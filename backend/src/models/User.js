/**
 * User Model (Knex + PostgreSQL)
 * Production-ready mit PostgreSQL über Knex
 */

import bcrypt from 'bcrypt';
import { getDatabase } from '../database/dbKnex.js';

const BCRYPT_ROUNDS = 10;

/**
 * Benutzer erstellen
 */
export async function createUser(email, password) {
  const db = getDatabase();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
  const timestamp = Date.now();

  const [userId] = await db('users').insert({
    email,
    password_hash: passwordHash,
    created_at: timestamp,
    updated_at: timestamp,
  }).returning('id');

  // PostgreSQL returning() gibt ein Objekt zurück: { id: 123 }
  const id = typeof userId === 'object' ? userId.id : userId;

  return findUserById(id);
}

/**
 * Benutzer nach E-Mail finden
 */
export async function findUserByEmail(email) {
  const db = getDatabase();
  return await db('users').where('email', email).first();
}

/**
 * Benutzer nach ID finden
 */
export async function findUserById(id) {
  const db = getDatabase();
  return await db('users').where('id', id).first();
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
export async function updateStripeCustomerId(userId, stripeCustomerId) {
  const db = getDatabase();
  return await db('users')
    .where('id', userId)
    .update({
      stripe_customer_id: stripeCustomerId,
      updated_at: Date.now(),
    });
}

/**
 * Subscription aktualisieren
 */
export async function updateSubscription(userId, status, plan, periodEnd) {
  const db = getDatabase();
  return await db('users')
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

