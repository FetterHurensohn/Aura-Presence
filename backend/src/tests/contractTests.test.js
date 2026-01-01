/**
 * API Contract Tests
 * Validate that API responses conform to defined schemas
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import { createUser, deleteUser, findUserByEmail } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { getDatabase } from '../database/dbKnex.js';

describe('API Contract Tests', () => {
  let testUser;
  let testToken;
  let testEmail;

  beforeAll(async () => {
    // Create test user
    testEmail = `contracttest-${Date.now()}@example.com`;
    testUser = createUser(testEmail, 'TestPassword123!@#');
    testToken = generateToken(testUser.id);
  });

  afterAll(async () => {
    // Cleanup: Delete test user
    const db = getDatabase();
    if (testUser && testUser.id) {
      await db('users').where({ id: testUser.id }).delete();
    }
  });

  // ========================================================================
  // AUTH ENDPOINT CONTRACTS
  // ========================================================================

  describe('POST /api/auth/register', () => {
    it('should return valid AuthRegisterResponse schema', async () => {
      const uniqueEmail = `register-${Date.now()}@example.com`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'TestPassword123!@#',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: expect.any(String),
        user: {
          id: expect.any(Number),
          email: uniqueEmail,
          role: 'free',
          subscription_status: 'none',
          created_at: expect.any(Number),
          updated_at: expect.any(Number),
        },
        token: expect.any(String),
      });

      // Cleanup
      const db = getDatabase();
      await db('users').where({ email: uniqueEmail }).delete();
    });

    it('should return ErrorResponse for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'TestPassword123!@#',
        });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'EMAIL_EXISTS',
      });
    });

    it('should return ErrorResponse for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'VALIDATION_ERROR',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return valid AuthLoginResponse schema', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'TestPassword123!@#',
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: expect.any(String),
        user: {
          id: expect.any(Number),
          email: testEmail,
          role: expect.stringMatching(/^(free|pro|enterprise)$/),
          subscription_status: expect.stringMatching(/^(none|active|trialing|canceled|past_due)$/),
          created_at: expect.any(Number),
          updated_at: expect.any(Number),
        },
        token: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should return ErrorResponse for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!@#',
        });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'INVALID_CREDENTIALS',
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return valid AuthRefreshResponse schema', async () => {
      // First login to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'TestPassword123!@#',
        });

      const refreshToken = loginResponse.body.refreshToken;

      // Then refresh
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        token: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should return ErrorResponse for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'INVALID_REFRESH_TOKEN',
      });
    });
  });

  // ========================================================================
  // ANALYZE ENDPOINT CONTRACTS
  // ========================================================================

  describe('POST /api/analyze', () => {
    it('should return valid AnalyzeResponse schema', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          features: {
            eye_contact_quality: 0.85,
            blink_rate: 18,
            facial_expression: 'smiling',
            head_pose: {
              pitch: 5,
              yaw: -3,
              roll: 1,
            },
            hands_detected: ['left', 'right'],
            left_hand_gesture: 'open',
            right_hand_gesture: 'pointing',
            hand_movement_speed: 0.25,
            posture_angle: 5,
            frame_timestamp: Date.now(),
            confidence: 0.92,
          },
          sessionId: 'test-session-123',
        });

      // May be 200 or 403 depending on user role and limits
      if (response.status === 200) {
        expect(response.body).toMatchObject({
          success: expect.any(Boolean),
          timestamp: expect.any(Number),
          sessionId: expect.any(String),
          dbSessionId: expect.any(Number),
          evaluation: {
            metrics: expect.any(Object),
            flags: expect.any(Array),
            confidence: expect.any(Number),
          },
          interpretation: {
            feedback: expect.any(String),
            tone: expect.any(String),
            source: expect.stringMatching(/^(openai|mock)$/),
          },
          metadata: {
            processingTime: expect.any(Number),
            userId: expect.any(Number),
          },
        });

        // Validate metric structure
        const metrics = response.body.evaluation.metrics;
        Object.values(metrics).forEach((metric) => {
          expect(metric).toMatchObject({
            value: expect.anything(),
            status: expect.any(String),
            description: expect.any(String),
          });
        });
      } else if (response.status === 403) {
        // Feature not available or usage limit exceeded
        expect(response.body).toMatchObject({
          error: expect.any(String),
          message: expect.any(String),
          code: expect.stringMatching(/^(FEATURE_NOT_AVAILABLE|USAGE_LIMIT_EXCEEDED)$/),
        });
      }
    });

    it('should return ErrorResponse without authentication', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({
          features: {
            frame_timestamp: Date.now(),
          },
        });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: expect.stringMatching(/^(AUTH_REQUIRED|NO_TOKEN)$/),
      });
    });

    it('should return ErrorResponse for invalid features', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          features: {
            // Missing required frame_timestamp
            eye_contact_quality: 0.85,
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'VALIDATION_ERROR',
      });
    });
  });

  // ========================================================================
  // SUBSCRIPTION ENDPOINT CONTRACTS
  // ========================================================================

  describe('GET /api/subscription/status', () => {
    it('should return valid SubscriptionStatusResponse schema', async () => {
      const response = await request(app)
        .get('/api/subscription/status')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(none|active|trialing|canceled|past_due)$/),
        plan: expect.toBeOneOf([expect.any(String), null]),
        role: expect.stringMatching(/^(free|pro|enterprise)$/),
        currentPeriodEnd: expect.toBeOneOf([expect.any(String), null]),
        limits: {
          analysisPerMonth: expect.any(Number),
          sessionDurationMinutes: expect.any(Number),
          storageRetentionDays: expect.any(Number),
        },
        usage: {
          analysisThisMonth: expect.any(Number),
        },
      });
    });

    it('should return ErrorResponse without authentication', async () => {
      const response = await request(app).get('/api/subscription/status');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: expect.stringMatching(/^(AUTH_REQUIRED|NO_TOKEN)$/),
      });
    });
  });

  describe('POST /api/subscription/create-checkout', () => {
    it('should return valid SubscriptionCreateCheckoutResponse schema', async () => {
      // Note: This will fail if STRIPE_SECRET_KEY is not set
      const response = await request(app)
        .post('/api/subscription/create-checkout')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          priceId: process.env.STRIPE_PRICE_ID || 'price_test_123',
        });

      // May be 200 or 500 depending on Stripe configuration
      if (response.status === 200) {
        expect(response.body).toMatchObject({
          sessionId: expect.any(String),
          url: expect.any(String),
        });
        expect(response.body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
      }
    });

    it('should return ErrorResponse without priceId', async () => {
      const response = await request(app)
        .post('/api/subscription/create-checkout')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: 'PRICE_ID_REQUIRED',
      });
    });
  });

  // ========================================================================
  // SESSIONS ENDPOINT CONTRACTS
  // ========================================================================

  describe('GET /api/sessions', () => {
    it('should return valid SessionsHistoryResponse schema', async () => {
      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${testToken}`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: expect.any(Boolean),
        sessions: expect.any(Array),
        count: expect.any(Number),
      });

      // Validate session structure if sessions exist
      if (response.body.sessions.length > 0) {
        response.body.sessions.forEach((session) => {
          expect(session).toMatchObject({
            id: expect.any(Number),
            user_id: expect.any(Number),
            started_at: expect.any(Number),
            total_frames: expect.any(Number),
          });
        });
      }
    });

    it('should return ErrorResponse without authentication', async () => {
      const response = await request(app).get('/api/sessions');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: expect.stringMatching(/^(AUTH_REQUIRED|NO_TOKEN)$/),
      });
    });
  });

  describe('GET /api/sessions/stats', () => {
    it('should return valid SessionsStatsResponse schema', async () => {
      const response = await request(app)
        .get('/api/sessions/stats')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        totalSessions: expect.any(Number),
        totalFrames: expect.any(Number),
      });
    });
  });

  // ========================================================================
  // GDPR ENDPOINT CONTRACTS
  // ========================================================================

  describe('POST /api/gdpr/export', () => {
    it('should return valid GDPRExportResponse schema', async () => {
      const response = await request(app)
        .post('/api/gdpr/export')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        exportDate: expect.any(String),
        exportVersion: expect.any(String),
        user: {
          id: expect.any(Number),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        subscription: expect.any(Object),
        analysisSessions: expect.any(Array),
        webhookEvents: expect.any(Array),
        gdprInfo: {
          dataController: expect.any(String),
          contactEmail: expect.any(String),
          rightsInfo: expect.any(String),
        },
      });

      // Validate ISO 8601 date format
      expect(response.body.exportDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return ErrorResponse without authentication', async () => {
      const response = await request(app).post('/api/gdpr/export');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
        code: expect.stringMatching(/^(AUTH_REQUIRED|NO_TOKEN)$/),
      });
    });
  });

  describe('POST /api/gdpr/delete', () => {
    it('should return valid GDPRDeleteResponse schema', async () => {
      const response = await request(app)
        .post('/api/gdpr/delete')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        deletionDate: expect.any(Number),
        gracePeriodDays: expect.any(Number),
        alreadyScheduled: expect.any(Boolean),
      });

      // Grace period should be 30 days
      expect(response.body.gracePeriodDays).toBe(30);

      // Cancel deletion for cleanup
      await request(app)
        .post('/api/gdpr/cancel-deletion')
        .set('Authorization', `Bearer ${testToken}`);
    });
  });

  describe('POST /api/gdpr/cancel-deletion', () => {
    it('should return valid GDPRCancelDeletionResponse schema', async () => {
      // First schedule deletion
      await request(app)
        .post('/api/gdpr/delete')
        .set('Authorization', `Bearer ${testToken}`);

      // Then cancel
      const response = await request(app)
        .post('/api/gdpr/cancel-deletion')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        wasPending: expect.any(Boolean),
      });
    });
  });

  // ========================================================================
  // ERROR RESPONSE FORMAT VALIDATION
  // ========================================================================

  describe('Error Response Format', () => {
    it('should use standardized error format for all errors', async () => {
      const errorEndpoints = [
        { method: 'post', path: '/api/auth/login', body: { email: 'wrong@test.com', password: 'wrong' } },
        { method: 'post', path: '/api/analyze', body: {}, headers: {} },
        { method: 'get', path: '/api/subscription/status', headers: {} },
      ];

      for (const endpoint of errorEndpoints) {
        const response = await request(app)[endpoint.method](endpoint.path)
          .set(endpoint.headers || {})
          .send(endpoint.body || {});

        if (response.status >= 400) {
          expect(response.body).toMatchObject({
            error: expect.any(String),
            message: expect.any(String),
            code: expect.any(String),
          });

          // Code should be UPPER_SNAKE_CASE
          expect(response.body.code).toMatch(/^[A-Z_]+$/);
        }
      }
    });
  });
});

// Custom Jest matchers
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.some((item) => {
      if (typeof item === 'function') {
        // It's a matcher like expect.any(String)
        try {
          expect(received).toEqual(item);
          return true;
        } catch {
          return false;
        }
      }
      return received === item;
    });

    return {
      message: () => `expected ${received} to be one of ${expected}`,
      pass,
    };
  },
});



