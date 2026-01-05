/**
 * Auth Service - Authentifizierungs-API-Calls
 */

import apiClient from './apiService';

/**
 * Benutzer registrieren
 */
export async function register(email, password, name, company, country) {
  const response = await apiClient.post('/auth/register', {
    email,
    password,
    name,
    company,
    country
  });
  
  // Backend wrapped die Response in "data"
  const { token, refreshToken, user } = response.data.data || response.data;
  
  // Token speichern
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  return user;
}

/**
 * Benutzer anmelden
 */
export async function login(email, password) {
  const response = await apiClient.post('/auth/login', {
    email,
    password
  });
  
  // Backend wrapped die Response in "data"
  const { token, refreshToken, user } = response.data.data || response.data;
  
  // Token speichern
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  return user;
}

/**
 * Abmelden
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

/**
 * Aktuellen Benutzer abrufen
 */
export async function getCurrentUser() {
  // Prüfe zuerst ob Token existiert
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await apiClient.get('/auth/me');
  // Backend wrapped die Response in "data"
  return response.data.data?.user || response.data.user;
}

/**
 * Prüfe ob User eingeloggt ist
 */
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

/**
 * Hole gespeicherten Token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Profil aktualisieren
 * Verwendet mehrere Fallback-Routen für maximale Kompatibilität
 */
export async function updateProfile(profileData) {
  // Spezial-Handling für language (temporärer Workaround)
  if (Object.keys(profileData).length === 1 && profileData.language) {
    try {
      console.log('🌐 Using /auth/update-language for language change');
      const response = await apiClient.post('/auth/update-language', profileData);
      return response.data.data?.user || response.data.user;
    } catch (error) {
      console.error('❌ /auth/update-language failed:', error.response?.data);
    }
  }
  
  // Versuche PUT /auth/profile
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data.data?.user || response.data.user;
  } catch (error) {
    // Fallback zu PATCH /auth/me
    if (error.response?.status === 404) {
      console.log('⚠️ PUT /auth/profile nicht gefunden, versuche PATCH /auth/me');
      const response = await apiClient.patch('/auth/me', profileData);
      return response.data.data?.user || response.data.user;
    }
    throw error;
  }
}





