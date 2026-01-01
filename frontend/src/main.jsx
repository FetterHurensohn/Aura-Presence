/**
 * Frontend Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Sentry Error-Tracking initialisieren (VOR React-Render!)
import { initSentry } from './services/sentryService';
initSentry();

// Toast Notification System
import ToastConfig from './design-system/components/Toast.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastConfig />
  </React.StrictMode>
);





