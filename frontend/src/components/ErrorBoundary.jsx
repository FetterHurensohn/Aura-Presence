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
      error: null
    };
    this.errorInfo = null; // Store as instance variable
  }

  static getDerivedStateFromError(error) {
    // Update state damit nächster Render Fallback-UI zeigt
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log Error für Debugging (KEIN setState hier - verhindert infinite loop!)
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // Store errorInfo in instance variable (nicht im state)
    this.errorInfo = errorInfo;

    // TODO: Sende Error an Sentry/Monitoring-Service
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
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
                  {this.errorInfo && (
                    <>
                      <br />
                      <br />
                      <strong>Component Stack:</strong>
                      {this.errorInfo.componentStack}
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





