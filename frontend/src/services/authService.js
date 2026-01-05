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
 * CLIENT-SIDE FALLBACK für language, da Backend noch nicht deployed
 */
export async function updateProfile(profileData) {
  // WORKAROUND: Sprache client-side speichern bis Backend deployed ist
  if (Object.keys(profileData).length === 1 && profileData.language) {
    console.log('💾 Speichere Sprache client-side (Backend noch nicht deployed)');
    localStorage.setItem('userLanguage', profileData.language);
    
    // Versuche trotzdem, an Backend zu senden (für künftige Syncs)
    try {
      const response = await apiClient.post('/auth/update-language', profileData);
      console.log('✅ Backend Sync erfolgreich!');
      return response.data.data?.user || response.data.user;
    } catch (error) {
      console.log('⚠️ Backend noch nicht deployed, nur local gespeichert');
      // Return user mit updated language (lokal)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.language = profileData.language;
      localStorage.setItem('user', JSON.stringify(currentUser));
      return currentUser;
    }
  }
  
  // Für andere Felder: Normale API Calls
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data.data?.user || response.data.user;
  } catch (error) {
    if (error.response?.status === 404) {
      const response = await apiClient.patch('/auth/me', profileData);
      return response.data.data?.user || response.data.user;
    }
    throw error;
  }
}

/**
 * Get language from localStorage
 */
export function getLocalLanguage() {
  return localStorage.getItem('userLanguage') || 'de';
}

/**
 * Set language in localStorage
 */
export function setLocalLanguage(language) {
  localStorage.setItem('userLanguage', language);
}

