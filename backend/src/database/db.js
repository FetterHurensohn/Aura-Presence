/**
 * SQLite Datenbank-Setup mit better-sqlite3
 * Einfache, synchrone DB für den Starter - später auf PostgreSQL migrieren
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, '../../data/aura-presence.db');

// Stelle sicher, dass das data-Verzeichnis existiert
const dataDir = dirname(DB_PATH);
try {
  mkdirSync(dataDir, { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    logger.error('Fehler beim Erstellen des data-Verzeichnisses:', err);
  }
}

let db = null;

/**
 * Datenbank-Verbindung herstellen
 */
export function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH, {
      verbose: process.env.NODE_ENV === 'development' ? logger.debug : null
    });
    
    // WAL-Modus für bessere Performance
    db.pragma('journal_mode = WAL');
  }
  
  return db;
}

/**
 * Datenbank initialisieren und Tabellen erstellen
 */
export async function initializeDatabase() {
  const database = getDatabase();
  
  // Users Tabelle
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      stripe_customer_id TEXT,
      subscription_status TEXT DEFAULT 'none',
      subscription_plan TEXT,
      subscription_current_period_end INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
  
  // Index auf E-Mail für schnelle Lookups
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);
  
  // Analysis Sessions Tabelle (optional für Tracking)
  database.exec(`
    CREATE TABLE IF NOT EXISTS analysis_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      total_frames INTEGER DEFAULT 0,
      average_confidence REAL,
      metadata TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // Webhook Events Tabelle (für Idempotenz bei Stripe Webhooks)
  database.exec(`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT UNIQUE NOT NULL,
      event_type TEXT NOT NULL,
      processed_at INTEGER NOT NULL,
      payload TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  
  // Index auf event_id für schnelle Idempotenz-Checks
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id)
  `);
  
  // Index auf event_type für Queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type)
  `);
  
  logger.info('Datenbank-Tabellen erfolgreich erstellt/überprüft');
  
  return database;
}

/**
 * Datenbank-Verbindung schließen (für Tests)
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

export default getDatabase;

