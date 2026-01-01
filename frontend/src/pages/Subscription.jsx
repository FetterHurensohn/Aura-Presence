/**
 * Subscription/Billing Page
 * Zeigt verfügbare Plans mit Feature-Liste und Stripe Checkout
 */

import React, { useState } from 'react';
import { createCheckoutSession } from '../services/apiService';
import NavBar from '../design-system/components/NavBar';
import Card from '../design-system/components/Card';
import Button from '../design-system/components/Button';
import Icon from '../design-system/components/Icon';
import Footer from '../components/Footer';
import { showError } from '../services/toastService';

function Subscription({ user, onLogout }) {
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0€',
      period: 'für immer',
      description: 'Perfekt zum Ausprobieren',
      features: [
        { text: '5 Analysen pro Monat', included: true },
        { text: 'Basis MediaPipe-Analyse', included: true },
        { text: 'Einfaches Feedback', included: true },
        { text: 'KI-gestütztes Feedback', included: false },
        { text: 'Export-Funktion', included: false },
        { text: 'Erweiterte Metriken', included: false },
      ],
      buttonText: 'Aktueller Plan',
      buttonVariant: 'secondary',
      disabled: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '9,99€',
      period: 'pro Monat',
      description: 'Für regelmäßige Nutzung',
      popular: true,
      features: [
        { text: 'Unbegrenzte Analysen', included: true },
        { text: 'Erweiterte MediaPipe-Analyse', included: true },
        { text: 'KI-gestütztes Feedback', included: true },
        { text: 'Export als PDF/JSON', included: true },
        { text: 'Verlaufsstatistiken', included: true },
        { text: 'Priority Support', included: false },
      ],
      buttonText: 'Upgrade zu Pro',
      buttonVariant: 'primary',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_test_123',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'nach Vereinbarung',
      description: 'Für Teams & Unternehmen',
      features: [
        { text: 'Alles aus Pro', included: true },
        { text: 'Team-Dashboard', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'API-Zugriff', included: true },
        { text: 'Dedizierter Support', included: true },
        { text: 'On-Premise Option', included: true },
      ],
      buttonText: 'Kontakt aufnehmen',
      buttonVariant: 'secondary',
      contact: true,
    },
  ];

  const handleSubscribe = async (plan) => {
    if (plan.contact) {
      window.location.href = 'mailto:enterprise@aurapresence.com';
      return;
    }

    if (!plan.priceId) return;

    setLoading(plan.id);
    
    try {
      const { url } = await createCheckoutSession(plan.priceId);
      window.location.href = url;
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      showError('Fehler beim Starten des Checkout-Prozesses');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-900">
      <NavBar user={user} onLogout={onLogout} />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-h1 text-white mb-4">
              Wähle deinen Plan
            </h1>
            <p className="text-lg text-muted-500 max-w-2xl mx-auto">
              Starte kostenlos und upgrade jederzeit. Alle Pläne enthalten 14 Tage Geld-zurück-Garantie.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`
                  relative
                  ${plan.popular ? 'ring-2 ring-accent-500 shadow-accent' : ''}
                `.trim()}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-pill">
                      Beliebteste Option
                    </span>
                  </div>
                )}

                <div className="text-center pt-4">
                  <h3 className="text-h3 text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-500 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-h1 text-white font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-500">{plan.period}</div>
                  </div>

                  <Button
                    variant={plan.buttonVariant}
                    size="lg"
                    fullWidth
                    disabled={plan.disabled || loading === plan.id}
                    loading={loading === plan.id}
                    onClick={() => handleSubscribe(plan)}
                    icon={plan.contact ? 'bell' : 'check'}
                  >
                    {plan.buttonText}
                  </Button>
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Icon name="check" size={20} color="success" className="mt-0.5" />
                      ) : (
                        <Icon name="close" size={20} color="muted" className="mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-white' : 'text-muted-500'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-h2 text-white mb-6 text-center">
              Häufig gestellte Fragen
            </h2>
            
            <div className="space-y-4">
              <Card>
                <h4 className="text-white font-semibold mb-2">
                  Kann ich jederzeit upgraden oder downgraden?
                </h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Ja! Du kannst deinen Plan jederzeit in den Einstellungen ändern. 
                  Beim Upgrade wird der neue Plan sofort aktiv, beim Downgrade läuft der aktuelle Plan bis zum Monatsende.
                </p>
              </Card>

              <Card>
                <h4 className="text-white font-semibold mb-2">
                  Wie sicher ist meine Zahlung?
                </h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Alle Zahlungen werden über Stripe verarbeitet, einem der sichersten Payment-Provider weltweit. 
                  Wir speichern keine Kreditkartendaten auf unseren Servern.
                </p>
              </Card>

              <Card>
                <h4 className="text-white font-semibold mb-2">
                  Was passiert mit meinen Daten, wenn ich kündige?
                </h4>
                <p className="text-sm text-muted-500 leading-relaxed">
                  Dein Account und alle Daten bleiben erhalten. Du kannst jederzeit wieder upgraden. 
                  Wenn du deinen Account komplett löschen möchtest, kannst du das in den Einstellungen tun.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Subscription;



