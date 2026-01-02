/**
 * Sessions Page - Liste aller Sessions + Detail View
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './Sessions.css';

function Sessions() {
  const navigate = useNavigate();
  
  // Mock Data
  const sessions = [
    { id: 1, date: '2026-01-02', duration: 25, type: 'focus', confidence: 87, posture: 82, eyeContact: 91 },
    { id: 2, date: '2026-01-01', duration: 30, type: 'coach', confidence: 84, posture: 85, eyeContact: 83 },
    { id: 3, date: '2025-12-30', duration: 20, type: 'focus', confidence: 79, posture: 78, eyeContact: 80 },
    { id: 4, date: '2025-12-28', duration: 28, type: 'coach', confidence: 88, posture: 90, eyeContact: 86 },
    { id: 5, date: '2025-12-25', duration: 15, type: 'focus', confidence: 82, posture: 81, eyeContact: 83 },
  ];

  return (
    <div className="sessions-page">
      <div className="sessions-container">
        {/* Header */}
        <header className="sessions-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Zurück
            </button>
            <h1 className="sessions-title">Meine Sessions</h1>
          </div>
          <button 
            className="new-session-btn"
            onClick={() => navigate('/session-prepare')}
          >
            <span>+</span>
            <span>Neue Session</span>
          </button>
        </header>

        {/* Stats Overview */}
        <section className="sessions-stats">
          <div className="stat-card">
            <span className="stat-value">{sessions.length}</span>
            <span className="stat-label">Gesamt</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {Math.floor(sessions.reduce((acc, s) => acc + s.confidence, 0) / sessions.length)}%
            </span>
            <span className="stat-label">Ø Confidence</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
            </span>
            <span className="stat-label">Gesamtzeit</span>
          </div>
        </section>

        {/* Sessions List */}
        <section className="sessions-list">
          {sessions.map(session => (
            <div 
              key={session.id}
              className="session-card"
              onClick={() => navigate(`/session/${session.id}`, { state: { session } })}
            >
              <div className="session-card-header">
                <div className="session-date">
                  <span className="date-day">
                    {new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit' })}
                  </span>
                  <span className="date-month">
                    {new Date(session.date).toLocaleDateString('de-DE', { month: 'short' })}
                  </span>
                </div>
                <div className="session-meta">
                  <span className="session-type-badge">
                    {session.type === 'focus' ? '🎯' : '💬'}
                  </span>
                  <span className="session-duration">{session.duration} min</span>
                </div>
              </div>

              <div className="session-card-score">
                <div className="score-circle-small">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2d3748"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeDasharray={`${session.confidence}, 100`}
                    />
                  </svg>
                  <span className="score-value-small">{session.confidence}%</span>
                </div>
              </div>

              <div className="session-card-metrics">
                <div className="mini-metric">
                  <span className="mini-metric-label">Haltung</span>
                  <span className="mini-metric-value">{session.posture}%</span>
                </div>
                <div className="mini-metric">
                  <span className="mini-metric-label">Blick</span>
                  <span className="mini-metric-value">{session.eyeContact}%</span>
                </div>
              </div>

              <div className="session-card-arrow">→</div>
            </div>
          ))}
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Sessions;

