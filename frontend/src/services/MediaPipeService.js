/**
 * MediaPipe Orchestrator Service - Koordiniert Pose, Face Mesh und Hands
 * 
 * WICHTIG: Alle MediaPipe-Lösungen verwenden Web-Version (WASM)
 * Alle Berechnungen erfolgen lokal im Browser!
 * 
 * HINWEIS: MediaPipe lädt über CDN-Scripts, nicht über npm-Imports
 */

import faceMeshService from './MediaPipeFaceMeshService.js';
import handsService from './MediaPipeHandsService.js';

// Warte bis MediaPipe Libraries geladen sind (von index.html)
async function waitForMediaPipeLibraries() {
  let attempts = 0;
  while ((!window.Pose || !window.Camera) && attempts < 100) {
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }
  
  if (!window.Pose || !window.Camera) {
    throw new Error('MediaPipe Libraries konnten nicht geladen werden. Bitte überprüfe deine Internetverbindung und lade die Seite neu.');
  }
  
  console.log('✓ MediaPipe Libraries bereit');
}

class MediaPipeOrchestratorService {
  constructor() {
    this.pose = null;
    this.camera = null;
    this.isInitialized = false;
    this.isPoseReady = false; // WICHTIG: Erst true, wenn Assets geladen sind
    
    // Results Storage für Unified Feature Extraction
    this.latestResults = {
      pose: null,
      faceMesh: null,
      hands: null
    };
    
    this.onUnifiedResultsCallback = null;
    
    // Konfiguration
    this.config = {
      targetFps: 15, // Limitiere auf 15 FPS für Performance
      modelComplexity: 1, // 0 = light, 1 = full, 2 = heavy
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      enableFaceMesh: true, // Toggle für Face Mesh
      enableHands: true      // Toggle für Hands
    };
    
    // Sequential Processing für Performance
    this.processingQueue = ['pose', 'faceMesh', 'hands'];
    this.currentProcessingIndex = 0;
  }

  /**
   * MediaPipe Orchestrator initialisieren (Pose + Face Mesh + Hands)
   */
  async initialize(videoElement, onUnifiedResults) {
    if (this.isInitialized) {
      // Bereits initialisiert - nichts zu tun
      return;
    }

    this.onUnifiedResultsCallback = onUnifiedResults;

    try {
      // 0. Warte bis MediaPipe Libraries geladen sind
      await waitForMediaPipeLibraries();
      
      // 1. Pose-Model laden (aus window.Pose)
      this.pose = new window.Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      this.pose.setOptions({
        modelComplexity: this.config.modelComplexity,
        smoothLandmarks: this.config.smoothLandmarks,
        minDetectionConfidence: this.config.minDetectionConfidence,
        minTrackingConfidence: this.config.minTrackingConfidence
      });

      this.pose.onResults((results) => {
        // Markiere Pose als bereit, wenn erste Results kommen (Assets geladen)
        if (!this.isPoseReady) {
          this.isPoseReady = true;
          console.log('✓ MediaPipe Pose bereit (Assets geladen)');
        }
        this.latestResults.pose = results;
        this.emitUnifiedResults();
      });

      // 2. Face Mesh initialisieren (wenn aktiviert)
      if (this.config.enableFaceMesh) {
        await faceMeshService.initialize((results) => {
          this.latestResults.faceMesh = results;
          this.emitUnifiedResults();
        });
      }

      // 3. Hands initialisieren (wenn aktiviert)
      if (this.config.enableHands) {
        await handsService.initialize((results) => {
          this.latestResults.hands = results;
          this.emitUnifiedResults();
        });
      }

      // Kamera initialisieren (falls videoElement eine echte Kamera ist)
      if (videoElement && videoElement.srcObject && window.Camera) {
        this.camera = new window.Camera(videoElement, {
          onFrame: async () => {
            if (this.pose && videoElement.readyState >= 2) {
              await this.pose.send({ image: videoElement });
            }
          },
          width: 640,
          height: 480,
          fps: this.config.targetFps
        });
      }

      this.isInitialized = true;
      console.log('✓ MediaPipe Orchestrator initialisiert (Pose + Face Mesh + Hands)');

    } catch (error) {
      console.error('Fehler beim Initialisieren von MediaPipe Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Emit unified results zu Callback
   */
  emitUnifiedResults() {
    if (this.onUnifiedResultsCallback) {
      this.onUnifiedResultsCallback({
        pose: this.latestResults.pose,
        faceMesh: this.latestResults.faceMesh,
        hands: this.latestResults.hands
      });
    }
  }

  /**
   * Verarbeite einzelnes Frame (Sequential Processing für Performance)
   */
  async processFrame(imageSource) {
    if (!this.isInitialized) {
      throw new Error('MediaPipe Orchestrator nicht initialisiert');
    }

    // Sequential Processing: Nur ein Model pro Frame für bessere Performance
    const currentModel = this.processingQueue[this.currentProcessingIndex];

    try {
      switch (currentModel) {
        case 'pose':
          // Nur senden, wenn Pose bereit ist (Assets geladen)
          if (this.pose && this.isPoseReady) {
            await this.pose.send({ image: imageSource });
          }
          break;
        case 'faceMesh':
          if (this.config.enableFaceMesh && faceMeshService.isReady()) {
            await faceMeshService.processFrame(imageSource);
          }
          break;
        case 'hands':
          if (this.config.enableHands && handsService.isReady()) {
            await handsService.processFrame(imageSource);
          }
          break;
      }
    } catch (error) {
      // Unterdrücke Fehler während Pose lädt (normal beim Start)
      if (!this.isPoseReady && currentModel === 'pose') {
        // Still loading, ignore error
      } else {
        console.error(`Fehler beim Verarbeiten von ${currentModel}:`, error);
      }
    }

    // Rotiere zum nächsten Model
    this.currentProcessingIndex = (this.currentProcessingIndex + 1) % this.processingQueue.length;
  }

  /**
   * Kamera starten (falls verwendet)
   */
  async startCamera() {
    if (this.camera) {
      await this.camera.start();
      console.log('✓ MediaPipe Kamera gestartet');
    }
  }

  /**
   * Kamera stoppen
   */
  stopCamera() {
    if (this.camera) {
      this.camera.stop();
      console.log('✓ MediaPipe Kamera gestoppt');
    }
  }

  /**
   * MediaPipe Orchestrator schließen und Ressourcen freigeben
   */
  close() {
    this.stopCamera();
    
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }
    
    // Schließe alle Services
    if (faceMeshService.isReady()) {
      faceMeshService.close();
    }
    
    if (handsService.isReady()) {
      handsService.close();
    }
    
    this.camera = null;
    this.isInitialized = false;
    this.isPoseReady = false; // Reset Pose-Ready-Flag
    this.onUnifiedResultsCallback = null;
    this.latestResults = { pose: null, faceMesh: null, hands: null };
    
    console.log('✓ MediaPipe Orchestrator geschlossen');
  }

  /**
   * Prüfe ob initialisiert
   */
  isReady() {
    return this.isInitialized && this.pose !== null;
  }
}

// Feature Extractors sind jetzt in separater Datei: FeatureExtractor.js
// Import über: import { UnifiedFeatureExtractor } from './FeatureExtractor.js';

// Singleton-Instance exportieren
const mediaPipeService = new MediaPipeOrchestratorService();

export default mediaPipeService;





