/**
 * Dashboard Component - EXAKT 1:1 nach neuem Mockup
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../services/apiService';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Session Data
  const lastSession = {
    date: '01.01.2026',
    type: 'Pitch',
    metrics: {
      augenkontakt: 100,
      inhalt: 100,
      gestik: 100,
      stimme: 100,
      mimik: 100
    }
  };

  const weekData = [
    { day: 'Mon', value: 29 },
    { day: 'Tue', value: 29 },
    { day: 'Wed', value: 29 },
    { day: 'Thu', value: 29 },
    { day: 'Fri', value: 29 },
    { day: 'Sat', value: 29 },
    { day: 'Sun', value: 29 }
  ];

  const presentations = [
    { title: 'Präsentation', value: 29 },
    { title: 'Präsentation', value: 29 },
    { title: 'Präsentation', value: 29 },
    { title: 'Präsentation', value: 29 },
    { title: 'Präsentation', value: 29 }
  ];

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

  const handleStartSession = () => {
    navigate('/session-prepare');
  };

  // Get user initial
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="dashboard-new">
      {/* Header mit Profil-Avatar */}
      <div className="dashboard-header-new">
        <div className="user-avatar" onClick={() => navigate('/account')}>
          {getUserInitial()}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content-new">
        {/* Greeting Section */}
        <div className="greeting-section">
          <h1 className="greeting-title">Guten Tag,</h1>
          <p className="greeting-subtitle">Bereit für eine neue Sitzung?</p>
          <button className="start-button" onClick={handleStartSession}>
            Starten
          </button>
        </div>

        {/* Sessions Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Sessions</h2>
          <div className="session-card">
            <div className="session-header">
              <div>
                <h3 className="session-title">Letzte Sitzung</h3>
                <p className="session-date">{lastSession.date}</p>
                <p className="session-type">{lastSession.type}</p>
              </div>
              <div className="session-thumbnail"></div>
            </div>
            <div className="session-metrics">
              <div className="metric-row">
                <span className="metric-label">Augenkontakt:</span>
                <span className="metric-value">{lastSession.metrics.augenkontakt}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Inhalt:</span>
                <span className="metric-value">{lastSession.metrics.inhalt}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Gestik:</span>
                <span className="metric-value">{lastSession.metrics.gestik}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Stimme:</span>
                <span className="metric-value">{lastSession.metrics.stimme}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Mimik:</span>
                <span className="metric-value">{lastSession.metrics.mimik}</span>
              </div>
            </div>
            <button className="details-link" onClick={() => navigate('/sessions')}>
              Details ansehen
            </button>
          </div>
        </section>

        {/* Kurse Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Kurse</h2>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-thumbnail"></div>
              <p className="course-title">Pitch</p>
            </div>
            <div className="course-card">
              <div className="course-thumbnail"></div>
              <p className="course-title">Pitch</p>
            </div>
          </div>
        </section>

        {/* Statistik Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Statistik</h2>
          
          {/* Bar Chart */}
          <div className="chart-container">
            <div className="chart-bars">
              {weekData.map((item, index) => (
                <div key={index} className="chart-bar-wrapper">
                  <div className="chart-bar-label">{item.value}%</div>
                  <div className="chart-bar" style={{ height: `${item.value * 2}px` }}></div>
                  <div className="chart-day-label">{item.day}</div>
                </div>
              ))}
              {/* Green Line */}
              <svg className="chart-line" viewBox="0 0 320 80" preserveAspectRatio="none">
                <polyline
                  points="20,40 60,50 100,45 140,55 180,35 220,50 260,45 300,40"
                  fill="none"
                  stroke="#007A5A"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Presentation List */}
          <div className="presentation-list">
            {presentations.map((item, index) => (
              <div key={index} className="presentation-item">
                <span className="presentation-label">{item.title}</span>
                <div className="presentation-bar-container">
                  <div className="presentation-bar" style={{ width: `${item.value}%` }}></div>
                </div>
                <span className="presentation-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Spacer für Bottom Nav */}
        <div style={{ height: '100px' }}></div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-new">
        <button className="nav-btn" onClick={() => navigate('/dashboard')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="nav-btn" onClick={() => navigate('/sessions')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </button>
        <button className="nav-btn-center" onClick={handleStartSession}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button className="nav-btn" onClick={() => navigate('/insights')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v8H3v-8zm4-5h2v13H7V8zm4-2h2v15h-2V6zm4-3h2v18h-2V3z"/>
          </svg>
        </button>
        <button className="nav-btn" onClick={() => navigate('/account')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default Dashboard;
