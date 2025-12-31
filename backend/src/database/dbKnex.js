/**
 * Knex Database Instance
 * Ersetzt better-sqlite3 mit einem DB-agnostischen Layer
 */

import knex from 'knex';
import knexConfig from './knexfile.js';
import logger from '../utils/logger.js';

let db = null;

/**
 * Datenbank-Instanz abrufen (Singleton)
 */
export function getDatabase() {
  if (!db) {
    db = knex(knexConfig);
    
    logger.info(`Datenbank verbunden: ${knexConfig.client}`);
    
    if (knexConfig.client === 'pg') {
      logger.info('PostgreSQL Connection Pool:', knexConfig.pool);
    }
  }
  
  return db;
}

/**
 * Datenbank initialisieren und Migrations ausführen
 */
export async function initializeDatabase() {
  const database = getDatabase();
  
  try {
    // Prüfe DB-Connection
    await database.raw('SELECT 1');
    logger.info('Datenbank-Verbindung erfolgreich');
    
    // Führe Migrations aus
    const [batchNo, migrations] = await database.migrate.latest();
    
    if (migrations.length === 0) {
      logger.info('Alle Migrations bereits ausgeführt');
    } else {
      logger.info(`Migrations ausgeführt (Batch ${batchNo}):`, migrations);
    }
    
    return database;
  } catch (error) {
    logger.error('Fehler bei der Datenbank-Initialisierung:', error);
    throw error;
  }
}

/**
 * Datenbank-Verbindung schließen
 */
export async function closeDatabase() {
  if (db) {
    await db.destroy();
    db = null;
    logger.info('Datenbank-Verbindung geschlossen');
  }
}

/**
 * Health-Check: Teste DB-Connection
 */
export async function checkDatabaseHealth() {
  try {
    const database = getDatabase();
    await database.raw('SELECT 1');
    return { status: 'healthy', client: knexConfig.client };
  } catch (error) {
    logger.error('Database Health-Check fehlgeschlagen:', error);
    return { status: 'unhealthy', error: error.message };
  }
}

export default getDatabase;





