/**
 * Sentry Error Tracking - Frontend Integration
 * Konfiguriert Sentry für React Error-Monitoring
 */

import * as Sentry from '@sentry/react';

/**
 * Initialisiert Sentry für Frontend
 */
export function initSentry() {
  const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
  const ENV = import.meta.env.MODE || 'development';

  // Nur wenn DSN gesetzt ist
  if (!SENTRY_DSN) {
    console.log('ℹ️  Sentry: Deaktiviert (keine DSN gesetzt)');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENV,
    
    // Release-Tracking (kann via CI/CD gesetzt werden)
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,

    // Integrations (Sentry v10 API)
    integrations: [
      // React-spezifische Integrations
      Sentry.browserTracingIntegration(),
      // Replay-Integration für Session-Recordings (optional)
      // Deaktiviert in Development um Probleme zu vermeiden
      ...(ENV === 'production' ? [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        })
      ] : []),
    ],

    // Performance-Monitoring
    tracesSampleRate: ENV === 'production' ? 0.1 : 1.0,

    // Replay-Sample-Rate
    replaysSessionSampleRate: 0, // Keine automatischen Replays
    replaysOnErrorSampleRate: ENV === 'production' ? 0.1 : 1.0,

    // Before-Send Hook: Umfassendes PII Scrubbing
    beforeSend(event, hint) {
      // Filtere Authorization Headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['Authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['Cookie'];
      }
      
      // Filtere URLs mit Tokens
      if (event.request?.url) {
        event.request.url = event.request.url
          .replace(/token=[^&]+/gi, 'token=[REDACTED]')
          .replace(/api_key=[^&]+/gi, 'api_key=[REDACTED]');
      }

      // Filtere localStorage-Daten
      if (event.extra) {
        const sensitiveKeys = ['authToken', 'refreshToken', 'password', 'secret', 'apiKey'];
        Object.keys(event.extra).forEach(key => {
          if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            event.extra[key] = '[REDACTED]';
          }
        });
      }
      
      // Filtere User-Context (E-Mail optional)
      if (event.user) {
        // IP-Adresse anonymisieren (DSGVO)
        if (event.user.ip_address) {
          event.user.ip_address = event.user.ip_address.replace(/\.\d+$/, '.0');
        }
      }
      
      // Filtere Breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          if (breadcrumb.data) {
            Object.keys(breadcrumb.data).forEach(key => {
              if (['token', 'password', 'secret'].some(s => key.toLowerCase().includes(s))) {
                breadcrumb.data[key] = '[REDACTED]';
              }
            });
          }
          return breadcrumb;
        });
      }

      // In Development: Zeige Error auch in Console
      if (ENV === 'development') {
        console.error('Sentry Error:', hint.originalException || hint.syntheticException);
      }

      return event;
    },

    // Ignore bestimmte Errors
    ignoreErrors: [
      // Network Errors (zu häufig, nicht hilfreich)
      'Network request failed',
      'NetworkError',
      'Failed to fetch',
      'Load failed',
      
      // Browser-Extensions
      'top.GLOBALS',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'atomicFindClose',
      
      // MediaPipe-spezifische (normale Warnings)
      'MediaPipe is not ready',
      
      // React DevTools
      '__REACT_DEVTOOLS',
      
      // Cancelled Requests (normal)
      'AbortError',
      'Request aborted',
      
      // ResizeObserver (harmlos)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],

    // Denylist für URLs (third-party scripts)
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],

    // Breadcrumbs-Filter
    beforeBreadcrumb(breadcrumb, hint) {
      // Filtere sensitive Console-Logs
      if (breadcrumb.category === 'console') {
        if (breadcrumb.message?.includes('token')) return null;
        if (breadcrumb.message?.includes('password')) return null;
        if (breadcrumb.message?.includes('JWT')) return null;
      }

      // Filtere XHR/Fetch-Breadcrumbs mit sensitive Headers
      if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
        if (breadcrumb.data?.url) {
          breadcrumb.data.url = breadcrumb.data.url
            .replace(/token=[^&]+/gi, 'token=[REDACTED]');
        }
      }

      return breadcrumb;
    },
  });

  console.log('✅ Sentry initialisiert:', {
    environment: ENV,
    dsn: `${SENTRY_DSN.slice(0, 20)}...`,
  });
}

/**
 * Set User-Context nach Login
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
 * Manuelles Error-Capture
 */
export function captureError(error, context = {}) {
  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    level: context.level || 'error',
  });
}

/**
 * Capture Message (für wichtige Events)
 */
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    tags: context.tags,
    extra: context.extra,
  });
}

/**
 * Add Breadcrumb für Custom-Events
 */
export function addBreadcrumb(message, data = {}, category = 'custom') {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
}

/**
 * Helper: E-Mail maskieren
 */
function maskEmail(email) {
  if (!email) return undefined;
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}

// Export Sentry für direkten Zugriff
export { Sentry };

