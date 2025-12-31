/**
 * Consent Service - DSGVO-konforme Einwilligungsverwaltung
 * 
 * Verwaltet User-Consent für:
 * - Essentiell: Immer aktiv (Auth, Session)
 * - Analytics: Opt-in (Sentry, Performance-Tracking)
 * - Camera: Opt-in (MediaPipe-Analyse)
 * - AI: Opt-in (OpenAI-Integration)
 */

const CONSENT_STORAGE_KEY = 'aura_presence_consent';
const CONSENT_VERSION = '1.0'; // Bei Änderungen erhöhen → erneute Einwilligung

/**
 * Standard-Consent-State
 */
const DEFAULT_CONSENT = {
  version: CONSENT_VERSION,
  timestamp: null,
  essential: true, // Immer aktiv
  analytics: false,
  camera: false,
  ai: false
};

/**
 * Consent-State aus localStorage laden
 */
export function getConsent() {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CONSENT;
    }
    
    const consent = JSON.parse(stored);
    
    // Version-Check: Bei Version-Mismatch → erneute Einwilligung erforderlich
    if (consent.version !== CONSENT_VERSION) {
      console.log('Consent version outdated, requiring re-consent');
      return DEFAULT_CONSENT;
    }
    
    return { ...DEFAULT_CONSENT, ...consent };
  } catch (error) {
    console.error('Error loading consent:', error);
    return DEFAULT_CONSENT;
  }
}

/**
 * Consent-State speichern
 */
export function saveConsent(consent) {
  try {
    const consentToSave = {
      ...consent,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentToSave));
    
    // Event dispatchen für Komponenten-Updates
    window.dispatchEvent(new CustomEvent('consentChanged', { detail: consentToSave }));
    
    return true;
  } catch (error) {
    console.error('Error saving consent:', error);
    return false;
  }
}

/**
 * Alle Einwilligungen akzeptieren
 */
export function acceptAll() {
  return saveConsent({
    essential: true,
    analytics: true,
    camera: true,
    ai: true
  });
}

/**
 * Nur essentielle Cookies akzeptieren
 */
export function acceptEssential() {
  return saveConsent({
    essential: true,
    analytics: false,
    camera: false,
    ai: false
  });
}

/**
 * Granulare Einwilligung speichern
 */
export function saveGranularConsent({ analytics, camera, ai }) {
  return saveConsent({
    essential: true, // Immer true
    analytics: !!analytics,
    camera: !!camera,
    ai: !!ai
  });
}

/**
 * Alle Einwilligungen widerrufen
 */
export function revokeConsent() {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  
  // Event dispatchen
  window.dispatchEvent(new CustomEvent('consentChanged', { detail: DEFAULT_CONSENT }));
  
  return true;
}

/**
 * Prüfen ob Consent bereits gegeben wurde (Banner-Anzeige)
 */
export function hasGivenConsent() {
  const consent = getConsent();
  return consent.timestamp !== null;
}

/**
 * Prüfen ob spezifischer Consent gegeben wurde
 */
export function hasConsent(type) {
  const consent = getConsent();
  return consent[type] === true;
}

/**
 * Consent-Status für Debugging
 */
export function getConsentStatus() {
  const consent = getConsent();
  return {
    hasGivenConsent: hasGivenConsent(),
    consent,
    age: consent.timestamp ? Date.now() - consent.timestamp : null
  };
}

/**
 * Event-Listener für Consent-Änderungen
 */
export function onConsentChange(callback) {
  const handler = (event) => callback(event.detail);
  window.addEventListener('consentChanged', handler);
  
  // Cleanup-Funktion zurückgeben
  return () => window.removeEventListener('consentChanged', handler);
}

