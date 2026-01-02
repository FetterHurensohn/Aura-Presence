/**
 * Sentry Error Tracking Integration
 * Konfiguriert Sentry für Backend Error-Monitoring
 * Updated für Sentry v10 API
 */

import * as Sentry from '@sentry/node';

/**
 * Initialisiert Sentry mit Backend-Konfiguration
 */
export function initSentry() {
  const SENTRY_DSN = process.env.SENTRY_DSN;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Nur in Production oder wenn explizit DSN gesetzt ist
  if (!SENTRY_DSN) {
    console.log('ℹ️  Sentry: Deaktiviert (keine DSN gesetzt)');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    
    // Tracing/Performance Monitoring
    tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,

    // Integrations (Sentry v10 API)
    integrations: [
      Sentry.httpIntegration({ tracing: true }),
    ],

    // PII-Scrubbing Hook
    beforeSend(event, hint) {
      // 1. Request Headers filtern
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['x-csrf-token'];
      }

      // 2. Request Data (POST Body) filtern
      if (event.request?.data) {
        const sensitiveFields = ['password', 'token', 'refreshToken', 'secret', 'apiKey'];
        sensitiveFields.forEach(field => {
          if (event.request.data[field]) {
            event.request.data[field] = '[REDACTED]';
          }
        });
      }

      // 3. Extra Context filtern
      if (event.extra) {
        // Video/Audio Daten
        if (event.extra.videoFrame) delete event.extra.videoFrame;
        if (event.extra.rawVideo) delete event.extra.rawVideo;
        if (event.extra.rawAudio) delete event.extra.rawAudio;
        
        // Biometric/AI Daten
        if (event.extra.faceData) delete event.extra.faceData;
        if (event.extra.emotionScores) delete event.extra.emotionScores;
        
        // Base64-Strings
        Object.keys(event.extra).forEach(key => {
          if (typeof event.extra[key] === 'string' && event.extra[key].length > 1000) {
            event.extra[key] = '[LARGE_DATA_REDACTED]';
          }
        });
      }

      // 4. User Context
      if (event.user) {
        // IP anonymisieren
        if (event.user.ip_address) {
          const parts = event.user.ip_address.split('.');
          if (parts.length === 4) {
            event.user.ip_address = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
          }
        }
      }

      return event;
    },

    // Ignore bestimmte Errors
    ignoreErrors: [
      'ValidationError',
      'UnauthorizedError',
      'NotFoundError',
    ],
  });

  console.log('✅ Sentry initialisiert:', NODE_ENV);
}

/**
 * Express Request Handler (Sentry v10)
 */
export function sentryRequestHandler() {
  return (req, res, next) => {
    // Optional: Add custom context
    Sentry.setContext('request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
    });
    next();
  };
}

/**
 * Express Error Handler (Sentry v10)
 * MUSS NACH allen Routes registriert werden!
 */
export function registerSentryErrorHandler(app) {
  Sentry.setupExpressErrorHandler(app);
}

/**
 * Manuell einen Error an Sentry senden
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Set User Context (nach Login)
 */
export function setUserContext(user) {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id?.toString(),
    // E-Mail NICHT senden (GDPR)
    // email: user.email,
  });
}

export default Sentry;
