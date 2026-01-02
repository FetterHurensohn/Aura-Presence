/**
 * Live Session Page - Echtzeit-Analyse während der Aufnahme
 * EXAKT 1:1 nach Foto
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveSession.css';

function LiveSession() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Realtime Scores
  const [scores, setScores] = useState({
    mimik: 29,
    stimme: 29,
    augenkontakt: 29,
    koerperhaltung: 29
  });

  // KI-Tutor Feedback
  const [aiFeedback, setAiFeedback] = useState([
    'Stehe stiller',
    'Kopf gerade',
    'Schau zum Publikum',
    'Stottern!'
  ]);

  // Timer
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
      }
    };
    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
  };

  const handleToggleCamera = () => {
    setCameraOn(!cameraOn);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getVideoTracks().forEach(track => {
        track.enabled = !cameraOn;
      });
    }
  };

  const handleToggleMicrophone = () => {
    setMicrophoneOn(!microphoneOn);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getAudioTracks().forEach(track => {
        track.enabled = !microphoneOn;
      });
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    // Navigate to analysis result
    navigate('/analysis-result');
  };

  return (
    <div className="live-session-new">
      {/* Camera Feed - Full Screen */}
      <video 
        ref={videoRef}
        className="camera-feed"
        autoPlay 
        playsInline 
        muted
      />

      {/* KI-Tutor Sprechblase - Oben Rechts */}
      <div className="ai-tutor-bubble">
        <h3 className="ai-tutor-title">KI-Tutor</h3>
        <ul className="ai-feedback-list">
          {aiFeedback.map((feedback, index) => (
            <li key={index}>{feedback}</li>
          ))}
        </ul>
      </div>

      {/* Progress Bars - Rechts */}
      <div className="progress-bars-container">
        {/* Mimik */}
        <div className="progress-bar-item">
          <div className="progress-icon">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M9,11.75A1.25,1.25 0 0,0 7.75,13A1.25,1.25 0 0,0 9,14.25A1.25,1.25 0 0,0 10.25,13A1.25,1.25 0 0,0 9,11.75M15,11.75A1.25,1.25 0 0,0 13.75,13A1.25,1.25 0 0,0 15,14.25A1.25,1.25 0 0,0 16.25,13A1.25,1.25 0 0,0 15,11.75M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,11.71 4,11.42 4.05,11.14C6.41,10.09 8.28,8.16 9.26,5.77C11.07,8.33 14.05,10 17.42,10C18.2,10 18.95,9.91 19.67,9.74C19.88,10.45 20,11.21 20,12C20,16.41 16.41,20 12,20Z"/>
            </svg>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${scores.mimik}%` }}></div>
          </div>
          <span className="progress-value">{scores.mimik}%</span>
        </div>

        {/* Stimme */}
        <div className="progress-bar-item">
          <div className="progress-icon">
            <svg viewBox="0 0 484.5 484.5" fill="white">
              <path d="M242.25,306c43.35,0,76.5-33.15,76.5-76.5v-153c0-43.35-33.15-76.5-76.5-76.5c-43.35,0-76.5,33.15-76.5,76.5v153C165.75,272.85,198.9,306,242.25,306z M377.4,229.5c0,76.5-63.75,130.05-135.15,130.05c-71.4,0-135.15-53.55-135.15-130.05H63.75c0,86.7,68.85,158.1,153,170.85v84.15h51v-84.15c84.15-12.75,153-84.149,153-170.85H377.4L377.4,229.5z"/>
            </svg>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${scores.stimme}%` }}></div>
          </div>
          <span className="progress-value">{scores.stimme}%</span>
        </div>

        {/* Augenkontakt */}
        <div className="progress-bar-item">
          <div className="progress-icon">
            <svg viewBox="0 0 64 64" fill="white">
              <path d="M32 22.5C28.0415 22.5 23.7233 24.7207 20.572 26.7364C18.9575 27.7691 17.5722 28.7992 16.5907 29.5707C16.0991 29.957 15.7069 30.2801 15.4355 30.5082C15.2998 30.6223 15.1943 30.7128 15.1215 30.7758C15.0852 30.8072 15.057 30.8318 15.0373 30.849L15.0143 30.8693L15.0077 30.8752L15.0049 30.8776C14.6841 31.1623 14.5 31.5711 14.5 32C14.5 32.4289 14.6836 32.8372 15.0043 33.1219L16 32C15.0043 33.1219 15.0056 33.123 15.0056 33.123L15.0077 33.1248L15.0143 33.1307L15.0373 33.151C15.057 33.1682 15.0852 33.1928 15.1215 33.2242C15.1943 33.2872 15.2998 33.3777 15.4355 33.4918C15.7069 33.7199 16.0991 34.043 16.5907 34.4293C17.5722 35.2008 18.9575 36.2309 20.572 37.2636C23.7233 39.2793 28.0415 41.5 32 41.5C35.9585 41.5 40.2767 39.2793 43.428 37.2636C45.0425 36.2309 46.4278 35.2008 47.4093 34.4293C47.9009 34.043 48.2931 33.7199 48.5645 33.4918C48.7002 33.3777 48.8057 33.2872 48.8785 33.2242C48.9148 33.1928 48.943 33.1682 48.9627 33.151L48.9857 33.1307L48.9923 33.1248L48.9951 33.1224C49.3159 32.8377 49.5 32.4289 49.5 32C49.5 31.5711 49.3164 31.1628 48.9957 30.8781L48 32C48.9957 30.8781 48.9944 30.877 48.9944 30.877L48.9923 30.8752L48.9857 30.8693L48.9627 30.849C48.943 30.8318 48.9148 30.8072 48.8785 30.7758C48.8057 30.7128 48.7002 30.6223 48.5645 30.5082C48.2931 30.2801 47.9009 29.957 47.4093 29.5707C46.4278 28.7992 45.0425 27.7691 43.428 26.7364C40.2767 24.7207 35.9585 22.5 32 22.5ZM48 32L48.9951 33.1224C48.9951 33.1224 48.9957 33.1219 48 32ZM16 32L15.0049 30.8776C15.0049 30.8776 15.0043 30.8781 16 32ZM18.4445 32.0707L18.3548 32L18.4445 31.9293C19.3715 31.2008 20.6763 30.2309 22.1885 29.2636C23.9697 28.1243 25.9419 27.0526 27.8715 26.3465C26.1307 27.6199 25 29.6779 25 32C25 34.3221 26.1307 36.3801 27.8715 37.6535C25.9419 36.9474 23.9697 35.8757 22.1885 34.7364C20.6763 33.7691 19.3715 32.7992 18.4445 32.0707ZM36.1285 37.6535C38.0581 36.9474 40.0303 35.8757 41.8115 34.7364C43.3237 33.7691 44.6285 32.7992 45.5555 32.0707L45.6452 32L45.5555 31.9293C44.6285 31.2008 43.3237 30.2309 41.8115 29.2636C40.0303 28.1243 38.0581 27.0526 36.1285 26.3465C37.8693 27.6199 39 29.6779 39 32C39 34.3221 37.8693 36.3801 36.1285 37.6535ZM36 32C36 34.2091 34.2091 36 32 36C29.7909 36 28 34.2091 28 32C28 29.7909 29.7909 28 32 28C34.2091 28 36 29.7909 36 32Z"/>
            </svg>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${scores.augenkontakt}%` }}></div>
          </div>
          <span className="progress-value">{scores.augenkontakt}%</span>
        </div>

        {/* Körperhaltung */}
        <div className="progress-bar-item">
          <div className="progress-icon">
            <svg viewBox="0 0 42 42" fill="white">
              <path d="M 24.46875 0.75 C 22.535753 0.75 20.96875 2.317006 20.96875 4.25 C 20.96875 6.182994 22.535753 7.75 24.46875 7.75 C 26.401747 7.75 27.96875 6.182994 27.96875 4.25 C 27.96875 2.317006 26.401747 0.75 24.46875 0.75 z M 24.46875 8.75 C 22.86615 8.75 21.484729 9.5822916 20.6875 10.84375 L 17.375 13.75 L 11.5 13.78125 A 1.50015 1.50015 0 1 0 11.5 16.78125 L 17.9375 16.75 A 1.50015 1.50015 0 0 0 18.9375 16.375 L 20.1875 15.28125 L 20.96875 24.75 L 20.96875 30.75 L 20.96875 39.75 A 1.50015 1.50015 0 1 0 23.96875 39.75 L 23.96875 30.75 L 23.96875 24.75 L 24.96875 24.75 L 24.96875 30.75 L 24.96875 39.75 A 1.50015 1.50015 0 1 0 27.96875 39.75 L 27.96875 30.75 L 27.96875 24.75 L 28.15625 22.53125 A 1.50015 1.50015 0 0 0 30.25 22.21875 L 34.03125 17.8125 A 1.50015 1.50015 0 0 0 33.875 15.71875 L 28.25 10.78125 L 28.21875 10.71875 C 27.410068 9.5217421 26.022051 8.75 24.46875 8.75 z M 28.75 15.21875 L 30.78125 17 L 28.375 19.8125 L 28.75 15.21875 z"/>
            </svg>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${scores.koerperhaltung}%` }}></div>
          </div>
          <span className="progress-value">{scores.koerperhaltung}%</span>
        </div>
      </div>

      {/* Timer - Unten Mitte */}
      <div className="session-timer">
        {formatTime(elapsedTime)}
      </div>

      {/* Control Buttons - Unten Mitte */}
      <div className="control-buttons">
        <button className="control-btn" onClick={handlePlayPause}>
          {isPaused ? (
            <svg viewBox="0 0 32 32" fill="white">
              <path d="M26.78,13.45,11.58,4A3,3,0,0,0,7,6.59V25.41a3,3,0,0,0,3,3A3,3,0,0,0,11.58,28l15.2-9.41a3,3,0,0,0,0-5.1Z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          )}
        </button>

        <button className="control-btn" onClick={handleToggleMicrophone}>
          <svg viewBox="0 0 484.5 484.5" fill="white">
            <path d="M242.25,306c43.35,0,76.5-33.15,76.5-76.5v-153c0-43.35-33.15-76.5-76.5-76.5c-43.35,0-76.5,33.15-76.5,76.5v153C165.75,272.85,198.9,306,242.25,306z M377.4,229.5c0,76.5-63.75,130.05-135.15,130.05c-71.4,0-135.15-53.55-135.15-130.05H63.75c0,86.7,68.85,158.1,153,170.85v84.15h51v-84.15c84.15-12.75,153-84.149,153-170.85H377.4L377.4,229.5z"/>
          </svg>
        </button>

        <button className="control-btn" onClick={handleToggleCamera}>
          <svg viewBox="0 0 16 16" fill="white">
            <path d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56l-10-14 .814-.58 10 14-.814.58z"/>
          </svg>
        </button>

        <button className="control-btn stop-btn" onClick={handleStop}>
          <svg viewBox="0 0 32 32" fill="white">
            <rect height="28" rx="4" width="28" x="2" y="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LiveSession;
