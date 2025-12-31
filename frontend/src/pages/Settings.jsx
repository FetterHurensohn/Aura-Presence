/**
 * Settings Page - User-Einstellungen inkl. Consent-Management
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getConsent, saveGranularConsent, revokeConsent } from '../services/consentService';
import { exportUserData, deleteAccount } from '../services/gdprService';
import { showSuccess, showInfo, showError } from '../services/toastService';
import './Settings.css';

function Settings({ user, onLogout }) {
  const navigate = useNavigate();
  
  const [consent, setConsent] = useState({
    analytics: false,
    camera: false,
    ai: false
  });
  
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Lade aktuellen Consent-Status
    const currentConsent = getConsent();
    setConsent({
      analytics: currentConsent.analytics,
      camera: currentConsent.camera,
      ai: currentConsent.ai
    });
  }, []);

  const handleToggle = (key) => {
    setConsent(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    saveGranularConsent(consent);
    showSuccess('Einstellungen gespeichert');
  };

  const handleRevokeConsent = () => {
    revokeConsent();
    showInfo('Alle Einwilligungen wurden widerrufen. Cookie-Banner wird beim nächsten Laden angezeigt.');
    setShowConfirmRevoke(false);
    
    // Seite neu laden um Banner anzuzeigen
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportUserData();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      showError('Bitte gib dein Passwort ein');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      
      // Nach erfolgreicher Löschung: Logout und Redirect
      setTimeout(() => {
        onLogout();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <Link to="/dashboard" className="back-link">← Zurück</Link>
          <h1>Einstellungen</h1>
        </div>

        {/* User Info */}
        <section className="settings-section">
          <h2>Account</h2>
          <div className="user-info">
            <p><strong>E-Mail:</strong> {user?.email}</p>
            <p><strong>Subscription:</strong> {user?.subscription_status || 'Keine'}</p>
          </div>
        </section>

        {/* Consent Management */}
        <section className="settings-section">
          <h2>Datenschutz & Einwilligungen</h2>
          
          <div className="consent-options">
            <div className="consent-option">
              <div className="consent-header">
                <input 
                  type="checkbox" 
                  checked={true} 
                  disabled 
                  id="setting-essential"
                />
                <label htmlFor="setting-essential">
                  <strong>Essentielle Cookies</strong>
                </label>
              </div>
              <p>Erforderlich für Login und grundlegende Funktionen. Kann nicht deaktiviert werden.</p>
            </div>

            <div className="consent-option">
              <div className="consent-header">
                <input 
                  type="checkbox" 
                  checked={consent.analytics}
                  onChange={() => handleToggle('analytics')}
                  id="setting-analytics"
                />
                <label htmlFor="setting-analytics">
                  <strong>Analytics</strong>
                </label>
              </div>
              <p>Anonymisierte Nutzungsstatistiken und Error-Tracking (Sentry).</p>
            </div>

            <div className="consent-option">
              <div className="consent-header">
                <input 
                  type="checkbox" 
                  checked={consent.camera}
                  onChange={() => handleToggle('camera')}
                  id="setting-camera"
                />
                <label htmlFor="setting-camera">
                  <strong>Kamera-Zugriff</strong>
                </label>
              </div>
              <p>
                Erforderlich für Video-Analyse. 
                <strong> Keine Videos werden übertragen</strong> – nur strukturierte Metriken.
              </p>
            </div>

            <div className="consent-option">
              <div className="consent-header">
                <input 
                  type="checkbox" 
                  checked={consent.ai}
                  onChange={() => handleToggle('ai')}
                  id="setting-ai"
                />
                <label htmlFor="setting-ai">
                  <strong>KI-Interpretation (OpenAI)</strong>
                </label>
              </div>
              <p>Sendet strukturierte Metriken an OpenAI für personalisiertes Feedback.</p>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Einstellungen speichern
            </button>
            
            <button 
              className="btn btn-danger" 
              onClick={() => setShowConfirmRevoke(true)}
            >
              Alle Einwilligungen widerrufen
            </button>
          </div>
          
          {showConfirmRevoke && (
            <div className="confirm-dialog">
              <p>
                <strong>Möchtest du wirklich alle Einwilligungen widerrufen?</strong><br />
                Der Cookie-Banner wird beim nächsten Laden angezeigt.
              </p>
              <div className="confirm-actions">
                <button className="btn btn-danger" onClick={handleRevokeConsent}>
                  Ja, widerrufen
                </button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmRevoke(false)}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </section>

        {/* GDPR - Data Export & Account Deletion */}
        <section className="settings-section">
          <h2>Deine Daten (DSGVO)</h2>
          
          <div className="gdpr-section">
            <div className="gdpr-option">
              <h3>📥 Daten exportieren</h3>
              <p>
                Lade alle deine gespeicherten Daten als JSON-Datei herunter.
                Enthält: Profildaten, Analyse-Sessions und Subscription-Info.
              </p>
              <button 
                className="btn btn-primary" 
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? 'Exportiere...' : 'Daten herunterladen'}
              </button>
            </div>

            <div className="gdpr-option danger-zone">
              <h3>🗑️ Account löschen</h3>
              <p>
                <strong>Vorsicht:</strong> Dein Account wird zur Löschung markiert und nach 30 Tagen 
                permanent gelöscht. Du kannst die Löschung innerhalb dieser Zeit abbrechen.
              </p>
              <button 
                className="btn btn-danger" 
                onClick={() => setShowConfirmDelete(true)}
              >
                Account löschen
              </button>
            </div>

            {showConfirmDelete && (
              <div className="confirm-dialog danger">
                <h4>⚠️ Account wirklich löschen?</h4>
                <p>
                  Diese Aktion kann nicht rückgängig gemacht werden. 
                  Gib dein Passwort ein um fortzufahren:
                </p>
                <input 
                  type="password"
                  placeholder="Dein Passwort"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="form-input"
                  disabled={isDeleting}
                />
                <div className="confirm-actions">
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Lösche...' : 'Ja, Account löschen'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowConfirmDelete(false);
                      setDeletePassword('');
                    }}
                    disabled={isDeleting}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Logout */}
        <section className="settings-section">
          <h2>Abmelden</h2>
          <button className="btn btn-secondary" onClick={onLogout}>
            Abmelden
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;

