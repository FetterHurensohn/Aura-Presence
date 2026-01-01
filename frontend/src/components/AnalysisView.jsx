/**
 * Analysis View - Hauptkomponente für Video-Analyse
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoReceiver from './VideoReceiver';
import CanvasProcessor from './CanvasProcessor';
import FeedbackDisplay from './FeedbackDisplay';
import FPSMonitor from './FPSMonitor';
import SessionStats from './SessionStats';
import { sendAnalysis } from '../services/apiService';
import { showError, showInfo, showWarning } from '../services/toastService';
import { hasConsent } from '../services/consentService';
import './AnalysisView.css';

function AnalysisView({ user, onLogout }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [sessionStartTime] = useState(() => Date.now());
  const [videoSource, setVideoSource] = useState('camera'); // 'camera', 'demo', or 'upload'
  const [uploadedVideo, setUploadedVideo] = useState(null);
  
  // FPS & Detection Status
  const [fps, setFps] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState({
    pose: false,
    face: false,
    hands: false,
    handsCount: 0,
    confidence: 0
  });
  
  // Analysis State: 'idle', 'sending', 'processing', 'success', 'error'
  const [analysisState, setAnalysisState] = useState('idle');
  const [lastError, setLastError] = useState(null);
  
  // Feedback History für Trend-Visualisierung
  const feedbackHistoryRef = useRef([]);
  
  // VideoReceiver Ref für pause/resume
  const videoReceiverRef = useRef(null);
  
  const analysisIntervalRef = useRef(null);
  const featuresBufferRef = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  /**
   * Video-Upload Handler
   */
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      showError('Bitte wähle eine Video-Datei aus');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      showError('Video ist zu groß. Maximal 100MB erlaubt.');
      return;
    }

    // Create object URL for video
    const videoUrl = URL.createObjectURL(file);
    setUploadedVideo(videoUrl);
    setVideoSource('upload');
    showInfo(`Video "${file.name}" hochgeladen. Bereit zur Analyse.`);
  };

  /**
   * Cleanup uploaded video URL when component unmounts or video changes
   */
  useEffect(() => {
    return () => {
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo);
      }
    };
  }, [uploadedVideo]);

  /**
   * Analyse starten
   */
  const handleStartAnalysis = () => {
    // Consent-Check: Kamera & AI (nur für live camera, nicht für uploads)
    if (videoSource === 'camera' && !hasConsent('camera')) {
      showWarning('Bitte erteile deine Einwilligung für Kamera-Zugriff in den Cookie-Einstellungen.');
      return;
    }

    // Check if upload video is selected but no file uploaded
    if (videoSource === 'upload' && !uploadedVideo) {
      showWarning('Bitte lade zuerst ein Video hoch.');
      return;
    }
    
    setIsAnalyzing(true);
    featuresBufferRef.current = [];
    
    // Resume Video wenn pausiert
    if (videoReceiverRef.current && videoReceiverRef.current.isPaused) {
      videoReceiverRef.current.resume();
    }
    
    const sourceMessage = videoSource === 'camera' ? 'Positioniere dich vor der Kamera.' :
                          videoSource === 'upload' ? 'Analysiere dein hochgeladenes Video.' :
                          'Demo-Video wird analysiert.';
    showInfo(`Analyse gestartet. ${sourceMessage}`);

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
    
    // Pausiere Kamera/Video
    if (videoReceiverRef.current) {
      videoReceiverRef.current.pause();
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

    // State: Sending
    setAnalysisState('sending');

    try {
      // State: Processing
      setAnalysisState('processing');
      
      // Sende an Backend für Analyse
      const response = await sendAnalysis(aggregated, sessionId, {
        samplesCount: buffer.length
      });

      // State: Success
      setAnalysisState('success');
      setLatestFeedback(response);
      setLastError(null);
      
      // Füge zur History hinzu (max 20 Einträge)
      feedbackHistoryRef.current.push({
        timestamp: Date.now(),
        metrics: response.evaluation.metrics,
        confidence: response.evaluation.confidence
      });
      if (feedbackHistoryRef.current.length > 20) {
        feedbackHistoryRef.current.shift();
      }
      
      // Nach 1 Sekunde zurück zu idle
      setTimeout(() => {
        if (isAnalyzing) {
          setAnalysisState('idle');
        }
      }, 1000);

    } catch (err) {
      console.error('Fehler beim Senden der Analyse:', err);
      
      // State: Error
      setAnalysisState('error');
      setLastError(err);
      
      // Error-Toast wird automatisch von apiService angezeigt
      // Bei wiederholten Fehlern: Analyse stoppen
      if (err.response?.status >= 500) {
        handleStopAnalysis();
        showError('Analyse aufgrund von Server-Fehlern pausiert.');
      }
      
      // Nach 3 Sekunden zurück zu idle (wenn noch am Analysieren)
      setTimeout(() => {
        if (isAnalyzing) {
          setAnalysisState('idle');
        }
      }, 3000);
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
            {/* Analysis State Indicator */}
            {isAnalyzing && (
              <AnalysisStateIndicator 
                state={analysisState} 
                error={lastError}
              />
            )}
            
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
              <button 
                onClick={() => {
                  setVideoSource('upload');
                  fileInputRef.current?.click();
                }} 
                className={`btn ${videoSource === 'upload' ? 'btn-primary' : 'btn-outline'}`}
                disabled={isAnalyzing}
                title="Video hochladen und analysieren"
              >
                📁 Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
              />
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
            <h3>
              Video-Feed (
                {videoSource === 'camera' ? 'Live-Kamera' : 
                 videoSource === 'upload' ? 'Hochgeladenes Video' : 
                 'Demo-Video'})
            </h3>
            <VideoReceiver 
              ref={videoReceiverRef}
              videoSource={videoSource}
              uploadedVideoUrl={uploadedVideo}
            >
              {(videoRef) => (
                <>
                  <CanvasProcessor
                    videoRef={videoRef}
                    isAnalyzing={isAnalyzing}
                    onFeaturesExtracted={handleFeaturesExtracted}
                    onFpsUpdate={setFps}
                    onDetectionStatus={setDetectionStatus}
                  />
                  
                  {/* FPS Monitor Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    zIndex: 10 
                  }}>
                    <FPSMonitor fps={fps} showWarning={true} />
                  </div>

                  {/* Detection Status Badges */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px', 
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <DetectionBadge 
                      label="Pose" 
                      detected={detectionStatus.pose} 
                      color="#6c5ce7" 
                    />
                    <DetectionBadge 
                      label="Gesicht" 
                      detected={detectionStatus.face} 
                      color="#FF3030" 
                    />
                    <DetectionBadge 
                      label={detectionStatus.handsCount === 0 ? 'Hände' : `${detectionStatus.handsCount} Hand${detectionStatus.handsCount > 1 ? 'e' : ''}`}
                      detected={detectionStatus.hands} 
                      color="#4ECDC4" 
                    />
                  </div>
                </>
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
              feedbackHistory={feedbackHistoryRef.current}
            />
            
            {/* Session Statistics */}
            <div style={{ marginTop: '1.5rem' }}>
              <SessionStats 
                feedbackHistory={feedbackHistoryRef.current}
                sessionStartTime={sessionStartTime}
                isAnalyzing={isAnalyzing}
              />
            </div>
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

/**
 * Detection Badge Component
 * Zeigt an ob eine bestimmte Landmark-Gruppe erkannt wurde
 */
function DetectionBadge({ label, detected, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0.75rem',
      background: detected ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      fontSize: '0.875rem',
      color: detected ? color : '#888',
      fontWeight: detected ? '600' : '400',
      transition: 'all 0.3s ease',
      minWidth: '120px'
    }}>
      <span style={{ fontSize: '1rem' }}>
        {detected ? '✓' : '⚠'}
      </span>
      <span>{label}</span>
    </div>
  );
}

/**
 * Analysis State Indicator Component
 * Zeigt den aktuellen Status der Backend-Analyse
 */
function AnalysisStateIndicator({ state, error }) {
  const getStateConfig = () => {
    switch (state) {
      case 'sending':
        return {
          icon: '📤',
          text: 'Sende...',
          color: '#FFD93D',
          bg: 'rgba(255, 217, 61, 0.2)'
        };
      case 'processing':
        return {
          icon: '🔄',
          text: 'Analysiere...',
          color: '#8A63FF',
          bg: 'rgba(138, 99, 255, 0.2)',
          pulse: true
        };
      case 'success':
        return {
          icon: '✓',
          text: 'Erfolg',
          color: '#44FF9E',
          bg: 'rgba(68, 255, 158, 0.2)'
        };
      case 'error':
        return {
          icon: '⚠️',
          text: 'Fehler',
          color: '#FF5757',
          bg: 'rgba(255, 87, 87, 0.2)'
        };
      default: // idle
        return {
          icon: '⏸',
          text: 'Bereit',
          color: '#6B6B78',
          bg: 'rgba(107, 107, 120, 0.2)'
        };
    }
  };

  const config = getStateConfig();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: config.bg,
      border: `1px solid ${config.color}40`,
      borderRadius: '999px',
      color: config.color,
      fontSize: '0.875rem',
      fontWeight: '600',
      animation: config.pulse ? 'pulse 2s ease-in-out infinite' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <span style={{ fontSize: '1rem' }}>
        {config.icon}
      </span>
      <span>{config.text}</span>
    </div>
  );
}

export default AnalysisView;

