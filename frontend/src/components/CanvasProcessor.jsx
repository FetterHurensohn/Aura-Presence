/**
 * CanvasProcessor Component
 * Verarbeitet Video-Frames mit MediaPipe und zeichnet Visualisierung
 */

import React, { useRef, useEffect, useState } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, FACEMESH_LIPS } from '@mediapipe/face_mesh';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import mediaPipeService from '../services/MediaPipeService';
import { UnifiedFeatureExtractor } from '../services/FeatureExtractor';
import { showError, showWarning } from '../services/toastService';

function CanvasProcessor({ videoRef, isAnalyzing, onFeaturesExtracted }) {
  const canvasRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const featureExtractorRef = useRef(new UnifiedFeatureExtractor());
  const animationFrameRef = useRef(null);
  const lastProcessTimeRef = useRef(0);
  
  // Latest results from all MediaPipe models
  const latestResultsRef = useRef({
    pose: null,
    faceMesh: null,
    hands: null
  });

  // Target FPS für Processing (limitiert Performance-Last)
  const TARGET_FPS = 15;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  useEffect(() => {
    initializeMediaPipe();

    return () => {
      cleanup();
    };
  }, []);

  /**
   * MediaPipe initialisieren
   */
  const initializeMediaPipe = async () => {
    if (!videoRef?.current) {
      return;
    }

    try {
      await mediaPipeService.initialize(
        videoRef.current,
        handleMediaPipeUnifiedResults
      );
      
      setIsInitialized(true);
      setError(null);
      
      // Starte Frame-Processing-Loop
      startProcessingLoop();

    } catch (err) {
      console.error('Fehler beim Initialisieren von MediaPipe Orchestrator:', err);
      const errorMessage = 'MediaPipe konnte nicht geladen werden. Bitte überprüfe deine Internetverbindung und lade die Seite neu.';
      setError(errorMessage);
      showError(errorMessage, { duration: 8000 });
    }
  };

  /**
   * Frame-Processing-Loop (mit FPS-Limitierung)
   */
  const startProcessingLoop = () => {
    const processFrame = async (timestamp) => {
      // FPS-Limitierung
      if (timestamp - lastProcessTimeRef.current < FRAME_INTERVAL) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      lastProcessTimeRef.current = timestamp;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Canvas-Größe anpassen
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Frame an MediaPipe senden
      try {
        await mediaPipeService.processFrame(video);
      } catch (err) {
        console.error('Fehler beim Verarbeiten des Frames:', err);
        // Bei wiederholten Frame-Processing-Fehlern: Warnung anzeigen (aber nur einmalig)
        if (!window._mediaPipeFrameErrorShown) {
          window._mediaPipeFrameErrorShown = true;
          showWarning('Probleme bei der Frame-Verarbeitung. Video-Qualität oder Performance könnte beeinträchtigt sein.');
          // Reset Flag nach 30 Sekunden
          setTimeout(() => {
            window._mediaPipeFrameErrorShown = false;
          }, 30000);
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  /**
   * MediaPipe Unified Results Handler
   */
  const handleMediaPipeUnifiedResults = (unifiedResults) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Store latest results
    latestResultsRef.current = unifiedResults;

    const ctx = canvas.getContext('2d');
    
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Video-Frame zeichnen (von Pose results)
    if (unifiedResults.pose?.image) {
      ctx.drawImage(unifiedResults.pose.image, 0, 0, canvas.width, canvas.height);
    }

    // 1. Pose-Landmarks zeichnen (falls erkannt)
    if (unifiedResults.pose?.poseLandmarks) {
      drawConnectors(ctx, unifiedResults.pose.poseLandmarks, POSE_CONNECTIONS, {
        color: '#6c5ce7',
        lineWidth: 2
      });

      drawLandmarks(ctx, unifiedResults.pose.poseLandmarks, {
        color: '#00d2d3',
        lineWidth: 1,
        radius: 3
      });
    }

    // 2. Face Mesh zeichnen (falls erkannt)
    if (unifiedResults.faceMesh?.multiFaceLandmarks) {
      unifiedResults.faceMesh.multiFaceLandmarks.forEach(landmarks => {
        // Face Tesselation (dezent)
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
          color: '#C0C0C070',
          lineWidth: 1
        });

        // Eyes (hervorgehoben)
        drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, {
          color: '#FF3030',
          lineWidth: 1
        });
        drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, {
          color: '#FF3030',
          lineWidth: 1
        });

        // Lips
        drawConnectors(ctx, landmarks, FACEMESH_LIPS, {
          color: '#E0E0E0',
          lineWidth: 1
        });

        // Iris (wenn refined landmarks aktiv)
        if (landmarks.length > 468) {
          // Left iris: 468-472
          // Right iris: 473-477
          const leftIris = landmarks.slice(468, 473);
          const rightIris = landmarks.slice(473, 478);
          
          drawLandmarks(ctx, leftIris, { color: '#30FF30', radius: 2 });
          drawLandmarks(ctx, rightIris, { color: '#30FF30', radius: 2 });
        }
      });
    }

    // 3. Hands zeichnen (falls erkannt)
    if (unifiedResults.hands?.multiHandLandmarks) {
      unifiedResults.hands.multiHandLandmarks.forEach((handLandmarks, index) => {
        const handedness = unifiedResults.hands.multiHandedness?.[index]?.label || 'Unknown';
        const handColor = handedness === 'Left' ? '#FF6B6B' : '#4ECDC4';

        // Hand Connections
        drawConnectors(ctx, handLandmarks, HAND_CONNECTIONS, {
          color: handColor,
          lineWidth: 2
        });

        // Hand Landmarks
        drawLandmarks(ctx, handLandmarks, {
          color: handColor,
          lineWidth: 1,
          radius: 4
        });
      });
    }

    // Features extrahieren (nur wenn Analyse aktiv)
    if (isAnalyzing) {
      const features = featureExtractorRef.current.extractUnified(
        unifiedResults.pose,
        unifiedResults.faceMesh,
        unifiedResults.hands
      );
      
      if (features && onFeaturesExtracted) {
        onFeaturesExtracted(features);
      }
    }

    // Status-Overlay
    drawStatusOverlay(ctx, unifiedResults);
  };

  /**
   * Status-Overlay zeichnen
   */
  const drawStatusOverlay = (ctx, unifiedResults) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Status für jedes Model
    let yOffset = 10;
    const lineHeight = 35;

    // Pose Status
    const poseDetected = unifiedResults.pose?.poseLandmarks;
    drawStatusBadge(ctx, 10, yOffset, 'Pose', poseDetected, '#6c5ce7');
    yOffset += lineHeight;

    // Face Status
    const faceDetected = unifiedResults.faceMesh?.multiFaceLandmarks?.length > 0;
    drawStatusBadge(ctx, 10, yOffset, 'Gesicht', faceDetected, '#FF3030');
    yOffset += lineHeight;

    // Hands Status
    const handsCount = unifiedResults.hands?.multiHandLandmarks?.length || 0;
    const handsLabel = handsCount === 0 ? 'Hände' : `${handsCount} Hand${handsCount > 1 ? 'e' : ''}`;
    drawStatusBadge(ctx, 10, yOffset, handsLabel, handsCount > 0, '#4ECDC4');

    // Analyse-Status
    if (isAnalyzing) {
      ctx.fillStyle = 'rgba(108, 92, 231, 0.7)';
      ctx.fillRect(canvas.width - 170, 10, 160, 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('🔴 Analysiere...', canvas.width - 160, 30);
    }
  };

  /**
   * Status-Badge zeichnen
   */
  const drawStatusBadge = (ctx, x, y, label, detected, color) => {
    const statusText = detected ? `✓ ${label}` : `⚠ ${label}`;
    const bgColor = detected ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)';
    const textColor = detected ? color : '#888';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, 150, 30);
    
    ctx.fillStyle = textColor;
    ctx.font = '14px Arial';
    ctx.fillText(statusText, x + 10, y + 20);
  };

  /**
   * Cleanup
   */
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    mediaPipeService.close();
    featureExtractorRef.current.reset();
  };

  if (error) {
    return (
      <div className="canvas-error">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="canvas-loading">
        <div className="spinner"></div>
        <p>MediaPipe wird initialisiert...</p>
      </div>
    );
  }

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="analysis-canvas"
      />
    </div>
  );
}

export default CanvasProcessor;

