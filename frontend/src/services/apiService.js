/**
 * API Service - Axios Client mit Interceptors
 */

import axios from 'axios';
import { showError } from './toastService';
import { withRetry } from '../utils/retryHelper';

// API Base URL - Environment-abhängig
// Development: Vite proxy (/api)
// Production: Direkte Backend-URL
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD
    ? 'https://aura-presence-backend-production.up.railway.app/api'  // Production Fallback
    : '/api';  // Development (Vite Proxy)

// Axios Instance erstellen
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Token automatisch hinzufügen
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Error Handling mit Toast-Notifications + Auto-Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    let errorMessage = 'Ein Fehler ist aufgetreten';

    if (error.response) {
      // Server hat mit Fehlercode geantwortet
      const { status, data } = error.response;
      
      // Strukturierte Error-Messages basierend auf HTTP-Status
      switch (status) {
        case 401:
          // SKIP token refresh for login/register endpoints
          const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                                  originalRequest.url?.includes('/auth/register');
          
          if (isAuthEndpoint) {
            // For login/register, use the actual error message from backend
            errorMessage = data.error || data.message || 'E-Mail oder Passwort ist falsch';
            break;
          }
          
          // Try to refresh token (if not already retried)
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              try {
                // Attempt token refresh
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { 
                  refreshToken 
                });
                
                // Update tokens
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                return apiClient(originalRequest);
              } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                
                errorMessage = 'Sitzung abgelaufen. Bitte neu einloggen.';
                
                // Redirect zu Login (nur wenn nicht bereits auf Login-Page)
                if (!window.location.pathname.includes('/login') && 
                    !window.location.pathname.includes('/register')) {
                  showError(errorMessage);
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 1000);
                }
                
                return Promise.reject(refreshError);
              }
            } else {
              // No refresh token - just logout
              errorMessage = 'Sitzung abgelaufen. Bitte neu einloggen.';
              localStorage.removeItem('token');
              
              if (!window.location.pathname.includes('/login') && 
                  !window.location.pathname.includes('/register')) {
                showError(errorMessage);
                setTimeout(() => {
                  window.location.href = '/login';
                }, 1000);
              }
            }
          }
          break;
          
        case 403:
          errorMessage = 'Zugriff verweigert. Fehlende Berechtigung.';
          break;
          
        case 404:
          errorMessage = 'Ressource nicht gefunden.';
          break;
          
        case 409:
          errorMessage = data.error || 'Konflikt bei der Verarbeitung.';
          break;
          
        case 429:
          errorMessage = 'Zu viele Anfragen. Bitte kurz warten.';
          break;
          
        case 500:
        case 502:
        case 503:
          errorMessage = 'Server-Fehler. Bitte später erneut versuchen.';
          break;
          
        default:
          errorMessage = data.error || data.message || errorMessage;
      }
      
      error.message = errorMessage;
    } else if (error.request) {
      // Request wurde gesendet aber keine Antwort erhalten
      errorMessage = 'Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.';
      error.message = errorMessage;
    } else {
      // Fehler beim Setup des Requests
      errorMessage = error.message || errorMessage;
    }
    
    // Zeige Toast-Notification (nicht bei 401, da separater Logout-Toast)
    if (!error.response || error.response.status !== 401 || 
        window.location.pathname.includes('/login') || 
        window.location.pathname.includes('/register')) {
      showError(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Analyse-Daten senden
 */
export async function sendAnalysis(features, sessionId = null, metadata = {}) {
  const response = await apiClient.post('/analyze', {
    features,
    sessionId,
    metadata
  });
  
  return response.data;
}

/**
 * Subscription-Status abrufen
 */
export async function getSubscriptionStatus() {
  const response = await apiClient.get('/subscription/status');
  return response.data;
}

/**
 * Stripe Checkout Session erstellen
 */
export async function createCheckoutSession(priceId) {
  const response = await apiClient.post('/subscription/create-checkout', {
    priceId,
    successUrl: `${window.location.origin}/dashboard?checkout=success`,
    cancelUrl: `${window.location.origin}/dashboard?checkout=canceled`
  });
  
  return response.data;
}

