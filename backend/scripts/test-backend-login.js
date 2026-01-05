/**
 * Direkter Backend Login Test
 * Simuliert einen echten HTTP Request zum Login-Endpoint
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TEST_EMAIL = 'jacquesdong9@gmail.com';
const TEST_PASSWORD = 'Aura2024!';

// Teste gegen Production Backend
const BACKEND_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testBackendLogin() {
  console.log('🧪 Backend Login Test (Production)\n');
  console.log(`🌐 Backend: ${BACKEND_URL}`);
  console.log(`📧 Email: ${TEST_EMAIL}`);
  console.log(`🔑 Password: ${TEST_PASSWORD}\n`);

  try {
    console.log('📡 Sende Login Request...\n');
    
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/login`,
      {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ LOGIN ERFOLGREICH!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESPONSE DATA:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`User ID: ${response.data.data?.user?.id}`);
    console.log(`User Email: ${response.data.data?.user?.email}`);
    console.log(`Token: ${response.data.data?.token ? response.data.data.token.substring(0, 20) + '...' : 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Backend funktioniert korrekt!');
    console.log('\n🔍 WENN FRONTEND LOGIN FEHLSCHLÄGT:');
    console.log('   → Problem liegt im Frontend (React/Axios)');
    console.log('   → Check Browser Console für CORS/Network Errors');

  } catch (error) {
    console.log('❌ LOGIN FEHLGESCHLAGEN!\n');
    
    if (error.response) {
      // Server hat mit Fehlercode geantwortet
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 ERROR RESPONSE:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data?.error || 'Unknown'}`);
      console.log(`Message: ${error.response.data?.message || 'Unknown'}`);
      console.log(`Code: ${error.response.data?.code || 'Unknown'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      if (error.response.status === 401) {
        console.log('🔍 DIAGNOSE: Ungültige Credentials');
        console.log('   → Email oder Passwort ist falsch');
        console.log('   → ODER Backend verwendet falsche DB');
        console.log('   → ODER verifyPassword() hat einen Bug');
      }
    } else if (error.request) {
      // Request wurde gesendet aber keine Response erhalten
      console.log('❌ Keine Antwort vom Server erhalten');
      console.log('   → Backend ist offline ODER');
      console.log('   → Network/Firewall Problem');
    } else {
      // Fehler beim Setup des Requests
      console.log('❌ Fehler beim Request-Setup:');
      console.log(error.message);
    }
    
    console.error('\nFull Error:', error);
  }
}

testBackendLogin();

