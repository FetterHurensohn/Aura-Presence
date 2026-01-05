/**
 * Language Context for i18n
 * Provides language state and translation functions to all components
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from './translations';
import { getLocalLanguage, setLocalLanguage } from '../services/authService';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLanguage = 'de' }) {
  const [language, setLanguage] = useState(() => {
    // Try to load from localStorage first
    const savedLang = getLocalLanguage();
    return savedLang || initialLanguage;
  });

  useEffect(() => {
    // Sync with localStorage whenever language changes
    setLocalLanguage(language);
  }, [language]);

  const changeLanguage = (newLang) => {
    if (['de', 'en', 'fr', 'es', 'it'].includes(newLang)) {
      setLanguage(newLang);
      setLocalLanguage(newLang);
    }
  };

  const t = (path) => getTranslation(language, path);

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use translations in components
 * @returns {{ language: string, changeLanguage: (lang: string) => void, t: (path: string) => string }}
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

