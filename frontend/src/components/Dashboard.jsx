/**
 * Dashboard Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptionStatus, createCheckoutSession } from '../services/apiService';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await getSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Fehler beim Laden des Subscription-Status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setCheckoutLoading(true);
    
    try {
      // Verwende Price ID aus ENV oder Standard-Test-ID
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_test_123';
      const { url } = await createCheckoutSession(priceId);
      
      // Redirect zu Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      alert('Fehler beim Starten des Checkout-Prozesses');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            Aura Presence
          </Link>
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link active">Dashboard</Link>
            <Link to="/analyze" className="navbar-link">Analyse starten</Link>
            <button onClick={onLogout} className="btn btn-secondary">
              Abmelden
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <h1>Willkommen, {user.email}!</h1>
        
        {/* Subscription Status */}
        <div className="dashboard-grid">
          <div className="card">
            <h3>Abonnement-Status</h3>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <div className="subscription-status">
                  <span className={`status-badge status-${subscription?.status || 'none'}`}>
                    {subscription?.status === 'active' ? '✓ Aktiv' : 
                     subscription?.status === 'trialing' ? '⏱ Testphase' :
                     '✗ Kein aktives Abo'}
                  </span>
                </div>
                
                {subscription?.status === 'active' || subscription?.status === 'trialing' ? (
                  <div className="subscription-details">
                    <p>Plan: <strong>{subscription.plan || 'Standard'}</strong></p>
                    {subscription.currentPeriodEnd && (
                      <p>Gültig bis: <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE')}</strong></p>
                    )}
                  </div>
                ) : (
                  <div className="subscription-cta">
                    <p>Schalte alle Features frei mit einem Premium-Abo!</p>
                    <button 
                      onClick={handleSubscribe} 
                      className="btn btn-primary"
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? 'Lädt...' : 'Jetzt upgraden'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3>Schnellzugriff</h3>
            <div className="quick-actions">
              <Link to="/analyze" className="action-button">
                <span className="action-icon">🎥</span>
                <div>
                  <h4>Analyse starten</h4>
                  <p>Video-Stream analysieren</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="dashboard-grid mt-4">
          <div className="card info-card">
            <h4>📊 Verhaltensanalyse</h4>
            <p>Echtzeit-Analyse deiner Körpersprache und Präsenz mittels KI</p>
          </div>
          <div className="card info-card">
            <h4>🔒 Datenschutz</h4>
            <p>Alle Analysen erfolgen lokal - keine Videos werden gespeichert</p>
          </div>
          <div className="card info-card">
            <h4>💡 KI-Feedback</h4>
            <p>Konstruktive Rückmeldungen zur Verbesserung deiner Ausstrahlung</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;





