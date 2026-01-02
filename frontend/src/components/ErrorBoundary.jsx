/**
 * ErrorBoundary Component
 * Fängt React-Fehler und zeigt Fallback-UI
 */

import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state damit nächster Render Fallback-UI zeigt
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log Error für Debugging
    console.error('ErrorBoundary caught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Sende Error an Sentry
    try {
      const { captureError } = require('../services/sentryService');
      captureError(error, {
        extra: {
          componentStack: errorInfo.componentStack,
        },
        tags: {
          errorBoundary: 'App',
        },
      });
    } catch (err) {
      console.error('Failed to send error to Sentry:', err);
    }
  }

  handleReload = () => {
    // Reset State und reload
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset State und navigate zu Home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1>Etwas ist schiefgelaufen</h1>
            <p className="error-message">
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Fehlerdetails (nur in Development sichtbar)</summary>
                <pre className="error-stack">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      <br />
                      <br />
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReload} className="btn btn-primary">
                Seite neu laden
              </button>
              <button onClick={this.handleGoHome} className="btn btn-secondary">
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;





