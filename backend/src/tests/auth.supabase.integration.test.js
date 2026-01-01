/**
 * Auth Integration Tests (Supabase)
 * Tests authentication flow with Supabase PostgreSQL backend
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getDatabase } from '../../src/database/dbKnex.js';
import { createUser, findUserByEmail, verifyPassword } from '../../src/models/User.js';
import { generateRefreshToken, findRefreshToken, revokeRefreshToken } from '../../src/models/RefreshToken.js';

describe('Auth Integration with Supabase', () => {
  let db;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  beforeAll(() => {
    db = getDatabase();
  });

  afterAll(async () => {
    // Cleanup test data
    await db('refresh_tokens').where('user_id', '>', 0).delete();
    await db('users').where('email', 'like', 'test-%@example.com').delete();
    await db.destroy();
  });

  describe('User Registration', () => {
    it('should create a new user in Supabase', async () => {
      const user = await createUser(testEmail, testPassword);
      
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.password_hash).toBeUndefined(); // Should be sanitized
    });

    it('should not allow duplicate emails', async () => {
      await expect(createUser(testEmail, testPassword)).rejects.toThrow();
    });

    it('should hash password correctly', async () => {
      const user = await findUserByEmail(testEmail);
      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe(testPassword);
      expect(user.password_hash.length).toBeGreaterThan(50); // bcrypt hash length
    });
  });

  describe('User Login', () => {
    it('should find user by email', async () => {
      const user = await findUserByEmail(testEmail);
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
    });

    it('should verify correct password', () => {
      const user = findUserByEmail(testEmail);
      const isValid = verifyPassword(testPassword, user.password_hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await findUserByEmail(testEmail);
      const isValid = verifyPassword('WrongPassword', user.password_hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Refresh Tokens', () => {
    let userId;
    let tokenString;

    beforeAll(async () => {
      const user = await findUserByEmail(testEmail);
      userId = user.id;
    });

    it('should generate refresh token', async () => {
      const result = await generateRefreshToken(userId, {
        userAgent: 'Jest Test',
        ipAddress: '127.0.0.1'
      });
      
      tokenString = result.token;
      
      expect(result.token).toBeDefined();
      expect(result.token.length).toBe(128); // 64 bytes hex = 128 chars
      expect(result.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should find valid refresh token', async () => {
      const token = await findRefreshToken(tokenString);
      
      expect(token).toBeDefined();
      expect(token.user_id).toBe(userId);
      expect(token.revoked).toBe(false);
    });

    it('should revoke refresh token', async () => {
      await revokeRefreshToken(tokenString);
      const token = await findRefreshToken(tokenString);
      
      expect(token).toBeNull(); // findRefreshToken filters out revoked tokens
    });

    it('should store token metadata', async () => {
      const { token } = await generateRefreshToken(userId, {
        userAgent: 'Test Browser',
        ipAddress: '192.168.1.1'
      });
      
      const result = await db('refresh_tokens')
        .where({ token })
        .first();
      
      expect(result.user_agent).toBe('Test Browser');
      expect(result.ip_address).toBe('192.168.1.1');
    });
  });

  describe('Database Constraints', () => {
    it('should enforce unique email constraint', async () => {
      await expect(
        db('users').insert({
          email: testEmail,
          password_hash: 'dummy',
          created_at: Date.now(),
          updated_at: Date.now()
        })
      ).rejects.toThrow();
    });

    it('should enforce foreign key on refresh_tokens', async () => {
      await expect(
        db('refresh_tokens').insert({
          user_id: 999999, // Non-existent user
          token: 'dummy-token',
          expires_at: Date.now() + 86400000,
          created_at: Date.now()
        })
      ).rejects.toThrow();
    });
  });
});

