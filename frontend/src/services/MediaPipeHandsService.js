/**
 * MediaPipe Hands Service - Hand-Tracking mit 21 Landmarks pro Hand
 * 
 * WICHTIG: Verwendet @mediapipe/hands Web-Version (WASM)
 * Alle Berechnungen erfolgen lokal im Browser!
 */

import Hands from '@mediapipe/hands';

class MediaPipeHandsService {
  constructor() {
    this.hands = null;
    this.isInitialized = false;
    this.onResultsCallback = null;
    
    // Konfiguration
    this.config = {
      maxNumHands: 2, // Beide Hände tracken
      modelComplexity: 1, // 0 = lite, 1 = full
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    };
  }

  /**
   * MediaPipe Hands initialisieren
   */
  async initialize(onResults) {
    if (this.isInitialized) {
      console.warn('MediaPipe Hands bereits initialisiert');
      return;
    }

    this.onResultsCallback = onResults;

    try {
      // Hands Model laden
      this.hands = new Hands({
        locateFile: (file) => {
          // CDN-URL für MediaPipe-Dateien
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      // Hands Optionen setzen
      this.hands.setOptions({
        maxNumHands: this.config.maxNumHands,
        modelComplexity: this.config.modelComplexity,
        minDetectionConfidence: this.config.minDetectionConfidence,
        minTrackingConfidence: this.config.minTrackingConfidence
      });

      // Ergebnis-Handler
      this.hands.onResults((results) => {
        if (this.onResultsCallback) {
          this.onResultsCallback(results);
        }
      });

      this.isInitialized = true;
      console.log('✓ MediaPipe Hands initialisiert (21 Landmarks pro Hand, max 2 Hände)');

    } catch (error) {
      console.error('Fehler beim Initialisieren von MediaPipe Hands:', error);
      throw error;
    }
  }

  /**
   * Verarbeite einzelnes Frame
   */
  async processFrame(imageSource) {
    if (!this.hands || !this.isInitialized) {
      throw new Error('MediaPipe Hands nicht initialisiert');
    }

    await this.hands.send({ image: imageSource });
  }

  /**
   * MediaPipe schließen und Ressourcen freigeben
   */
  close() {
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
    
    this.isInitialized = false;
    this.onResultsCallback = null;
    
    console.log('✓ MediaPipe Hands geschlossen');
  }

  /**
   * Prüfe ob initialisiert
   */
  isReady() {
    return this.isInitialized && this.hands !== null;
  }
}

// Singleton-Instance exportieren
const handsService = new MediaPipeHandsService();

export default handsService;

