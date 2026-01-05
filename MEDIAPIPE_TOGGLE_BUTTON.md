# 👁️ MediaPipe Toggle-Button - Visualisierung ein/aus

## ✨ **NEUE FUNKTION**

**Button zum Ein-/Ausblenden der MediaPipe-Linien während der Analyse!**

### **Position:**
- Zwischen **Kamera-Button** und **Stop-Button**
- In der Control-Bar unten in der Mitte

### **Icon:**
- Accessibility Human Icon (Figur mit ausgestreckten Armen)
- Stroke: Weiß, 2px, Round Caps & Joins

---

## 🎨 **DESIGN**

### **Button States:**

#### **AKTIV (Linien sichtbar):**
```css
background: linear-gradient(90deg, rgba(14, 124, 184, 1) 0%, rgba(51, 11, 145, 1) 100%);
opacity: 1;
```
- **Aura Presence Gradient** (Blau → Lila)
- Icon: Weiß

#### **INAKTIV (Linien ausgeblendet):**
```css
background: rgba(75, 85, 99, 0.95);
opacity: 1;
```
- **Grau** (wie andere Buttons)
- Icon: Weiß

#### **DISABLED (Analyse nicht gestartet):**
```css
opacity: 0.5;
disabled: true;
```
- Nicht klickbar wenn Analyse nicht läuft

---

## 🔧 **IMPLEMENTIERUNG**

### **1. State Management**

```javascript
const [showMediaPipeLines, setShowMediaPipeLines] = useState(true); // Standard: AN
```

### **2. Toggle-Funktion**

```javascript
const handleToggleMediaPipeLines = () => {
  const newState = !showMediaPipeLines;
  setShowMediaPipeLines(newState);
  
  console.log(newState ? '👁️ MediaPipe Linien anzeigen' : '🙈 MediaPipe Linien ausblenden');
  
  // Feedback aktualisieren
  if (aiFeedback.length > 1) {
    const feedback = [...aiFeedback];
    feedback[feedback.length - 1] = newState 
      ? '👁️ Tracking sichtbar' 
      : '🙈 Tracking ausgeblendet';
    setAiFeedback(feedback);
  }
};
```

### **3. Drawing-Funktion angepasst**

```javascript
const drawMediaPipeVisualization = (results) => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  
  if (!canvas || !video) return;
  
  // Canvas-Größe anpassen
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Canvas IMMER leeren (auch wenn Visualisierung aus ist)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // WICHTIG: Nur zeichnen wenn showMediaPipeLines aktiv ist!
  if (!showMediaPipeLines) {
    return; // Canvas bleibt transparent
  }
  
  // ... Rest der Drawing-Logik ...
};
```

**Wichtig:** Canvas wird **immer geleert**, auch wenn Linien ausgeblendet sind. So bleiben keine alten Linien auf dem Bildschirm.

### **4. Button JSX**

```jsx
<button 
  className="control-btn" 
  onClick={handleToggleMediaPipeLines} 
  title={showMediaPipeLines ? "Tracking ausblenden" : "Tracking anzeigen"}
  disabled={!analysisStarted}
  style={{ 
    opacity: !analysisStarted ? 0.5 : 1,
    background: showMediaPipeLines 
      ? 'linear-gradient(90deg, rgba(14, 124, 184, 1) 0%, rgba(51, 11, 145, 1) 100%)' 
      : 'rgba(75, 85, 99, 0.95)'
  }}
>
  <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="3" r="1"/>
    <path d="M16 21L12 13M12 13V7M12 13L8 21M12 7L18 9M12 7L6 9"/>
  </svg>
</button>
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
2. **Warte bis MediaPipe lädt** (~5 Sekunden)
3. **Prüfe:** Linien sind **sichtbar** (Standard)
4. **Button:** Hat **Aura Gradient** (Blau → Lila)
5. **Klicke Button** → Linien verschwinden
6. **Button:** Wird **Grau**
7. **AI-Feedback:** Zeigt "🙈 Tracking ausgeblendet"
8. **Klicke erneut** → Linien erscheinen wieder
9. **Button:** Wird wieder **Gradient**
10. **AI-Feedback:** Zeigt "👁️ Tracking sichtbar"

### **Console-Logs (F12):**
```
👁️ MediaPipe Linien anzeigen
🙈 MediaPipe Linien ausblenden
👁️ MediaPipe Linien anzeigen
...
```

---

## 🎯 **USE CASES**

### **1. Konzentration auf Präsentation**
- Nutzer will sich auf den **Inhalt konzentrieren**
- Linien können **ablenken**
- → Button drücken, Linien ausblenden

### **2. Screenshot/Recording ohne Linien**
- Nutzer will **saubere Aufnahme** ohne Overlays
- → Linien ausblenden während wichtiger Momente

### **3. Debugging**
- Entwickler will **prüfen ob MediaPipe funktioniert**
- → Linien ein/aus schalten zum Vergleichen

### **4. Performance**
- Auf **schwachen Geräten** kann Drawing Performance kosten
- → Linien ausblenden spart Rechenleistung (Canvas wird nur geleert, nicht gezeichnet)

---

## 📊 **VORTEILE**

✅ **User Control:** Nutzer hat volle Kontrolle über Visualisierung  
✅ **Nicht-invasiv:** Analyse läuft weiter, nur Anzeige ändert sich  
✅ **Visuelles Feedback:** Button-Farbe zeigt Status (Gradient = AN, Grau = AUS)  
✅ **AI-Feedback:** Klarer Status in der KI-Tutor-Box  
✅ **Performance:** Canvas-Drawing wird übersprungen wenn ausgeblendet  
✅ **Accessibility:** Tooltip zeigt Funktion ("Tracking anzeigen/ausblenden")

---

## 🔄 **BUTTON-REIHENFOLGE**

```
[Play/Pause] [Mikrofon] [Kamera] [👤 Tracking] [Stop]
```

**Position:** 4. Button von links (zwischen Kamera und Stop)

---

## 🎨 **ICON DETAILS**

```svg
<svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" 
     strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="3" r="1"/> <!-- Kopf -->
  <path d="M16 21L12 13M12 13V7M12 13L8 21M12 7L18 9M12 7L6 9"/> <!-- Körper & Arme -->
</svg>
```

- **Symbolik:** Person mit ausgestreckten Armen → Körper-Tracking
- **Farbe:** Weiß (wie alle Control-Buttons)
- **Stroke:** 2px (gut sichtbar)

---

## 🚀 **DEPLOYMENT**

```bash
git add .
git commit -m "👁️ MediaPipe Toggle-Button: Linien ein/aus während Analyse"
git push origin main
```

**Vercel:** Automatisches Deployment

---

## 📁 **GEÄNDERTE DATEIEN**

```
frontend/src/pages/LiveSession.jsx    - State, Toggle-Funktion, Button
MEDIAPIPE_TOGGLE_BUTTON.md            - Diese Dokumentation
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem: Button reagiert nicht**

**Lösung:**
- Prüfe: `analysisStarted === true`?
- Prüfe: `disabled` Attribut?
- Console: Erscheint Log beim Klick?

### **Problem: Linien verschwinden nicht**

**Lösung:**
- Prüfe: `showMediaPipeLines` State wird geändert?
- Console: `🙈 MediaPipe Linien ausblenden` erscheint?
- Prüfe: `drawMediaPipeVisualization` hat Early Return?

### **Problem: Button-Farbe ändert sich nicht**

**Lösung:**
- Prüfe: Inline `style` mit `background` wird gesetzt?
- Browser-Cache leeren (Ctrl+Shift+R)

---

## 📈 **ZUKÜNFTIGE ERWEITERUNGEN**

### **Idee 1: Einzelne Features togglen**
```javascript
const [showPose, setShowPose] = useState(true);
const [showFaceMesh, setShowFaceMesh] = useState(true);
const [showHands, setShowHands] = useState(true);
```
→ Dropdown-Menü mit Checkboxen für jedes Feature

### **Idee 2: Opacity-Slider**
```javascript
const [linesOpacity, setLinesOpacity] = useState(1.0);
```
→ Slider von 0% (unsichtbar) bis 100% (voll sichtbar)

### **Idee 3: Farben anpassen**
```javascript
const [poseColor, setPoseColor] = useState('#0E7DB8');
```
→ Color Picker für jede Feature-Kategorie

---

**Status:** ✅ **READY FOR TESTING**

**Erstellt:** 2025-01-05  
**Version:** 1.0

