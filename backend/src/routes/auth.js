/**
 * Auth Routes - Registrierung und Login
 * Updated: 31.12.2024 - Fixed async/await for database calls
 */

import express from 'express';
import { createUser, findUserByEmail, verifyPassword, sanitizeUser, updateUserProfile } from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema, profileSchema } from '../middleware/validation.js';
import { generateRefreshToken, findRefreshToken, revokeRefreshToken } from '../models/RefreshToken.js';
import logger from '../utils/logger.js';
import { 
  sendSuccess, 
  sendEmailExists, 
  sendInvalidCredentials,
  sendError,
  asyncHandler 
} from '../utils/responseHelpers.js';
import { ERROR_CODES } from '../schemas/apiSchemas.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Neuen Benutzer registrieren
 */
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { email, password, name, company, country, language } = req.body;
  
  // Prüfen ob E-Mail bereits existiert
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return sendEmailExists(res);
  }
  
  // Benutzer erstellen mit Profildaten (inkl. language)
  const user = await createUser(email, password, { name, company, country, language });
  
  // Access Token generieren (kurze Lebensdauer: 15 Minuten)
  const token = generateToken(user.id, '15m');
  
  // Refresh Token generieren (längere Lebensdauer: 7 Tage)
  const { token: refreshToken } = await generateRefreshToken(user.id, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  });
  
  logger.info(`Neuer Benutzer registriert: ${email} (ID: ${user.id})`);
  
  return sendSuccess(res, {
    message: 'Registrierung erfolgreich',
    user: sanitizeUser(user),
    token,
    refreshToken
  }, 201);
}));

/**
 * POST /api/auth/login
 * Benutzer anmelden
 */
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Benutzer finden
  const user = await findUserByEmail(email);
  
  if (!user) {
    return sendInvalidCredentials(res);
  }
  
  // Passwort überprüfen
  const isValidPassword = verifyPassword(password, user.password_hash);
  
  if (!isValidPassword) {
    return sendInvalidCredentials(res);
  }
  
  // Access Token generieren (kurze Lebensdauer: 15 Minuten)
  const token = generateToken(user.id, '15m');
  
  // Refresh Token generieren (längere Lebensdauer: 7 Tage)
  const { token: refreshToken } = await generateRefreshToken(user.id, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  });
  
  logger.info(`Benutzer angemeldet: ${email} (ID: ${user.id})`);
  
  return sendSuccess(res, {
    message: 'Anmeldung erfolgreich',
    user: sanitizeUser(user),
    token,
    refreshToken
  });
}));

/**
 * GET /api/auth/me
 * Aktuellen Benutzer abrufen (geschützte Route)
 */
router.get('/me', authenticateToken, (req, res) => {
  return sendSuccess(res, {
    user: req.user
  });
});

/**
 * POST /api/auth/refresh
 * Refresh Access Token mit Refresh Token
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return sendError(res, 400, ERROR_CODES.NO_REFRESH_TOKEN, 'Kein Refresh-Token in der Anfrage enthalten.');
  }
  
  // Verify refresh token exists and is valid
  const storedToken = await findRefreshToken(refreshToken);
  
  if (!storedToken) {
    return sendError(res, 401, ERROR_CODES.INVALID_REFRESH_TOKEN, 'Der Refresh-Token ist ungültig oder abgelaufen.');
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
  
  return sendSuccess(res, {
    token: newAccessToken,
    refreshToken: newRefreshToken
  });
}));

/**
 * POST /api/auth/logout
 * Revoke Refresh Token (logout)
 */
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
    logger.info(`User ${req.user.id} logged out - token revoked`);
  }
  
  // Logout sollte immer erfolgreich sein (Client löscht Token)
  return sendSuccess(res, {
    message: 'Erfolgreich abgemeldet'
  });
}));

/**
 * PUT /api/auth/profile
 * Profildaten aktualisieren (geschützte Route)
 */
router.put('/profile', authenticateToken, validate(profileSchema), asyncHandler(async (req, res) => {
  const { name, company, country, language } = req.body;
  const userId = req.user.id;
  
  // Alle Felder sind bereits durch Joi validiert
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (company !== undefined) updateData.company = company;
  if (country !== undefined) updateData.country = country;
  if (language !== undefined) updateData.language = language;
  
  // Update durchführen
  const updatedUser = await updateUserProfile(userId, updateData);
  
  logger.info(`Profile updated for user ${userId}`);
  
  return sendSuccess(res, {
    message: 'Profil erfolgreich aktualisiert',
    user: sanitizeUser(updatedUser)
  });
}));

export default router;

