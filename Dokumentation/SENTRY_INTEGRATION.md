# Sentry Integration - Aura Presence

## Übersicht

Vollständige Sentry Error-Tracking Integration für Frontend (React) und Backend (Node/Express) mit strengem PII-Scrubbing für Datenschutz-Compliance.

**Status:** ✅ Backend implementiert | 🚧 Frontend in Arbeit | 🚧 CI/CD in Arbeit

---

## 🔒 Datenschutz-Garantien

### Was NIEMALS an Sentry gesendet wird:

- ❌ Video-Frames (`videoFrame`, `frameData`, `payload.frames`)
- ❌ Audio-Daten (`rawAudio`, `audioBuffer`)
- ❌ Base64-Strings (über 100 Zeichen)
- ❌ MediaPipe Rohdaten
- ❌ Große Binärdaten (über 1MB)
- ❌ User-Uploads (Bilder, Videos)

### Automatisches PII-Scrubbing:

Die `beforeSend` Hook in `backend/src/utils/sentry.js` filtert automatisch:
- Alle Keys mit `video`, `audio`, `frame`, `image`, `stream`, `buffer`, `blob`, `media`
- Base64-Strings (Pattern-Match + Length)
- Data-URIs (`data:image/...`, `data:video/...`)
- Zirkuläre Referenzen
- Objekte über 1MB

---

## 📦 Backend Integration (✅ Implementiert)

### Installation

```bash
cd backend
npm install
```

Packages installiert:
- `@sentry/node` (v7.x)
- `@sentry/tracing` (v7.x)

### Environment Variables

Erstelle `backend/.env` basierend auf `.env.example`:

```bash
# REQUIRED für Sentry
SENTRY_DSN_BACKEND=https://xxx@oyyy.ingest.sentry.io/zzz
SENTRY_ENABLED=true

# OPTIONAL
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.05
```

**Wichtig:** 
- `SENTRY_DSN_BACKEND` ist **kritisch** - ohne diese wird Sentry nicht gestartet
- Setze `SENTRY_ENABLED=false` um Sentry komplett zu deaktivieren

### Files erstellt/geändert:

1. **`backend/src/utils/sentry.js`** (NEU)
   - `initSentry(app)` - Initialisierung mit Express
   - `registerSentryErrorHandler(app)` - Error Handler Registration
   - `captureException(error, context)` - Manuelles Error Capture
   - `captureMessage(message, level, context)` - Message Capture
   - `scrubPII(data)` - PII-Scrubbing Funktion

2. **`backend/src/server.js`** (GEÄNDERT)
   - Import Sentry Utils
   - `initSentry(app)` Aufruf direkt nach Express App Creation
   - `registerSentryErrorHandler(app)` vor eigenem Error Handler
   - `captureException()` in globalem Error Handler
   - Test-Route: `GET /test/sentry`

3. **`backend/.env.example`** (ERWEITERT)
   - Sentry Environment Variables dokumentiert
   - Datenschutz-Hinweise hinzugefügt
   - Test-Anweisungen hinzugefügt

4. **`backend/package.json`** (DEPENDENCIES)
   - `@sentry/node`: ^7.x
   - `@sentry/tracing`: ^7.x

---

## 🧪 Backend Testing

### Voraussetzungen:

1. Sentry-Projekt erstellt: https://sentry.io
2. DSN kopiert und in `backend/.env` als `SENTRY_DSN_BACKEND` gesetzt
3. Backend läuft: `npm run dev` in `backend/`

### Test 1: Sentry Deaktiviert (ohne DSN)

```bash
# .env: Keine SENTRY_DSN_BACKEND gesetzt oder SENTRY_ENABLED=false
npm run dev
```

**Erwartete Console-Ausgabe:**
```
ℹ️  Sentry: Deaktiviert (SENTRY_ENABLED=false)
```
oder
```
⚠️  Sentry: Keine DSN gesetzt - Sentry wird nicht initialisiert
```

### Test 2: Sentry Aktiviert (mit DSN)

```bash
# .env: SENTRY_DSN_BACKEND=https://xxx@yyy.ingest.sentry.io/zzz
npm run dev
```

**Erwartete Console-Ausgabe:**
```
✅ Sentry Backend initialisiert (Environment: development)
```

### Test 3: Error Capture Test

**Trigger absichtlichen Fehler:**

```bash
curl -X GET http://localhost:3000/test/sentry
```

**Erwartete Response:**
```json
{
  "error": "TEST: Sentry Error Capture funktioniert!",
  "stack": "..."
}
```

**Status:** HTTP 500

**Sentry UI Prüfung:**
1. Gehe zu https://sentry.io → Dein Projekt
2. **Issues** Tab
3. Neuer Issue sollte erscheinen: `"TEST: Sentry Error Capture funktioniert!"`
4. Klicke auf Issue → Prüfe **Event Details**:
   - ✅ Error Message korrekt
   - ✅ Stack Trace vorhanden
   - ✅ Request URL: `/test/sentry`
   - ✅ Environment: `development`
   - ✅ KEINE Video/Audio Daten in Request Body

### Test 4: PII-Scrubbing Verification

**Teste dass Video-Daten entfernt werden:**

Erstelle Test-Route in `backend/src/server.js` (temporär für Testing):

```javascript
app.post('/test/sentry-pii', (req, res) => {
  // Simuliere Request mit Video-Daten
  const fakeVideoData = {
    videoFrame: 'base64encodedframedata...',
    rawAudio: new Array(10000).fill(0),
    analysis: {
      pose: 'good',
      frameData: 'shouldBeRemoved'
    }
  };
  
  captureMessage('TEST: PII Scrubbing', 'info', fakeVideoData);
  res.json({ message: 'Event sent to Sentry' });
});
```

```bash
curl -X POST http://localhost:3000/test/sentry-pii \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Sentry UI Prüfung:**
- Gehe zu Event Details → **Extra Data**
- ✅ `videoFrame` sollte `[SCRUBBED_MEDIA_DATA]` sein
- ✅ `rawAudio` sollte `[SCRUBBED_MEDIA_DATA]` sein
- ✅ `frameData` sollte `[SCRUBBED_MEDIA_DATA]` sein

---

## 📊 Performance & Sampling

### Trace Sampling:

Default: **5%** (0.05) für Production

```env
SENTRY_TRACES_SAMPLE_RATE=0.05  # 5% der Requests werden getrackt
```

Für Development/Testing:
```env
SENTRY_TRACES_SAMPLE_RATE=1.0   # 100% tracking
```

### Event Sampling:

- Error Events: **100%** (alle Errors werden captured)
- Breadcrumbs: **Max 50** pro Event
- Rate Limiting: Server-side (optional implementierbar)

---

## 🚫 Sentry Deaktivieren

### Methode 1: Environment Variable

```env
SENTRY_ENABLED=false
```

Server-Neustart erforderlich.

### Methode 2: DSN entfernen

Entferne oder kommentiere `SENTRY_DSN_BACKEND` in `.env`:

```env
# SENTRY_DSN_BACKEND=https://xxx@yyy.ingest.sentry.io/zzz
```

Server-Neustart erforderlich.

### Emergency Rollback (Production):

**Railway:**
1. Dashboard → Backend Service → **Variables**
2. Setze `SENTRY_ENABLED` = `false`
3. Service deployt automatisch neu (~30 Sekunden)

**Vercel (falls Backend dort):**
1. Dashboard → Project → **Settings** → **Environment Variables**
2. Setze `SENTRY_ENABLED` = `false`
3. **Deployments** → **Redeploy**

---

## 🔐 Sicherheit & Best Practices

### DO's ✅

- ✅ Verwende separate DSNs für Backend und Frontend
- ✅ Setze `SENTRY_ENVIRONMENT` korrekt (development/staging/production)
- ✅ Nutze niedrige `tracesSampleRate` in Production (0.05 = 5%)
- ✅ Prüfe Sentry Events manuell auf PII-Leaks
- ✅ Rotiere `SENTRY_AUTH_TOKEN` regelmäßig
- ✅ Setze Sentry Alerts für kritische Errors

### DON'Ts ❌

- ❌ NIEMALS `SENTRY_AUTH_TOKEN` in Git committen
- ❌ NIEMALS DSN client-side exposen (nur Frontend-DSN erlaubt)
- ❌ NIEMALS `tracesSampleRate=1.0` in Production
- ❌ NIEMALS PII-Scrubbing deaktivieren
- ❌ NIEMALS Video/Audio-Rohdaten an Context anhängen

---

## 📈 Monitoring & Alerts

### Empfohlene Sentry Alerts:

1. **Error Rate Alert:**
   - Trigger: Error Rate > 10/minute
   - Severity: Critical
   - Notification: Slack/Email

2. **New Issue Alert:**
   - Trigger: First-seen Error
   - Severity: High
   - Notification: Slack

3. **Performance Degradation:**
   - Trigger: P95 > 2 seconds
   - Severity: Warning
   - Notification: Email

---

## 🚧 TODO: Frontend Integration

**Status:** Pending

Geplante Schritte:
1. Install `@sentry/react` und `@sentry/tracing`
2. Erstelle `frontend/src/utils/sentry.js`
3. Integriere in `frontend/src/main.jsx`
4. Frontend PII-Scrubbing implementieren
5. ErrorBoundary hinzufügen
6. Test-Page erstellen: `/dev/sentry-test`

---

## 🚧 TODO: CI/CD Integration

**Status:** Pending

Geplante Schritte:
1. GitHub Actions erweitern
2. Source Map Upload für Frontend
3. Release Creation automatisieren
4. Sentry CLI in CI installieren
5. GitHub Secrets konfigurieren

---

## 📝 Changelog

### 2026-01-01 - Backend Integration (v1.0.0)

**Added:**
- ✅ Backend Sentry Integration (`@sentry/node`, `@sentry/tracing`)
- ✅ PII-Scrubbing für Video/Audio-Daten
- ✅ Express Middleware Integration
- ✅ Test-Route `/test/sentry`
- ✅ Environment Variables in `.env.example`
- ✅ Diese Dokumentation

**Changed:**
- ✅ `backend/src/server.js` - Sentry Init & Error Handler
- ✅ Global Error Handler - Sentry Capture Integration

**Security:**
- ✅ Automatic PII-Scrubbing in `beforeSend` Hook
- ✅ Keine Video/Audio-Daten an Sentry

---

## 🆘 Troubleshooting

### Problem: "Sentry: Keine DSN gesetzt"

**Lösung:**
```bash
# Prüfe .env Datei
cat backend/.env | grep SENTRY_DSN_BACKEND

# Setze DSN
echo "SENTRY_DSN_BACKEND=https://xxx@yyy.ingest.sentry.io/zzz" >> backend/.env

# Server neustarten
npm run dev
```

### Problem: Events erscheinen nicht in Sentry

**Debugging:**
1. Prüfe Console: `✅ Sentry Backend initialisiert` sollte erscheinen
2. Prüfe DSN ist korrekt (keine Leerzeichen/Zeilenumbrüche)
3. Prüfe Sentry-Projekt ist aktiv (nicht disabled)
4. Prüfe Network Tab: Requests an `sentry.io` sollten sichtbar sein
5. Prüfe Sentry Project Settings → **Inbound Filters** (keine IP-Blocks)

### Problem: Zu viele Events / Quota exceeded

**Lösung:**
```env
# Reduziere Sample Rate
SENTRY_TRACES_SAMPLE_RATE=0.01  # 1% statt 5%

# Oder temporär deaktivieren
SENTRY_ENABLED=false
```

---

## 📚 Ressourcen

- **Sentry Docs:** https://docs.sentry.io/platforms/node/
- **Express Integration:** https://docs.sentry.io/platforms/node/guides/express/
- **PII Scrubbing:** https://docs.sentry.io/platforms/node/data-management/sensitive-data/
- **Releases:** https://docs.sentry.io/product/releases/

---

**Dokumentiert am:** 2026-01-01  
**Version:** 1.0.0 (Backend only)  
**Autor:** AI Assistant  
**Status:** ✅ Backend Ready for Testing

