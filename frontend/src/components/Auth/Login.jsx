/**
 * Login Component - EXAKT 1:1 vom Mockup
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { showSuccess } from '../../services/toastService';
import './Auth.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      onLogin(user);
      showSuccess('Erfolgreich angemeldet! Willkommen zurück.');
      navigate('/dashboard');
    } catch (err) {
      setError('E-Mail oder Passwort ist falsch');
      console.error('Login-Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo - EXAKT wie im Mockup */}
        <div className="auth-logo">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 3.25C6.27208 3.25 3.25 6.27208 3.25 10C3.25 13.7279 6.27208 16.75 10 16.75C13.7279 16.75 16.75 13.7279 16.75 10C16.75 6.27208 13.7279 3.25 10 3.25ZM1.75 10C1.75 5.44365 5.44365 1.75 10 1.75C14.5563 1.75 18.25 5.44365 18.25 10C18.25 14.5563 14.5563 18.25 10 18.25C5.44365 18.25 1.75 14.5563 1.75 10Z" fill="#000000"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.0049 5.25012C10.3623 5.2513 10.6733 5.48426 10.7684 5.82534L11.7719 9.31066L15.2572 10.3142C15.5983 10.4093 15.8313 10.7203 15.8324 11.0777C15.8336 11.4351 15.6024 11.7474 15.2622 11.8444L11.777 12.8479L10.7734 16.3332C10.6783 16.6743 10.3673 16.9073 10.0099 16.9084C9.65254 16.9096 9.34022 16.6766 9.24312 16.3355L8.23961 12.8502L4.75429 11.8467C4.41321 11.7516 4.18025 11.4406 4.17907 11.0832C4.17789 10.7258 4.40906 10.4135 4.74935 10.3165L8.23467 9.31296L9.23818 5.82764C9.33329 5.48656 9.64445 5.25293 10.0018 5.25175L10.0049 5.25012ZM9.76416 7.48346L9.14233 9.67743C9.05847 9.97844 8.82841 10.2085 8.5274 10.2923L6.33343 10.9142L8.5274 11.536C8.82841 11.6199 9.05847 11.8499 9.14233 12.1509L9.76416 14.3449L10.386 12.1509C10.4698 11.8499 10.6999 11.6199 11.0009 11.536L13.1949 10.9142L11.0009 10.2923C10.6999 10.2085 10.4698 9.97844 10.386 9.67743L9.76416 7.48346Z" fill="#000000"/>
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
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Passwort</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
