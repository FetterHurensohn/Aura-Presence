/**
 * Analysis Result Page - Score und Feedback
 * EXAKT 1:1 nach Foto
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AnalysisResult.css';

function AnalysisResult({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result || {};

  // Mock Data
  const score = result.score || 101;
  const sessionType = result.type || 'Präsentation:';
  
  const metrics = {
    mimik: result.mimik || 29,
    stimme: result.stimme || 29,
    augenkontakt: result.augenkontakt || 29,
    gestik: result.gestik || 29
  };

  const feedback = {
    pause: true,
    stottern: false,
    haende: false,
    mikrofon: false
  };

  const improvements = [
    'Still stehen',
    'Kopf gerade halten',
    'Blick aufs Publikum richten',
    'Weniger Stottern'
  ];

  // Get user initial
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'J';
  };

  const handleRepeat = () => {
    navigate('/session-prepare');
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="analysis-result-page">
      {/* Account Button - fixiert */}
      <div className="result-account-btn" onClick={() => navigate('/account')}>
        {getUserInitial()}
      </div>

      {/* Content */}
      <div className="result-content">
        {/* Score Circle */}
        <div className="result-score-container">
          <div className="result-score-label">{sessionType}</div>
          <div className="result-score-circle">
            <svg viewBox="0 0 200 200" className="result-score-svg">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="20"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#resultScoreGradient)"
                strokeWidth="20"
                strokeDasharray={`${(score / 120) * 534} 534`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <defs>
                <linearGradient id="resultScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0E7CB8" />
                  <stop offset="100%" stopColor="#330B91" />
                </linearGradient>
              </defs>
            </svg>
            <div className="result-score-content">
              <div className="result-score-number">{score}</div>
              <div className="result-score-text">Punkte</div>
            </div>
          </div>
        </div>

        {/* Zusammenfassung */}
        <section className="result-section">
          <h2 className="result-section-title">Zusammenfassung</h2>
          
          <div className="result-metrics-grid">
            {/* Mimik */}
            <div className="result-metric-card">
              <div className="metric-header">
                <svg className="metric-icon" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                  <path d="M8 14 Q12 16 16 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="metric-label">Mimik:</span>
              </div>
              <div className="metric-bar-container">
                <div className="metric-bar" style={{ width: `${metrics.mimik}%` }}></div>
              </div>
              <span className="metric-value">{metrics.mimik}%</span>
            </div>

            {/* Stimme */}
            <div className="result-metric-card">
              <div className="metric-header">
                <svg className="metric-icon" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M256,352c38.4,0,70.4-32,70.4-70.4V102.4C326.4,64,294.4,32,256,32s-70.4,32-70.4,70.4v179.2C185.6,320,217.6,352,256,352z M352,204.8h-19.2v76.8c0,41.6-35.2,76.8-76.8,76.8s-76.8-35.2-76.8-76.8v-76.8H160v76.8c0,51.2,38.4,92.8,86.4,99.2v44.8h-44.8V448h108.8v-22.4h-44.8v-44.8C313.6,374.4,352,332.8,352,281.6V204.8z"/>
                </svg>
                <span className="metric-label">Stimme:</span>
              </div>
              <div className="metric-bar-container">
                <div className="metric-bar" style={{ width: `${metrics.stimme}%` }}></div>
              </div>
              <span className="metric-value">{metrics.stimme}%</span>
            </div>

            {/* Augenkontakt */}
            <div className="result-metric-card">
              <div className="metric-header">
                <svg className="metric-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,5C5.636,5,1.111,11.25,1.111,12S5.636,19,12,19s10.889-6.25,10.889-7S18.364,5,12,5Zm0,11.556A4.556,4.556,0,1,1,16.556,12,4.561,4.561,0,0,1,12,16.556Z"/>
                  <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
                </svg>
                <span className="metric-label">Augenkontakt:</span>
              </div>
              <div className="metric-bar-container">
                <div className="metric-bar" style={{ width: `${metrics.augenkontakt}%` }}></div>
              </div>
              <span className="metric-value">{metrics.augenkontakt}%</span>
            </div>

            {/* Gestik */}
            <div className="result-metric-card">
              <div className="metric-header">
                <svg className="metric-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8H18V6a2,2,0,0,0-4,0V8H12V5a2,2,0,0,0-4,0V8H6a2,2,0,0,0,0,4H8v3H6a2,2,0,0,0,0,4H8v1a2,2,0,0,0,4,0V19h2v1a2,2,0,0,0,4,0V19h2a2,2,0,0,0,0-4H18V12h2a2,2,0,0,0,0-4Z"/>
                </svg>
                <span className="metric-label">Gestik:</span>
              </div>
              <div className="metric-bar-container">
                <div className="metric-bar" style={{ width: `${metrics.gestik}%` }}></div>
              </div>
              <span className="metric-value">{metrics.gestik}%</span>
            </div>
          </div>
        </section>

        {/* Feedback */}
        <section className="result-section">
          <h2 className="result-section-title">Feedback</h2>
          
          <div className="feedback-items">
            <div className="feedback-item">
              <span className="feedback-label">Pause:</span>
              <div className={`feedback-status ${feedback.pause ? 'success' : 'error'}`}>
                {feedback.pause ? '✓' : '✗'}
              </div>
            </div>
            <div className="feedback-item">
              <span className="feedback-label">Stottern:</span>
              <div className={`feedback-status ${feedback.stottern ? 'success' : 'error'}`}>
                {feedback.stottern ? '✓' : '✗'}
              </div>
            </div>
            <div className="feedback-item">
              <span className="feedback-label">Hände:</span>
              <div className={`feedback-status ${feedback.haende ? 'success' : 'error'}`}>
                {feedback.haende ? '✓' : '✗'}
              </div>
            </div>
            <div className="feedback-item">
              <span className="feedback-label">Mikrofon:</span>
              <div className={`feedback-status ${feedback.mikrofon ? 'success' : 'error'}`}>
                {feedback.mikrofon ? '✓' : '✗'}
              </div>
            </div>
          </div>

          <div className="feedback-tip">
            <span className="tip-text">Achte auf eine gut-beleuchtete Umgebung</span>
            <span className="tip-icon">💡</span>
          </div>
        </section>

        {/* Verbessern */}
        <section className="result-section">
          <h2 className="result-section-title">Verbessern</h2>
          
          <ul className="improvement-list">
            {improvements.map((item, index) => (
              <li key={index} className="improvement-item">{item}</li>
            ))}
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="result-actions">
          <button className="result-btn result-btn-primary" onClick={handleRepeat}>
            Wiederholen
          </button>
          <button className="result-btn result-btn-secondary" onClick={handleHome}>
            Startseite
          </button>
        </div>

        {/* Spacer für Bottom Nav */}
        <div style={{ height: '100px' }}></div>
      </div>

      {/* MENUBAR */}
      <nav className="menubar-new">
        <div className="menubar-left">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,5.724V2c0-.552-.447-1-1-1s-1,.448-1,1v2.366L14.797,.855c-1.699-1.146-3.895-1.146-5.594,0L2.203,5.579c-1.379,.931-2.203,2.48-2.203,4.145v9.276c0,2.757,2.243,5,5,5h3c.553,0,1-.448,1-1V15c0-.551,.448-1,1-1h4c.552,0,1,.449,1,1v8c0,.552,.447,1,1,1h3c2.757,0,5-2.243,5-5V9.724c0-1.581-.744-3.058-2-4Zm0,13.276c0,1.654-1.346,3-3,3h-2v-7c0-1.654-1.346-3-3-3h-4c-1.654,0-3,1.346-3,3v7h-2c-1.654,0-3-1.346-3-3V9.724c0-.999,.494-1.929,1.322-2.487L10.322,2.513c1.02-.688,2.336-.688,3.355,0l7,4.724c.828,.558,1.322,1.488,1.322,2.487v9.276Z"/>
              </svg>
            </button>
            <button className="menubar-icon active" onClick={() => navigate('/sessions')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m16,10.111l-7,3.889v-7.778l7,3.889Zm8,7.889c0,3.309-2.691,6-6,6s-6-2.691-6-6,2.691-6,6-6,6,2.691,6,6Zm-2,0c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Zm-3-3h-2v3.423l2.079,2.019,1.393-1.435-1.472-1.43v-2.577ZM21,0H3C1.346,0,0,1.346,0,3v17h10.262c-.165-.64-.262-1.308-.262-2H2V3c0-.551.448-1,1-1h18c.552,0,1,.449,1,1v8.079c.754.437,1.428.992,2,1.642V3c0-1.654-1.346-3-3-3Z"/>
              </svg>
            </button>
          </div>
        </div>

        <button className="menubar-center-btn" onClick={() => navigate('/session-prepare')}>
          <svg viewBox="0 0 24 24" fill="white">
            <path d="m16.395,10.122l-5.192-2.843c-.673-.379-1.473-.372-2.138.017-.667.39-1.064,1.083-1.064,1.855v5.699c0,.772.397,1.465,1.064,1.855.34.199.714.297,1.087.297.358,0,.716-.091,1.041-.274l5.212-2.854c.687-.386,1.096-1.086,1.096-1.873s-.409-1.487-1.105-1.878Zm-.961,2.003l-5.212,2.855c-.019.01-.077.042-.147-.001-.074-.043-.074-.107-.074-.128v-5.699c0-.021,0-.085.074-.128.027-.016.052-.021.074-.021.036,0,.065.016.083.026l5.192,2.844c.019.011.076.043.076.13s-.058.119-.066.125ZM12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Z"/>
          </svg>
        </button>

        <div className="menubar-right">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/insights')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23,22H5a3,3,0,0,1-3-3V1A1,1,0,0,0,0,1V19a5.006,5.006,0,0,0,5,5H23a1,1,0,0,0,0-2Z"/><path d="M6,20a1,1,0,0,0,1-1V12a1,1,0,0,0-2,0v7A1,1,0,0,0,6,20Z"/><path d="M10,10v9a1,1,0,0,0,2,0V10a1,1,0,0,0-2,0Z"/><path d="M15,13v6a1,1,0,0,0,2,0V13a1,1,0,0,0-2,0Z"/><path d="M20,9V19a1,1,0,0,0,2,0V9a1,1,0,0,0-2,0Z"/><path d="M6,9a1,1,0,0,0,.707-.293l3.586-3.586a1.025,1.025,0,0,1,1.414,0l2.172,2.172a3,3,0,0,0,4.242,0l5.586-5.586A1,1,0,0,0,22.293.293L16.707,5.878a1,1,0,0,1-1.414,0L13.121,3.707a3,3,0,0,0-4.242,0L5.293,7.293A1,1,0,0,0,6,9Z"/>
              </svg>
            </button>
            <button className="menubar-icon" onClick={() => navigate('/courses')}>
              <svg viewBox="0 0 512 512" fill="currentColor">
                <path d="M470.549,111.573L313.237,36.629c-34.628-20.684-77.728-21.051-112.704-0.96L41.451,111.573c-0.597,0.299-1.216,0.619-1.792,0.96c-37.752,21.586-50.858,69.689-29.272,107.441c7.317,12.798,18.08,23.284,31.064,30.266l43.883,20.907V375.68c0.026,46.743,30.441,88.039,75.072,101.931c31.059,8.985,63.264,13.384,95.595,13.056c32.326,0.362,64.531-4,95.595-12.949c44.631-13.891,75.046-55.188,75.072-101.931V271.104l42.667-20.395v175.957c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333v-256C512.143,145.615,492.363,122.473,470.549,111.573z M384,375.787c0.011,27.959-18.129,52.69-44.8,61.077c-27.046,7.728-55.073,11.479-83.2,11.136c-28.127,0.343-56.154-3.408-83.2-11.136c-26.671-8.388-44.811-33.118-44.8-61.077v-84.309l70.763,33.707c17.46,10.368,37.401,15.816,57.707,15.765c19.328,0.137,38.331-4.98,54.976-14.805L384,291.477V375.787z M452.267,211.733l-160.896,76.8c-22.434,13.063-50.241,12.693-72.32-0.96l-157.419-74.88c-17.547-9.462-24.101-31.357-14.639-48.903c3.2-5.934,7.998-10.853,13.85-14.201l159.893-76.373c22.441-13.034,50.233-12.665,72.32,0.96l157.312,74.944c11.569,6.424,18.807,18.555,18.965,31.787C469.354,193.441,462.9,205.097,452.267,211.733L452.267,211.733z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AnalysisResult;
