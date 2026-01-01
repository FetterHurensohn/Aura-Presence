/**
 * VideoReceiver Component
 * Verwaltet MediaStream (Kamera, WebRTC oder Demo-Video)
 */

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';

const VideoReceiver = forwardRef(({ children, videoSource = 'camera', uploadedVideoUrl = null }, ref) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initialisiere basierend auf videoSource
    if (videoSource === 'demo') {
      initializeDemoVideo();
    } else if (videoSource === 'upload') {
      initializeUploadedVideo();
    } else {
      requestCameraAccess();
    }

    return () => {
      // Cleanup: Stream stoppen
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoSource, uploadedVideoUrl]);

  /**
   * Kamera-Zugriff anfordern
   */
  const requestCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Front-Kamera
        },
        audio: false
      });

      setStream(mediaStream);
      setPermissionGranted(true);
      setError(null);

      // Stream zu Video-Element verbinden
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (err) {
      console.error('Fehler beim Zugriff auf Kamera:', err);
      
      let errorMessage = 'Kamera-Zugriff fehlgeschlagen';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Kamera-Berechtigung verweigert. Bitte erlaube den Kamera-Zugriff in den Browser-Einstellungen.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Keine Kamera gefunden. Bitte stelle sicher, dass eine Kamera angeschlossen ist.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Kamera ist bereits in Verwendung oder nicht zugänglich.';
      }
      
      setError(errorMessage);
    }
  };

  /**
   * Initialisiere hochgeladenes Video
   */
  const initializeUploadedVideo = () => {
    try {
      if (videoRef.current && uploadedVideoUrl) {
        videoRef.current.src = uploadedVideoUrl;
        videoRef.current.loop = false;
        videoRef.current.muted = true;
        videoRef.current.controls = true; // Show controls for uploaded videos
        
        setPermissionGranted(true);
        setError(null);
        
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
        };
        
        videoRef.current.onerror = () => {
          setError('Fehler beim Laden des Videos');
        };
      } else if (!uploadedVideoUrl) {
        setError('Kein Video hochgeladen');
      }
    } catch (err) {
      console.error('Fehler beim Initialisieren des hochgeladenen Videos:', err);
      setError('Fehler beim Laden des Videos');
    }
  };

  /**
   * Initialisiere Demo-Video
   */
  const initializeDemoVideo = () => {
    try {
      if (videoRef.current) {
        videoRef.current.src = '/demo-video.mp4';
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        
        videoRef.current.onloadeddata = () => {
          setPermissionGranted(true);
          setVideoReady(true);
          setError(null);
          console.log('✓ Demo-Video geladen');
        };

        videoRef.current.onerror = (e) => {
          console.error('Fehler beim Laden des Demo-Videos:', e);
          setError(
            'Demo-Video konnte nicht geladen werden. ' +
            'Bitte stelle sicher, dass demo-video.mp4 in public/ vorhanden ist. ' +
            'Siehe demo-video-info.md für Details.'
          );
        };

        // Video muss manuell gestartet werden (Browser-Policy)
        videoRef.current.play().catch(err => {
          console.warn('Video Autoplay blocked:', err);
          // Das ist OK - Video startet wenn User interagiert
        });
      }
    } catch (err) {
      console.error('Fehler beim Initialisieren des Demo-Videos:', err);
      setError('Demo-Video-Initialisierung fehlgeschlagen');
    }
  };

  /**
   * Retry Kamera-Zugriff oder Demo-Video
   */
  const handleRetry = () => {
    setError(null);
    if (videoSource === 'demo') {
      initializeDemoVideo();
    } else {
      requestCameraAccess();
    }
  };

  /**
   * Pause Video/Stream
   */
  const pause = useCallback(() => {
    if (videoSource === 'camera' && stream) {
      // Deaktiviere Tracks (aber stoppe sie nicht komplett)
      stream.getTracks().forEach(track => {
        track.enabled = false;
      });
      setIsPaused(true);
    } else if (videoRef.current) {
      // Pausiere Video-Element
      videoRef.current.pause();
      setIsPaused(true);
    }
  }, [videoSource, stream]);

  /**
   * Resume Video/Stream
   */
  const resume = useCallback(() => {
    if (videoSource === 'camera' && stream) {
      // Reaktiviere Tracks
      stream.getTracks().forEach(track => {
        track.enabled = true;
      });
      setIsPaused(false);
    } else if (videoRef.current) {
      // Setze Video fort
      videoRef.current.play().catch(err => {
        console.warn('Video play error:', err);
      });
      setIsPaused(false);
    }
  }, [videoSource, stream]);

  /**
   * Expose pause/resume methods via ref
   */
  useImperativeHandle(ref, () => ({
    pause,
    resume,
    isPaused
  }), [pause, resume, isPaused]);

  if (error) {
    return (
      <div className="video-error">
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={handleRetry} className="btn btn-primary mt-2">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  if (!permissionGranted) {
    const loadingMessage = videoSource === 'demo' 
      ? 'Demo-Video wird geladen...' 
      : 'Warte auf Kamera-Berechtigung...';
    
    return (
      <div className="video-loading">
        <div className="spinner"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay={videoSource === 'camera'}
        playsInline
        muted
        style={{ display: 'none' }}
      />
      
      {/* Render-Prop Pattern: Gebe videoRef an Children weiter */}
      {children && children(videoRef)}
    </div>
  );
});

export default VideoReceiver;





