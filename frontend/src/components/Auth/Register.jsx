/**
 * Register Component
 * Redesigned mit Design-System Components
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { showSuccess, showError } from '../../services/toastService';
import Card from '../../design-system/components/Card';
import Input from '../../design-system/components/Input';
import Button from '../../design-system/components/Button';
import Checkbox from '../../design-system/components/Checkbox';

function Register({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email Validation
    if (!email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    
    // Password Validation
    if (!password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Passwort muss Groß-, Kleinbuchstaben und Zahl enthalten';
      }
    }
    
    // Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Passwort-Bestätigung ist erforderlich';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }
    
    // AGB Validation
    if (!agbAccepted) {
      newErrors.agb = 'Bitte akzeptiere die AGB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-900 via-bg-900 to-surface-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-accent-500 text-4xl">✨</span>
            <h1 className="text-h1 font-bold text-white">Aura Presence</h1>
          </div>
          <p className="text-muted-500 text-sm">
            Registriere dich für Echtzeit-Video-Analyse
          </p>
        </div>

        {/* Register Card */}
        <Card>
          <h2 className="text-h2 text-white mb-6 text-center">Registrieren</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              icon="user"
              error={errors.email}
              disabled={loading}
            />

            <Input
              type="password"
              label="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 Zeichen"
              icon="lock"
              helperText="Muss Groß-, Kleinbuchstaben und Zahl enthalten"
              error={errors.password}
              disabled={loading}
            />

            <Input
              type="password"
              label="Passwort bestätigen"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              icon="lock"
              error={errors.confirmPassword}
              disabled={loading}
            />

            <div>
              <Checkbox
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
                label={
                  <span className="text-sm">
                    Ich akzeptiere die{' '}
                    <Link to="/agb" className="text-accent-500 hover:text-accent-400 transition-colors duration-base">
                      AGB
                    </Link>
                    {' '}und{' '}
                    <Link to="/datenschutz" className="text-accent-500 hover:text-accent-400 transition-colors duration-base">
                      Datenschutzerklärung
                    </Link>
                  </span>
                }
                disabled={loading}
              />
              {errors.agb && (
                <p className="mt-1 text-sm text-danger">{errors.agb}</p>
              )}
            </div>

            <Button 
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Registrieren
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-500">
              Bereits ein Konto?{' '}
              <Link 
                to="/login" 
                className="text-accent-500 hover:text-accent-400 font-medium transition-colors duration-base"
              >
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;

