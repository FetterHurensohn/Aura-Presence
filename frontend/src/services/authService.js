/**
 * Auth Service - Authentifizierungs-API-Calls
 */

import apiClient from './apiService';

/**
 * Benutzer registrieren
 */
export async function register(email, password) {
  const response = await apiClient.post('/auth/register', {
    email,
    password
  });
  
  const { token, user } = response.data;
  
  // Token speichern
  localStorage.setItem('token', token);
  
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
  
  const { token, user } = response.data;
  
  // Token speichern
  localStorage.setItem('token', token);
  
  return user;
}

/**
 * Abmelden
 */
export function logout() {
  localStorage.removeItem('token');
}

/**
 * Aktuellen Benutzer abrufen
 */
export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me');
  return response.data.user;
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





