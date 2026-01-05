/**
 * Run Migration on Production Database
 * Führt die Profil-Felder Migration direkt auf Railway PostgreSQL aus
 */

import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  console.log('🔧 Migration: Add User Profile Fields\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL nicht gefunden!');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  });

  try {
    console.log('📡 Verbinde zur Production Database...');
    await client.connect();
    console.log('✅ Verbindung erfolgreich!\n');

    // Check if columns already exist
    console.log('🔍 Prüfe ob Spalten bereits existieren...');
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('name', 'company', 'country')
    `);

    if (checkResult.rows.length > 0) {
      console.log('⚠️  Spalten existieren bereits:');
      checkResult.rows.forEach(row => {
        console.log(`   - ${row.column_name}`);
      });
      console.log('\n✅ Migration bereits durchgeführt - Überspringe.');
      process.exit(0);
    }

    // Add columns
    console.log('💾 Füge neue Spalten hinzu...\n');
    
    console.log('   → Füge "name" Spalte hinzu...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN name VARCHAR(255)
    `);
    console.log('   ✅ "name" hinzugefügt');

    console.log('   → Füge "company" Spalte hinzu...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN company VARCHAR(255)
    `);
    console.log('   ✅ "company" hinzugefügt');

    console.log('   → Füge "country" Spalte hinzu...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN country VARCHAR(100)
    `);
    console.log('   ✅ "country" hinzugefügt');

    // Verify
    console.log('\n🔍 Verifiziere Migration...');
    const verifyResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('name', 'company', 'country')
      ORDER BY column_name
    `);

    console.log('✅ Migration erfolgreich verifiziert:\n');
    verifyResult.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}(${row.character_maximum_length || 'N/A'})`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ MIGRATION ERFOLGREICH ABGESCHLOSSEN!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ FEHLER bei Migration:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Datenbankverbindung geschlossen.\n');
  }
}

runMigration();

