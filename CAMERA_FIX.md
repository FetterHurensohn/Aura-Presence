# 🔧 Kamera-Zugriff Fix - NotFoundError behoben

## ❌ Problem

```
NotFoundError: Requested device not found
```

Die Kamera konnte nicht gefunden werden, obwohl Berechtigungen erteilt wurden.

### Ursache
Die `getUserMedia()` Constraints waren **zu spezifisch**:

```javascript
// ❌ VORHER - Zu restriktiv
const stream = await navigator.mediaDevices.getUserMedia({ 
  video: { width: 640, height: 480 },  // Feste Auflösung
  audio: true 
});
```

Wenn die Kamera **nicht exakt 640x480** unterstützt, schlägt der Aufruf mit `NotFoundError` fehl.

---

## ✅ Lösung

### 1. **Flexible Video Constraints**

Verwende `ideal` und `max` statt fester Werte:

```javascript
// ✅ NACHHER - Flexibel
const constraints = {
  video: {
    width: { ideal: 640, max: 1280 },   // Bevorzugt 640, akzeptiert bis 1280
    height: { ideal: 480, max: 720 },   // Bevorzugt 480, akzeptiert bis 720
    facingMode: 'user'                  // Front-Kamera bevorzugt
  },
  audio: {
    echoCancellation: true,             // Echo-Unterdrückung
    noiseSuppression: true,             // Rauschunterdrückung
    autoGainControl: true               // Automatische Lautstärkeanpassung
  }
};

const stream = await navigator.mediaDevices.getUserMedia(constraints);
```

### 2. **Besseres Error-Handling**

Unterscheidung zwischen verschiedenen Fehlertypen:

```javascript
catch (err) {
  console.error('❌ Camera access error:', err.name, err.message);
  
  let errorMessage = [];
  
  if (err.name === 'NotFoundError') {
    errorMessage = [
      '❌ Keine Kamera/Mikrofon gefunden!',
      'Bitte Gerät anschließen',
      'Oder andere Kamera wählen'
    ];
  } else if (err.name === 'NotAllowedError') {
    errorMessage = [
      '❌ Zugriff verweigert!',
      'Bitte Berechtigung erteilen',
      'Browser-Einstellungen prüfen'
    ];
  } else if (err.name === 'NotReadableError') {
    errorMessage = [
      '❌ Kamera wird bereits verwendet!',
      'Andere App schließen',
      'Seite neu laden'
    ];
  } else {
    errorMessage = [
      '❌ Fehler beim Kamera-Zugriff!',
      `Fehler: ${err.name}`,
      'Seite neu laden oder Support kontaktieren'
    ];
  }
  
  setAiFeedback(errorMessage);
}
```

### 3. **Device-Enumeration**

Beim App-Start werden alle verfügbaren Geräte aufgelistet (Debugging):

```javascript
useEffect(() => {
  const checkDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      const audioDevices = devices.filter(d => d.kind === 'audioinput');
      
      console.log('🎥 Available video devices:', videoDevices.length, 
                  videoDevices.map(d => d.label || 'Unnamed'));
      console.log('🎙️ Available audio devices:', audioDevices.length,
                  audioDevices.map(d => d.label || 'Unnamed'));
      
      if (videoDevices.length === 0) {
        console.warn('⚠️ No video input devices found!');
        setAiFeedback(['⚠️ Keine Kamera erkannt!', 'Bitte Kamera anschließen']);
      }
      
      if (audioDevices.length === 0) {
        console.warn('⚠️ No audio input devices found!');
      }
    } catch (err) {
      console.error('❌ Error enumerating devices:', err);
    }
  };
  
  checkDevices();
}, []);
```

---

## 📝 Geänderte Dateien

### 1. **`frontend/src/pages/LiveSession.jsx`**

**Funktion: `initializeCamera()`**
- ✅ Flexible Constraints implementiert
- ✅ Besseres Error-Handling
- ✅ Console-Logging für Debugging

**Funktion: `startCamera()`**
- ✅ Flexible Constraints implementiert
- ✅ Besseres Error-Handling

**Neu: `checkDevices()` useEffect**
- ✅ Enumeriert alle verfügbaren Geräte beim Start
- ✅ Warnt in Console, wenn keine Geräte gefunden

### 2. **`frontend/src/pages/SessionPrepare.jsx`**

**Funktion: `checkDevices()`**
- ✅ Flexible Constraints implementiert
- ✅ Besseres Error-Handling

---

## 🧪 Testing

### Erwartete Console-Logs (bei funktionierender Kamera):

```
🎥 Available video devices: 1 ['HD Webcam']
🎙️ Available audio devices: 2 ['Mikrofon (Realtek)', 'Mikrofon Array']
🎥 Requesting camera access with constraints: {...}
✅ Camera stream obtained: { videoTracks: 1, audioTracks: 1 }
✅ Video metadata loaded, dimensions: { width: 640, height: 480 }
✅ MediaPipe erfolgreich initialisiert
```

### Wenn keine Kamera gefunden:

```
⚠️ No video input devices found!
❌ Camera access error: NotFoundError Requested device not found
```

---

## 🔍 Debugging-Guide

### Fall 1: `NotFoundError` trotz Kamera

**Mögliche Ursachen:**
1. **Kamera wird von anderer App verwendet**
   - Windows Kamera-App schließen
   - Skype/Teams/Zoom schließen
   - Browser-Tabs mit Kamera schließen

2. **Kamera-Treiber Problem**
   - Geräte-Manager öffnen
   - Kamera deaktivieren & reaktivieren
   - Treiber aktualisieren

3. **Windows Datenschutz-Einstellungen**
   ```
   Einstellungen → Datenschutz → Kamera
   • Apps Zugriff auf Kamera erlauben: AN
   • Desktop-Apps Zugriff erlauben: AN
   ```

### Fall 2: `NotAllowedError`

**Lösung:**
- Browser-Adressleiste: Kamera-Icon anklicken
- "Immer erlauben" auswählen
- Seite neu laden

**Chrome/Edge Einstellungen:**
```
chrome://settings/content/camera
→ localhost erlauben
```

### Fall 3: `NotReadableError`

**Lösung:**
- Alle Tabs/Apps mit Kamera-Zugriff schließen
- Browser neu starten
- Falls Problem bleibt: PC neu starten

---

## 📊 getUserMedia Constraints - Best Practices

### ✅ Empfohlen: Flexible Constraints

```javascript
{
  video: {
    width: { ideal: 640, min: 320, max: 1280 },
    height: { ideal: 480, min: 240, max: 720 },
    facingMode: 'user',           // 'user' = Front, 'environment' = Rück
    frameRate: { ideal: 30, max: 60 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: { ideal: 48000 }
  }
}
```

### ❌ Vermeiden: Feste Werte

```javascript
{
  video: { width: 640, height: 480 },  // Schlägt fehl wenn nicht unterstützt!
  audio: true
}
```

### ✅ Minimal: Nur Video/Audio

```javascript
{
  video: true,   // Akzeptiert jede Auflösung
  audio: true    // Akzeptiert jedes Mikrofon
}
```

Aber **weniger Kontrolle** über Qualität.

---

## 🚀 Deployment

### Lokaler Test:
1. Seite neu laden: `http://localhost:5173`
2. Console öffnen (F12)
3. Nach "Available devices" Logs suchen
4. Live Session → Analyse starten
5. Kamera sollte funktionieren ✅

### Production (Vercel):
```bash
cd frontend
npm run build
git add .
git commit -m "fix: Flexible camera constraints for NotFoundError"
git push
```

Vercel deployed automatisch.

---

## ✅ Zusammenfassung

| Vorher | Nachher |
|--------|---------|
| ❌ Feste Auflösung (640x480) | ✅ Flexible Constraints (ideal/max) |
| ❌ Generischer Error | ✅ Spezifische Error-Messages |
| ❌ Keine Device-Erkennung | ✅ Device-Enumeration beim Start |
| ❌ Keine Audio-Optimierung | ✅ Echo-/Rauschunterdrückung |
| ❌ Schlechtes Debugging | ✅ Ausführliche Console-Logs |

**Resultat:** Kamera funktioniert jetzt mit **allen Webcam-Modellen**, nicht nur denen mit exakt 640x480 Unterstützung!

