/**
 * Analysis Result Page - Zeigt die Ergebnisse nach einer Session
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AnalysisResult.css';

function AnalysisResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionType = 'focus', duration = 25, metrics = {} } = location.state || {};

  const overallScore = Math.floor((metrics.posture + metrics.eyeContact + metrics.confidence) / 3) || 82;

  return (
    <div className="analysis-result">
      <div className="result-container">
        {/* Header */}
        <header className="result-header">
          <h1 className="result-title">Session abgeschlossen! 🎉</h1>
          <p className="result-subtitle">Hier sind deine Ergebnisse</p>
        </header>

        {/* Overall Score */}
        <section className="overall-score">
          <div className="score-circle-large">
            <svg viewBox="0 0 120 120" className="score-svg-large">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#2d3748" strokeWidth="12"/>
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="12"
                strokeDasharray={`${(overallScore / 100) * 339.292} 339.292`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="score-content-large">
              <span className="score-value-large">{overallScore}</span>
              <span className="score-unit">%</span>
            </div>
          </div>
          <h2 className="score-label-large">Gesamt-Confidence</h2>
          <p className="score-description">
            {overallScore >= 90 ? '🌟 Hervorragend!' : 
             overallScore >= 75 ? '👍 Sehr gut!' : 
             overallScore >= 60 ? '✓ Gut!' : '💪 Noch Potenzial!'}
          </p>
        </section>

        {/* Detailed Metrics */}
        <section className="detailed-metrics">
          <h3 className="metrics-title">Detaillierte Analyse</h3>
          
          <div className="metric-detail">
            <div className="metric-detail-header">
              <span className="metric-icon">🧍</span>
              <span className="metric-name">Körperhaltung</span>
              <span className="metric-score">{metrics.posture || 82}%</span>
            </div>
            <div className="metric-bar-large">
              <div 
                className="metric-bar-fill-large"
                style={{ width: `${metrics.posture || 82}%` }}
              />
            </div>
            <p className="metric-feedback">
              {(metrics.posture || 82) >= 80 
                ? 'Deine Haltung war stabil und selbstbewusst.' 
                : 'Achte auf eine aufrechte Haltung mit entspannten Schultern.'}
            </p>
          </div>

          <div className="metric-detail">
            <div className="metric-detail-header">
              <span className="metric-icon">👁️</span>
              <span className="metric-name">Blickkontakt</span>
              <span className="metric-score">{metrics.eyeContact || 87}%</span>
            </div>
            <div className="metric-bar-large">
              <div 
                className="metric-bar-fill-large"
                style={{ width: `${metrics.eyeContact || 87}%` }}
              />
            </div>
            <p className="metric-feedback">
              {(metrics.eyeContact || 87) >= 80 
                ? 'Sehr gut! Du hast konstanten Blickkontakt gehalten.' 
                : 'Versuche, öfter direkt in die Kamera zu schauen.'}
            </p>
          </div>

          <div className="metric-detail">
            <div className="metric-detail-header">
              <span className="metric-icon">⭐</span>
              <span className="metric-name">Confidence</span>
              <span className="metric-score">{metrics.confidence || 79}%</span>
            </div>
            <div className="metric-bar-large">
              <div 
                className="metric-bar-fill-large"
                style={{ width: `${metrics.confidence || 79}%` }}
              />
            </div>
            <p className="metric-feedback">
              {(metrics.confidence || 79) >= 80 
                ? 'Du wirkst selbstsicher und überzeugend!' 
                : 'Mit mehr Übung wirst du noch sicherer auftreten.'}
            </p>
          </div>
        </section>

        {/* Session Info */}
        <section className="session-info-card">
          <div className="info-row">
            <span className="info-label">Session-Typ</span>
            <span className="info-value">{sessionType === 'focus' ? '🎯 Focus Mode' : '💬 Coach Mode'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Dauer</span>
            <span className="info-value">{duration} Minuten</span>
          </div>
          <div className="info-row">
            <span className="info-label">Datum</span>
            <span className="info-value">{new Date().toLocaleDateString('de-DE')}</span>
          </div>
        </section>

        {/* Actions */}
        <div className="result-actions">
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/sessions')}
          >
            <span>📊</span>
            <span>Alle Sessions</span>
          </button>
          <button 
            className="action-btn primary"
            onClick={() => navigate('/session-prepare')}
          >
            <span>🔄</span>
            <span>Neue Session</span>
          </button>
          <button 
            className="action-btn accent"
            onClick={() => navigate('/dashboard')}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;

