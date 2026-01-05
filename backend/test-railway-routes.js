/**
 * Test script to check Railway deployment routes
 */

const BASE_URL = 'https://aura-presence-backend-production.up.railway.app';

async function testRoutes() {
  console.log('🔍 Testing Railway Backend Routes...\n');
  
  const routes = [
    { method: 'GET', path: '/health', expectStatus: 200, needsAuth: false },
    { method: 'POST', path: '/api/auth/login', expectStatus: 400, needsAuth: false }, // 400 = validation error (no body)
    { method: 'POST', path: '/api/auth/register', expectStatus: 400, needsAuth: false },
    { method: 'GET', path: '/api/auth/me', expectStatus: 401, needsAuth: true }, // 401 = no token
    { method: 'PUT', path: '/api/auth/profile', expectStatus: 401, needsAuth: true },
    { method: 'PATCH', path: '/api/auth/me', expectStatus: 401, needsAuth: true },
    { method: 'POST', path: '/api/auth/update-language', expectStatus: 401, needsAuth: true },
  ];
  
  for (const route of routes) {
    try {
      const url = `${BASE_URL}${route.path}`;
      const response = await fetch(url, {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const status = response.status;
      const statusIcon = status === route.expectStatus ? '✅' : '❌';
      
      console.log(`${statusIcon} ${route.method} ${route.path}`);
      console.log(`   Expected: ${route.expectStatus}, Got: ${status}`);
      
      if (status === 404) {
        console.log('   ⚠️  Route not found!');
      }
      
    } catch (error) {
      console.log(`❌ ${route.method} ${route.path}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
}

testRoutes().catch(console.error);

