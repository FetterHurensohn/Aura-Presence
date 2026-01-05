# MediaPipe Integration in LiveSession - Implementierungsplan

## ✅ Bereits Vorhanden:
- MediaPipeService.js (Pose, FaceMesh, Hands Orchestrator)
- MediaPipeFaceMeshService.js (468+ Landmarks, Iris-Tracking)
- MediaPipeHandsService.js (21 Landmarks pro Hand)
- FeatureExtractor.js (PoseFeatureExtractor, FaceMeshFeatureExtractor, HandsFeatureExtractor, UnifiedFeatureExtractor)
- AnalysisAggregator.js (NEU - Daten-Aggregation für ChatGPT)

## 📝 Zu Implementieren in LiveSession.jsx:

### 1. Imports hinzufügen:
```javascript
import mediaPipeService from '../services/MediaPipeService';
import { UnifiedFeatureExtractor } from '../services/FeatureExtractor';
import analysisAggregator from '../services/AnalysisAggregator';
```

### 2. State erweitern:
```javascript
const [mediaPipeInitialized, setMediaPipeInitialized] = useState(false);
const featureExtractorRef = useRef(null);
const animationFrameRef = useRef(null);
```

### 3. MediaPipe initialisieren (in useEffect nach Kamera-Init):
```javascript
useEffect(() => {
  const initMediaPipe = async () => {
    if (!videoRef.current || !cameraOn) return;
    
    try {
      // Feature Extractor erstellen
      featureExtractorRef.current = new UnifiedFeatureExtractor();
      
      // MediaPipe initialisieren
      await mediaPipeService.initialize(
        videoRef.current,
        handleMediaPipeResults
      );
      
      // Aggregator starten
      analysisAggregator.start();
      
      setMediaPipeInitialized(true);
      
      // Frame-Processing starten
      startFrameProcessing();
      
    } catch (error) {
      console.error('MediaPipe Init-Fehler:', error);
    }
  };
  
  if (videoRef.current && cameraOn) {
    initMediaPipe();
  }
  
  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    mediaPipeService.close();
  };
}, [cameraOn]);
```

### 4. Frame Processing Loop:
```javascript
const startFrameProcessing = () => {
  const processFrame = async () => {
    if (videoRef.current && mediaPipeService.isReady() && !isPaused) {
      await mediaPipeService.processFrame(videoRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(processFrame);
  };
  processFrame();
};
```

### 5. MediaPipe Results Handler:
```javascript
const handleMediaPipeResults = (results) => {
  if (!featureExtractorRef.current) return;
  
  // Features extrahieren
  const features = featureExtractorRef.current.extractUnified(
    results.pose,
    results.faceMesh,
    results.hands
  );
  
  // An Aggregator senden
  analysisAggregator.addFeatures(features);
  
  // Scores berechnen und UI aktualisieren
  const currentScores = analysisAggregator.calculateScores();
  setScores({
    mimik: currentScores.facialExpression || 29,
    stimme: scores.stimme, // Audio wird separat analysiert
    augenkontakt: currentScores.eyeContact || 29,
    koerperhaltung: currentScores.posture || 29
  });
  
  // Echtzeit-Feedback generieren
  updateAIFeedback(features, currentScores);
};
```

### 6. AI Feedback Update:
```javascript
const updateAIFeedback = (features, scores) => {
  const feedback = [];
  
  // Augenkontakt
  if (features.eye_contact_quality < 0.5) {
    feedback.push('Schau zur Kamera!');
  }
  
  // Körperhaltung
  if (Math.abs(features.posture_angle) > 15) {
    feedback.push('Stehe aufrechter!');
  }
  
  // Handbewegung
  if (features.hand_movement_speed > 0.5) {
    feedback.push('Weniger hektisch!');
  } else if (features.hand_movement_speed < 0.1) {
    feedback.push('Nutze mehr Gestik!');
  }
  
  // Mimik
  if (features.facial_expression === 'neutral' && elapsed

Time > 10) {
    feedback.push('Mehr lächeln!');
  }
  
  // Blinzelrate
  if (features.blink_rate < 10) {
    feedback.push('Entspann dich!');
  }
  
  setAiFeedback(feedback.slice(0, 4)); // Maximal 4 Tipps
};
```

### 7. handleStop erweitern:
```javascript
const handleStop = async () => {
  setIsRecording(false);
  setPaused(true);
  
  // MediaPipe stoppen
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
  mediaPipeService.close();
  
  // Finale Analyse generieren
  const analysisData = analysisAggregator.exportForBackend();
  
  // An Backend senden
  try {
    const response = await fetch('/api/analysis/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(analysisData)
    });
    
    const result = await response.json();
    
    // Zu Ergebnis-Seite navigieren
    navigate('/analysis-result', { 
      state: { 
        sessionId: result.data.sessionId,
        analysis: analysisData 
      } 
    });
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    navigate('/analysis-result', { state: { analysis: analysisData } });
  }
  
  // Kamera stoppen
  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
  }
};
```

## 🚀 Backend API Endpoint erstellen:

### POST /api/analysis/save
```javascript
router.post('/save', authenticateToken, asyncHandler(async (req, res) => {
  const { summary, rawData } = req.body;
  const userId = req.user.id;
  
  // Session in DB speichern
  const sessionId = await createAnalysisSession(userId, summary);
  
  // Optional: OpenAI für detailliertes Feedback
  const aiFeedback = await generateAIFeedback(summary);
  
  return sendSuccess(res, {
    sessionId,
    aiFeedback,
    summary
  });
}));
```

## ✅ Tests:
1. Kamera-Zugriff und MediaPipe-Initialisierung
2. Echtzeit-Feature-Extraction
3. Score-Updates im UI
4. AI-Feedback-Generierung
5. Session-Speicherung
6. Navigation zur Ergebnis-Seite

## 📦 Deployment:
- Frontend: Alle Änderungen committen
- Backend: Neuen Endpoint implementieren
- Testen in Production

