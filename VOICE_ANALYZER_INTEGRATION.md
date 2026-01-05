# 🎤 Voice Analyzer Integration - Echtzeit-Sprachanalyse

## ✨ **NEUE FEATURES**

### **1. Audio Feature Extraction (Meyda.js)**
✅ **Lautstärke (RMS)** - Zu leise? Zu laut?  
✅ **Energie** - Energieniveau der Stimme  
✅ **Klarheit (Zero Crossing Rate)** - Stimmqualität  
✅ **Spektraler Schwerpunkt** - "Helligkeit" der Stimme

### **2. Speech Recognition (Web Speech API)**
✅ **Worte pro Minute (WPM)** - Sprechgeschwindigkeit  
✅ **Füllwörter-Erkennung** - "ähm", "also", "halt", etc.  
✅ **Echtzeit-Transkription** - Gesprochene Worte werden erkannt  
✅ **Confidence** - Wie klar/deutlich wird gesprochen?

### **3. Berechnete Metriken**
✅ **Pausen-Detektion** - Anzahl, Länge, Durchschnitt  
✅ **Redefluss-Score** - Kombination aus WPM, Pausen, Füllwörtern  
✅ **Speech Flow** - Gesamtbewertung 0-100  
✅ **Flags** - Warnungen (ZU_SCHNELL, VIELE_FUELLWOERTER, etc.)

---

## 🏗️ **ARCHITEKTUR**

```
LiveSession.jsx
    ↓
    ├─ MediaPipe Service (Pose, Face Mesh, Hands)
    ├─ Voice Analyzer Service (NEW!)
    │   ├─ Web Audio API + Meyda.js
    │   ├─ Web Speech API
    │   └─ Feature Aggregation
    └─ Analysis Aggregator
        ↓
    Backend API → ChatGPT
```

---

## 📦 **NEUE DATEIEN**

### **1. `frontend/src/services/VoiceAnalyzer.js`**

**Klasse:** `VoiceAnalyzer` (Singleton)

**Hauptmethoden:**
```javascript
// Initialisierung
await voiceAnalyzer.initialize(stream, 'de-DE');

// Echtzeit-Daten abrufen
const analysis = voiceAnalyzer.getRealtimeAnalysis();
// Returns: { volume, energy, clarity, speech, pauses, overall }

// Finale Daten für Backend
const data = voiceAnalyzer.exportForBackend();

// Stoppen
voiceAnalyzer.stop();

// Reset für neue Session
voiceAnalyzer.reset();
```

**Features:**
- ✅ **Meyda.js** für Audio-Feature-Extraction
- ✅ **Web Speech API** für Speech-to-Text
- ✅ **Pausen-Detektion** (RMS < 0.01 = Stille)
- ✅ **Füllwörter-Liste** (15 deutsche Füllwörter)
- ✅ **Score-Berechnung** (0-100 für jedes Feature)
- ✅ **Flags-Generierung** (Warnungen bei Auffälligkeiten)

---

## 🔧 **INTEGRATION IN LIVESESSION.JSX**

### **Import:**
```javascript
import voiceAnalyzer from '../services/VoiceAnalyzer';
```

### **State:**
```javascript
const [voiceAnalyzerInitialized, setVoiceAnalyzerInitialized] = useState(false);
const voiceUpdateIntervalRef = useRef(null);
```

### **Initialisierung (in `initMediaPipe`):**
```javascript
if (microphoneOn && streamRef.current) {
  await voiceAnalyzer.initialize(streamRef.current, 'de-DE');
  setVoiceAnalyzerInitialized(true);
  
  // Voice Score Update Interval (alle 2 Sekunden)
  voiceUpdateIntervalRef.current = setInterval(() => {
    updateVoiceScore();
  }, 2000);
}
```

### **Voice Score Update:**
```javascript
const updateVoiceScore = () => {
  const voiceAnalysis = voiceAnalyzer.getRealtimeAnalysis();
  
  setScores(prevScores => ({
    ...prevScores,
    stimme: voiceAnalysis.overall  // 0-100
  }));
};
```

### **Finale Daten Export (in `handleStop`):**
```javascript
const mediaPipeData = analysisAggregator.exportForBackend();
const voiceData = voiceAnalyzer.exportForBackend();

const analysisData = {
  ...mediaPipeData,
  ...voiceData,
  summary: {
    ...mediaPipeData.summary,
    voiceScore: voiceData.voice.overall
  }
};

// An Backend senden
await apiClient.post('/analyze/save', analysisData);
```

---

## 📊 **DATEN-FORMAT**

### **Realtime Analysis (`getRealtimeAnalysis()`):**

```javascript
{
  volume: {
    current: 0.45,       // Aktuelle Lautstärke
    average: 0.42,       // Durchschnitt
    score: 85            // Score 0-100
  },
  energy: {
    average: 0.56,
    score: 90
  },
  clarity: {
    average: 0.72,       // Zero Crossing Rate
    score: 100
  },
  speech: {
    wordsPerMinute: 145,           // WPM (Optimal: 120-160)
    fillerWordsPerMinute: 2.3,     // Füllwörter/Min
    fillerWordCount: 8,            // Gesamt
    totalWords: 245,               // Gesamt gesprochene Worte
    score: 82
  },
  pauses: {
    count: 23,                     // Anzahl Pausen
    averageLength: 1.2,            // Sekunden
    longestPause: 3.5,             // Sekunden
    score: 78
  },
  overall: 82  // Gesamter Voice Score (0-100)
}
```

### **Backend Export (`exportForBackend()`):**

```javascript
{
  voice: {
    volume: { current, average, score },
    energy: { average, score },
    clarity: { average, score },
    speech: { wordsPerMinute, fillerWordsPerMinute, fillerWordCount, totalWords, score },
    pauses: { count, averageLength, longestPause, score },
    overall: 82,
    flags: ['ZU_VIELE_FUELLWOERTER', 'ZU_SCHNELL']
  },
  raw: {
    transcripts: [
      { timestamp: 1234567890, text: 'Hello world', confidence: 0.95 },
      // ...
    ],
    fillerWords: [
      { timestamp: 1234567890, word: 'ähm', context: 'Hello ähm world' },
      // ...
    ]
  }
}
```

---

## 🎯 **SCORE-BERECHNUNG**

### **Speech Flow Score (0-100):**

**Basis:** 100 Punkte

**Abzüge:**
- **WPM < 100:** -15 Punkte (zu langsam)
- **WPM > 180:** -20 Punkte (zu schnell)
- **WPM < 80:** -25 Punkte (sehr langsam)
- **WPM > 200:** -30 Punkte (sehr schnell)
- **Füllwörter > 3/Min:** -10 Punkte
- **Füllwörter > 5/Min:** -20 Punkte
- **Füllwörter > 8/Min:** -30 Punkte
- **Pausen-Score:** Mittelwert mit Pausen-Score

**Optimal:**
- **WPM:** 120-160
- **Füllwörter:** < 3 pro Minute
- **Pausen:** 1-2 Sekunden durchschnittlich

### **Volume Score (0-100):**
- **< 0.1:** 40 (sehr leise)
- **0.1-0.2:** 60 (zu leise)
- **0.3-0.6:** 100 (optimal)
- **0.7-0.8:** 70 (zu laut)
- **> 0.8:** 50 (sehr laut)

### **Pausen Score (0-100):**
**Basis:** 100 Punkte

**Abzüge:**
- **Durchschnitt < 0.5s:** -10 (zu kurz)
- **Durchschnitt > 3s:** -20 (zu lang)
- **Längste Pause > 5s:** -15 (sehr lang)

---

## 🚨 **FLAGS (Warnungen)**

Automatisch generierte Warnungen bei Auffälligkeiten:

| Flag | Bedingung | Bedeutung |
|------|-----------|-----------|
| `ZU_LEISE` | Volume Score < 60 | Zu leise sprechen |
| `ZU_LAUT` | Volume > 0.7 | Zu laut sprechen |
| `ZU_LANGSAM` | WPM < 100 | Zu langsam sprechen |
| `ZU_SCHNELL` | WPM > 180 | Zu schnell sprechen |
| `VIELE_FUELLWOERTER` | Füllwörter > 5/Min | Zu viele Füllwörter |
| `LANGE_PAUSEN` | Durchschnitt > 3s | Pausen zu lang |
| `WENIGE_PAUSEN` | < 5 Pausen bei > 100 Worten | Zu wenige Pausen |

---

## 🎤 **FÜLLWÖRTER-LISTE**

**Deutsch (15 Füllwörter):**
```javascript
const fillerWords = [
  'ähm', 'ehm', 'öhm',
  'also', 'halt', 'quasi',
  'sozusagen', 'irgendwie',
  'gewissermaßen', 'im prinzip',
  'praktisch', 'theoretisch',
  'einfach', 'genau', 'eben'
];
```

**Erweiterbar für andere Sprachen:**
```javascript
// Englisch
const fillerWordsEN = ['um', 'uh', 'like', 'you know', 'actually', ...];

// Französisch
const fillerWordsFR = ['euh', 'ben', 'quoi', 'genre', ...];
```

---

## 🧪 **TESTING**

### **Lokaler Test:**
```bash
cd frontend
npm run dev
```

**Navigiere zu:** http://localhost:5173/session-prepare

### **Test-Szenario:**

1. **Starte Analyse** → Kamera/Mikrofon erlauben
2. **Warte 5 Sekunden** → MediaPipe + Voice Analyzer laden
3. **Spreche laut und deutlich:**
   - "Hallo, ich teste die Voice Analysis."
   - "Ich spreche jetzt etwas schneller."
   - "Ähm... und jetzt mit Füllwörtern."
4. **Prüfe Browser Console (F12):**

```javascript
// Sollte alle 2 Sekunden erscheinen:
🎤 Voice Score: {
  overall: 82,
  wpm: 145,
  fillerWords: 3,
  pauses: 5
}

// Alle 4 Sekunden:
🎤 Audio Features: {
  rms: 0.452,
  energy: 0.563,
  zcr: 0.721,
  pauses: 5
}

// Bei Speech Recognition:
🗣️ Speech: {
  transcript: "Hallo ich teste die Voice Analysis",
  confidence: "95%",
  fillerWords: 0,
  totalWords: 6
}
```

5. **Prüfe UI:**
   - **Stimme-Score-Balken** aktualisiert sich alle 2 Sekunden
   - Wert sollte zwischen 60-90 liegen (bei normalem Sprechen)

6. **Stoppe Analyse** → Prüfe Console:

```javascript
📊 Finale Analyse: {
  voice: {
    overall: 82,
    flags: ['ZU_VIELE_FUELLWOERTER'],
    // ...
  },
  raw: {
    transcripts: [...],
    fillerWords: [...]
  }
}
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem: Mikrofon wird nicht erkannt**

**Symptom:** Voice Analyzer startet nicht, keine Audio-Features

**Lösung:**
1. Prüfe Browser-Berechtigung (Mikrofon erlaubt?)
2. Prüfe: `streamRef.current` enthält Audio-Track?
3. Console-Log: `⚠️ Voice Analyzer konnte nicht initialisiert werden`

```javascript
// Debug:
console.log('Stream:', streamRef.current);
console.log('Audio Tracks:', streamRef.current?.getAudioTracks());
```

---

### **Problem: Speech Recognition funktioniert nicht**

**Symptom:** Keine Transkripte, keine Füllwörter

**Lösung:**
1. **Browser-Support prüfen:**
   - ✅ Chrome/Edge: Funktioniert
   - ❌ Firefox: Nicht unterstützt
   - ✅ Safari: Funktioniert (mit Einschränkungen)

```javascript
// Check Support:
const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
console.log('Speech Recognition supported:', isSupported);
```

2. **Sprache prüfen:**
   - Aktuell: `de-DE` (Deutsch)
   - Ändern in `VoiceAnalyzer.initialize(stream, 'en-US')`

3. **Mikrofon-Qualität:**
   - Schlechte Mikrofone → niedrige Confidence
   - Hintergrundgeräusche → falsche Erkennung

---

### **Problem: Voice Score bleibt bei 29**

**Symptom:** Score aktualisiert sich nicht

**Lösung:**
1. Prüfe: `voiceAnalyzerInitialized === true`?
2. Prüfe: `voiceUpdateIntervalRef.current` existiert?
3. Console: Erscheint `🎤 Voice Score:` alle 2 Sekunden?

```javascript
// Debug:
console.log('Voice Analyzer initialized:', voiceAnalyzerInitialized);
console.log('Update Interval:', voiceUpdateIntervalRef.current);
console.log('Voice Analyzer running:', voiceAnalyzer.isRunning);
```

---

### **Problem: Zu viele/wenige Füllwörter erkannt**

**Symptom:** Füllwörter-Count unrealistisch

**Lösung:**
1. **Füllwörter-Liste anpassen** (`VoiceAnalyzer.js`):

```javascript
this.fillerWordList = [
  'ähm', 'ehm', 'öhm',  // Nur diese 3
  // Rest auskommentieren für weniger False Positives
];
```

2. **Confidence-Threshold erhöhen:**

```javascript
// In handleSpeechResult:
if (isFinal && confidence > 0.8) {  // Nur >80% Confidence
  // ... Füllwörter erkennen
}
```

---

### **Problem: Pausen werden nicht erkannt**

**Symptom:** Pausen-Count = 0

**Lösung:**
1. **Pause-Threshold anpassen:**

```javascript
this.pauseThreshold = 0.02;  // Von 0.01 auf 0.02 erhöhen
```

2. **Min. Pausen-Länge reduzieren:**

```javascript
this.minPauseLength = 0.3;  // Von 0.5 auf 0.3 Sekunden
```

3. **Mikrofon-Empfindlichkeit:**
   - Zu empfindlich → Keine Stille erkannt
   - Lösung: Threshold erhöhen

---

## 📈 **PERFORMANCE**

### **Ressourcen-Verbrauch:**

| Feature | CPU | Memory | Network |
|---------|-----|--------|---------|
| **Meyda.js** | ~2-5% | ~10 MB | 0 KB |
| **Web Speech API** | ~1-3% | ~5 MB | ~10 KB/s |
| **Gesamt** | ~3-8% | ~15 MB | ~10 KB/s |

### **Optimierungen:**

1. **Buffer Size:** 512 (Balance zwischen Latenz & Performance)
2. **Update Interval:** 2 Sekunden (nicht zu häufig)
3. **Feature Extractors:** Nur 4 (nicht alle 25 Meyda-Features)

---

## 🚀 **DEPLOYMENT**

```bash
git add .
git commit -m "🎤 Voice Analyzer: Echtzeit-Sprachanalyse mit Meyda.js + Speech API"
git push origin main
```

**Vercel:** Automatisches Deployment

**Dependencies:**
```json
{
  "meyda": "^5.7.0"
}
```

---

## 📊 **CHATGPT INTEGRATION (Backend)**

Die Voice-Daten werden an das Backend gesendet und können von ChatGPT analysiert werden:

```javascript
// Backend: routes/analyze.js
router.post('/save', authenticateToken, async (req, res) => {
  const { voice, raw } = req.body;
  
  // ChatGPT Prompt
  const prompt = `
    Analysiere diese Stimm-Daten:
    - Sprechgeschwindigkeit: ${voice.speech.wordsPerMinute} WPM
    - Füllwörter: ${voice.speech.fillerWordCount}
    - Pausen: ${voice.pauses.count} (Ø ${voice.pauses.averageLength}s)
    - Lautstärke: ${voice.volume.average}
    - Overall Score: ${voice.overall}
    - Flags: ${voice.flags.join(', ')}
    
    Gib konstruktives Feedback!
  `;
  
  const feedback = await chatGPT.analyze(prompt);
  
  res.json({ feedback });
});
```

---

## 🎯 **NÄCHSTE SCHRITTE**

### **Phase 1: ✅ Basis-Integration** (DONE)
- ✅ Meyda.js installiert
- ✅ VoiceAnalyzer.js erstellt
- ✅ LiveSession.jsx integriert
- ✅ Realtime Score-Updates

### **Phase 2: Backend-Integration** (TODO)
- ⏳ Backend-Route für Voice-Daten
- ⏳ ChatGPT Feedback-Generierung
- ⏳ Speicherung in Datenbank

### **Phase 3: UI-Verbesserungen** (TODO)
- ⏳ Detaillierte Voice-Statistiken anzeigen
- ⏳ Füllwörter-Liste in UI
- ⏳ Transkript-Anzeige
- ⏳ Echtzeit-WPM-Counter

### **Phase 4: Erweiterungen** (FUTURE)
- 📅 Mehrsprachigkeit (EN, FR, ES)
- 📅 Stottern-Erkennung
- 📅 Tonhöhen-Analyse
- 📅 Emotionserkennung (Stimmlage)

---

**Status:** ✅ **READY FOR TESTING**

**Erstellt:** 2025-01-05  
**Version:** 1.0

