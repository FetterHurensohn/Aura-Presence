/**
 * Response Helper Functions
 * Standardized response formatting for consistent API responses
 */

import { ERROR_CODES } from '../schemas/apiSchemas.js';
import logger from './logger.js';

/**
 * Send successful response
 * @param {object} res - Express response object
 * @param {object} data - Response data
 * @param {number} [statusCode=200] - HTTP status code
 */
export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

/**
 * Send error response with standardized format
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Error code from ERROR_CODES
 * @param {string} message - User-friendly error message (German)
 * @param {object} [details] - Additional error details
 */
export function sendError(res, statusCode, errorCode, message, details = {}) {
  const errorResponse = {
    error: getErrorTitle(errorCode),
    message,
    code: errorCode,
    ...details,
  };

  // Log error for debugging (exclude sensitive details)
  logger.error(`API Error [${statusCode}] ${errorCode}: ${message}`, {
    code: errorCode,
    statusCode,
    details: sanitizeErrorDetails(details),
  });

  return res.status(statusCode).json(errorResponse);
}

/**
 * Get human-readable error title from error code
 * @param {string} errorCode - Error code
 * @returns {string} Error title
 */
function getErrorTitle(errorCode) {
  const titles = {
    // 400
    VALIDATION_ERROR: 'Validierungsfehler',
    PRICE_ID_REQUIRED: 'Preis-ID erforderlich',
    
    // 401
    AUTH_REQUIRED: 'Authentifizierung erforderlich',
    NO_TOKEN: 'Kein Token vorhanden',
    INVALID_TOKEN: 'Ungültiger Token',
    TOKEN_EXPIRED: 'Token abgelaufen',
    INVALID_CREDENTIALS: 'Ungültige Anmeldedaten',
    NO_REFRESH_TOKEN: 'Kein Refresh-Token vorhanden',
    INVALID_REFRESH_TOKEN: 'Ungültiger Refresh-Token',
    
    // 403
    INSUFFICIENT_ROLE: 'Unzureichende Berechtigung',
    FEATURE_NOT_AVAILABLE: 'Feature nicht verfügbar',
    SUBSCRIPTION_REQUIRED: 'Abonnement erforderlich',
    
    // 404
    USER_NOT_FOUND: 'Benutzer nicht gefunden',
    
    // 409
    EMAIL_EXISTS: 'E-Mail bereits registriert',
    
    // 429
    USAGE_LIMIT_EXCEEDED: 'Nutzungslimit überschritten',
    
    // 500
    INTERNAL_ERROR: 'Interner Serverfehler',
    AUTH_ERROR: 'Authentifizierungsfehler',
    REGISTRATION_ERROR: 'Registrierungsfehler',
    LOGIN_ERROR: 'Anmeldefehler',
    REFRESH_ERROR: 'Token-Erneuerungsfehler',
    ANALYSIS_ERROR: 'Analysefehler',
    SESSIONS_FETCH_ERROR: 'Fehler beim Abrufen der Sessions',
    CHECKOUT_ERROR: 'Checkout-Fehler',
    WEBHOOK_ERROR: 'Webhook-Fehler',
    EXPORT_ERROR: 'Export-Fehler',
    DELETION_SCHEDULE_ERROR: 'Löschplanung-Fehler',
    DELETION_CANCEL_ERROR: 'Löschstornierung-Fehler',
  };

  return titles[errorCode] || 'Fehler';
}

/**
 * Remove sensitive information from error details before logging
 * @param {object} details - Error details
 * @returns {object} Sanitized details
 */
function sanitizeErrorDetails(details) {
  const sanitized = { ...details };
  
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.refreshToken;
  delete sanitized.password_hash;
  
  return sanitized;
}

/**
 * Pre-configured error response functions for common cases
 */

export function sendAuthRequired(res, message = 'Authentifizierung erforderlich. Bitte melde dich an.') {
  return sendError(res, 401, ERROR_CODES.AUTH_REQUIRED, message);
}

export function sendInvalidToken(res, message = 'Der Token ist ungültig oder abgelaufen. Bitte melde dich erneut an.') {
  return sendError(res, 401, ERROR_CODES.INVALID_TOKEN, message);
}

export function sendInvalidCredentials(res, message = 'E-Mail oder Passwort ist falsch.') {
  return sendError(res, 401, ERROR_CODES.INVALID_CREDENTIALS, message);
}

export function sendInsufficientRole(res, requiredRoles, message = 'Du hast nicht die erforderlichen Berechtigungen für diese Aktion.') {
  return sendError(res, 403, ERROR_CODES.INSUFFICIENT_ROLE, message, { requiredRoles });
}

export function sendFeatureNotAvailable(res, featureName, requiredRoles, message = 'Dieses Feature ist in deinem aktuellen Plan nicht verfügbar.') {
  return sendError(res, 403, ERROR_CODES.FEATURE_NOT_AVAILABLE, message, {
    feature: featureName,
    requiredRoles,
  });
}

export function sendUsageLimitExceeded(res, limit, current, message = 'Du hast dein monatliches Nutzungslimit erreicht. Bitte upgrade deinen Plan.') {
  return sendError(res, 429, ERROR_CODES.USAGE_LIMIT_EXCEEDED, message, {
    limit,
    current,
  });
}

export function sendValidationError(res, validationDetails, message = 'Die Eingabedaten sind ungültig.') {
  return sendError(res, 400, ERROR_CODES.VALIDATION_ERROR, message, {
    validation: validationDetails,
  });
}

export function sendInternalError(res, message = 'Ein interner Fehler ist aufgetreten. Bitte versuche es später erneut.') {
  return sendError(res, 500, ERROR_CODES.INTERNAL_ERROR, message);
}

export function sendEmailExists(res, message = 'Diese E-Mail-Adresse wird bereits verwendet. Bitte verwende eine andere oder melde dich an.') {
  return sendError(res, 409, ERROR_CODES.EMAIL_EXISTS, message);
}

export function sendUserNotFound(res, message = 'Benutzer nicht gefunden.') {
  return sendError(res, 404, ERROR_CODES.USER_NOT_FOUND, message);
}

/**
 * Wrap async route handlers to catch errors
 * @param {function} fn - Async route handler
 * @returns {function} Wrapped handler
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error('Unhandled error in async route:', error);
      
      // Check if headers already sent
      if (res.headersSent) {
        return next(error);
      }
      
      // Send generic internal error
      sendInternalError(res, 'Ein unerwarteter Fehler ist aufgetreten.');
    });
  };
}

/**
 * Format timestamp to ISO 8601 string
 * @param {number} timestamp - Unix timestamp (seconds or milliseconds)
 * @returns {string} ISO 8601 formatted date
 */
export function formatTimestampISO(timestamp) {
  // Convert to milliseconds if in seconds
  const ms = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  return new Date(ms).toISOString();
}

/**
 * Convert Unix timestamp (seconds) to milliseconds
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {number} Timestamp in milliseconds
 */
export function timestampToMs(timestamp) {
  return timestamp < 10000000000 ? timestamp * 1000 : timestamp;
}

export default {
  sendSuccess,
  sendError,
  sendAuthRequired,
  sendInvalidToken,
  sendInvalidCredentials,
  sendInsufficientRole,
  sendFeatureNotAvailable,
  sendUsageLimitExceeded,
  sendValidationError,
  sendInternalError,
  sendEmailExists,
  sendUserNotFound,
  asyncHandler,
  formatTimestampISO,
  timestampToMs,
};



