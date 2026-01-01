/**
 * FeedbackDisplay Component
 * Zeigt KI-gestütztes Feedback an
 */

import React from 'react';
import './FeedbackDisplay.css';

function FeedbackDisplay({ feedback, isAnalyzing, feedbackHistory = [] }) {
  if (!feedback) {
    return (
      <div className="card feedback-placeholder">
        <h3>KI-Feedback</h3>
        {isAnalyzing ? (
          <div className="feedback-waiting">
            <div className="spinner"></div>
            <p>Warte auf erste Analyse...</p>
          </div>
        ) : (
          <p className="text-muted">
            Starte die Analyse, um personalisiertes Feedback zu erhalten.
          </p>
        )}
      </div>
    );
  }

  const { evaluation, interpretation, timestamp } = feedback;

  return (
    <div className="feedback-container">
      {/* Haupt-Feedback-Card */}
      <div className="card feedback-card">
        <h3>KI-Feedback</h3>
        
        {/* Confidence Score */}
        <div className="confidence-badge">
          <span className="confidence-label">Gesamt-Score:</span>
          <span className={`confidence-value confidence-${getConfidenceLevel(evaluation.confidence)}`}>
            {(evaluation.confidence * 100).toFixed(0)}%
          </span>
        </div>

        {/* Interpretation Text */}
        {interpretation && (
          <div className="interpretation-text">
            <p>{interpretation.feedback}</p>
            <div className="interpretation-meta">
              <span className="badge">{interpretation.tone}</span>
              <span className="timestamp">
                {new Date(timestamp).toLocaleTimeString('de-DE')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Breakdown */}
      <div className="card metrics-card">
        <h4>Detaillierte Metriken</h4>
        <div className="metrics-list">
          <MetricItem 
            label="Augenkontakt"
            metric={evaluation.metrics.eyeContact}
            feedbackHistory={feedbackHistory}
          />
          <MetricItem 
            label="Blinzelrate"
            metric={evaluation.metrics.blinkRate}
            feedbackHistory={feedbackHistory}
          />
          <MetricItem 
            label="Gestik"
            metric={evaluation.metrics.gestureFrequency}
            feedbackHistory={feedbackHistory}
          />
          <MetricItem 
            label="Körperhaltung"
            metric={evaluation.metrics.posture}
            feedbackHistory={feedbackHistory}
          />
        </div>
      </div>

      {/* Flags / Warnungen */}
      {evaluation.flags && evaluation.flags.length > 0 && (
        <div className="card flags-card">
          <h4>Hinweise</h4>
          <div className="flags-list">
            {evaluation.flags.map((flag, index) => (
              <div key={index} className={`flag flag-${flag.severity}`}>
                <span className="flag-icon">
                  {flag.severity === 'high' ? '⚠️' : 
                   flag.severity === 'medium' ? '⚡' : 'ℹ️'}
                </span>
                <span className="flag-message">{flag.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Einzelne Metrik-Anzeige mit Trend-Graph
 */
function MetricItem({ label, metric, feedbackHistory = [] }) {
  // Extrahiere Trend-Daten für diese Metrik (letzten 5 Werte)
  const metricKey = label.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');
  const trendData = feedbackHistory.slice(-5).map(entry => {
    // Map label to metric key
    let metricValue = 0.5;
    if (metricKey.includes('augenkontakt')) {
      metricValue = entry.metrics?.eyeContact?.score || 0.5;
    } else if (metricKey.includes('blinzel')) {
      metricValue = entry.metrics?.blinkRate?.score || 0.5;
    } else if (metricKey.includes('gestik')) {
      metricValue = entry.metrics?.gestureFrequency?.score || 0.5;
    } else if (metricKey.includes('haltung')) {
      metricValue = entry.metrics?.posture?.score || 0.5;
    }
    return metricValue;
  });

  return (
    <div className="metric-item">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <span className={`metric-status status-${metric.status}`}>
          {metric.status}
        </span>
      </div>
      <div className="metric-bar">
        <div 
          className={`metric-fill fill-${metric.status}`}
          style={{ width: `${metric.score * 100}%` }}
        />
      </div>
      
      {/* Mini Trend Graph */}
      {trendData.length > 1 && (
        <div className="metric-trend">
          {trendData.map((value, i) => (
            <div 
              key={i} 
              className="trend-bar" 
              style={{ 
                height: `${value * 100}%`,
                opacity: 0.5 + (i / trendData.length) * 0.5 // Neuere Bars sind opaker
              }} 
            />
          ))}
        </div>
      )}
      
      <p className="metric-description">{metric.description}</p>
    </div>
  );
}

/**
 * Hilfsfunktion: Confidence-Level bestimmen
 */
function getConfidenceLevel(confidence) {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
}

export default FeedbackDisplay;





