/**
 * Test Login für jacquesdong9@gmail.com
 * Direkter Test gegen die Datenbank + Backend-Logik
 */

import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const TARGET_EMAIL = 'jacquesdong9@gmail.com';
const TEST_PASSWORD = 'Aura2024!';

async function testLogin() {
  console.log('🧪 Login Test gestartet...\n');

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
    await client.connect();
    console.log('✅ Verbindung zur Datenbank erfolgreich\n');

    // 1. User aus DB holen
    console.log(`🔍 Suche User: ${TARGET_EMAIL}`);
    const result = await client.query(
      'SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1',
      [TARGET_EMAIL]
    );

    if (result.rows.length === 0) {
      console.error('❌ User nicht gefunden!');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('✅ User gefunden:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`   Updated: ${user.updated_at}`);
    console.log(`   Hash: ${user.password_hash ? user.password_hash.substring(0, 30) + '...' : 'NULL'}`);
    console.log();

    // 2. Passwort-Hash analysieren
    console.log('🔍 Analysiere Password-Hash...');
    const hashPrefix = user.password_hash.substring(0, 4);
    console.log(`   Hash-Prefix: ${hashPrefix}`);
    
    if (hashPrefix === '$2b$') {
      console.log('   ✅ Gültiger bcrypt Hash (bcryptjs/bcrypt)');
    } else if (hashPrefix === '$2a$') {
      console.log('   ⚠️  bcrypt Hash (alte Version)');
    } else {
      console.log('   ❌ Unbekannter Hash-Typ!');
    }
    console.log();

    // 3. Passwort mit bcrypt.compareSync testen (wie im Backend)
    console.log('🔐 Test 1: bcrypt.compareSync() [wie im Backend]');
    const isValidSync = bcrypt.compareSync(TEST_PASSWORD, user.password_hash);
    console.log(`   Ergebnis: ${isValidSync ? '✅ GÜLTIG' : '❌ UNGÜLTIG'}`);
    console.log();

    // 4. Passwort mit bcrypt.compare (async) testen
    console.log('🔐 Test 2: bcrypt.compare() [async]');
    const isValidAsync = await bcrypt.compare(TEST_PASSWORD, user.password_hash);
    console.log(`   Ergebnis: ${isValidAsync ? '✅ GÜLTIG' : '❌ UNGÜLTIG'}`);
    console.log();

    // 5. Test mit falschem Passwort
    console.log('🔐 Test 3: Falsches Passwort (sollte ungültig sein)');
    const isInvalid = bcrypt.compareSync('WrongPassword123!', user.password_hash);
    console.log(`   Ergebnis: ${isInvalid ? '❌ FEHLER - sollte falsch sein!' : '✅ Korrekt - ungültig'}`);
    console.log();

    // 6. Neuen Hash generieren und vergleichen
    console.log('🔐 Test 4: Neuen Hash generieren und vergleichen');
    const newHash = bcrypt.hashSync(TEST_PASSWORD, 10);
    console.log(`   Neuer Hash: ${newHash.substring(0, 30)}...`);
    const testNewHash = bcrypt.compareSync(TEST_PASSWORD, newHash);
    console.log(`   Test mit neuem Hash: ${testNewHash ? '✅ GÜLTIG' : '❌ UNGÜLTIG'}`);
    console.log();

    // Final Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST ZUSAMMENFASSUNG');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User gefunden: ✅`);
    console.log(`Hash-Format: ${hashPrefix === '$2b$' ? '✅' : '❌'}`);
    console.log(`Sync-Verifikation: ${isValidSync ? '✅' : '❌'}`);
    console.log(`Async-Verifikation: ${isValidAsync ? '✅' : '❌'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (isValidSync && isValidAsync) {
      console.log('✅ ERGEBNIS: Login sollte funktionieren!');
      console.log('\n🔍 WENN LOGIN TROTZDEM FEHLSCHLÄGT:');
      console.log('   1. Check Backend-Logs auf Railway');
      console.log('   2. Prüfe ob Backend die richtige DB verwendet');
      console.log('   3. Hard Refresh im Browser (Ctrl+Shift+R)');
    } else {
      console.log('❌ ERGEBNIS: Login wird NICHT funktionieren!');
      console.log('\n🔧 NÄCHSTER SCHRITT: Passwort neu setzen');
    }

  } catch (error) {
    console.error('\n❌ FEHLER:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testLogin();

