/**
 * Login Component
 * Redesigned mit Design-System Components
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { showSuccess } from '../../services/toastService';
import Card from '../../design-system/components/Card';
import Input from '../../design-system/components/Input';
import Button from '../../design-system/components/Button';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }
    
    if (!password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
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
      const user = await login(email, password);
      onLogin(user);
      showSuccess('Erfolgreich angemeldet! Willkommen zurück.');
      navigate('/dashboard');
    } catch (err) {
      // Error-Toast wird automatisch von apiService angezeigt
      console.error('Login-Fehler:', err);
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
            Echtzeit-Video-Analyse für bessere Präsenz
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <h2 className="text-h2 text-white mb-6 text-center">Anmelden</h2>

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
              placeholder="••••••••"
              icon="lock"
              error={errors.password}
              disabled={loading}
            />

            <Button 
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Anmelden
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-500">
              Noch kein Konto?{' '}
              <Link 
                to="/register" 
                className="text-accent-500 hover:text-accent-400 font-medium transition-colors duration-base"
              >
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;

