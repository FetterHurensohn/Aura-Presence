/**
 * Sentry Error Tracking Integration
 * Konfiguriert Sentry für Backend Error-Monitoring
 * Optional - funktioniert auch ohne Sentry
 */

let Sentry = null;

// Dynamischer Import nur wenn Sentry installiert ist
try {
  Sentry = await import('@sentry/node');
} catch (err) {
  console.log('ℹ️  Sentry: Not installed (optional dependency)');
}

/**
 * Initialisiert Sentry mit Backend-Konfiguration
 */
export function initSentry() {
  if (!Sentry) {
    console.log('ℹ️  Sentry: Deaktiviert (nicht installiert)');
    return;
  }

  const SENTRY_DSN = process.env.SENTRY_DSN;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Nur in Production oder wenn explizit DSN gesetzt ist
  if (!SENTRY_DSN || SENTRY_DSN === 'none') {
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

      // 3. Contexts filtern
      if (event.contexts?.user) {
        delete event.contexts.user.email;
        delete event.contexts.user.ip_address;
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
 * Express Request Handler für Sentry Tracing
 */
export function sentryRequestHandler() {
  if (!Sentry) {
    // Fallback: No-op middleware
    return (req, res, next) => next();
  }

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
 * Express Error Handler für Sentry
 */
export function registerSentryErrorHandler(app) {
  if (!Sentry) {
    console.log('ℹ️  Sentry: Error handler skipped (not installed)');
    return;
  }
  
  app.use(Sentry.Handlers.errorHandler());
  console.log('✅ Sentry: Error handler registered');
}

/**
 * Manuelles Error-Capture
 */
export function captureException(error, context = {}) {
  if (!Sentry) {
    console.error('Error (Sentry not installed):', error);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context
  });
}
