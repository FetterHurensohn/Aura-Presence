/**
 * Analysis View - Hauptkomponente für Video-Analyse
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoReceiver from './VideoReceiver';
import CanvasProcessor from './CanvasProcessor';
import FeedbackDisplay from './FeedbackDisplay';
import { sendAnalysis } from '../services/apiService';
import { showError, showInfo, showWarning } from '../services/toastService';
import { hasConsent } from '../services/consentService';
import './AnalysisView.css';

function AnalysisView({ user, onLogout }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [videoSource, setVideoSource] = useState('camera'); // 'camera' or 'demo'
  
  const analysisIntervalRef = useRef(null);
  const featuresBufferRef = useRef([]);

  useEffect(() => {
    return () => {
      // Cleanup
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  /**
   * Analyse starten
   */
  const handleStartAnalysis = () => {
    // Consent-Check: Kamera & AI
    if (!hasConsent('camera')) {
      showWarning('Bitte erteile deine Einwilligung für Kamera-Zugriff in den Cookie-Einstellungen.');
      return;
    }
    
    setIsAnalyzing(true);
    featuresBufferRef.current = [];
    
    showInfo('Analyse gestartet. Positioniere dich vor der Kamera.');

    // Sende alle 2 Sekunden aggregierte Features an Backend
    analysisIntervalRef.current = setInterval(() => {
      sendAggregatedFeatures();
    }, 2000);
  };

  /**
   * Analyse stoppen
   */
  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    showInfo('Analyse pausiert.');
  };

  /**
   * Features vom CanvasProcessor empfangen
   */
  const handleFeaturesExtracted = (features) => {
    setCurrentFeatures(features);
    
    // Features in Buffer sammeln
    if (isAnalyzing) {
      featuresBufferRef.current.push(features);
    }
  };

  /**
   * Aggregiere Features und sende an Backend
   */
  const sendAggregatedFeatures = async () => {
    const buffer = featuresBufferRef.current;
    
    if (buffer.length === 0) {
      return;
    }

    // Durchschnittswerte berechnen
    const aggregated = {
      eye_contact_estimate: avg(buffer.map(f => f.eye_contact_estimate)),
      blink_rate_estimate: avg(buffer.map(f => f.blink_rate_estimate)),
      mouth_open: buffer.filter(f => f.mouth_open).length > buffer.length / 2,
      hand_movement_freq: avg(buffer.map(f => f.hand_movement_freq)),
      posture_angle: avg(buffer.map(f => f.posture_angle)),
      frame_timestamp: Date.now()
    };

    // Buffer leeren
    featuresBufferRef.current = [];

    try {
      // Sende an Backend für Analyse
      const response = await sendAnalysis(aggregated, sessionId, {
        samplesCount: buffer.length
      });

      setLatestFeedback(response);

    } catch (err) {
      console.error('Fehler beim Senden der Analyse:', err);
      // Error-Toast wird automatisch von apiService angezeigt
      // Bei wiederholten Fehlern: Analyse stoppen
      if (err.response?.status >= 500) {
        handleStopAnalysis();
        showError('Analyse aufgrund von Server-Fehlern pausiert.');
      }
    }
  };

  /**
   * Hilfsfunktion: Durchschnitt berechnen
   */
  const avg = (arr) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  return (
    <div className="analysis-view">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            Aura Presence
          </Link>
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/analyze" className="navbar-link active">Analyse</Link>
            <button onClick={onLogout} className="btn btn-secondary">
              Abmelden
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="analysis-header">
          <h1>Live-Analyse</h1>
          <div className="analysis-controls">
            {/* Video Source Toggle */}
            <div className="video-source-toggle" style={{ marginRight: '1rem' }}>
              <button 
                onClick={() => setVideoSource('camera')} 
                className={`btn ${videoSource === 'camera' ? 'btn-primary' : 'btn-outline'}`}
                disabled={isAnalyzing}
                title="Live-Kamera verwenden"
              >
                📹 Kamera
              </button>
              <button 
                onClick={() => setVideoSource('demo')} 
                className={`btn ${videoSource === 'demo' ? 'btn-primary' : 'btn-outline'}`}
                disabled={isAnalyzing}
                title="Demo-Video für Testing"
              >
                🎬 Demo
              </button>
            </div>

            {/* Analysis Control */}
            {!isAnalyzing ? (
              <button 
                onClick={handleStartAnalysis} 
                className="btn btn-primary"
              >
                ▶ Analyse starten
              </button>
            ) : (
              <button 
                onClick={handleStopAnalysis} 
                className="btn btn-secondary"
              >
                ⏸ Analyse pausieren
              </button>
            )}
          </div>
        </div>

        {/* Video & Canvas Grid */}
        <div className="analysis-grid">
          {/* Video + Canvas */}
          <div className="video-section card">
            <h3>Video-Feed ({videoSource === 'camera' ? 'Live-Kamera' : 'Demo-Video'})</h3>
            <VideoReceiver videoSource={videoSource}>
              {(videoRef) => (
                <CanvasProcessor
                  videoRef={videoRef}
                  isAnalyzing={isAnalyzing}
                  onFeaturesExtracted={handleFeaturesExtracted}
                />
              )}
            </VideoReceiver>

            {/* Live Metrics */}
            {currentFeatures && (
              <div className="live-metrics">
                <h4>Live-Metriken</h4>
                <div className="metrics-grid">
                  {/* Face Mesh Metrics */}
                  {currentFeatures.eye_contact_quality !== undefined && (
                    <div className="metric">
                      <span className="metric-label">👁️ Augenkontakt:</span>
                      <span className="metric-value">
                        {(currentFeatures.eye_contact_quality * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {currentFeatures.blink_rate !== undefined && (
                    <div className="metric">
                      <span className="metric-label">👀 Blinzelrate:</span>
                      <span className="metric-value">
                        {currentFeatures.blink_rate}/min
                      </span>
                    </div>
                  )}
                  {currentFeatures.facial_expression && (
                    <div className="metric">
                      <span className="metric-label">😊 Ausdruck:</span>
                      <span className="metric-value">
                        {currentFeatures.facial_expression}
                      </span>
                    </div>
                  )}
                  
                  {/* Hands Metrics */}
                  {currentFeatures.hands_detected && (
                    <div className="metric">
                      <span className="metric-label">👋 Hände:</span>
                      <span className="metric-value">
                        {currentFeatures.hands_detected.length || 0}
                      </span>
                    </div>
                  )}
                  {currentFeatures.hand_movement_speed !== undefined && (
                    <div className="metric">
                      <span className="metric-label">✋ Bewegung:</span>
                      <span className="metric-value">
                        {currentFeatures.hand_movement_speed.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {/* Pose Metrics */}
                  {currentFeatures.posture_angle !== undefined && (
                    <div className="metric">
                      <span className="metric-label">🧍 Haltung:</span>
                      <span className="metric-value">
                        {currentFeatures.posture_angle}°
                      </span>
                    </div>
                  )}
                  {currentFeatures.hand_movement_freq !== undefined && (
                    <div className="metric">
                      <span className="metric-label">🤲 Gestik:</span>
                      <span className="metric-value">
                        {currentFeatures.hand_movement_freq.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Display */}
          <div className="feedback-section">
            <FeedbackDisplay 
              feedback={latestFeedback} 
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="card mt-4 info-box">
          <h4>🔒 Datenschutz-Hinweis</h4>
          <p>
            Alle Analysen erfolgen in Echtzeit. <strong>Es werden keine Videos oder Bilder gespeichert oder übertragen.</strong>
            Nur strukturierte, numerische Metriken werden zur Auswertung an unseren Server gesendet.
            MediaPipe-Verarbeitung findet vollständig lokal in deinem Browser statt.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisView;

