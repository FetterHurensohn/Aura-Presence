/**
 * Test Script: Profile Update mit language
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testProfileUpdate() {
  try {
    console.log('🔐 1. Login...');
    
    // Login
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'jacquesdong9@gmail.com',
      password: 'Aura2024!'
    });
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    console.log('✅ Login erfolgreich! Token:', token.substring(0, 20) + '...');
    console.log('Full response:', JSON.stringify(loginResponse.data, null, 2));
    
    console.log('\n📝 2. Update language zu "en"...');
    
    // Update profile
    const updateResponse = await axios.put(
      `${API_URL}/api/auth/profile`,
      { language: 'en' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ Update erfolgreich!');
    console.log('User:', updateResponse.data.data.user);
    
    console.log('\n🔍 3. Prüfe GET /auth/me...');
    
    // Get current user
    const meResponse = await axios.get(
      `${API_URL}/api/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ User abgerufen!');
    console.log('Language:', meResponse.data.data.user.language);
    
    console.log('\n🔄 4. Update zurück zu "de"...');
    
    // Update back
    const updateBackResponse = await axios.put(
      `${API_URL}/api/auth/profile`,
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

testProfileUpdate()
  .then(() => {
    console.log('\n🎉 ALLE TESTS ERFOLGREICH!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test fehlgeschlagen:', error);
    process.exit(1);
  });

