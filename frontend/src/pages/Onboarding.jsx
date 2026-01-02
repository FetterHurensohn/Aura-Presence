/**
 * Onboarding Page - 3 Fragen nach Registrierung
 * EXAKT im gleichen Stil wie Login/Register
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function Onboarding({ user, onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // TODO: Save user profile data to backend
      console.log('Onboarding data:', formData);
      
      if (onComplete) {
        await onComplete(formData);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.company.trim() !== '';
      case 3:
        return formData.country.trim() !== '';
      default:
        return false;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Logo */}
        <div className="onboarding-logo">
          <svg width="96" height="96" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" />
            <path d="M100 40 L130 90 L100 85 L70 90 Z" fill="white" />
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0E7CB8" />
                <stop offset="100%" stopColor="#330B91" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand */}
        <h1 className="onboarding-brand">Aura Presence</h1>

        {/* Progress Indicator */}
        <div className="onboarding-progress">
          <div className={`progress-dot ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className="progress-line"></div>
          <div className={`progress-dot ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className="progress-line"></div>
          <div className={`progress-dot ${currentStep >= 3 ? 'active' : ''}`}></div>
        </div>

        {/* Step Content */}
        <div className="onboarding-content">
          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">Wie heißt du?</h2>
              
              <div className="onboarding-form">
                <div className="onboarding-input-group">
                  <label className="onboarding-label">Vor- und Nachname</label>
                  <input
                    type="text"
                    className="onboarding-input"
                    placeholder="z.B. Max Mustermann"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company */}
          {currentStep === 2 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">Zu welchem Unternehmen gehörst du?</h2>
              
              <div className="onboarding-form">
                <div className="onboarding-input-group">
                  <label className="onboarding-label">Unternehmen</label>
                  <input
                    type="text"
                    className="onboarding-input"
                    placeholder="z.B. Aura Presence GmbH"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Country */}
          {currentStep === 3 && (
            <div className="onboarding-step">
              <h2 className="onboarding-title">Wo wohnst du?</h2>
              
              <div className="onboarding-form">
                <div className="onboarding-input-group">
                  <label className="onboarding-label">Land</label>
                  <select
                    className="onboarding-input"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    autoFocus
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Luxemburg">Luxemburg</option>
                    <option value="Belgien">Belgien</option>
                    <option value="Niederlande">Niederlande</option>
                    <option value="Frankreich">Frankreich</option>
                    <option value="Italien">Italien</option>
                    <option value="Spanien">Spanien</option>
                    <option value="Polen">Polen</option>
                    <option value="Tschechien">Tschechien</option>
                    <option value="Andere">Andere</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="onboarding-actions">
            {currentStep > 1 && (
              <button 
                type="button"
                className="onboarding-button secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Zurück
              </button>
            )}
            
            <button
              type="button"
              className="onboarding-button primary"
              onClick={handleNext}
              disabled={!isStepValid() || loading}
            >
              {loading ? 'Wird gespeichert...' : currentStep === 3 ? 'Fertig' : 'Weiter'}
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="onboarding-step-indicator">
          Schritt {currentStep} von 3
        </div>
      </div>
    </div>
  );
}

export default Onboarding;

