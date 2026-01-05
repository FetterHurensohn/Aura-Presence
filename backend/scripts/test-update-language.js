/**
 * Test Script: POST /auth/update-language
 */

import axios from 'axios';

const API_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testUpdateLanguage() {
  try {
    console.log('🔐 1. Login...');
    
    // Login
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'jacquesdong9@gmail.com',
      password: 'Aura2024!'
    });
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    console.log('✅ Login erfolgreich!');
    console.log('Current language:', loginResponse.data.user.language);
    
    console.log('\n🌐 2. Update language via POST /auth/update-language...');
    
    // Update language
    const updateResponse = await axios.post(
      `${API_URL}/api/auth/update-language`,
      { language: 'en' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Language update erfolgreich!');
    console.log('New language:', updateResponse.data.data.user.language);
    
    console.log('\n🔄 3. Update zurück zu "de"...');
    
    const updateBackResponse = await axios.post(
      `${API_URL}/api/auth/update-language`,
      { language: 'de' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Back to deutsch!');
    console.log('Language:', updateBackResponse.data.data.user.language);
    
  } catch (error) {
    console.error('❌ Fehler:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    process.exit(1);
  }
}

testUpdateLanguage()
  .then(() => {
    console.log('\n🎉 POST /auth/update-language FUNKTIONIERT!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test fehlgeschlagen:', error);
    process.exit(1);
  });

