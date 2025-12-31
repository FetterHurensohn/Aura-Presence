/**
 * Tests für Auth-Funktionen
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { generateToken } from '../src/middleware/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

describe('Auth Middleware', () => {
  describe('generateToken', () => {
    test('sollte gültigen JWT Token generieren', () => {
      const userId = 123;
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Token verifizieren
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
    });
    
    test('sollte Token mit korrekter Gültigkeitsdauer erstellen', () => {
      const userId = 456;
      const token = generateToken(userId);
      
      const decoded = jwt.decode(token);
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      
      // Prüfe dass Gültigkeit > jetzt ist
      const now = Math.floor(Date.now() / 1000);
      expect(decoded.exp).toBeGreaterThan(now);
    });
  });
});





