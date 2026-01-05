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
export async function createUser(email, password, profileData = {}) {
  const db = getDatabase();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
  const timestamp = Date.now();

  const userData = {
    email,
    password_hash: passwordHash,
    created_at: timestamp,
    updated_at: timestamp,
  };

  // Optionale Profildaten hinzufügen
  if (profileData.name) userData.name = profileData.name;
  if (profileData.company) userData.company = profileData.company;
  if (profileData.country) userData.country = profileData.country;
  if (profileData.language) userData.language = profileData.language;

  const [userId] = await db('users').insert(userData).returning('id');

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

/**
 * Profildaten aktualisieren
 */
export async function updateUserProfile(userId, profileData) {
  const db = getDatabase();
  const updateData = {
    updated_at: Date.now(),
  };
  
  if (profileData.name !== undefined) updateData.name = profileData.name;
  if (profileData.company !== undefined) updateData.company = profileData.company;
  if (profileData.country !== undefined) updateData.country = profileData.country;
  if (profileData.language !== undefined) updateData.language = profileData.language;
  
  await db('users')
    .where('id', userId)
    .update(updateData);
    
  return findUserById(userId);
}

