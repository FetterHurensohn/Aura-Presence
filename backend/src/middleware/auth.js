/**
 * JWT Authentifizierungs-Middleware
 */

import jwt from 'jsonwebtoken';
import { findUserById } from '../models/User.js';
import logger from '../utils/logger.js';

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
export function authenticateToken(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({
      error: 'Authentifizierung erforderlich',
      message: 'Kein Authentifizierungs-Token gefunden. Bitte melde dich an.',
      code: 'NO_TOKEN'
    });
  }
  
  try {
    const decoded = jwt.verify(token, getJWTSecret());
    
    // Benutzer aus Datenbank laden
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'Benutzer nicht gefunden',
        message: 'Der Benutzer-Account existiert nicht mehr.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Benutzer-Objekt ohne Passwort-Hash an Request anhängen
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token abgelaufen',
        message: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Ungültiger Token',
        message: 'Der Authentifizierungs-Token ist ungültig.',
        code: 'INVALID_TOKEN'
      });
    }
    
    logger.error('JWT-Authentifizierungsfehler:', error);
    return res.status(500).json({
      error: 'Fehler bei der Authentifizierung',
      message: 'Ein interner Fehler ist bei der Authentifizierung aufgetreten.',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * Middleware zum Überprüfen der Subscription (optional)
 */
export function requireSubscription(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentifizierung erforderlich',
      message: 'Bitte melde dich an, um auf diese Funktion zuzugreifen.',
      code: 'AUTH_REQUIRED'
    });
  }
  
  const { subscription_status } = req.user;
  
  // Erlaube Zugriff wenn aktive Subscription oder Testphase
  if (subscription_status === 'active' || subscription_status === 'trialing') {
    return next();
  }
  
  return res.status(403).json({
    error: 'Aktives Abonnement erforderlich',
    message: 'Diese Funktion erfordert ein aktives Abonnement. Bitte upgrade deinen Account.',
    code: 'SUBSCRIPTION_REQUIRED',
    subscription_status
  });
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

