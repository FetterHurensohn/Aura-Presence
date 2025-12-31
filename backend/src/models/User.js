/**
 * User Model - Datenbankoperationen für Benutzer
 */

import getDatabase from '../database/db.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

const SALT_ROUNDS = 12;

/**
 * Benutzer erstellen
 */
export function createUser(email, password) {
  const db = getDatabase();
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const now = Date.now();
  
  try {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(email, passwordHash, now, now);
    
    return {
      id: result.lastInsertRowid,
      email,
      subscription_status: 'none',
      created_at: now
    };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('E-Mail bereits registriert');
    }
    logger.error('Fehler beim Erstellen des Benutzers:', error);
    throw error;
  }
}

/**
 * Benutzer per E-Mail finden
 */
export function findUserByEmail(email) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

/**
 * Benutzer per ID finden
 */
export function findUserById(id) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

/**
 * Passwort verifizieren
 */
export function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compareSync(plainPassword, passwordHash);
}

/**
 * Stripe Customer ID aktualisieren
 */
export function updateStripeCustomerId(userId, customerId) {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE users 
    SET stripe_customer_id = ?, updated_at = ?
    WHERE id = ?
  `);
  
  stmt.run(customerId, Date.now(), userId);
}

/**
 * Subscription-Status aktualisieren
 */
export function updateSubscription(userId, status, plan, periodEnd) {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE users 
    SET subscription_status = ?, 
        subscription_plan = ?, 
        subscription_current_period_end = ?,
        updated_at = ?
    WHERE id = ?
  `);
  
  stmt.run(status, plan, periodEnd, Date.now(), userId);
  
  logger.info(`Subscription aktualisiert für User ${userId}: ${status}`);
}

/**
 * Benutzer ohne sensible Daten zurückgeben
 */
export function sanitizeUser(user) {
  if (!user) return null;
  
  const { password_hash, ...sanitized } = user;
  return sanitized;
}





