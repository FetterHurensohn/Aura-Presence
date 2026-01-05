/**
 * Reset Password für jacquesdong9@gmail.com in Production DB
 * Verwendung: node scripts/reset-jacquesdong-password.js
 */

import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BCRYPT_ROUNDS = 10;
const TARGET_EMAIL = 'jacquesdong9@gmail.com';
const NEW_PASSWORD = 'Aura2024!';

async function resetPassword() {
  console.log('🔧 Password Reset Script gestartet...\n');

  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL nicht gefunden!');
    console.error('Stelle sicher, dass die .env Datei vorhanden ist.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false
  });

  try {
    // Connect to database
    console.log('📡 Verbinde zur Datenbank...');
    await client.connect();
    console.log('✅ Verbindung erfolgreich!\n');

    // Check if user exists
    console.log(`🔍 Suche User: ${TARGET_EMAIL}`);
    const userResult = await client.query(
      'SELECT id, email, created_at FROM users WHERE email = $1',
      [TARGET_EMAIL]
    );

    if (userResult.rows.length === 0) {
      console.error(`❌ User "${TARGET_EMAIL}" nicht gefunden!`);
      console.error('Der Account existiert nicht in der Datenbank.');
      process.exit(1);
    }

    const user = userResult.rows[0];
    console.log(`✅ User gefunden: ID ${user.id}\n`);

    // Generate new password hash
    console.log('🔐 Generiere neuen Password-Hash...');
    const passwordHash = bcrypt.hashSync(NEW_PASSWORD, BCRYPT_ROUNDS);
    console.log(`✅ Hash generiert: ${passwordHash.substring(0, 20)}...\n`);

    // Update password in database
    console.log('💾 Update Passwort in Datenbank...');
    const updateResult = await client.query(
      'UPDATE users SET password_hash = $1, updated_at = $2 WHERE email = $3 RETURNING id, email',
      [passwordHash, Date.now(), TARGET_EMAIL]
    );

    if (updateResult.rows.length > 0) {
      console.log('✅ Passwort erfolgreich aktualisiert!\n');
    } else {
      console.error('❌ Update fehlgeschlagen!');
      process.exit(1);
    }

    // Verify the new password
    console.log('🔍 Verifiziere neues Passwort...');
    const verifyResult = await client.query(
      'SELECT password_hash FROM users WHERE email = $1',
      [TARGET_EMAIL]
    );

    const storedHash = verifyResult.rows[0].password_hash;
    const isValid = bcrypt.compareSync(NEW_PASSWORD, storedHash);

    if (isValid) {
      console.log('✅ Passwort-Verifikation erfolgreich!\n');
    } else {
      console.error('❌ Passwort-Verifikation fehlgeschlagen!');
      process.exit(1);
    }

    // Success summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PASSWORT ERFOLGREICH ZURÜCKGESETZT!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${TARGET_EMAIL}`);
    console.log(`🔑 Passwort: ${NEW_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎯 JETZT TESTEN:');
    console.log('1. Öffne: https://aura-presence-analyser.vercel.app/login');
    console.log('2. Login mit obigen Daten');
    console.log('✅ Sollte funktionieren!\n');

  } catch (error) {
    console.error('\n❌ FEHLER:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Datenbankverbindung geschlossen.');
  }
}

// Run the script
resetPassword();

