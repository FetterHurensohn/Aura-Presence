/**
 * Database Connection Tests (Supabase)
 * Integration tests for PostgreSQL/Supabase database connection
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getDatabase } from '../../src/database/dbKnex.js';

describe('Supabase Database Connection', () => {
  let db;

  beforeAll(() => {
    db = getDatabase();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('Connection', () => {
    it('should connect to Supabase PostgreSQL', async () => {
      const result = await db.raw('SELECT 1+1 as result');
      expect(result.rows[0].result).toBe(2);
    });

    it('should use PostgreSQL client', () => {
      expect(db.client.config.client).toBe('pg');
    });

    it('should have connection pooling enabled', () => {
      const poolConfig = db.client.pool;
      expect(poolConfig.min).toBeGreaterThanOrEqual(2);
      expect(poolConfig.max).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Migrations', () => {
    it('should have migrations table', async () => {
      const exists = await db.schema.hasTable('knex_migrations');
      expect(exists).toBe(true);
    });

    it('should have run all migrations', async () => {
      const migrations = await db('knex_migrations').select('*');
      expect(migrations.length).toBeGreaterThan(0);
    });
  });

  describe('Tables', () => {
    const requiredTables = [
      'users',
      'refresh_tokens',
      'sessions',
      'user_activity_log',
      'api_requests'
    ];

    requiredTables.forEach(tableName => {
      it(`should have ${tableName} table`, async () => {
        const exists = await db.schema.hasTable(tableName);
        expect(exists).toBe(true);
      });
    });
  });

  describe('Query Performance', () => {
    it('should execute simple query in reasonable time', async () => {
      const start = Date.now();
      await db.raw('SELECT NOW()');
      const duration = Date.now() - start;
      
      // Should be faster than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });
});

