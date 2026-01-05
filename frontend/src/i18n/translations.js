/**
 * Aura Presence - Multi-Language Translations
 * Supported: DE, EN, FR, ES, IT
 */

export const translations = {
  de: {
    // Navigation
    nav: {
      home: 'Startseite',
      live: 'Live-Session',
      history: 'Verlauf',
      account: 'Konto',
      logout: 'Abmelden'
    },
    
    // Home Page
    home: {
      title: 'Willkommen bei Aura Presence',
      subtitle: 'Analyse Ihrer Präsentationsfähigkeiten mit KI',
      startSession: 'Session starten',
      viewHistory: 'Verlauf ansehen',
      features: {
        eyeContact: 'Blickkontakt',
        eyeContactDesc: 'Analysiert Ihren Augenkontakt in Echtzeit',
        facial: 'Mimik',
        facialDesc: 'Erkennt und bewertet Ihre Gesichtsausdrücke',
        gestures: 'Gestik',
        gesturesDesc: 'Verfolgt Ihre Körpersprache und Handbewegungen'
      }
    },
    
    // Live Session
    live: {
      title: 'Live-Session',
      recording: 'Aufnahme läuft',
      paused: 'Pausiert',
      camera: 'Kamera',
      microphone: 'Mikrofon',
      start: 'Starten',
      pause: 'Pause',
      resume: 'Fortsetzen',
      stop: 'Stoppen',
      analyzing: 'Analyse läuft...',
      scores: {
        eyeContact: 'Blickkontakt',
        facialExpression: 'Mimik',
        gestures: 'Gestik',
        overall: 'Gesamtbewertung'
      },
      feedback: 'KI-Feedback',
      noFeedback: 'Starten Sie die Aufnahme, um Feedback zu erhalten',
      cameraPermission: 'Bitte erlauben Sie den Kamera-Zugriff',
      micPermission: 'Bitte erlauben Sie den Mikrofon-Zugriff'
    },
    
    // History Page
    history: {
      title: 'Aufnahme-Verlauf',
      noSessions: 'Keine Aufnahmen vorhanden',
      date: 'Datum',
      duration: 'Dauer',
      score: 'Bewertung',
      view: 'Ansehen',
      delete: 'Löschen',
      eyeContact: 'Blickkontakt',
      facial: 'Mimik',
      gestures: 'Gestik'
    },
    
    // Account Page
    account: {
      title: 'Kontoeinstellungen',
      profile: 'Profil',
      email: 'E-Mail',
      name: 'Name',
      company: 'Unternehmen',
      country: 'Land',
      language: 'Sprache',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      logout: 'Abmelden',
      changePassword: 'Passwort ändern',
      deleteAccount: 'Konto löschen'
    },
    
    // Auth Pages
    auth: {
      login: {
        title: 'Anmelden',
        email: 'E-Mail',
        password: 'Passwort',
        button: 'Anmelden',
        noAccount: 'Noch kein Konto?',
        register: 'Registrieren',
        forgotPassword: 'Passwort vergessen?'
      },
      register: {
        title: 'Registrieren',
        email: 'E-Mail',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        name: 'Name',
        company: 'Unternehmen',
        country: 'Land',
        selectCountry: 'Land auswählen',
        button: 'Registrieren',
        hasAccount: 'Bereits registriert?',
        login: 'Anmelden',
        passwordRequirements: 'Mind. 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl'
      }
    },
    
    // Languages
    languages: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano'
    },
    
    // Common
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolgreich',
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      back: 'Zurück',
      next: 'Weiter',
      close: 'Schließen'
    },
    
    // Messages
    messages: {
      languageChanged: 'Sprache geändert',
      profileUpdated: 'Profil aktualisiert',
      sessionStarted: 'Session gestartet',
      sessionStopped: 'Session beendet',
      error: 'Ein Fehler ist aufgetreten',
      loginSuccess: 'Erfolgreich angemeldet',
      logoutSuccess: 'Erfolgreich abgemeldet',
      registerSuccess: 'Erfolgreich registriert'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      live: 'Live Session',
      history: 'History',
      account: 'Account',
      logout: 'Logout'
    },
    
    // Home Page
    home: {
      title: 'Welcome to Aura Presence',
      subtitle: 'AI-Powered Presentation Skills Analysis',
      startSession: 'Start Session',
      viewHistory: 'View History',
      features: {
        eyeContact: 'Eye Contact',
        eyeContactDesc: 'Analyzes your eye contact in real-time',
        facial: 'Facial Expression',
        facialDesc: 'Detects and evaluates your facial expressions',
        gestures: 'Gestures',
        gesturesDesc: 'Tracks your body language and hand movements'
      }
    },
    
    // Live Session
    live: {
      title: 'Live Session',
      recording: 'Recording',
      paused: 'Paused',
      camera: 'Camera',
      microphone: 'Microphone',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      analyzing: 'Analyzing...',
      scores: {
        eyeContact: 'Eye Contact',
        facialExpression: 'Facial Expression',
        gestures: 'Gestures',
        overall: 'Overall Score'
      },
      feedback: 'AI Feedback',
      noFeedback: 'Start recording to get feedback',
      cameraPermission: 'Please allow camera access',
      micPermission: 'Please allow microphone access'
    },
    
    // History Page
    history: {
      title: 'Recording History',
      noSessions: 'No recordings available',
      date: 'Date',
      duration: 'Duration',
      score: 'Score',
      view: 'View',
      delete: 'Delete',
      eyeContact: 'Eye Contact',
      facial: 'Facial',
      gestures: 'Gestures'
    },
    
    // Account Page
    account: {
      title: 'Account Settings',
      profile: 'Profile',
      email: 'Email',
      name: 'Name',
      company: 'Company',
      country: 'Country',
      language: 'Language',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Logout',
      changePassword: 'Change Password',
      deleteAccount: 'Delete Account'
    },
    
    // Auth Pages
    auth: {
      login: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        button: 'Login',
        noAccount: "Don't have an account?",
        register: 'Register',
        forgotPassword: 'Forgot password?'
      },
      register: {
        title: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
        company: 'Company',
        country: 'Country',
        selectCountry: 'Select Country',
        button: 'Register',
        hasAccount: 'Already registered?',
        login: 'Login',
        passwordRequirements: 'Min. 8 characters, 1 uppercase, 1 lowercase, 1 number'
      }
    },
    
    // Languages
    languages: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      close: 'Close'
    },
    
    // Messages
    messages: {
      languageChanged: 'Language changed',
      profileUpdated: 'Profile updated',
      sessionStarted: 'Session started',
      sessionStopped: 'Session stopped',
      error: 'An error occurred',
      loginSuccess: 'Successfully logged in',
      logoutSuccess: 'Successfully logged out',
      registerSuccess: 'Successfully registered'
    }
  },
  
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      live: 'Session en direct',
      history: 'Historique',
      account: 'Compte',
      logout: 'Déconnexion'
    },
    
    // Home Page
    home: {
      title: 'Bienvenue sur Aura Presence',
      subtitle: 'Analyse des compétences de présentation par IA',
      startSession: 'Démarrer une session',
      viewHistory: 'Voir l\'historique',
      features: {
        eyeContact: 'Contact visuel',
        eyeContactDesc: 'Analyse votre contact visuel en temps réel',
        facial: 'Expression faciale',
        facialDesc: 'Détecte et évalue vos expressions faciales',
        gestures: 'Gestes',
        gesturesDesc: 'Suit votre langage corporel et vos mouvements'
      }
    },
    
    // Live Session
    live: {
      title: 'Session en direct',
      recording: 'Enregistrement',
      paused: 'En pause',
      camera: 'Caméra',
      microphone: 'Microphone',
      start: 'Démarrer',
      pause: 'Pause',
      resume: 'Reprendre',
      stop: 'Arrêter',
      analyzing: 'Analyse en cours...',
      scores: {
        eyeContact: 'Contact visuel',
        facialExpression: 'Expression faciale',
        gestures: 'Gestes',
        overall: 'Score global'
      },
      feedback: 'Retour IA',
      noFeedback: 'Démarrez l\'enregistrement pour obtenir un retour',
      cameraPermission: 'Veuillez autoriser l\'accès à la caméra',
      micPermission: 'Veuillez autoriser l\'accès au microphone'
    },
    
    // History Page
    history: {
      title: 'Historique des enregistrements',
      noSessions: 'Aucun enregistrement disponible',
      date: 'Date',
      duration: 'Durée',
      score: 'Score',
      view: 'Voir',
      delete: 'Supprimer',
      eyeContact: 'Contact visuel',
      facial: 'Facial',
      gestures: 'Gestes'
    },
    
    // Account Page
    account: {
      title: 'Paramètres du compte',
      profile: 'Profil',
      email: 'Email',
      name: 'Nom',
      company: 'Entreprise',
      country: 'Pays',
      language: 'Langue',
      edit: 'Modifier',
      save: 'Enregistrer',
      cancel: 'Annuler',
      logout: 'Déconnexion',
      changePassword: 'Changer le mot de passe',
      deleteAccount: 'Supprimer le compte'
    },
    
    // Auth Pages
    auth: {
      login: {
        title: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        button: 'Se connecter',
        noAccount: 'Pas encore de compte?',
        register: 'S\'inscrire',
        forgotPassword: 'Mot de passe oublié?'
      },
      register: {
        title: 'Inscription',
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        name: 'Nom',
        company: 'Entreprise',
        country: 'Pays',
        selectCountry: 'Sélectionner le pays',
        button: 'S\'inscrire',
        hasAccount: 'Déjà inscrit?',
        login: 'Se connecter',
        passwordRequirements: 'Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre'
      }
    },
    
    // Languages
    languages: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano'
    },
    
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      close: 'Fermer'
    },
    
    // Messages
    messages: {
      languageChanged: 'Langue modifiée',
      profileUpdated: 'Profil mis à jour',
      sessionStarted: 'Session démarrée',
      sessionStopped: 'Session arrêtée',
      error: 'Une erreur s\'est produite',
      loginSuccess: 'Connexion réussie',
      logoutSuccess: 'Déconnexion réussie',
      registerSuccess: 'Inscription réussie'
    }
  },
  
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      live: 'Sesión en vivo',
      history: 'Historial',
      account: 'Cuenta',
      logout: 'Cerrar sesión'
    },
    
    // Home Page
    home: {
      title: 'Bienvenido a Aura Presence',
      subtitle: 'Análisis de habilidades de presentación con IA',
      startSession: 'Iniciar sesión',
      viewHistory: 'Ver historial',
      features: {
        eyeContact: 'Contacto visual',
        eyeContactDesc: 'Analiza tu contacto visual en tiempo real',
        facial: 'Expresión facial',
        facialDesc: 'Detecta y evalúa tus expresiones faciales',
        gestures: 'Gestos',
        gesturesDesc: 'Rastrea tu lenguaje corporal y movimientos'
      }
    },
    
    // Live Session
    live: {
      title: 'Sesión en vivo',
      recording: 'Grabando',
      paused: 'Pausado',
      camera: 'Cámara',
      microphone: 'Micrófono',
      start: 'Iniciar',
      pause: 'Pausar',
      resume: 'Reanudar',
      stop: 'Detener',
      analyzing: 'Analizando...',
      scores: {
        eyeContact: 'Contacto visual',
        facialExpression: 'Expresión facial',
        gestures: 'Gestos',
        overall: 'Puntuación general'
      },
      feedback: 'Retroalimentación IA',
      noFeedback: 'Inicia la grabación para obtener retroalimentación',
      cameraPermission: 'Por favor, permite el acceso a la cámara',
      micPermission: 'Por favor, permite el acceso al micrófono'
    },
    
    // History Page
    history: {
      title: 'Historial de grabaciones',
      noSessions: 'No hay grabaciones disponibles',
      date: 'Fecha',
      duration: 'Duración',
      score: 'Puntuación',
      view: 'Ver',
      delete: 'Eliminar',
      eyeContact: 'Contacto visual',
      facial: 'Facial',
      gestures: 'Gestos'
    },
    
    // Account Page
    account: {
      title: 'Configuración de cuenta',
      profile: 'Perfil',
      email: 'Correo electrónico',
      name: 'Nombre',
      company: 'Empresa',
      country: 'País',
      language: 'Idioma',
      edit: 'Editar',
      save: 'Guardar',
      cancel: 'Cancelar',
      logout: 'Cerrar sesión',
      changePassword: 'Cambiar contraseña',
      deleteAccount: 'Eliminar cuenta'
    },
    
    // Auth Pages
    auth: {
      login: {
        title: 'Iniciar sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        button: 'Iniciar sesión',
        noAccount: '¿No tienes cuenta?',
        register: 'Registrarse',
        forgotPassword: '¿Olvidaste tu contraseña?'
      },
      register: {
        title: 'Registrarse',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar contraseña',
        name: 'Nombre',
        company: 'Empresa',
        country: 'País',
        selectCountry: 'Seleccionar país',
        button: 'Registrarse',
        hasAccount: '¿Ya estás registrado?',
        login: 'Iniciar sesión',
        passwordRequirements: 'Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número'
      }
    },
    
    // Languages
    languages: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano'
    },
    
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      close: 'Cerrar'
    },
    
    // Messages
    messages: {
      languageChanged: 'Idioma cambiado',
      profileUpdated: 'Perfil actualizado',
      sessionStarted: 'Sesión iniciada',
      sessionStopped: 'Sesión detenida',
      error: 'Ocurrió un error',
      loginSuccess: 'Sesión iniciada exitosamente',
      logoutSuccess: 'Sesión cerrada exitosamente',
      registerSuccess: 'Registro exitoso'
    }
  },
  
  it: {
    // Navigation
    nav: {
      home: 'Home',
      live: 'Sessione dal vivo',
      history: 'Cronologia',
      account: 'Account',
      logout: 'Disconnetti'
    },
    
    // Home Page
    home: {
      title: 'Benvenuto su Aura Presence',
      subtitle: 'Analisi delle competenze di presentazione con IA',
      startSession: 'Avvia sessione',
      viewHistory: 'Vedi cronologia',
      features: {
        eyeContact: 'Contatto visivo',
        eyeContactDesc: 'Analizza il tuo contatto visivo in tempo reale',
        facial: 'Espressione facciale',
        facialDesc: 'Rileva e valuta le tue espressioni facciali',
        gestures: 'Gesti',
        gesturesDesc: 'Traccia il tuo linguaggio del corpo e movimenti'
      }
    },
    
    // Live Session
    live: {
      title: 'Sessione dal vivo',
      recording: 'Registrazione',
      paused: 'In pausa',
      camera: 'Fotocamera',
      microphone: 'Microfono',
      start: 'Avvia',
      pause: 'Pausa',
      resume: 'Riprendi',
      stop: 'Ferma',
      analyzing: 'Analisi in corso...',
      scores: {
        eyeContact: 'Contatto visivo',
        facialExpression: 'Espressione facciale',
        gestures: 'Gesti',
        overall: 'Punteggio complessivo'
      },
      feedback: 'Feedback IA',
      noFeedback: 'Avvia la registrazione per ottenere feedback',
      cameraPermission: 'Si prega di consentire l\'accesso alla fotocamera',
      micPermission: 'Si prega di consentire l\'accesso al microfono'
    },
    
    // History Page
    history: {
      title: 'Cronologia registrazioni',
      noSessions: 'Nessuna registrazione disponibile',
      date: 'Data',
      duration: 'Durata',
      score: 'Punteggio',
      view: 'Visualizza',
      delete: 'Elimina',
      eyeContact: 'Contatto visivo',
      facial: 'Facciale',
      gestures: 'Gesti'
    },
    
    // Account Page
    account: {
      title: 'Impostazioni account',
      profile: 'Profilo',
      email: 'Email',
      name: 'Nome',
      company: 'Azienda',
      country: 'Paese',
      language: 'Lingua',
      edit: 'Modifica',
      save: 'Salva',
      cancel: 'Annulla',
      logout: 'Disconnetti',
      changePassword: 'Cambia password',
      deleteAccount: 'Elimina account'
    },
    
    // Auth Pages
    auth: {
      login: {
        title: 'Accedi',
        email: 'Email',
        password: 'Password',
        button: 'Accedi',
        noAccount: 'Non hai un account?',
        register: 'Registrati',
        forgotPassword: 'Password dimenticata?'
      },
      register: {
        title: 'Registrati',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Conferma password',
        name: 'Nome',
        company: 'Azienda',
        country: 'Paese',
        selectCountry: 'Seleziona paese',
        button: 'Registrati',
        hasAccount: 'Già registrato?',
        login: 'Accedi',
        passwordRequirements: 'Min. 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero'
      }
    },
    
    // Languages
    languages: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano'
    },
    
    // Common
    common: {
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      confirm: 'Conferma',
      cancel: 'Annulla',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      back: 'Indietro',
      next: 'Avanti',
      close: 'Chiudi'
    },
    
    // Messages
    messages: {
      languageChanged: 'Lingua cambiata',
      profileUpdated: 'Profilo aggiornato',
      sessionStarted: 'Sessione avviata',
      sessionStopped: 'Sessione fermata',
      error: 'Si è verificato un errore',
      loginSuccess: 'Accesso effettuato',
      logoutSuccess: 'Disconnesso',
      registerSuccess: 'Registrazione completata'
    }
  }
};

/**
 * Get translation for a given key path
 * @param {string} lang - Language code (de, en, fr, es, it)
 * @param {string} path - Dot-notation path to translation (e.g., 'nav.home')
 * @returns {string} - Translated string or key if not found
 */
export function getTranslation(lang, path) {
  const keys = path.split('.');
  let value = translations[lang] || translations.de;
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return path; // Return key if translation not found
    }
  }
  
  return value || path;
}

