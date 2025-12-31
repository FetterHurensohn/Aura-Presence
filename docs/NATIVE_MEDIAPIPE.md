# 📱 Native MediaPipe SDK - Android & iOS

Anleitung zur Integration von nativen MediaPipe SDKs für optimale Performance auf mobilen Geräten.

## ⚠️ WICHTIGER HINWEIS

Diese Aufgabe ist **komplex** und erfordert:
- Native Android-Entwicklung (Java/Kotlin)
- Native iOS-Entwicklung (Swift/Objective-C)
- Capacitor-Plugin-Entwicklung
- MediaPipe C++-Bibliotheken
- **Geschätzter Aufwand:** 40-60 Stunden

**Alternativen:**
- ✅ **Web-Version (bereits implementiert)** funktioniert auf mobilen Geräten
- ✅ Performance ist ausreichend für moderne Smartphones (iPhone 12+, Samsung S21+)
- ❌ Native SDK lohnt sich erst bei **sehr hohem Traffic** oder **Low-End-Geräten**

---

## 📊 Performance-Vergleich

| Metrik | Web (WASM) | Native SDK | Verbesserung |
|--------|------------|------------|--------------|
| **Initialisierung** | ~2-3s | ~0.5-1s | **2-3x schneller** |
| **Framerate** | 15-25 FPS | 25-30 FPS | **1.5-2x schneller** |
| **CPU-Last** | 60-80% | 30-50% | **30-50% weniger** |
| **Akku-Verbrauch** | Hoch | Mittel | **20-40% weniger** |
| **Bundle-Größe** | ~10 MB WASM | ~15 MB Native | **+5 MB** |

**Empfehlung:** Web-Version für MVP/Start, Native SDK für Scale.

---

## 🏗️ Architektur-Übersicht

### Web (aktuell)

```
Browser → WASM (MediaPipe) → JavaScript → React
                ↓
         Canvas Rendering
```

### Native (geplant)

```
Native Camera → MediaPipe C++ → JNI/Swift Bridge → Capacitor Plugin → React
                       ↓
                 Native Rendering
```

---

## 📦 Benötigte Komponenten

### 1. MediaPipe Native SDKs

**Android:**
- MediaPipe AAR (Android Archive)
- Quelle: https://github.com/google/mediapipe
- Build mit Bazel

**iOS:**
- MediaPipe Framework
- Quelle: https://github.com/google/mediapipe
- Build mit Xcode

### 2. Capacitor Plugin

**Struktur:**

```
capacitor-mediapipe-plugin/
├── android/
│   ├── src/main/java/com/aura/mediapipe/
│   │   ├── MediaPipePlugin.java
│   │   └── MediaPipeProcessor.java
│   └── build.gradle
├── ios/
│   ├── Plugin/
│   │   ├── MediaPipePlugin.swift
│   │   └── MediaPipeProcessor.swift
│   └── Podfile
├── src/
│   ├── definitions.ts
│   └── web.ts (Fallback zu WASM)
└── package.json
```

### 3. TypeScript-Bridge

```typescript
// capacitor-mediapipe-plugin/src/definitions.ts
export interface MediaPipePlugin {
  initialize(options: InitOptions): Promise<void>;
  processFrame(frame: FrameData): Promise<LandmarksResult>;
  destroy(): Promise<void>;
}
```

---

## 🛠️ Implementierungsplan

### Phase 1: Setup & Dependencies

**Geschätzter Aufwand:** 8-10 Stunden

1. **MediaPipe Build aufsetzen**

```bash
# 1. Bazel installieren
# macOS
brew install bazel

# Windows
# https://bazel.build/install/windows

# 2. MediaPipe Repo klonen
git clone https://github.com/google/mediapipe.git
cd mediapipe

# 3. Android AAR bauen
bazel build -c opt --fat_apk_cpu=arm64-v8a,armeabi-v7a \
  mediapipe/examples/android/src/java/com/google/mediapipe/apps/basic:pose

# 4. iOS Framework bauen
bazel build -c opt --config=ios_arm64 \
  mediapipe/examples/ios/posetrackinggpu:PoseTrackingGpuApp
```

2. **Capacitor-Plugin initialisieren**

```bash
npm init @capacitor/plugin capacitor-mediapipe-plugin
cd capacitor-mediapipe-plugin
npm install
```

### Phase 2: Android-Implementation

**Geschätzter Aufwand:** 15-20 Stunden

**`android/src/main/java/com/aura/mediapipe/MediaPipePlugin.java`:**

```java
package com.aura.mediapipe;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.mediapipe.framework.Packet;
import com.google.mediapipe.framework.PacketGetter;

@CapacitorPlugin(name = "MediaPipe")
public class MediaPipePlugin extends Plugin {
    private MediaPipeProcessor processor;

    @PluginMethod
    public void initialize(PluginCall call) {
        processor = new MediaPipeProcessor(getContext());
        boolean success = processor.initialize();
        
        if (success) {
            call.resolve();
        } else {
            call.reject("Failed to initialize MediaPipe");
        }
    }

    @PluginMethod
    public void processFrame(PluginCall call) {
        String frameData = call.getString("frame");
        // Convert base64 to Bitmap
        // Process with MediaPipe
        // Return landmarks as JSON
        
        JSObject result = new JSObject();
        result.put("poseLandmarks", landmarks);
        call.resolve(result);
    }

    @PluginMethod
    public void destroy(PluginCall call) {
        if (processor != null) {
            processor.destroy();
        }
        call.resolve();
    }
}
```

**`MediaPipeProcessor.java`:**

```java
package com.aura.mediapipe;

import com.google.mediapipe.framework.Graph;
import com.google.mediapipe.framework.Packet;

public class MediaPipeProcessor {
    private Graph graph;
    
    public boolean initialize() {
        // Load MediaPipe graph
        // Configure solutions (Pose, Face Mesh, Hands)
        return true;
    }
    
    public Landmarks processFrame(Bitmap frame) {
        // Convert Bitmap to MediaPipe Packet
        // Run graph
        // Extract landmarks
        return landmarks;
    }
    
    public void destroy() {
        graph.close();
    }
}
```

**`build.gradle`:**

```gradle
dependencies {
    implementation 'com.google.mediapipe:mediapipe_java:0.10.9'
    implementation 'com.google.mediapipe:solution-core:latest.release'
}
```

### Phase 3: iOS-Implementation

**Geschätzter Aufwand:** 15-20 Stunden

**`ios/Plugin/MediaPipePlugin.swift`:**

```swift
import Foundation
import Capacitor
import MediaPipeTasksVision

@objc(MediaPipePlugin)
public class MediaPipePlugin: CAPPlugin {
    private var processor: MediaPipeProcessor?
    
    @objc func initialize(_ call: CAPPluginCall) {
        processor = MediaPipeProcessor()
        let success = processor?.initialize() ?? false
        
        if success {
            call.resolve()
        } else {
            call.reject("Failed to initialize MediaPipe")
        }
    }
    
    @objc func processFrame(_ call: CAPPluginCall) {
        guard let frameData = call.getString("frame") else {
            call.reject("Missing frame data")
            return
        }
        
        // Convert base64 to UIImage
        // Process with MediaPipe
        // Return landmarks
        
        call.resolve(["poseLandmarks": landmarks])
    }
    
    @objc func destroy(_ call: CAPPluginCall) {
        processor?.destroy()
        call.resolve()
    }
}
```

**`MediaPipeProcessor.swift`:**

```swift
import MediaPipeTasksVision
import UIKit

class MediaPipeProcessor {
    private var poseLandmarker: PoseLandmarker?
    
    func initialize() -> Bool {
        // Configure MediaPipe options
        // Load models
        return true
    }
    
    func processFrame(_ image: UIImage) -> Landmarks? {
        // Convert UIImage to MPImage
        // Run pose detection
        // Return landmarks
        return landmarks
    }
    
    func destroy() {
        poseLandmarker = nil
    }
}
```

**`Podfile`:**

```ruby
pod 'MediaPipeTasksVision', '~> 0.10.9'
```

### Phase 4: TypeScript-Bridge

**Geschätzter Aufwand:** 5-8 Stunden

**`src/definitions.ts`:**

```typescript
export interface MediaPipePlugin {
  initialize(options: {
    solutions: ('pose' | 'faceMesh' | 'hands')[];
    complexity?: 'lite' | 'full' | 'heavy';
  }): Promise<void>;
  
  processFrame(frame: {
    data: string; // base64
    width: number;
    height: number;
  }): Promise<{
    poseLandmarks?: Landmark[];
    faceLandmarks?: Landmark[];
    handLandmarks?: HandLandmarks;
  }>;
  
  destroy(): Promise<void>;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}
```

**`src/index.ts`:**

```typescript
import { registerPlugin } from '@capacitor/core';
import type { MediaPipePlugin } from './definitions';

const MediaPipe = registerPlugin<MediaPipePlugin>('MediaPipe', {
  web: () => import('./web').then(m => new m.MediaPipeWeb()),
});

export * from './definitions';
export { MediaPipe };
```

**`src/web.ts` (Fallback zu WASM):**

```typescript
import { WebPlugin } from '@capacitor/core';
import type { MediaPipePlugin } from './definitions';

export class MediaPipeWeb extends WebPlugin implements MediaPipePlugin {
  async initialize() {
    // Verwende existierende WASM-Implementation
    return;
  }
  
  async processFrame(frame) {
    // Delegate zu MediaPipeService.js
    return {};
  }
  
  async destroy() {
    return;
  }
}
```

### Phase 5: Integration in Aura Presence

**Geschätzter Aufwand:** 5-8 Stunden

**Installation:**

```bash
cd capacitor-mediapipe-plugin
npm run build
npm link

cd ../aura-presence/frontend
npm link capacitor-mediapipe-plugin
```

**`frontend/src/services/NativeMediaPipeService.js`:**

```javascript
import { MediaPipe } from 'capacitor-mediapipe-plugin';
import { Capacitor } from '@capacitor/core';

class NativeMediaPipeService {
  async initialize() {
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      console.log('Using Native MediaPipe SDK');
      await MediaPipe.initialize({
        solutions: ['pose', 'faceMesh', 'hands'],
        complexity: 'full'
      });
    } else {
      console.log('Using Web WASM MediaPipe (Fallback)');
      // Use existing MediaPipeService
    }
  }
  
  async processFrame(videoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);
    
    const frameData = canvas.toDataURL('image/jpeg', 0.8);
    
    const result = await MediaPipe.processFrame({
      data: frameData.split(',')[1], // Remove data:image/jpeg;base64,
      width: canvas.width,
      height: canvas.height
    });
    
    return result;
  }
}
```

---

## 📱 Capacitor-Build

### Android

```bash
# 1. Sync mit Capacitor
npm run capacitor:sync

# 2. Öffne Android Studio
npm run capacitor:open:android

# 3. In Android Studio:
# - Build → Build Bundle(s) / APK(s) → Build APK(s)
# - Run → Run 'app'

# 4. Release-Build
cd android
./gradlew assembleRelease

# APK: android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
# 1. Sync mit Capacitor
npm run capacitor:sync

# 2. Install Pods
cd ios/App
pod install

# 3. Öffne Xcode
cd ../../
npm run capacitor:open:ios

# 4. In Xcode:
# - Product → Archive
# - Distribute App → App Store Connect
```

---

## 🧪 Testing

### Unit-Tests

**Android (`android/src/test/`):**

```java
@Test
public void testMediaPipeInitialization() {
    MediaPipeProcessor processor = new MediaPipeProcessor(context);
    assertTrue(processor.initialize());
}
```

**iOS (`ios/PluginTests/`):**

```swift
func testMediaPipeInitialization() {
    let processor = MediaPipeProcessor()
    XCTAssertTrue(processor.initialize())
}
```

### Performance-Tests

```javascript
// frontend/src/tests/performance.test.js
describe('Native MediaPipe Performance', () => {
  test('should process 30 frames in < 1s', async () => {
    const start = Date.now();
    
    for (let i = 0; i < 30; i++) {
      await nativeMediaPipe.processFrame(testFrame);
    }
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // 30 FPS
  });
});
```

---

## 💰 Kosten-Nutzen-Analyse

### Entwicklungskosten

| Phase | Stunden | Stundensatz | Kosten |
|-------|---------|-------------|--------|
| Setup & Dependencies | 10h | 80€ | 800€ |
| Android-Implementation | 20h | 80€ | 1.600€ |
| iOS-Implementation | 20h | 80€ | 1.600€ |
| TypeScript-Bridge | 8h | 80€ | 640€ |
| Integration & Testing | 8h | 80€ | 640€ |
| **Gesamt** | **66h** | **80€** | **5.280€** |

### Laufende Kosten

- **App-Store-Gebühren**
  - Apple: $99/Jahr
  - Google: $25 einmalig
- **Wartung & Updates**: ~10h/Jahr (800€)

### Nutzen

**Performance-Gewinn:**
- **Low-End-Geräte**: 2-3x schneller
- **Battery-Life**: 20-40% länger
- **User-Experience**: Flüssigere Animationen

**Wann lohnt es sich?**
- ✅ **> 10.000 aktive mobile Nutzer**
- ✅ **Fokus auf Low-End-Märkte** (Indien, Afrika)
- ✅ **Echtzeit-Performance kritisch**
- ❌ **< 1.000 Nutzer** → Web-Version ausreichend

---

## 🔄 Alternative Ansätze

### 1. Progressive Enhancement

**Strategie:**
- Start mit Web-Version (WASM)
- Sammle Performance-Metriken
- Implementiere Native nur wenn nötig

**Vorteile:**
- Schneller Launch
- Geringere Entwicklungskosten
- Datenbasierte Entscheidung

### 2. Hybrid-Approach

**Strategie:**
- Web-Version für Desktop
- Native SDK nur für Mobile

**Implementation:**

```javascript
const mediaPipeService = Capacitor.isNativePlatform()
  ? new NativeMediaPipeService()
  : new WebMediaPipeService();
```

### 3. React Native (statt Capacitor)

**Vorteile:**
- Bessere Native-Integration
- Größere Community
- Mehr Performance-Optimierungen

**Nachteile:**
- Komplettes Rewrite von React → React Native
- Kein Web-Version mehr
- Steile Lernkurve

---

## 📚 Ressourcen & Links

**Offizielle Docs:**
- [MediaPipe Solutions](https://developers.google.com/mediapipe/solutions/guide)
- [MediaPipe Android](https://developers.google.com/mediapipe/framework/getting_started/android)
- [MediaPipe iOS](https://developers.google.com/mediapipe/framework/getting_started/ios)
- [Capacitor Plugin Dev](https://capacitorjs.com/docs/plugins/creating-plugins)

**Community:**
- [MediaPipe GitHub](https://github.com/google/mediapipe)
- [MediaPipe Discussions](https://github.com/google/mediapipe/discussions)
- [Capacitor Discord](https://discord.gg/UPYYRhtyzp)

**Beispiel-Projekte:**
- [MediaPipe Android Examples](https://github.com/google/mediapipe/tree/master/mediapipe/examples/android)
- [MediaPipe iOS Examples](https://github.com/google/mediapipe/tree/master/mediapipe/examples/ios)

---

## ✅ Empfehlung

**Für Aura Presence (aktueller Stand):**

1. ✅ **Behalte Web-Version (WASM)** als Hauptimplementation
2. ✅ **Sammle Performance-Metriken** in Production
3. ⏳ **Native SDK** nur bei Bedarf (> 10k mobile Nutzer)

**Warum?**
- Web-Version funktioniert auf 95% der Geräte gut
- Entwicklungszeit besser in Features investiert
- Native SDK: Hohe Kosten bei unsicherem Nutzen

**Nächste Schritte (wenn Native gewünscht):**
1. Performance-Tests mit Zielgeräten
2. Proof-of-Concept (nur Android oder iOS)
3. ROI-Berechnung basierend auf User-Feedback
4. Schrittweise Implementation (Phase 1-5)

---

**💡 FAZIT:** Native MediaPipe ist **"Nice-to-Have"**, nicht **"Must-Have"**. Fokus auf andere Production-Readiness-Aufgaben hat höhere Priorität.

