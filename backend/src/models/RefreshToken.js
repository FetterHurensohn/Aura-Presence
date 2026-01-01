/**
 * Refresh Token Model
 * Verwaltet Refresh-Tokens für JWT-Token-Rotation
 */

import { getDatabase } from '../database/dbKnex.js';
import crypto from 'crypto';

/**
 * Erstelle einen neuen Refresh Token
 * @param {number} userId - User ID
 * @param {string} token - Token string
 * @param {number} expiresAt - Expiration timestamp
 * @param {Object} meta - Optional metadata (userAgent, ipAddress)
 * @returns {Promise<Object>} Created token
 */
export async function createRefreshToken(userId, token, expiresAt, meta = {}) {
  const db = getDatabase();
  
  const [result] = await db('refresh_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: Date.now(),
      user_agent: meta.userAgent || null,
      ip_address: meta.ipAddress || null
    })
    .returning('id'); // PostgreSQL requires .returning()
  
  const id = result.id || result; // Handle both SQLite (number) and PostgreSQL (object)
  
  return { id, userId, token, expiresAt };
}

/**
 * Generiere einen neuen Refresh Token
 * @param {number} userId - User ID
 * @param {Object} meta - Optional metadata
 * @returns {Promise<Object>} Token object with token string and expiry
 */
export async function generateRefreshToken(userId, meta = {}) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 Tage
  
  await createRefreshToken(userId, token, expiresAt, meta);
  
  return { token, expiresAt };
}

/**
 * Finde einen gültigen Refresh Token
 * @param {string} token - Token string
 * @returns {Promise<Object|null>} Token object or null
 */
export async function findRefreshToken(token) {
  const db = getDatabase();
  
  return await db('refresh_tokens')
    .where('token', token)
    .where('revoked', false)
    .where('expires_at', '>', Date.now())
    .first();
}

/**
 * Revoke (invalidate) einen Refresh Token
 * @param {string} token - Token string
 * @returns {Promise<number>} Number of affected rows
 */
export async function revokeRefreshToken(token) {
  const db = getDatabase();
  
  return await db('refresh_tokens')
    .where('token', token)
    .update({ revoked: true });
}

/**
 * Revoke alle Refresh Tokens eines Users
 * @param {number} userId - User ID
 * @returns {Promise<number>} Number of affected rows
 */
export async function revokeAllUserTokens(userId) {
  const db = getDatabase();
  
  return await db('refresh_tokens')
    .where('user_id', userId)
    .where('revoked', false)
    .update({ revoked: true });
}

/**
 * Lösche abgelaufene Tokens (Cleanup)
 * @returns {Promise<number>} Number of deleted tokens
 */
export async function cleanupExpiredTokens() {
  const db = getDatabase();
  
  return await db('refresh_tokens')
    .where('expires_at', '<', Date.now())
    .delete();
}

/**
 * Hole alle aktiven Refresh Tokens eines Users
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of active tokens
 */
export async function getUserRefreshTokens(userId) {
  const db = getDatabase();
  
  return await db('refresh_tokens')
    .where('user_id', userId)
    .where('revoked', false)
    .where('expires_at', '>', Date.now())
    .select('id', 'created_at', 'expires_at', 'user_agent', 'ip_address')
    .orderBy('created_at', 'desc');
}

export default {
  createRefreshToken,
  generateRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cleanupExpiredTokens,
  getUserRefreshTokens
};





