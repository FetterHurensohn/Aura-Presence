/**
 * Dashboard Component - Redesigned
 * Modern, mobile-first layout with bottom navigation
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../services/apiService';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Session Data (TODO: Replace with real API calls)
  const lastSession = {
    date: '2026-01-01',
    duration: '25 min',
    confidence: 87,
    posture: 82,
    eyeContact: 91
  };

  const recentSessions = [
    { id: 1, date: '2026-01-01', confidence: 87, duration: '25 min' },
    { id: 2, date: '2025-12-30', confidence: 84, duration: '30 min' },
    { id: 3, date: '2025-12-28', confidence: 79, duration: '20 min' },
    { id: 4, date: '2025-12-25', confidence: 88, duration: '28 min' },
  ];

  const weekTrend = '+5%'; // Mock trend

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

  const startSession = () => {
    navigate('/analyze');
  };

  return (
    <div className="dashboard-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-content">
          <span className="status-plan">
            {subscription?.role === 'pro' ? '⭐ Pro' : subscription?.role === 'enterprise' ? '💎 Enterprise' : '🆓 Free'}
          </span>
          <span className="status-divider">•</span>
          <span className="status-limit">
            {subscription?.limits?.analysisPerMonth === -1 
              ? 'Unbegrenzt' 
              : `${subscription?.usage?.analysisThisMonth || 0}/${subscription?.limits?.analysisPerMonth || 10} Sessions`}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="greeting">
            Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {user?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="status-text">
            {recentSessions.length > 0 
              ? `Deine letzte Sitzung war vor ${Math.floor(Math.random() * 5) + 1} Tagen` 
              : 'Starte deine erste Sitzung!'}
          </p>
        </header>

        {/* Primary Action */}
        <section className="primary-action">
          <button className="start-session-btn" onClick={startSession}>
            <div className="btn-icon">▶</div>
            <div className="btn-content">
              <h2 className="btn-title">Sitzung starten</h2>
              <p className="btn-description">Neue Analyse deiner Präsenz</p>
            </div>
            <div className="btn-arrow">→</div>
          </button>
        </section>

        {/* Last Session Summary */}
        {lastSession && (
          <section className="last-session">
            <div className="section-header">
              <h3 className="section-title">Letzte Sitzung</h3>
            </div>
            <div className="session-card">
              <div className="session-meta">
                <span className="session-date">{new Date(lastSession.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}</span>
                <span className="session-duration">{lastSession.duration}</span>
              </div>
              <div className="session-score">
                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="score-svg">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2d3748"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeDasharray={`${lastSession.confidence}, 100`}
                    />
                  </svg>
                  <div className="score-value">{lastSession.confidence}%</div>
                </div>
                <div className="score-label">Gesamt-Confidence</div>
              </div>
              <div className="session-metrics">
                <div className="metric">
                  <span className="metric-label">Körperhaltung</span>
                  <span className="metric-value">{lastSession.posture}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Blickkontakt</span>
                  <span className="metric-value">{lastSession.eyeContact}%</span>
                </div>
              </div>
              <Link to="/analyze" className="session-details-link">
                Details ansehen →
              </Link>
            </div>
          </section>
        )}

        {/* Recent Sessions */}
        <section className="recent-sessions">
          <div className="section-header">
            <h3 className="section-title">Verlauf</h3>
            <Link to="/analyze" className="section-link">Alle →</Link>
          </div>
          <div className="sessions-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-item-date">
                  {new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                </div>
                <div className="session-item-bar">
                  <div 
                    className="session-item-progress" 
                    style={{ width: `${session.confidence}%` }}
                  ></div>
                </div>
                <div className="session-item-score">{session.confidence}%</div>
                <div className="session-item-duration">{session.duration}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Insight Teaser */}
        <section className="insight-teaser">
          <div className="teaser-card">
            <h3 className="teaser-title">📈 Entwicklung (7 Tage)</h3>
            <div className="teaser-content">
              <div className="trend-indicator positive">
                <span className="trend-arrow">↗</span>
                <span className="trend-value">{weekTrend}</span>
              </div>
              <p className="trend-text">Deine Confidence verbessert sich stetig!</p>
            </div>
            <Link to="/analyze" className="teaser-link">
              Zu Insights →
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/dashboard" className="nav-item active">
          <div className="nav-icon">🏠</div>
          <div className="nav-label">Dashboard</div>
        </Link>
        <Link to="/analyze" className="nav-item">
          <div className="nav-icon">📊</div>
          <div className="nav-label">Sessions</div>
        </Link>
        <Link to="/analyze" className="nav-item">
          <div className="nav-icon">💡</div>
          <div className="nav-label">Insights</div>
        </Link>
        <Link to="/settings" className="nav-item">
          <div className="nav-icon">⚙️</div>
          <div className="nav-label">Account</div>
        </Link>
      </nav>
    </div>
  );
}

export default Dashboard;

