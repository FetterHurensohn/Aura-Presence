/**
 * Database Connection (Knex.js + PostgreSQL/Supabase)
 */

import knex from 'knex';
import knexConfig from './knexfile.js';

// Knex Instance erstellen
const db = knex(knexConfig);

/**
 * Initialisiert Datenbank (führt Migrations aus wenn nötig)
 */
export async function initializeDatabase() {
  try {
    // Test Connection
    await db.raw('SELECT 1');
    console.log('✅ Database connected successfully');
    
    // SKIP Migrations check (temporär - für Sentry Testing)
    console.log('⚠️  Migrations check skipped for testing');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

/**
 * Graceful Shutdown
 */
export async function closeDatabase() {
  try {
    await db.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error.message);
  }
}

export default db;

