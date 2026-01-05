/**
 * Test Script: Profile Update mit PATCH /auth/me
 */

import axios from 'axios';

const API_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testPatchMe() {
  try {
    console.log('🔐 1. Login...');
    
    // Login
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'jacquesdong9@gmail.com',
      password: 'Aura2024!'
    });
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    console.log('✅ Login erfolgreich!');
    
    console.log('\n📝 2. Update language via PATCH /auth/me...');
    
    // Update profile via PATCH
    const updateResponse = await axios.patch(
      `${API_URL}/api/auth/me`,
      { language: 'en' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ PATCH /auth/me erfolgreich!');
    console.log('User language:', updateResponse.data.data.user.language);
    
    console.log('\n🔄 3. Update zurück zu "de"...');
    
    const updateBackResponse = await axios.patch(
      `${API_URL}/api/auth/me`,
      { language: 'de' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Update erfolgreich!');
    console.log('Language:', updateBackResponse.data.data.user.language);
    
  } catch (error) {
    console.error('❌ Fehler:', error.response?.data || error.message);
    process.exit(1);
  }
}

testPatchMe()
  .then(() => {
    console.log('\n🎉 PATCH /auth/me FUNKTIONIERT!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test fehlgeschlagen:', error);
    process.exit(1);
  });

