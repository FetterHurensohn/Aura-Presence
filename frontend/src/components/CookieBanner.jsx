/**
 * Cookie Banner - DSGVO-konforme Einwilligungsabfrage
 * Erscheint bei erstem Besuch oder nach Consent-Widerruf
 */

import React, { useState } from 'react';
import { acceptAll, acceptEssential, saveGranularConsent } from '../services/consentService';
import './CookieBanner.css';

function CookieBanner({ onAccept }) {
  const [showDetails, setShowDetails] = useState(false);
  const [granular, setGranular] = useState({
    analytics: false,
    camera: false,
    ai: false
  });

  const handleAcceptAll = () => {
    acceptAll();
    onAccept();
  };

  const handleAcceptEssential = () => {
    acceptEssential();
    onAccept();
  };

  const handleSaveGranular = () => {
    saveGranularConsent(granular);
    onAccept();
  };

  const handleToggle = (key) => {
    setGranular(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <h3>🍪 Diese Website verwendet Cookies</h3>
          
          {!showDetails ? (
            <>
              <p>
                Wir verwenden Cookies und ähnliche Technologien, um dir die bestmögliche Erfahrung zu bieten. 
                Einige sind essenziell für den Betrieb der Website, während andere uns helfen, die Performance 
                zu verbessern und deine Erfahrung zu personalisieren.
              </p>
              
              <div className="cookie-banner-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAcceptAll}
                  data-test="accept-all"
                >
                  Alle akzeptieren
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={handleAcceptEssential}
                >
                  Nur Essentielle
                </button>
                
                <button 
                  className="btn btn-link"
                  onClick={() => setShowDetails(true)}
                >
                  Einstellungen anpassen
                </button>
              </div>
              
              <p className="cookie-banner-note">
                Weitere Informationen findest du in unserer{' '}
                <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
                  Datenschutzerklärung
                </a>.
              </p>
            </>
          ) : (
            <>
              <p>Wähle, welche Datenverarbeitung du erlauben möchtest:</p>
              
              <div className="cookie-options">
                <div className="cookie-option">
                  <div className="cookie-option-header">
                    <input 
                      type="checkbox" 
                      checked={true} 
                      disabled 
                      id="consent-essential"
                    />
                    <label htmlFor="consent-essential">
                      <strong>Essenziell</strong>
                    </label>
                  </div>
                  <p className="cookie-option-description">
                    Erforderlich für Login, Session-Management und grundlegende Funktionen. 
                    Kann nicht deaktiviert werden.
                  </p>
                </div>
                
                <div className="cookie-option">
                  <div className="cookie-option-header">
                    <input 
                      type="checkbox" 
                      checked={granular.analytics}
                      onChange={() => handleToggle('analytics')}
                      id="consent-analytics"
                    />
                    <label htmlFor="consent-analytics">
                      <strong>Analytics</strong>
                    </label>
                  </div>
                  <p className="cookie-option-description">
                    Ermöglicht anonymisierte Nutzungsstatistiken und Error-Tracking (Sentry) 
                    zur Verbesserung der App.
                  </p>
                </div>
                
                <div className="cookie-option">
                  <div className="cookie-option-header">
                    <input 
                      type="checkbox" 
                      checked={granular.camera}
                      onChange={() => handleToggle('camera')}
                      id="consent-camera"
                    />
                    <label htmlFor="consent-camera">
                      <strong>Kamera-Zugriff</strong>
                    </label>
                  </div>
                  <p className="cookie-option-description">
                    Erforderlich für die Video-Analyse mit MediaPipe. 
                    <strong> Keine Videos werden übertragen oder gespeichert</strong> – 
                    nur strukturierte Metriken.
                  </p>
                </div>
                
                <div className="cookie-option">
                  <div className="cookie-option-header">
                    <input 
                      type="checkbox" 
                      checked={granular.ai}
                      onChange={() => handleToggle('ai')}
                      id="consent-ai"
                    />
                    <label htmlFor="consent-ai">
                      <strong>KI-Interpretation</strong>
                    </label>
                  </div>
                  <p className="cookie-option-description">
                    Sendet strukturierte Verhaltensmetriken an OpenAI zur Generierung 
                    von personalisiertem Feedback. Ohne diese Option: Basis-Feedback nur.
                  </p>
                </div>
              </div>
              
              <div className="cookie-banner-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveGranular}
                >
                  Auswahl speichern
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Zurück
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;

