/**
 * Script: Add language field to users table in Production
 * Führt die Migration 20250105000000_add_user_profile_fields aus
 */

import knex from 'knex';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL nicht gefunden in .env!');
  process.exit(1);
}

console.log('🔗 Verbinde zu Production DB...');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    directory: '../src/database/migrations'
  }
});

async function addLanguageField() {
  try {
    console.log('📊 Prüfe ob language-Spalte bereits existiert...');
    
    // Check if column exists
    const hasColumn = await db.schema.hasColumn('users', 'language');
    
    if (hasColumn) {
      console.log('✅ language-Spalte existiert bereits!');
      return;
    }
    
    console.log('➕ Füge language-Spalte hinzu...');
    
    await db.schema.table('users', (table) => {
      table.string('language', 10).defaultTo('de');
    });
    
    console.log('✅ language-Spalte erfolgreich hinzugefügt!');
    
    // Verify
    const columnInfo = await db('users').columnInfo('language');
    console.log('📋 Spalten-Info:', columnInfo);
    
  } catch (error) {
    console.error('❌ Fehler:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

addLanguageField()
  .then(() => {
    console.log('🎉 Migration erfolgreich abgeschlossen!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration fehlgeschlagen:', error);
    process.exit(1);
  });

