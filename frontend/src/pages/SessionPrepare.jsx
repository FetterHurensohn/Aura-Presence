/**
 * Session Prepare Page - Start-Seite vor der Analyse
 * EXAKT 1:1 nach Foto
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionPrepare.css';

function SessionPrepare({ user }) {
  const navigate = useNavigate();
  const [cameraStatus, setCameraStatus] = useState(true);
  const [microphoneStatus, setMicrophoneStatus] = useState(false);
  const [analyseMode, setAnalyseMode] = useState('Rede');
  const [fokusOptions, setFokusOptions] = useState([true, true, false]);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  // Check camera and microphone permissions
  useEffect(() => {
    checkDevices();
  }, []);

  const checkDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStatus(true);
      setMicrophoneStatus(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Device access error:', err);
      setCameraStatus(false);
      setMicrophoneStatus(false);
    }
  };

  const handleFokusToggle = (index) => {
    const newFokus = [...fokusOptions];
    newFokus[index] = !newFokus[index];
    setFokusOptions(newFokus);
  };

  const handleStart = () => {
    if (!privacyAccepted) {
      alert('Bitte akzeptiere die Datenschutzbestimmungen');
      return;
    }
    navigate('/live-session');
  };

  // Get user initial
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'J';
  };

  const analyseModes = [
    'Pitch',
    'Präsentation',
    'Interview',
    'Vortag',
    'Rede',
    'Verhandlung',
    'Verkaufsgespräch'
  ];

  return (
    <div className="session-prepare-new">
      {/* Account Button - fixiert */}
      <div className="prepare-account-btn" onClick={() => navigate('/account')}>
        {getUserInitial()}
      </div>

      {/* Content */}
      <div className="prepare-content">
        {/* Header */}
        <div className="prepare-header">
          <h1 className="prepare-title">Los Geht's!</h1>
          <p className="prepare-subtitle">Lass uns mit der Analyse starten</p>
        </div>

        {/* Technick-Check */}
        <section className="prepare-section">
          <h2 className="section-heading">Technick- Check</h2>
          <div className="tech-check-items">
            <div className="tech-check-row">
              <span className="tech-label">Kamera:</span>
              <span className={`tech-status ${cameraStatus ? 'success' : 'error'}`}>
                {cameraStatus ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                )}
              </span>
            </div>
            <div className="tech-check-row">
              <span className="tech-label">Mikrofon:</span>
              <span className={`tech-status ${microphoneStatus ? 'success' : 'error'}`}>
                {microphoneStatus ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                )}
              </span>
            </div>
          </div>
          <div className="tech-tip">
            <span>Achte auf eine gut-beleuchtete Umgebung</span>
            <span className="tip-icon">💡</span>
          </div>
        </section>

        {/* Analyse-Modus */}
        <section className="prepare-section">
          <h2 className="section-heading">Analyse-Modus</h2>
          <div className="analyse-modes">
            {analyseModes.map((mode) => (
              <div 
                key={mode}
                className="mode-option"
                onClick={() => setAnalyseMode(mode)}
              >
                <div className={`mode-radio ${analyseMode === mode ? 'selected' : ''}`}>
                  {analyseMode === mode && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <span className="mode-label">{mode}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fokus (optional) */}
        <section className="prepare-section">
          <h2 className="section-heading">Fokus (optional)</h2>
          <div className="fokus-options">
            {fokusOptions.map((checked, index) => (
              <div 
                key={index}
                className="fokus-option"
                onClick={() => handleFokusToggle(index)}
              >
                <div className={`fokus-checkbox ${checked ? 'checked' : ''}`}>
                  {checked && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <span className="fokus-label">Verhandlung</span>
              </div>
            ))}
          </div>
        </section>

        {/* Datenschutz */}
        <section className="prepare-section">
          <h2 className="section-heading">Datenschutz</h2>
          <div className="privacy-option">
            <div 
              className={`privacy-checkbox ${privacyAccepted ? 'checked' : ''}`}
              onClick={() => setPrivacyAccepted(!privacyAccepted)}
            >
              {privacyAccepted && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </div>
            <span className="privacy-text">
              Ich stimme der Analyse zur Verarbeitung und Auswertung des Videomaterials zu. Die Videos werden nicht auf externen Server gespeichert. <span className="privacy-link" onClick={() => navigate('/privacy-policy')}>Mehr erfahren</span>
            </span>
          </div>
        </section>

        {/* Analyse starten Button */}
        <div className="prepare-action">
          <button className="start-analyse-btn" onClick={handleStart}>
            Analyse starten
          </button>
        </div>

        {/* Spacer für Bottom Nav */}
        <div style={{ height: '100px' }}></div>
      </div>

      {/* MENUBAR - GLEICH WIE DASHBOARD */}
      <nav className="menubar-new">
        {/* Links: Linie ÜBER Icons */}
        <div className="menubar-left">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,5.724V2c0-.552-.447-1-1-1s-1,.448-1,1v2.366L14.797,.855c-1.699-1.146-3.895-1.146-5.594,0L2.203,5.579c-1.379,.931-2.203,2.48-2.203,4.145v9.276c0,2.757,2.243,5,5,5h3c.553,0,1-.448,1-1V15c0-.551,.448-1,1-1h4c.552,0,1,.449,1,1v8c0,.552,.447,1,1,1h3c2.757,0,5-2.243,5-5V9.724c0-1.581-.744-3.058-2-4Zm0,13.276c0,1.654-1.346,3-3,3h-2v-7c0-1.654-1.346-3-3-3h-4c-1.654,0-3,1.346-3,3v7h-2c-1.654,0-3-1.346-3-3V9.724c0-.999,.494-1.929,1.322-2.487L10.322,2.513c1.02-.688,2.336-.688,3.355,0l7,4.724c.828,.558,1.322,1.488,1.322,2.487v9.276Z"/>
              </svg>
            </button>
            <button className="menubar-icon" onClick={() => navigate('/sessions')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m16,10.111l-7,3.889v-7.778l7,3.889Zm8,7.889c0,3.309-2.691,6-6,6s-6-2.691-6-6,2.691-6,6-6,6,2.691,6,6Zm-2,0c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Zm-3-3h-2v3.423l2.079,2.019,1.393-1.435-1.472-1.43v-2.577ZM21,0H3C1.346,0,0,1.346,0,3v17h10.262c-.165-.64-.262-1.308-.262-2H2V3c0-.551.448-1,1-1h18c.552,0,1,.449,1,1v8.079c.754.437,1.428.992,2,1.642V3c0-1.654-1.346-3-3-3Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mitte: Großer Button */}
        <button className="menubar-center-btn" onClick={handleStart}>
          <svg viewBox="0 0 24 24" fill="white">
            <path d="m16.395,10.122l-5.192-2.843c-.673-.379-1.473-.372-2.138.017-.667.39-1.064,1.083-1.064,1.855v5.699c0,.772.397,1.465,1.064,1.855.34.199.714.297,1.087.297.358,0,.716-.091,1.041-.274l5.212-2.854c.687-.386,1.096-1.086,1.096-1.873s-.409-1.487-1.105-1.878Zm-.961,2.003l-5.212,2.855c-.019.01-.077.042-.147-.001-.074-.043-.074-.107-.074-.128v-5.699c0-.021,0-.085.074-.128.027-.016.052-.021.074-.021.036,0,.065.016.083.026l5.192,2.844c.019.011.076.043.076.13s-.058.119-.066.125ZM12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Z"/>
          </svg>
        </button>

        {/* Rechts: Linie ÜBER Icons */}
        <div className="menubar-right">
          <div className="menubar-line"></div>
          <div className="menubar-icons">
            <button className="menubar-icon" onClick={() => navigate('/insights')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23,22H5a3,3,0,0,1-3-3V1A1,1,0,0,0,0,1V19a5.006,5.006,0,0,0,5,5H23a1,1,0,0,0,0-2Z"/><path d="M6,20a1,1,0,0,0,1-1V12a1,1,0,0,0-2,0v7A1,1,0,0,0,6,20Z"/><path d="M10,10v9a1,1,0,0,0,2,0V10a1,1,0,0,0-2,0Z"/><path d="M15,13v6a1,1,0,0,0,2,0V13a1,1,0,0,0-2,0Z"/><path d="M20,9V19a1,1,0,0,0,2,0V9a1,1,0,0,0-2,0Z"/><path d="M6,9a1,1,0,0,0,.707-.293l3.586-3.586a1.025,1.025,0,0,1,1.414,0l2.172,2.172a3,3,0,0,0,4.242,0l5.586-5.586A1,1,0,0,0,22.293.293L16.707,5.878a1,1,0,0,1-1.414,0L13.121,3.707a3,3,0,0,0-4.242,0L5.293,7.293A1,1,0,0,0,6,9Z"/>
              </svg>
            </button>
            <button className="menubar-icon" onClick={() => navigate('/account')}>
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

export default SessionPrepare;
