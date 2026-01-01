/**
 * Sentry Backend Integration
 * 
 * Wichtig: PII-Scrubbing für Video/Audio-Daten
 * Sentry wird NICHT gestartet wenn SENTRY_ENABLED=false oder keine DSN gesetzt.
 */

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import logger from './logger.js';

/**
 * Initialisiert Sentry für Backend (Express)
 * MUSS ganz am Anfang in server.js aufgerufen werden!
 * 
 * @param {Express.Application} app - Express App Instanz
 */
export function initSentry(app) {
  // Check if Sentry should be enabled
  const sentryEnabled = process.env.SENTRY_ENABLED !== 'false';
  const sentryDsn = process.env.SENTRY_DSN_BACKEND;

  if (!sentryEnabled) {
    logger.info('ℹ️  Sentry: Deaktiviert (SENTRY_ENABLED=false)');
    return;
  }

  if (!sentryDsn) {
    logger.warn('⚠️  Sentry: Keine DSN gesetzt - Sentry wird nicht initialisiert');
    return;
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE || 'local',
    
    // Tracing - default 5% sample rate
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.05,
    
    // Express Integration
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],

    // Max breadcrumbs to avoid memory issues
    maxBreadcrumbs: 50,

    // PII-Scrubbing: CRITICAL - Entferne Video/Audio-Daten!
    beforeSend(event, hint) {
      // Scrub request body für sensible Daten
      if (event.request?.data) {
        event.request.data = scrubPII(event.request.data);
      }

      // Scrub contexts
      if (event.contexts?.data) {
        event.contexts.data = scrubPII(event.contexts.data);
      }

      // Scrub extra data
      if (event.extra) {
        event.extra = scrubPII(event.extra);
      }

      return event;
    },

    // Filter breadcrumbs if needed
    beforeBreadcrumb(breadcrumb, hint) {
      // Optionally scrub breadcrumb data
      if (breadcrumb.data) {
        breadcrumb.data = scrubPII(breadcrumb.data);
      }
      return breadcrumb;
    },
  });

  // Express Request Handler - MUSS VOR allen anderen Middleware/Routes sein
  app.use(Sentry.Handlers.requestHandler());
  
  // Express Tracing Handler - direkt nach requestHandler
  app.use(Sentry.Handlers.tracingHandler());

  logger.info(`✅ Sentry Backend initialisiert (Environment: ${process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV})`);
}

/**
 * Sentry Error Handler - MUSS NACH allen Routes/Middleware registriert werden!
 * In server.js als letztes Error-Handling Middleware einfügen.
 * 
 * @param {Express.Application} app - Express App Instanz
 */
export function registerSentryErrorHandler(app) {
  if (process.env.SENTRY_ENABLED === 'false' || !process.env.SENTRY_DSN_BACKEND) {
    return;
  }

  app.use(Sentry.Handlers.errorHandler());
}

/**
 * Manuelles Capture von Exceptions mit Context
 * 
 * @param {Error} error - Fehler-Objekt
 * @param {Object} context - Zusätzlicher Context (wird auch gescrubt)
 */
export function captureException(error, context = {}) {
  if (process.env.SENTRY_ENABLED === 'false' || !process.env.SENTRY_DSN_BACKEND) {
    return;
  }

  // Scrub context before sending
  const scrubbedContext = scrubPII(context);

  Sentry.captureException(error, {
    extra: scrubbedContext,
  });
}

/**
 * Manuelles Capture von Messages
 * 
 * @param {string} message - Message
 * @param {string} level - Level (info, warning, error)
 * @param {Object} context - Context data
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (process.env.SENTRY_ENABLED === 'false' || !process.env.SENTRY_DSN_BACKEND) {
    return;
  }

  const scrubbedContext = scrubPII(context);

  Sentry.captureMessage(message, {
    level,
    extra: scrubbedContext,
  });
}

/**
 * PII-Scrubbing Funktion
 * KRITISCH: Entfernt alle Video/Audio/Binary-Daten aus Events!
 * 
 * Entfernt/maskiert:
 * - videoFrame, rawAudio, frameData, payload.frames, payload.image
 * - base64 Strings (länger als 100 Zeichen)
 * - mediaStream, frameBuffer
 * - Große Objekte/Arrays (über 1MB serialized)
 * 
 * @param {any} data - Zu scrubbendes Datenobjekt
 * @returns {any} Gescrubtes Objekt
 */
function scrubPII(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Array handling
  if (Array.isArray(data)) {
    return data.map(item => scrubPII(item));
  }

  // Object handling
  const scrubbed = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // KRITISCH: Entferne Video/Audio-bezogene Felder
    if (
      lowerKey.includes('video') ||
      lowerKey.includes('audio') ||
      lowerKey.includes('frame') ||
      lowerKey.includes('image') ||
      lowerKey.includes('stream') ||
      lowerKey.includes('buffer') ||
      lowerKey.includes('blob') ||
      lowerKey.includes('media')
    ) {
      scrubbed[key] = '[SCRUBBED_MEDIA_DATA]';
      continue;
    }

    // Entferne base64 Strings (erkennbar an Länge + Muster)
    if (typeof value === 'string') {
      if (value.length > 100 && /^[A-Za-z0-9+/=]+$/.test(value)) {
        scrubbed[key] = '[SCRUBBED_BASE64]';
        continue;
      }
      if (value.startsWith('data:image') || value.startsWith('data:video') || value.startsWith('data:audio')) {
        scrubbed[key] = '[SCRUBBED_DATA_URI]';
        continue;
      }
    }

    // Rekursiv für nested objects
    if (value && typeof value === 'object') {
      // Check size to avoid huge objects
      try {
        const stringified = JSON.stringify(value);
        if (stringified.length > 1000000) { // 1MB
          scrubbed[key] = '[SCRUBBED_LARGE_OBJECT]';
          continue;
        }
      } catch (e) {
        scrubbed[key] = '[SCRUBBED_CIRCULAR_REF]';
        continue;
      }

      scrubbed[key] = scrubPII(value);
    } else {
      scrubbed[key] = value;
    }
  }

  return scrubbed;
}

export default {
  initSentry,
  registerSentryErrorHandler,
  captureException,
  captureMessage,
};
