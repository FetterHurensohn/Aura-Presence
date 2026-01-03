/**
 * Sentry Frontend Integration (React)
 * 
 * Features:
 * - Error Tracking mit React ErrorBoundary
 * - Performance Monitoring (Tracing)
 * - PII-Scrubbing (GDPR-konform)
 * - Breadcrumbs für User Actions
 * - Source Maps für Production
 */

import * as Sentry from '@sentry/react';

/**
 * PII-Scrubbing: Entfernt sensible Daten aus Events
 * 
 * Filtert:
 * - Email-Adressen
 * - Passwörter
 * - Tokens
 * - Video/Audio Daten
 * - Biometric/AI Daten
 * - IP-Adressen
 * - Cookies
 */
const scrubPII = (event) => {
  // 1. Request/Response Bodies scrubben
  if (event.request) {
    // Headers
    if (event.request.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
      delete event.request.headers['x-csrf-token'];
      delete event.request.headers['x-api-key'];
    }

    // Query String
    if (event.request.query_string) {
      event.request.query_string = '[REDACTED]';
    }

    // Cookies
    if (event.request.cookies) {
      event.request.cookies = {};
    }

    // Data (POST Body)
    if (event.request.data) {
      if (typeof event.request.data === 'object') {
        const sensitiveFields = ['password', 'token', 'refreshToken', 'apiKey', 'secret', 'email'];
        sensitiveFields.forEach(field => {
          if (event.request.data[field]) {
            event.request.data[field] = '[REDACTED]';
          }
        });
      }
    }
  }

  // 2. Extra Context scrubben
  if (event.extra) {
    // Video/Audio Daten
    if (event.extra.videoFrame) delete event.extra.videoFrame;
    if (event.extra.audioData) delete event.extra.audioData;
    if (event.extra.rawVideo) delete event.extra.rawVideo;
    if (event.extra.rawAudio) delete event.extra.rawAudio;

    // Biometric/AI Daten
    if (event.extra.faceData) delete event.extra.faceData;
    if (event.extra.emotionScores) delete event.extra.emotionScores;
    if (event.extra.aiPredictions) delete event.extra.aiPredictions;

    // Base64 Strings (oft Bilder/Videos)
    Object.keys(event.extra).forEach(key => {
      if (typeof event.extra[key] === 'string' && event.extra[key].startsWith('data:')) {
        event.extra[key] = '[BASE64_DATA_REDACTED]';
      }
    });
  }

  // 3. User Context scrubben
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    // Behalte nur User-ID (anonymisiert)
    event.user = {
      id: event.user.id || 'anonymous'
    };
  }

  // 4. Breadcrumbs scrubben
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(crumb => {
      if (crumb.data) {
        // Scrub URLs with tokens
        if (crumb.data.url && crumb.data.url.includes('token=')) {
          crumb.data.url = crumb.data.url.replace(/token=[^&]+/, 'token=[REDACTED]');
        }
        // Scrub form data
        if (crumb.category === 'ui.input' || crumb.category === 'console') {
          delete crumb.data.value;
        }
      }
      return crumb;
    });
  }

  // 5. Exception Messages scrubben (Email-Adressen entfernen)
  if (event.exception?.values) {
    event.exception.values = event.exception.values.map(ex => {
      if (ex.value) {
        // Entferne Email-Adressen aus Error Messages
        ex.value = ex.value.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL_REDACTED]');
      }
      return ex;
    });
  }

  return event;
};

/**
 * Sentry initialisieren
 * 
 * @param {Object} options - Sentry Optionen
 * @param {string} options.environment - Environment (development, production, etc.)
 */
export const initSentry = ({ environment = 'development' } = {}) => {
  const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

  // Nur in Production initialisieren (oder wenn DSN explizit gesetzt)
  if (!SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN nicht gesetzt - Error Tracking deaktiviert');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment,
    
    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Session Replay für Error Debugging
        maskAllText: true, // GDPR: Alle Texte maskieren
        blockAllMedia: true, // GDPR: Alle Medien blocken
      }),
    ],

    // Tracing Sample Rate (10% für Development, 100% für Production)
    tracesSampleRate: environment === 'production' ? 1.0 : 0.1,
    
    // Session Replay Sample Rate (nur bei Errors)
    replaysSessionSampleRate: 0, // Keine normalen Sessions
    replaysOnErrorSampleRate: 1.0, // Alle Error-Sessions

    // PII-Scrubbing Hook
    beforeSend: scrubPII,

    // Ignore bestimmte Errors
    ignoreErrors: [
      // Browser Extensions
      'top.GLOBALS',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'atomicFindClose',
      
      // Network Errors (oft nicht hilfreich)
      'Network request failed',
      'NetworkError',
      'Failed to fetch',
      
      // CORS Errors (oft nicht behebbar)
      'CORS',
      
      // Aborted Requests (User navigiert weg)
      'AbortError',
      'Request aborted',
    ],

    // Ignore URLs (Third-Party Scripts)
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
    ],
  });

  console.log('✅ Sentry Frontend initialisiert:', environment);
};

/**
 * Manuell einen Error an Sentry senden
 * 
 * @param {Error} error - Der Error
 * @param {Object} context - Zusätzlicher Context
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Custom Error Boundary für React
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;


