import { Toaster } from 'react-hot-toast';

/**
 * Toast Configuration für react-hot-toast
 * 
 * Angepasst an das Design-System mit Custom Styling.
 * 
 * Usage in main.jsx:
 * import ToastConfig from './design-system/components/Toast';
 * <ToastConfig />
 */
const ToastConfig = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default Options
        duration: 5000,
        style: {
          background: '#1E1E24', // surface-700
          color: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
        
        // Success Toast
        success: {
          iconTheme: {
            primary: '#44FF9E', // success
            secondary: '#1E1E24',
          },
          style: {
            border: '1px solid rgba(68, 255, 158, 0.2)',
          },
        },
        
        // Error Toast
        error: {
          iconTheme: {
            primary: '#FF5757', // danger
            secondary: '#1E1E24',
          },
          style: {
            border: '1px solid rgba(255, 87, 87, 0.2)',
          },
        },
        
        // Loading Toast
        loading: {
          iconTheme: {
            primary: '#8A63FF', // accent-500
            secondary: '#1E1E24',
          },
        },
        
        // Custom (Info) Toast
        custom: {
          style: {
            border: '1px solid rgba(0, 229, 255, 0.2)', // cyan
          },
        },
      }}
    />
  );
};

export default ToastConfig;



