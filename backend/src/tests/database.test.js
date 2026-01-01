/**
 * PostgreSQL Connection & Migration Tests
 * Testet Datenbank-Verbindung und Migrations
 */

import { describe, it, before, after } from '@jest/globals';
import { getDatabase, initializeDatabase } from '../database/dbKnex.js';

describe('PostgreSQL Connection', () => {
  let db;
  
  before(async () => {
    db = getDatabase();
    await initializeDatabase();
  });
  
  it('should connect to PostgreSQL', async () => {
    const result = await db.raw('SELECT 1+1 as result');
    expect(result.rows[0].result).toBe(2);
  });
  
  it('should run migrations successfully', async () => {
    const migrations = await db('knex_migrations').select('*');
    expect(migrations.length).toBeGreaterThan(0);
  });
  
  it('should have all required tables', async () => {
    const tables = await db('information_schema.tables')
      .where('table_schema', 'public')
      .select('table_name');
    
    const tableNames = tables.map(t => t.table_name);
    
    // Core tables
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('refresh_tokens');
    expect(tableNames).toContain('analysis_sessions');
    expect(tableNames).toContain('webhook_events');
    
    // Audit tables
    expect(tableNames).toContain('user_activity_log');
    expect(tableNames).toContain('api_requests');
    expect(tableNames).toContain('feature_usage');
    expect(tableNames).toContain('error_logs');
    expect(tableNames).toContain('performance_metrics');
  });
  
  it('should have role field in users table', async () => {
    const columns = await db('information_schema.columns')
      .where('table_name', 'users')
      .select('column_name');
    
    const columnNames = columns.map(c => c.column_name);
    expect(columnNames).toContain('role');
  });
  
  after(async () => {
    await db.destroy();
  });
});



