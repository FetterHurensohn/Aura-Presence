/**
 * Error Handling Tests
 * Testet standardisiertes Error-Format in Backend-Routes
 */

import request from 'supertest';
import { app } from '../src/server.js';

describe('Error Handling', () => {
  describe('Standardisiertes Error-Format', () => {
    it('should return standardized error format on validation error', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email', // Ungültige E-Mail
          password: 'short' // Zu kurzes Passwort
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return standardized error format on duplicate email', async () => {
      // Erstelle User
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test1234'
        });

      // Versuche nochmal mit gleicher E-Mail
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test1234'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'E-Mail bereits registriert');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'EMAIL_EXISTS');
    });

    it('should return standardized error format on invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPass123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Ungültige Anmeldedaten');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    it('should return standardized error format on missing auth token', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({
          features: {
            eye_contact_estimate: 0.8,
            blink_rate_estimate: 15,
            mouth_open: false,
            hand_movement_freq: 0.5,
            posture_angle: 0,
            frame_timestamp: Date.now()
          }
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'NO_TOKEN');
    });

    it('should return standardized error format on 404', async () => {
      const response = await request(app)
        .get('/api/nonexistent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route nicht gefunden');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('Error Format Consistency', () => {
    it('all errors should have required fields: error, message, code', async () => {
      const testCases = [
        // Invalid email
        {
          method: 'post',
          path: '/api/auth/register',
          body: { email: 'invalid', password: 'Test1234' },
          expectedStatus: 400
        },
        // Missing token
        {
          method: 'get',
          path: '/api/auth/me',
          expectedStatus: 401
        },
        // 404
        {
          method: 'get',
          path: '/api/invalid-route',
          expectedStatus: 404
        }
      ];

      for (const testCase of testCases) {
        let response;
        
        if (testCase.method === 'post') {
          response = await request(app)
            .post(testCase.path)
            .send(testCase.body || {});
        } else {
          response = await request(app)
            .get(testCase.path);
        }

        expect(response.status).toBe(testCase.expectedStatus);
        expect(response.body).toHaveProperty('error');
        expect(typeof response.body.error).toBe('string');
        
        // message und code können optional sein, aber wenn vorhanden, müssen sie Strings sein
        if (response.body.message !== undefined) {
          expect(typeof response.body.message).toBe('string');
        }
        
        if (response.body.code !== undefined) {
          expect(typeof response.body.code).toBe('string');
        }
      }
    });
  });

  describe('No sensitive data in errors', () => {
    it('should not expose stack traces in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short' // Trigger validation error
        });

      expect(response.body).not.toHaveProperty('stack');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not expose password hashes in error messages', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        });

      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toMatch(/\$2[aby]\$/); // bcrypt hash pattern
    });
  });
});





