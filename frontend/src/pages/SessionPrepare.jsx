/**
 * Session Prepare Page - Vorbereitung vor der Live-Session
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionPrepare.css';

function SessionPrepare() {
  const navigate = useNavigate();
  const [sessionType, setSessionType] = useState('focus');
  const [duration, setDuration] = useState(25);
  const [cameraReady, setCameraReady] = useState(false);

  const handleStartSession = () => {
    navigate('/live-session', { 
      state: { sessionType, duration } 
    });
  };

  return (
    <div className="session-prepare">
      <div className="prepare-container">
        {/* Header */}
        <header className="prepare-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Zurück
          </button>
          <h1 className="prepare-title">Session vorbereiten</h1>
        </header>

        {/* Camera Preview */}
        <section className="camera-section">
          <div className="camera-preview">
            <video 
              id="camera-preview" 
              autoPlay 
              playsInline 
              muted
              className="preview-video"
            />
            <div className="camera-overlay">
              {!cameraReady && (
                <div className="camera-status">
                  <span className="status-icon">📹</span>
                  <p>Kamera wird geladen...</p>
                </div>
              )}
            </div>
          </div>
          <button 
            className={`camera-btn ${cameraReady ? 'ready' : ''}`}
            onClick={() => setCameraReady(!cameraReady)}
          >
            {cameraReady ? '✓ Kamera bereit' : '▶ Kamera testen'}
          </button>
        </section>

        {/* Session Settings */}
        <section className="session-settings">
          <h2 className="settings-title">Einstellungen</h2>

          {/* Session Type */}
          <div className="setting-group">
            <label className="setting-label">Session-Typ</label>
            <div className="session-types">
              <button 
                className={`type-btn ${sessionType === 'focus' ? 'active' : ''}`}
                onClick={() => setSessionType('focus')}
              >
                <span className="type-icon">🎯</span>
                <span className="type-name">Focus Mode</span>
                <span className="type-desc">Stille Analyse ohne Feedback</span>
              </button>
              <button 
                className={`type-btn ${sessionType === 'coach' ? 'active' : ''}`}
                onClick={() => setSessionType('coach')}
              >
                <span className="type-icon">💬</span>
                <span className="type-name">Coach Mode</span>
                <span className="type-desc">Live-Feedback während Session</span>
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="setting-group">
            <label className="setting-label">
              Dauer: <strong>{duration} Minuten</strong>
            </label>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="duration-slider"
            />
            <div className="duration-marks">
              <span>5 min</span>
              <span>30 min</span>
              <span>60 min</span>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="checklist">
          <h3 className="checklist-title">Vorbereitung</h3>
          <div className="checklist-items">
            <label className="checklist-item">
              <input type="checkbox" checked={cameraReady} readOnly />
              <span>Kamera funktioniert</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Gute Beleuchtung vorhanden</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Ruhige Umgebung</span>
            </label>
            <label className="checklist-item">
              <input type="checkbox" />
              <span>Keine Ablenkungen</span>
            </label>
          </div>
        </section>

        {/* Start Button */}
        <div className="start-section">
          <button 
            className="start-btn" 
            disabled={!cameraReady}
            onClick={handleStartSession}
          >
            <span className="start-icon">▶</span>
            <span>Session starten</span>
          </button>
          {!cameraReady && (
            <p className="start-hint">Teste zuerst deine Kamera</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionPrepare;

