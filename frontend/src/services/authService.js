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
 */
export async function updateProfile(profileData) {
  const response = await apiClient.put('/auth/profile', profileData);
  
  // Backend wrapped die Response in "data"
  return response.data.data?.user || response.data.user;
}





