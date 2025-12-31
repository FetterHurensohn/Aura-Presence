/**
 * Knex Configuration
 * Unterstützt SQLite (Dev/Tests) und PostgreSQL (Production)
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

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
  let sqlitePath = join(__dirname, '../../data/aura-presence.db');
  
  // Override mit DATABASE_URL falls gesetzt
  if (DATABASE_URL && DATABASE_URL.startsWith('sqlite:')) {
    const customPath = DATABASE_URL.replace('sqlite:', '').trim();
    if (customPath && customPath !== ':memory:') {
      sqlitePath = customPath;
    } else if (customPath === ':memory:') {
      sqlitePath = ':memory:';
    }
  }
  
  // Stelle sicher, dass das data-Verzeichnis existiert (außer für :memory:)
  if (sqlitePath !== ':memory:') {
    const dataDir = dirname(sqlitePath);
    
    // Nur versuchen zu erstellen wenn Pfad absolut oder gültig ist
    if (dataDir && dataDir !== '.' && dataDir !== sqlitePath) {
      try {
        mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        // Ignoriere Fehler - db.js wird das Verzeichnis auch erstellen
        if (err.code !== 'EEXIST' && err.code !== 'ENOENT') {
          console.error('Warnung beim Erstellen des data-Verzeichnisses:', err.message);
        }
      }
    }
  }
  
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





