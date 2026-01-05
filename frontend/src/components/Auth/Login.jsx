/**
 * Login Component - EXAKT 1:1 vom Mockup
 */

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { showSuccess } from '../../services/toastService';
import './Auth.css';

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Use refs for form values
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get values directly from inputs
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    
    // DEBUG: Console log für Debugging
    console.log('Form submitted with:', { email, password: password ? '***' : 'empty' });
    
    if (!email || !password) {
      console.error('Validation failed:', { email: !!email, password: !!password });
      setError('Bitte alle Felder ausfüllen');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      console.log('✅ Login erfolgreich, User:', user);
      onLogin(user);
      showSuccess('Erfolgreich angemeldet! Willkommen zurück.');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login-Fehler:', err);
      console.error('Error response:', err.response?.data);
      
      // Show backend error message if available
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || 'E-Mail oder Passwort ist falsch';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo - Echtes Aura Presence Logo */}
        <div className="auth-logo">
          <svg width="96" height="96" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.8 23.7189L28.3329 20.276C30.3132 15.8283 34.2108 12.5242 38.9228 11.2989L42.9138 10.261" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M22.1828 30.8891L20.4467 27.5441C18.2039 23.2228 18.0507 18.1154 20.0304 13.6675L21.7073 9.90001" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M40.2427 37.4L40.3558 41.167C40.5019 46.0335 38.4243 50.7017 34.711 53.8505L31.5658 56.5175" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M32.9568 41.8534L30.0821 44.2904C26.3683 47.4387 21.4232 48.7249 16.6462 47.7848L12.6 46.9885" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M24.8933 39.0143L21.1956 38.2861C16.4187 37.3454 12.33 34.2809 10.0867 29.9599L8.18655 26.3" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M41.5456 29L44.5613 31.2602C48.4572 34.1801 50.8117 38.7149 50.9584 43.5814L51.0827 47.7033" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <path d="M35.3 22.6447L38.9474 21.6961C43.6592 20.4705 48.6728 21.457 52.569 24.3764L55.8692 26.8491" stroke="black" strokeWidth="4" strokeLinecap="round"/>
            <rect x="27" y="27" width="10" height="10" rx="5" fill="black"/>
          </svg>
        </div>
        
        {/* Brand Name */}
        <h1 className="auth-brand">Aura Presence</h1>

        {/* Title mit Gradient-Linie */}
        <h2 className="auth-title">Anmelden</h2>

        {/* Error Message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">E-Mail-Adresse</label>
            <input
              ref={emailRef}
              type="email"
              className="auth-input"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Passwort</label>
            <input
              ref={passwordRef}
              type="password"
              className="auth-input"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Oder</span>
        </div>

        {/* Social Buttons (Placeholder) */}
        <button className="auth-button social" disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Mit Google verifizieren
        </button>

        <button className="auth-button social" disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Mit Apple verifizieren
        </button>

        {/* Register Link */}
        <div className="auth-footer">
          <span className="auth-footer-text">Noch nicht angemeldet?</span>
          {' '}
          <Link to="/register" className="auth-footer-link">
            Registrieren
          </Link>
        </div>

        {/* Privacy Notice mit Link */}
        <div className="auth-privacy">
          <strong>
            <Link to="/datenschutz" className="auth-privacy-link">
              Datenschutzerklärung
            </Link>
          </strong>
          <p>Video wird nicht gespeichert. Die Analyse erfolgt lokal; es werden nur aggregierte Metadaten verarbeitet.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
