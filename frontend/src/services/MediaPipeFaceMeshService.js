/**
 * MediaPipe Face Mesh Service - Gesichtserkennung mit 468 Landmarks
 * 
 * WICHTIG: Verwendet window.FaceMesh (geladen von index.html CDN)
 * Alle Berechnungen erfolgen lokal im Browser!
 */

// Keine Imports nötig - FaceMesh kommt von window.FaceMesh

class MediaPipeFaceMeshService {
  constructor() {
    this.faceMesh = null;
    this.isInitialized = false;
    this.onResultsCallback = null;
    
    // Konfiguration
    this.config = {
      maxNumFaces: 1, // Nur eine Person analysieren
      refineLandmarks: true, // Aktiviere Iris-Landmarks (468 → 478 Landmarks)
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    };
  }

  /**
   * MediaPipe Face Mesh initialisieren
   */
  async initialize(onResults) {
    if (this.isInitialized) {
      // Bereits initialisiert - nichts zu tun
      return;
    }

    this.onResultsCallback = onResults;

    try {
      // Face Mesh Model laden (von window.FaceMesh)
      if (!window.FaceMesh) {
        throw new Error('window.FaceMesh nicht verfügbar. MediaPipe Scripts nicht geladen?');
      }
      
      this.faceMesh = new window.FaceMesh({
        locateFile: (file) => {
          // CDN-URL für MediaPipe-Dateien
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      // Face Mesh Optionen setzen
      this.faceMesh.setOptions({
        maxNumFaces: this.config.maxNumFaces,
        refineLandmarks: this.config.refineLandmarks,
        minDetectionConfidence: this.config.minDetectionConfidence,
        minTrackingConfidence: this.config.minTrackingConfidence
      });

      // Ergebnis-Handler
      this.faceMesh.onResults((results) => {
        if (this.onResultsCallback) {
          this.onResultsCallback(results);
        }
      });

      this.isInitialized = true;
      console.log('✓ MediaPipe Face Mesh initialisiert (468+ Landmarks, Iris-Tracking)');

    } catch (error) {
      console.error('Fehler beim Initialisieren von MediaPipe Face Mesh:', error);
      throw error;
    }
  }

  /**
   * Verarbeite einzelnes Frame
   */
  async processFrame(imageSource) {
    if (!this.faceMesh || !this.isInitialized) {
      throw new Error('MediaPipe Face Mesh nicht initialisiert');
    }

    await this.faceMesh.send({ image: imageSource });
  }

  /**
   * MediaPipe schließen und Ressourcen freigeben
   */
  close() {
    if (this.faceMesh) {
      this.faceMesh.close();
      this.faceMesh = null;
    }
    
    this.isInitialized = false;
    this.onResultsCallback = null;
    
    console.log('✓ MediaPipe Face Mesh geschlossen');
  }

  /**
   * Prüfe ob initialisiert
   */
  isReady() {
    return this.isInitialized && this.faceMesh !== null;
  }
}

// Singleton-Instance exportieren
const faceMeshService = new MediaPipeFaceMeshService();

export default faceMeshService;

