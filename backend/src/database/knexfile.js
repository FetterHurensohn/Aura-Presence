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

// Erstelle data-Verzeichnis sofort beim Modul-Import
const defaultDataPath = join(__dirname, '../../data');
try {
  mkdirSync(defaultDataPath, { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.warn('Konnte data-Verzeichnis nicht erstellen:', err.message);
  }
}

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
  // WICHTIG: Verwende IMMER absoluten Pfad mit join(__dirname, ...)
  let sqlitePath = join(__dirname, '../../data/aura-presence.db');
  
  // Override mit DATABASE_URL falls explizit und korrekt gesetzt
  if (DATABASE_URL && DATABASE_URL.trim().length > 0 && DATABASE_URL.startsWith('sqlite:')) {
    const customPath = DATABASE_URL.replace('sqlite:', '').trim();
    
    if (customPath === ':memory:') {
      // In-Memory-Datenbank
      sqlitePath = ':memory:';
    } else if (customPath && customPath.length > 0) {
      // Entferne führende './' wenn vorhanden
      const cleanPath = customPath.replace(/^\.\//, '');
      
      // Prüfe ob Pfad absolut ist
      // Windows: Enthält ':' (z.B. C:\...)
      // Unix: Startet mit '/' (z.B. /var/...)
      const isAbsolute = cleanPath.includes(':') || cleanPath.startsWith('/');
      
      if (isAbsolute) {
        sqlitePath = cleanPath;
      } else {
        // Relativer Pfad -> mache absolut relativ zum Backend-Root
        sqlitePath = join(__dirname, '../../', cleanPath);
      }
    }
  }
  
  console.log('📊 SQLite-Datenbank-Pfad:', sqlitePath);
  
  // Stelle sicher, dass das Datenbank-Verzeichnis existiert
  if (sqlitePath !== ':memory:') {
    const dataDir = dirname(sqlitePath);
    
    // Robuster Check: Nur versuchen zu erstellen, wenn der Pfad gültig und absolut ist
    const isValidPath = dataDir && 
                        dataDir !== '.' && 
                        dataDir !== '..' &&
                        dataDir !== sqlitePath &&
                        !dataDir.startsWith('\\\\.\\') && // Windows Device Path
                        (dataDir.includes(':') || dataDir.startsWith('/')); // Absoluter Pfad (Windows oder Unix)
    
    if (isValidPath) {
      try {
        mkdirSync(dataDir, { recursive: true });
        console.log(`✓ Datenbank-Verzeichnis erstellt/überprüft: ${dataDir}`);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          console.error('FEHLER beim Erstellen des Datenbank-Verzeichnisses:', {
            dataDir,
            sqlitePath,
            error: err.message
          });
        }
      }
    } else {
      console.warn('⚠️ Invalider Datenbank-Pfad erkannt, überspringe Verzeichnis-Erstellung:', {
        dataDir,
        sqlitePath
      });
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





