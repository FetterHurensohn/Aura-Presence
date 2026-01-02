/**
 * Live Session Page - Focus & Coach Mode
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LiveSession.css';

function LiveSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionType = 'focus', duration = 25 } = location.state || {};
  
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [metrics, setMetrics] = useState({
    posture: 0,
    eyeContact: 0,
    confidence: 0
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });

      // Mock metrics update
      setMetrics({
        posture: Math.floor(Math.random() * 30) + 70,
        eyeContact: Math.floor(Math.random() * 30) + 70,
        confidence: Math.floor(Math.random() * 30) + 70
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleEndSession = () => {
    navigate('/analysis-result', {
      state: {
        sessionType,
        duration,
        metrics,
        feedback
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="live-session">
      {/* Header */}
      <header className="session-header">
        <div className="session-info">
          <span className="session-type-badge">
            {sessionType === 'focus' ? '🎯 Focus' : '💬 Coach'}
          </span>
          <span className="session-mode">
            {sessionType === 'focus' ? 'Stille Analyse' : 'Live-Feedback'}
          </span>
        </div>
        <div className="session-timer">
          <span className="timer-value">{formatTime(timeRemaining)}</span>
          <div className="timer-progress">
            <div 
              className="timer-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="session-content">
        {/* Video Feed */}
        <div className="video-container">
          <video 
            id="session-video" 
            autoPlay 
            playsInline 
            muted
            className="session-video"
          />
          <div className="video-overlay">
            {!isRunning && (
              <div className="paused-indicator">
                <span className="pause-icon">⏸</span>
                <p>Pausiert</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics (Coach Mode) */}
        {sessionType === 'coach' && (
          <div className="live-metrics">
            <div className="metric-card">
              <div className="metric-icon">🧍</div>
              <div className="metric-info">
                <span className="metric-label">Körperhaltung</span>
                <span className="metric-value">{metrics.posture}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill" 
                  style={{ width: `${metrics.posture}%` }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">👁️</div>
              <div className="metric-info">
                <span className="metric-label">Blickkontakt</span>
                <span className="metric-value">{metrics.eyeContact}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill" 
                  style={{ width: `${metrics.eyeContact}%` }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⭐</div>
              <div className="metric-info">
                <span className="metric-label">Confidence</span>
                <span className="metric-value">{metrics.confidence}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill" 
                  style={{ width: `${metrics.confidence}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="session-controls">
        <button className="control-btn secondary" onClick={() => navigate('/dashboard')}>
          <span>✕</span>
          <span>Abbrechen</span>
        </button>
        <button className="control-btn primary" onClick={handlePause}>
          <span>{isRunning ? '⏸' : '▶'}</span>
          <span>{isRunning ? 'Pausieren' : 'Fortsetzen'}</span>
        </button>
        <button className="control-btn accent" onClick={handleEndSession}>
          <span>⏹</span>
          <span>Beenden</span>
        </button>
      </div>
    </div>
  );
}

export default LiveSession;

