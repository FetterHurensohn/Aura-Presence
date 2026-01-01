/**
 * Knex Configuration
 * Configured for Supabase PostgreSQL (or any PostgreSQL database)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root (two levels up from this file)
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * PostgreSQL Configuration (Supabase or any PostgreSQL provider)
 * PostgreSQL is REQUIRED - SQLite is not supported
 */
function getConfig() {
  // PostgreSQL is REQUIRED
  if (!DATABASE_URL || !DATABASE_URL.startsWith('postgresql')) {
    throw new Error(
      '❌ DATABASE_URL must be set to a PostgreSQL connection string.\n' +
      'Example: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres\n' +
      'For Supabase: Get this from Project Settings > Database > Connection String (URI)\n' +
      'For local development with Docker:\n' +
      'docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=aura_presence postgres:15'
    );
  }
  
  console.log('✅ PostgreSQL connection configured');
  
  // Parse connection config for Supabase SSL support
  const connectionConfig = {
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false } // Allow self-signed certs in development
  };
  
  return {
    client: 'pg',
    connection: connectionConfig,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
    },
    migrations: {
      directory: join(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: join(__dirname, 'seeds'),
    },
  };
}

export default getConfig();





