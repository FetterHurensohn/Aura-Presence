/**
 * Debug: Test Production Login with detailed logging
 */

const axios = require('axios');

const BACKEND_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testLoginDetailed() {
  console.log('🔍 Detaillierter Login-Test\n');
  
  const credentials = {
    email: 'jacquesdong9@gmail.com',
    password: 'Aura2024!'
  };
  
  try {
    console.log('📤 Sende Request...');
    console.log('URL:', `${BACKEND_URL}/api/auth/login`);
    console.log('Payload:', { email: credentials.email, password: '***' });
    console.log('');
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return true; // Don't throw on any status
      }
    });
    
    console.log('📥 Response erhalten:');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('');
    
    if (response.status === 200) {
      console.log('✅ LOGIN ERFOLGREICH!');
      console.log('User:', response.data.user);
      console.log('Token:', response.data.token ? 'Vorhanden (Länge: ' + response.data.token.length + ')' : 'Fehlt!');
      console.log('RefreshToken:', response.data.refreshToken ? 'Vorhanden' : 'Fehlt');
    } else if (response.status === 401) {
      console.log('❌ 401 UNAUTHORIZED');
      console.log('Error:', response.data);
      console.log('');
      console.log('💡 Mögliche Ursachen:');
      console.log('1. Falsches Passwort');
      console.log('2. Account existiert nicht in Production DB');
      console.log('3. Backend validiert Credentials anders');
    } else {
      console.log('⚠️ Unerwarteter Status:', response.status);
      console.log('Data:', response.data);
    }
    
  } catch (error) {
    console.log('❌ REQUEST FEHLER:');
    console.log('Message:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testLoginDetailed();

