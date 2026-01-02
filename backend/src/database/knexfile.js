/**
 * Knex Configuration
 * Unterstützt SQLite (Dev/Tests) und PostgreSQL (Production)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Bestimme DB-Client basierend auf DATABASE_URL
 */
function getConfig() {
  // PostgreSQL
  if (DATABASE_URL && DATABASE_URL.startsWith('postgresql')) {
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
  
  // SQLite (Default für Dev/Tests)
  const sqlitePath = DATABASE_URL?.replace('sqlite:', '') || 
                     join(__dirname, '../../data/aura-presence.db');
  
  return {
    client: 'better-sqlite3',
    connection: {
      filename: sqlitePath === ':memory:' ? ':memory:' : sqlitePath,
    },
    useNullAsDefault: true, // Erforderlich für SQLite
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





