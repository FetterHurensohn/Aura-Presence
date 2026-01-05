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
    console.log('🌐 LanguageProvider initialized with:', savedLang);
    return savedLang || initialLanguage;
  });

  useEffect(() => {
    // Sync with localStorage whenever language changes
    console.log('🔄 Language changed to:', language);
    setLocalLanguage(language);
    
    // Update document lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userLanguage' && e.newValue && e.newValue !== language) {
        console.log('🔄 Storage event detected: language changed to', e.newValue);
        setLanguage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language]);

  // Check localStorage periodically (fallback for same-tab updates)
  useEffect(() => {
    const checkLanguage = () => {
      const currentLang = getLocalLanguage();
      if (currentLang && currentLang !== language) {
        console.log('🔄 Periodic check: language changed to', currentLang);
        setLanguage(currentLang);
      }
    };
    
    // Check every 500ms
    const interval = setInterval(checkLanguage, 500);
    return () => clearInterval(interval);
  }, [language]);

  const changeLanguage = (newLang) => {
    if (['de', 'en', 'fr', 'es', 'it'].includes(newLang)) {
      console.log('✅ Changing language to:', newLang);
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

