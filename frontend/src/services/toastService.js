/**
 * Toast Service - Wrapper für react-hot-toast
 * Zentralisierte Toast-Benachrichtigungen mit konsistentem Styling
 */

import toast from 'react-hot-toast';

/**
 * Toast-Konfiguration
 */
const DEFAULT_OPTIONS = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#16213e',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
};

/**
 * Success Toast
 */
export function showSuccess(message, options = {}) {
  return toast.success(message, {
    ...DEFAULT_OPTIONS,
    ...options,
    style: {
      ...DEFAULT_OPTIONS.style,
      border: '1px solid #51cf66',
    },
    iconTheme: {
      primary: '#51cf66',
      secondary: '#16213e',
    },
  });
}

/**
 * Error Toast
 */
export function showError(message, options = {}) {
  return toast.error(message, {
    ...DEFAULT_OPTIONS,
    duration: 5000, // Errors etwas länger anzeigen
    ...options,
    style: {
      ...DEFAULT_OPTIONS.style,
      border: '1px solid #ff6b6b',
    },
    iconTheme: {
      primary: '#ff6b6b',
      secondary: '#16213e',
    },
  });
}

/**
 * Warning Toast
 */
export function showWarning(message, options = {}) {
  return toast(message, {
    ...DEFAULT_OPTIONS,
    ...options,
    icon: '⚠️',
    style: {
      ...DEFAULT_OPTIONS.style,
      border: '1px solid #ffd93d',
    },
  });
}

/**
 * Info Toast
 */
export function showInfo(message, options = {}) {
  return toast(message, {
    ...DEFAULT_OPTIONS,
    duration: 3000,
    ...options,
    icon: 'ℹ️',
    style: {
      ...DEFAULT_OPTIONS.style,
      border: '1px solid #6c5ce7',
    },
  });
}

/**
 * Loading Toast (manuell dismissible)
 */
export function showLoading(message, options = {}) {
  return toast.loading(message, {
    ...DEFAULT_OPTIONS,
    duration: Infinity,
    ...options,
  });
}

/**
 * Toast schließen
 */
export function dismissToast(toastId) {
  toast.dismiss(toastId);
}

/**
 * Alle Toasts schließen
 */
export function dismissAll() {
  toast.dismiss();
}

// Default Export
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  dismiss: dismissToast,
  dismissAll,
};





