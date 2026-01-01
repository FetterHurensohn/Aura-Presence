/**
 * JWT Authentifizierungs-Middleware
 */

import jwt from 'jsonwebtoken';
import { findUserById } from '../models/User.js';
import logger from '../utils/logger.js';
import { hasFeature, FEATURES } from '../config/featureGates.js';
import { sendAuthRequired, sendUserNotFound, sendError, sendInsufficientRole, sendFeatureNotAvailable } from '../utils/responseHelpers.js';
import { ERROR_CODES } from '../schemas/apiSchemas.js';

/**
 * Get JWT_SECRET with validation
 */
function getJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    logger.error('JWT_SECRET ist nicht in den Umgebungsvariablen gesetzt!');
    throw new Error('JWT_SECRET ist nicht konfiguriert');
  }
  
  return JWT_SECRET;
}

/**
 * JWT Token aus Authorization-Header extrahieren
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Middleware zum Überprüfen der JWT-Authentifizierung
 */
export async function authenticateToken(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return sendError(res, 401, ERROR_CODES.NO_TOKEN, 'Kein Authentifizierungs-Token gefunden. Bitte melde dich an.');
  }
  
  try {
    const decoded = jwt.verify(token, getJWTSecret());
    
    // Benutzer aus Datenbank laden
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return sendUserNotFound(res, 'Der Benutzer-Account existiert nicht mehr.');
    }
    
    // Benutzer-Objekt ohne Passwort-Hash an Request anhängen
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, ERROR_CODES.TOKEN_EXPIRED, 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.');
    }
    
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, ERROR_CODES.INVALID_TOKEN, 'Der Authentifizierungs-Token ist ungültig.');
    }
    
    logger.error('JWT-Authentifizierungsfehler:', error);
    return sendError(res, 500, ERROR_CODES.AUTH_ERROR, 'Ein interner Fehler ist bei der Authentifizierung aufgetreten.');
  }
}

/**
 * Middleware zum Überprüfen der Subscription (optional)
 */
export function requireSubscription(req, res, next) {
  if (!req.user) {
    return sendAuthRequired(res, 'Bitte melde dich an, um auf diese Funktion zuzugreifen.');
  }
  
  const { subscription_status } = req.user;
  
  // Erlaube Zugriff wenn aktive Subscription oder Testphase
  if (subscription_status === 'active' || subscription_status === 'trialing') {
    return next();
  }
  
  return sendError(res, 403, ERROR_CODES.SUBSCRIPTION_REQUIRED, 'Diese Funktion erfordert ein aktives Abonnement. Bitte upgrade deinen Account.', {
    subscription_status
  });
}

/**
 * Middleware: Require specific role
 * Prüft ob der Benutzer eine der erlaubten Rollen hat
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthRequired(res);
    }
    
    const userRole = req.user.role || 'free';
    
    if (!allowedRoles.includes(userRole)) {
      return sendInsufficientRole(res, allowedRoles, `Dieses Feature erfordert ${allowedRoles.join(' oder ')} Plan.`);
    }
    
    next();
  };
}

/**
 * Middleware: Require specific feature
 * Prüft ob die Rolle des Benutzers ein bestimmtes Feature hat
 */
export function requireFeature(featureName) {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthRequired(res);
    }
    
    const userRole = req.user.role || 'free';
    
    if (!hasFeature(userRole, featureName)) {
      return sendFeatureNotAvailable(res, featureName, FEATURES[featureName]?.roles || [], `Dein Plan beinhaltet nicht ${FEATURES[featureName]?.name}`);
    }
    
    next();
  };
}

/**
 * JWT Token generieren
 */
export function generateToken(userId) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(
    { userId },
    getJWTSecret(),
    { expiresIn }
  );
}

