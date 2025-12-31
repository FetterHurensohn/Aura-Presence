/**
 * User Model (Knex-Version)
 * DB-agnostisch: Funktioniert mit SQLite und PostgreSQL
 */

import bcrypt from 'bcryptjs';
import getDatabase from '../database/dbKnex.js';

const BCRYPT_ROUNDS = 10;

/**
 * Benutzer erstellen
 */
export function createUser(email, password) {
  const db = getDatabase();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
  const timestamp = Date.now();

  const [userId] = db('users').insert({
    email,
    password_hash: passwordHash,
    created_at: timestamp,
    updated_at: timestamp,
  }).returning('id');

  // Bei SQLite: returning() gibt die ID direkt zurück
  // Bei PostgreSQL: returning() gibt ein Objekt zurück
  const id = typeof userId === 'object' ? userId.id : userId;

  return findUserById(id);
}

/**
 * Benutzer nach E-Mail finden
 */
export function findUserByEmail(email) {
  const db = getDatabase();
  return db('users').where('email', email).first();
}

/**
 * Benutzer nach ID finden
 */
export function findUserById(id) {
  const db = getDatabase();
  return db('users').where('id', id).first();
}

/**
 * Passwort überprüfen
 */
export function verifyPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

/**
 * Stripe Customer ID speichern
 */
export function updateStripeCustomerId(userId, stripeCustomerId) {
  const db = getDatabase();
  return db('users')
    .where('id', userId)
    .update({
      stripe_customer_id: stripeCustomerId,
      updated_at: Date.now(),
    });
}

/**
 * Subscription aktualisieren
 */
export function updateSubscription(userId, status, plan, periodEnd) {
  const db = getDatabase();
  return db('users')
    .where('id', userId)
    .update({
      subscription_status: status,
      subscription_plan: plan,
      subscription_current_period_end: periodEnd,
      updated_at: Date.now(),
    });
}

/**
 * Benutzer ohne Passwort-Hash zurückgeben (für API-Responses)
 */
export function sanitizeUser(user) {
  if (!user) return null;
  
  const { password_hash, ...sanitized } = user;
  return sanitized;
}





