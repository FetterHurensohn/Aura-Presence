/**
 * Auth Routes - Registrierung und Login
 */

import express from 'express';
import { createUser, findUserByEmail, verifyPassword, sanitizeUser } from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../middleware/validation.js';
import { generateRefreshToken, findRefreshToken, revokeRefreshToken } from '../models/RefreshToken.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Neuen Benutzer registrieren
 */
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Prüfen ob E-Mail bereits existiert
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'E-Mail bereits registriert',
        message: 'Diese E-Mail-Adresse wird bereits verwendet. Bitte verwende eine andere oder melde dich an.',
        code: 'EMAIL_EXISTS'
      });
    }
    
    // Benutzer erstellen
    const user = createUser(email, password);
    
    // Token generieren
    const token = generateToken(user.id);
    
    logger.info(`Neuer Benutzer registriert: ${email} (ID: ${user.id})`);
    
    res.status(201).json({
      message: 'Registrierung erfolgreich',
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    logger.error('Registrierungsfehler:', error);
    res.status(500).json({
      error: 'Fehler bei der Registrierung',
      message: 'Ein interner Fehler ist aufgetreten. Bitte versuche es später erneut.',
      code: 'REGISTRATION_ERROR'
    });
  }
});

/**
 * POST /api/auth/login
 * Benutzer anmelden
 */
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Benutzer finden
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Ungültige Anmeldedaten',
        message: 'E-Mail oder Passwort ist falsch.',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Passwort überprüfen
    const isValidPassword = verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Ungültige Anmeldedaten',
        message: 'E-Mail oder Passwort ist falsch.',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Access Token generieren (kurze Lebensdauer: 15 Minuten)
    const token = generateToken(user.id, '15m');
    
    // Refresh Token generieren (längere Lebensdauer: 7 Tage)
    const { token: refreshToken } = await generateRefreshToken(user.id, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });
    
    logger.info(`Benutzer angemeldet: ${email} (ID: ${user.id})`);
    
    res.json({
      message: 'Anmeldung erfolgreich',
      user: sanitizeUser(user),
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('Login-Fehler:', error);
    res.status(500).json({
      error: 'Fehler bei der Anmeldung',
      message: 'Ein interner Fehler ist aufgetreten. Bitte versuche es später erneut.',
      code: 'LOGIN_ERROR'
    });
  }
});

/**
 * GET /api/auth/me
 * Aktuellen Benutzer abrufen (geschützte Route)
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

/**
 * POST /api/auth/refresh
 * Refresh Access Token mit Refresh Token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token erforderlich',
        message: 'Kein Refresh-Token in der Anfrage enthalten.',
        code: 'NO_REFRESH_TOKEN'
      });
    }
    
    // Verify refresh token exists and is valid
    const storedToken = await findRefreshToken(refreshToken);
    
    if (!storedToken) {
      return res.status(401).json({
        error: 'Ungültiger refresh token',
        message: 'Der Refresh-Token ist ungültig oder abgelaufen.',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    // Generate new access token
    const newAccessToken = generateToken(storedToken.user_id, '15m');
    
    // Optional: Rotate refresh token (mehr Sicherheit)
    const { token: newRefreshToken } = await generateRefreshToken(storedToken.user_id, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });
    
    // Revoke old refresh token
    await revokeRefreshToken(refreshToken);
    
    logger.info(`Token refreshed for user ID: ${storedToken.user_id}`);
    
    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Token refresh fehlgeschlagen',
      message: 'Der Token konnte nicht erneuert werden.',
      code: 'REFRESH_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout
 * Revoke Refresh Token (logout)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
      logger.info(`User ${req.user.id} logged out - token revoked`);
    }
    
    res.json({
      message: 'Erfolgreich abgemeldet'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    // Logout sollte auch bei Fehlern erfolgreich sein (Client löscht Token)
    res.json({
      message: 'Erfolgreich abgemeldet'
    });
  }
});

export default router;

