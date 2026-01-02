/**
 * Dashboard Component
 * Redesigned mit Design-System Components und Metric Cards
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptionStatus, createCheckoutSession } from '../services/apiService';
import { captureError, addBreadcrumb } from '../services/sentryService';
import NavBar from '../design-system/components/NavBar';
import Card from '../design-system/components/Card';
import Button from '../design-system/components/Button';
import Icon from '../design-system/components/Icon';
import Footer from './Footer';

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
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_test_123';
      const { url } = await createCheckoutSession(priceId);
      window.location.href = url;
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      alert('Fehler beim Starten des Checkout-Prozesses');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // TEST: Sentry Error Handler (nur für Development)
  const handleTestSentryError = () => {
    addBreadcrumb('User clicked Sentry Test button', { component: 'Dashboard' });
    
    try {
      // Simuliere einen Fehler
      const undefinedVar = null;
      undefinedVar.someMethod(); // TypeError
    } catch (error) {
      captureError(error, {
        tags: {
          component: 'Dashboard',
          testType: 'manual',
        },
        extra: {
          userId: user?.id,
          timestamp: new Date().toISOString(),
        },
      });
      alert('✅ Test-Error wurde an Sentry gesendet! Prüfe Sentry Dashboard.');
    }
  };

  const handleTestSentryBoundary = () => {
    // Trigger ErrorBoundary
    throw new Error('TEST: Frontend ErrorBoundary funktioniert!');
  };

  // Mock-Daten für Statistiken (können später dynamisch geladen werden)
  const stats = {
    totalAnalyses: 42,
    totalSessions: 18,
    totalTime: '2.5h',
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-900">
      {/* Navigation */}
      <NavBar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-h1 text-white mb-2">
              Willkommen zurück, {user?.name || user?.email}! 👋
            </h1>
            <p className="text-muted-500">
              Hier ist deine Übersicht über deine Analysen und Aktivitäten.
            </p>

            {/* Sentry Test Buttons (nur Development) */}
            {import.meta.env.MODE === 'development' && (
              <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-warning font-semibold mb-2">🧪 Sentry Test (Development Only)</p>
                <div className="flex gap-3">
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handleTestSentryError}
                  >
                    Test Error Capture
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handleTestSentryBoundary}
                  >
                    Test ErrorBoundary
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Analyses */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-button bg-accent-500/20 flex items-center justify-center">
                  <Icon name="chart" size={24} color="accent" />
                </div>
                <div>
                  <p className="text-muted-500 text-sm">Analysen</p>
                  <p className="text-h2 text-white font-bold">{stats.totalAnalyses}</p>
                </div>
              </div>
            </Card>

            {/* Total Sessions */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-button bg-cyan/20 flex items-center justify-center">
                  <Icon name="video" size={24} color="cyan" />
                </div>
                <div>
                  <p className="text-muted-500 text-sm">Sitzungen</p>
                  <p className="text-h2 text-white font-bold">{stats.totalSessions}</p>
                </div>
              </div>
            </Card>

            {/* Total Time */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-button bg-success/20 flex items-center justify-center">
                  <Icon name="clock" size={24} color="success" />
                </div>
                <div>
                  <p className="text-muted-500 text-sm">Gesamtzeit</p>
                  <p className="text-h2 text-white font-bold">{stats.totalTime}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Subscription Status Card */}
            <Card 
              header={
                <div className="flex items-center gap-2">
                  <Icon name="shield" size={20} color="accent" />
                  <span>Abonnement-Status</span>
                </div>
              }
            >
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Icon name="spinner" size={32} color="accent" className="animate-spin" />
                </div>
              ) : (
                <>
                  {subscription?.status === 'active' || subscription?.status === 'trialing' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <Icon name="check" size={20} color="success" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {subscription.status === 'active' ? 'Aktiv' : 'Testphase'}
                          </p>
                          <p className="text-sm text-muted-500">
                            Plan: {subscription.plan || 'Standard'}
                          </p>
                        </div>
                      </div>
                      {subscription.currentPeriodEnd && (
                        <div className="bg-surface-700 rounded-button p-3">
                          <p className="text-sm text-muted-500">
                            Gültig bis:{' '}
                            <span className="text-white font-medium">
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE')}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <Icon name="warning" size={48} color="magenta" />
                      </div>
                      <p className="text-white mb-2">Kein aktives Abonnement</p>
                      <p className="text-sm text-muted-500 mb-6">
                        Schalte alle Features frei mit einem Premium-Abo!
                      </p>
                      <Button 
                        variant="primary"
                        size="lg"
                        icon="chart"
                        loading={checkoutLoading}
                        onClick={handleSubscribe}
                      >
                        Jetzt upgraden
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>

            {/* Quick Actions Card */}
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Icon name="play" size={20} color="accent" />
                  <span>Schnellzugriff</span>
                </div>
              }
            >
              <div className="space-y-3">
                <Link to="/analyze">
                  <Card 
                    hoverable 
                    onClick={() => {}}
                    className="bg-surface-700 hover:bg-surface-700/80"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-button bg-accent-500 flex items-center justify-center">
                        <Icon name="video" size={24} color="white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Analyse starten</p>
                        <p className="text-sm text-muted-500">Video-Stream analysieren</p>
                      </div>
                      <div className="ml-auto">
                        <Icon name="chevron-right" size={20} color="muted" />
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/settings">
                  <Card 
                    hoverable 
                    onClick={() => {}}
                    className="bg-surface-700 hover:bg-surface-700/80"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-button bg-cyan/20 flex items-center justify-center">
                        <Icon name="settings" size={24} color="cyan" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Einstellungen</p>
                        <p className="text-sm text-muted-500">Profil & Datenschutz</p>
                      </div>
                      <div className="ml-auto">
                        <Icon name="chevron-right" size={20} color="muted" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </Card>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center py-2">
                <div className="mb-3">
                  <Icon name="chart" size={32} color="accent" />
                </div>
                <h4 className="text-white font-semibold mb-2">Verhaltensanalyse</h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Echtzeit-Analyse deiner Körpersprache und Präsenz mittels KI
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center py-2">
                <div className="mb-3">
                  <Icon name="lock" size={32} color="success" />
                </div>
                <h4 className="text-white font-semibold mb-2">Datenschutz</h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Alle Analysen erfolgen lokal - keine Videos werden gespeichert
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center py-2">
                <div className="mb-3">
                  <Icon name="info" size={32} color="cyan" />
                </div>
                <h4 className="text-white font-semibold mb-2">KI-Feedback</h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Konstruktive Rückmeldungen zur Verbesserung deiner Ausstrahlung
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Dashboard;
