/**
 * Session Statistics Component
 * Zeigt aggregierte Session-Statistiken
 */

import React, { useMemo } from 'react';
import './SessionStats.css';

function SessionStats({ feedbackHistory, sessionStartTime, isAnalyzing }) {
  // Berechne aggregierte Statistiken
  const stats = useMemo(() => {
    if (feedbackHistory.length === 0) {
      return null;
    }

    // Durchschnittswerte berechnen
    const avgEyeContact = feedbackHistory.reduce((sum, f) => sum + (f.metrics?.eyeContact?.score || 0), 0) / feedbackHistory.length;
    const avgBlinkRate = feedbackHistory.reduce((sum, f) => sum + (f.metrics?.blinkRate?.score || 0), 0) / feedbackHistory.length;
    const avgGesture = feedbackHistory.reduce((sum, f) => sum + (f.metrics?.gestureFrequency?.score || 0), 0) / feedbackHistory.length;
    const avgPosture = feedbackHistory.reduce((sum, f) => sum + (f.metrics?.posture?.score || 0), 0) / feedbackHistory.length;
    const avgConfidence = feedbackHistory.reduce((sum, f) => sum + (f.confidence || 0), 0) / feedbackHistory.length;

    // Session-Dauer
    const duration = sessionStartTime ? Date.now() - sessionStartTime : 0;
    const durationMinutes = Math.floor(duration / 60000);
    const durationSeconds = Math.floor((duration % 60000) / 1000);

    // Trend berechnen (steigend/fallend basierend auf letzten 5 vs ersten 5)
    const recentAvg = feedbackHistory.slice(-5).reduce((sum, f) => sum + (f.confidence || 0), 0) / Math.min(5, feedbackHistory.length);
    const earlyAvg = feedbackHistory.slice(0, 5).reduce((sum, f) => sum + (f.confidence || 0), 0) / Math.min(5, feedbackHistory.length);
    const trend = recentAvg > earlyAvg ? 'improving' : recentAvg < earlyAvg ? 'declining' : 'stable';

    return {
      avgEyeContact,
      avgBlinkRate,
      avgGesture,
      avgPosture,
      avgConfidence,
      duration: { minutes: durationMinutes, seconds: durationSeconds },
      analysisCount: feedbackHistory.length,
      trend
    };
  }, [feedbackHistory, sessionStartTime]);

  if (!stats) {
    return (
      <div className="card session-stats-placeholder">
        <h3>Session-Statistiken</h3>
        <p className="text-muted">
          Starte die Analyse, um Session-Statistiken zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="card session-stats">
      <div className="session-stats-header">
        <h3>Session-Überblick</h3>
        {isAnalyzing && (
          <span className="session-active-badge">
            🔴 Live
          </span>
        )}
      </div>

      {/* Session Info */}
      <div className="session-info">
        <div className="session-info-item">
          <span className="info-label">Dauer</span>
          <span className="info-value">
            {stats.duration.minutes}:{stats.duration.seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="session-info-item">
          <span className="info-label">Analysen</span>
          <span className="info-value">{stats.analysisCount}</span>
        </div>
        <div className="session-info-item">
          <span className="info-label">Trend</span>
          <span className={`info-value trend-${stats.trend}`}>
            {stats.trend === 'improving' ? '📈 Besser' : 
             stats.trend === 'declining' ? '📉 Schlechter' : 
             '➡️ Stabil'}
          </span>
        </div>
      </div>

      {/* Average Scores */}
      <div className="average-scores">
        <h4>Durchschnittliche Scores</h4>
        <div className="scores-grid">
          <ScoreBar 
            label="Augenkontakt" 
            score={stats.avgEyeContact} 
            icon="👁️"
          />
          <ScoreBar 
            label="Blinzelrate" 
            score={stats.avgBlinkRate} 
            icon="😌"
          />
          <ScoreBar 
            label="Gestik" 
            score={stats.avgGesture} 
            icon="🤲"
          />
          <ScoreBar 
            label="Haltung" 
            score={stats.avgPosture} 
            icon="🧍"
          />
        </div>
      </div>

      {/* Overall Confidence */}
      <div className="overall-confidence">
        <div className="confidence-label">Gesamt-Performance</div>
        <div className="confidence-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="confidence-bg" />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="confidence-progress"
              strokeDasharray={`${stats.avgConfidence * 251.2} 251.2`}
            />
          </svg>
          <div className="confidence-text">
            {(stats.avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Score Bar Component
 */
function ScoreBar({ label, score, icon }) {
  const percentage = (score * 100).toFixed(0);
  const color = score >= 0.7 ? '#44FF9E' : score >= 0.5 ? '#FFD93D' : '#FF5757';

  return (
    <div className="score-bar-item">
      <div className="score-bar-header">
        <span className="score-icon">{icon}</span>
        <span className="score-label">{label}</span>
      </div>
      <div className="score-bar">
        <div 
          className="score-fill" 
          style={{ 
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>
      <div className="score-percentage">{percentage}%</div>
    </div>
  );
}

export default SessionStats;


