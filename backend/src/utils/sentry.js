/**
 * Sentry Error Tracking Integration
 * Konfiguriert Sentry für Backend Error-Monitoring
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

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
    
    // Release-Tracking (optional, kann via CI/CD gesetzt werden)
    release: process.env.SENTRY_RELEASE || undefined,

    // Sample-Rate für Performance-Monitoring
    tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,

    // Profiling (optional, nur in Production empfohlen)
    profilesSampleRate: NODE_ENV === 'production' ? 0.1 : 0,
    integrations: [
      new ProfilingIntegration(),
      // Automatische HTTP-Instrumentation
      new Sentry.Integrations.Http({ tracing: true }),
      // Express-Integration (wird in server.js aktiviert)
    ],

    // Before-Send Hook: Filtere sensitive Daten
    beforeSend(event, hint) {
      // Entferne sensitive Headers
      if (event.request) {
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
          delete event.request.headers['x-api-key'];
        }

        // Entferne Query-Parameter mit Secrets
        if (event.request.query_string) {
          event.request.query_string = event.request.query_string
            .replace(/token=[^&]+/gi, 'token=[REDACTED]')
            .replace(/api_key=[^&]+/gi, 'api_key=[REDACTED]');
        }
      }

      // Filtere Body-Daten (z.B. Passwörter)
      if (event.request?.data) {
        const data = typeof event.request.data === 'string'
          ? JSON.parse(event.request.data)
          : event.request.data;

        if (data.password) data.password = '[REDACTED]';
        if (data.email) data.email = maskEmail(data.email);
        if (data.token) data.token = '[REDACTED]';

        event.request.data = data;
      }

      return event;
    },

    // Ignore bestimmte Errors
    ignoreErrors: [
      // Network Errors
      'Network request failed',
      'NetworkError',
      'fetch failed',
      
      // Validation Errors (werden bereits geloggt)
      'ValidationError',
      
      // Cancelled Requests
      'AbortError',
      'Request aborted',
      
      // Common Browser Errors (falls Backend auch Browser-Errors empfängt)
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],

    // Breadcrumbs für Debugging
    beforeBreadcrumb(breadcrumb, hint) {
      // Filtere sensitive Console-Logs
      if (breadcrumb.category === 'console') {
        if (breadcrumb.message?.includes('JWT')) return null;
        if (breadcrumb.message?.includes('password')) return null;
      }

      return breadcrumb;
    },
  });

  console.log('✅ Sentry initialisiert:', {
    environment: NODE_ENV,
    dsn: `${SENTRY_DSN.slice(0, 20)}...`,
  });
}

/**
 * Express Error-Handler Middleware für Sentry
 */
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Nur Server-Errors (5xx) zu Sentry senden
      // Client-Errors (4xx) werden nur geloggt
      if (error.statusCode && error.statusCode < 500) {
        return false;
      }
      return true;
    },
  });
}

/**
 * Express Request-Handler Middleware für Sentry
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler({
    // User-Context aus JWT setzen (falls vorhanden)
    user: ['id', 'email', 'subscription_plan'],
  });
}

/**
 * Manuelles Error-Capture mit Context
 */
export function captureError(error, context = {}) {
  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    user: context.user,
    level: context.level || 'error',
  });
}

/**
 * Capture Message (für wichtige Events, keine Errors)
 */
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
  });
}

/**
 * Set User-Context (nach Auth)
 */
export function setUserContext(user) {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id?.toString(),
    email: maskEmail(user.email),
    subscription_plan: user.subscription_plan,
    subscription_status: user.subscription_status,
  });
}

/**
 * Helper: E-Mail maskieren (Datenschutz)
 */
function maskEmail(email) {
  if (!email) return undefined;
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}

// Export Sentry für direkten Zugriff
export { Sentry };

