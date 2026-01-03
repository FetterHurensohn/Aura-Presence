/**
 * Test Script: Register Production Account
 * Erstellt einen neuen Account direkt in der Production Datenbank
 */

const axios = require('axios');

const BACKEND_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testRegister() {
  console.log('🚀 Teste Production Registrierung...\n');
  
  const testAccount = {
    email: 'jacquesdong9@gmail.com',
    password: 'Aura2024!'
  };
  
  try {
    console.log(`📧 Registriere: ${testAccount.email}`);
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, testAccount);
    
    console.log('\n✅ REGISTRIERUNG ERFOLGREICH!');
    console.log('User ID:', response.data.user.id);
    console.log('Email:', response.data.user.email);
    console.log('Token erhalten:', !!response.data.token);
    
    return true;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('\n⚠️ Account existiert bereits!');
      console.log('Versuche Login mit gleichem Passwort...\n');
      
      try {
        const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, testAccount);
        console.log('✅ LOGIN ERFOLGREICH!');
        console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
        return true;
      } catch (loginError) {
        console.log('❌ LOGIN FEHLGESCHLAGEN!');
        console.log('Status:', loginError.response?.status);
        console.log('Error:', loginError.response?.data?.error);
        console.log('\n💡 Das bedeutet: Account existiert, aber mit ANDEREM Passwort!');
        return false;
      }
    } else {
      console.log('\n❌ REGISTRIERUNG FEHLGESCHLAGEN!');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data?.error || error.message);
      return false;
    }
  }
}

testRegister().then(success => {
  if (success) {
    console.log('\n🎉 ALLES FUNKTIONIERT!');
  } else {
    console.log('\n⚠️ PROBLEM GEFUNDEN - Account muss zurückgesetzt werden');
  }
  process.exit(success ? 0 : 1);
});

