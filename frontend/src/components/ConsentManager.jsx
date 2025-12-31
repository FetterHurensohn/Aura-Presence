/**
 * Consent Manager - Verwaltet Consent-Banner und Status
 * Wird in App.jsx integriert
 */

import React, { useState, useEffect } from 'react';
import CookieBanner from './CookieBanner';
import { hasGivenConsent, onConsentChange } from '../services/consentService';

function ConsentManager({ children }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Prüfe ob Consent bereits gegeben wurde
    const hasConsent = hasGivenConsent();
    setShowBanner(!hasConsent);

    // Lausche auf Consent-Widerruf (z.B. aus Settings)
    const unsubscribe = onConsentChange((consent) => {
      // Wenn timestamp null ist, wurde Consent widerrufen
      if (consent.timestamp === null) {
        setShowBanner(true);
      }
    });

    return unsubscribe;
  }, []);

  // Blockiere Body-Scroll wenn Banner angezeigt wird
  useEffect(() => {
    if (showBanner) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showBanner]);

  const handleAccept = () => {
    setShowBanner(false);
  };

  return (
    <>
      {children}
      {showBanner && <CookieBanner onAccept={handleAccept} />}
    </>
  );
}

export default ConsentManager;

