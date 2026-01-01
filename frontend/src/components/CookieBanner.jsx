/**
 * Cookie Banner - DSGVO-konforme Einwilligungsabfrage
 * Redesigned mit Design-System Modal
 */

import React, { useState } from 'react';
import { acceptAll, acceptEssential, saveGranularConsent } from '../services/consentService';
import Modal from '../design-system/components/Modal';
import Button from '../design-system/components/Button';
import Checkbox from '../design-system/components/Checkbox';
import Icon from '../design-system/components/Icon';

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
    <Modal
      open={true}
      onClose={() => {}} // Kann nicht geschlossen werden, nur über Buttons
      title={showDetails ? "Cookie-Einstellungen" : "🍪 Cookie-Einwilligung"}
      size="md"
    >
      {!showDetails ? (
        <>
          <div className="space-y-4">
            <p className="text-white leading-relaxed">
              Wir verwenden Cookies und ähnliche Technologien, um dir die bestmögliche Erfahrung zu bieten. 
              Einige sind essenziell für den Betrieb der Website, während andere uns helfen, die Performance 
              zu verbessern und deine Erfahrung zu personalisieren.
            </p>

            <div className="bg-surface-700 rounded-button p-4 flex items-start gap-3">
              <Icon name="info" size={24} color="cyan" className="mt-0.5" />
              <p className="text-sm text-muted-500 leading-relaxed">
                Weitere Informationen findest du in unserer{' '}
                <a 
                  href="/datenschutz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-500 hover:text-accent-400 transition-colors duration-base"
                >
                  Datenschutzerklärung
                </a>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button 
              variant="primary"
              size="lg"
              fullWidth
              icon="check"
              onClick={handleAcceptAll}
              data-test="accept-all"
            >
              Alle akzeptieren
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary"
                size="md"
                onClick={handleAcceptEssential}
              >
                Nur Essentielle
              </Button>
              
              <Button 
                variant="ghost"
                size="md"
                icon="settings"
                onClick={() => setShowDetails(true)}
              >
                Anpassen
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-white mb-4">
            Wähle, welche Datenverarbeitung du erlauben möchtest:
          </p>

          <div className="space-y-4">
            {/* Essential */}
            <div className="bg-surface-700 rounded-button p-4">
              <Checkbox
                checked={true}
                disabled
                label={<span className="font-semibold">Essenziell</span>}
              />
              <p className="text-sm text-muted-500 mt-2 ml-7 leading-relaxed">
                Erforderlich für Login, Session-Management und grundlegende Funktionen. 
                Kann nicht deaktiviert werden.
              </p>
            </div>

            {/* Analytics */}
            <div className="bg-surface-700 rounded-button p-4">
              <Checkbox
                checked={granular.analytics}
                onChange={() => handleToggle('analytics')}
                label={<span className="font-semibold">Analytics</span>}
              />
              <p className="text-sm text-muted-500 mt-2 ml-7 leading-relaxed">
                Ermöglicht anonymisierte Nutzungsstatistiken und Error-Tracking (Sentry) 
                zur Verbesserung der App.
              </p>
            </div>

            {/* Camera */}
            <div className="bg-surface-700 rounded-button p-4">
              <Checkbox
                checked={granular.camera}
                onChange={() => handleToggle('camera')}
                label={<span className="font-semibold">Kamera-Zugriff</span>}
              />
              <p className="text-sm text-muted-500 mt-2 ml-7 leading-relaxed">
                Erforderlich für die Video-Analyse mit MediaPipe.{' '}
                <span className="text-success font-medium">
                  Keine Videos werden übertragen oder gespeichert
                </span>{' '}
                – nur strukturierte Metriken.
              </p>
            </div>

            {/* AI */}
            <div className="bg-surface-700 rounded-button p-4">
              <Checkbox
                checked={granular.ai}
                onChange={() => handleToggle('ai')}
                label={<span className="font-semibold">KI-Interpretation</span>}
              />
              <p className="text-sm text-muted-500 mt-2 ml-7 leading-relaxed">
                Sendet strukturierte Verhaltensmetriken an OpenAI zur Generierung 
                von personalisiertem Feedback. Ohne diese Option: Basis-Feedback nur.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="primary"
              size="lg"
              fullWidth
              icon="check"
              onClick={handleSaveGranular}
            >
              Auswahl speichern
            </Button>
            
            <Button 
              variant="secondary"
              size="lg"
              icon="chevron-left"
              onClick={() => setShowDetails(false)}
            >
              Zurück
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default CookieBanner;

