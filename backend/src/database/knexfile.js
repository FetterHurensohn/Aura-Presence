/**
 * Knex Configuration
 * Configured for Supabase PostgreSQL (or any PostgreSQL database)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  
  return {
    client: 'pg',
    connection: DATABASE_URL,
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





