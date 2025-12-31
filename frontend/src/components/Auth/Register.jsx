/**
 * Register Component
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { showSuccess, showError } from '../../services/toastService';

function Register({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Passwort-Validierung (clientseitig)
    if (password !== confirmPassword) {
      showError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 8) {
      showError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    // Passwort-Komplexität-Prüfung
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      showError('Passwort muss Groß-, Kleinbuchstaben und Zahl enthalten');
      return;
    }

    setLoading(true);

    try {
      const user = await register(email, password);
      onLogin(user);
      showSuccess('Registrierung erfolgreich! Willkommen bei Aura Presence.');
      navigate('/dashboard');
    } catch (err) {
      // Error-Toast wird automatisch von apiService angezeigt
      console.error('Registrierungs-Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h1 className="auth-title">Aura Presence</h1>
        <h2>Registrieren</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 Zeichen, Groß-, Kleinbuchstaben und Zahl"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registriere...' : 'Registrieren'}
          </button>
        </form>

        <div className="auth-toggle">
          Bereits ein Konto? <Link to="/login">Jetzt anmelden</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

