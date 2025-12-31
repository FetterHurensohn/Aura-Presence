# 🔍 Sentry Error-Tracking Setup

Vollständige Anleitung zur Integration von Sentry für Production Error-Monitoring.

## 📊 Übersicht

**Sentry** ist ein Error-Tracking-Service, der Production-Fehler erfasst, analysiert und benachrichtigt.

**Integriert in:**
- ✅ Backend (Node.js/Express)
- ✅ Frontend (React)

**Features:**
- Error-Capture mit Stack-Traces
- Performance-Monitoring (APM)
- Session-Replay bei Errors
- User-Context & Breadcrumbs
- Release-Tracking
- Sensitive Data-Filtering

## 🚀 Quick Start

### 1. Sentry Account erstellen

1. Gehe zu https://sentry.io/signup
2. Erstelle Account (Free Tier: 5k errors/month)
3. Erstelle zwei Projekte:
   - **Backend**: Node.js Projekt
   - **Frontend**: React Projekt

### 2. DSN kopieren

**Backend:**
```
Settings → Projects → aura-backend → Client Keys (DSN)
→ Kopiere DSN (z.B. https://abc123@o123.ingest.sentry.io/456)
```

**Frontend:**
```
Settings → Projects → aura-frontend → Client Keys (DSN)
→ Kopiere DSN
```

### 3. Environment-Variablen setzen

**Backend (`backend/.env`):**
```env
SENTRY_DSN=https://your-backend-dsn@o123.ingest.sentry.io/456
SENTRY_RELEASE=v1.0.0  # Optional
```

**Frontend (`frontend/.env`):**
```env
VITE_SENTRY_DSN=https://your-frontend-dsn@o123.ingest.sentry.io/789
VITE_SENTRY_RELEASE=v1.0.0  # Optional
```

### 4. Dependencies installieren

```bash
# Backend
cd backend
npm install @sentry/node @sentry/profiling-node

# Frontend
cd frontend
npm install @sentry/react @sentry/tracing
```

### 5. Server neu starten

```bash
# Backend
npm run dev

# Frontend (Rebuild erforderlich!)
npm run build
npm run preview
```

### 6. Test-Error auslösen

**Backend:**
```bash
curl -X POST http://localhost:3001/api/test-error
```

**Frontend:**
```javascript
// In Browser-Console
throw new Error('Sentry Test Error');
```

**Erwartung:** Error erscheint in Sentry Dashboard nach ~30 Sekunden

## 📁 Implementierte Files

### Backend

- **`backend/src/utils/sentry.js`** - Sentry-Konfiguration
  - `initSentry()` - Initialisierung
  - `sentryRequestHandler()` - Express Middleware
  - `sentryErrorHandler()` - Error-Handler
  - `captureError()` - Manuelles Capture
  - `setUserContext()` - User-Tracking

- **`backend/src/server.js`** - Integration
  - Import `initSentry()` direkt nach `dotenv.config()`
  - Request-Handler vor anderen Middlewares
  - Error-Handler vor eigenem Error-Handler

### Frontend

- **`frontend/src/services/sentryService.js`** - Sentry-Konfiguration
  - `initSentry()` - Initialisierung mit React-Integrations
  - `setUserContext()` - User-Tracking
  - `captureError()` - Manuelles Capture
  - Session-Replay bei Errors

- **`frontend/src/main.jsx`** - Integration
  - Import `initSentry()` VOR React-Render

### Konfiguration

- **`backend/.env.example`** - SENTRY_DSN dokumentiert
- **`frontend/.env.example`** - VITE_SENTRY_DSN dokumentiert

## 🔐 Privacy & Security

### Sensitive Data Filtering

**Automatisch gefiltert:**
- ❌ `Authorization` Headers
- ❌ `Cookie` Headers
- ❌ `password` Fields
- ❌ `token` Query-Params
- ❌ JWT-Tokens
- ❌ E-Mail-Adressen (maskiert)

**Beispiel:**
```javascript
// Original
{ email: "user@example.com", password: "secret123" }

// In Sentry
{ email: "us***@example.com", password: "[REDACTED]" }
```

### E-Mail-Maskierung

```javascript
function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}
// user@example.com → us***@example.com
```

### Ignored Errors

**Backend:**
- `ValidationError` (zu häufig)
- `NetworkError` (Client-seitig)
- `AbortError` (Cancelled Requests)

**Frontend:**
- `Network request failed` (Offline)
- `Failed to fetch` (Offline)
- `ResizeObserver loop` (Browser-harmlos)
- Browser-Extension-Errors

## 📊 Sentry Dashboard

### Issues

**Navigiere zu:** Issues → All

**Wichtige Metriken:**
- **Frequency**: Wie oft tritt Error auf?
- **Users Affected**: Wie viele User betroffen?
- **Last Seen**: Wann zuletzt aufgetreten?

**Actions:**
- **Resolve**: Error als gelöst markieren
- **Ignore**: Error ignorieren (z.B. bekanntes Problem)
- **Assign**: Teammate zuweisen

### Performance

**Navigiere zu:** Performance → Transactions

**Metriken:**
- **Throughput**: Requests/Sekunde
- **Response Time**: Latenz (p50, p95, p99)
- **Failure Rate**: Error-Rate

### Alerts

**Navigiere zu:** Alerts → Create Alert Rule

**Beispiel-Regeln:**
```
IF error count > 10 in 1 hour
THEN send email to team@example.com

IF p95 response time > 2000ms in 5 minutes
THEN send Slack notification
```

## 🧪 Testing

### Manueller Test

**Backend:**
```bash
# Test-Endpoint erstellen (nur Development!)
curl -X POST http://localhost:3001/api/test-error \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

**Frontend:**
```javascript
// In Browser-Console
import { captureError } from './services/sentryService';
captureError(new Error('Test Error'), {
  tags: { test: true },
  extra: { info: 'Manual test' }
});
```

### Automated Tests

**Backend (`backend/tests/sentry.test.js`):**
```javascript
import { captureError } from '../src/utils/sentry.js';

describe('Sentry Integration', () => {
  test('sollte Error capturen ohne zu crashen', () => {
    expect(() => {
      captureError(new Error('Test'), {
        tags: { test: true }
      });
    }).not.toThrow();
  });
});
```

## 📈 Best Practices

### 1. Release-Tracking

```bash
# In CI/CD (z.B. GitHub Actions)
export SENTRY_RELEASE="aura-presence@${GIT_SHA}"

# Build mit Release
npm run build

# Upload Source-Maps zu Sentry
npx @sentry/cli releases files $SENTRY_RELEASE upload-sourcemaps ./dist
```

### 2. User-Context setzen

**Nach Login:**
```javascript
// Frontend
import { setUserContext } from './services/sentryService';

function handleLoginSuccess(user) {
  setUserContext(user);
  // ...
}
```

**Backend (in Auth-Middleware):**
```javascript
import { setUserContext } from '../utils/sentry.js';

export const authMiddleware = async (req, res, next) => {
  const user = await getUserFromToken(req);
  setUserContext(user);
  req.user = user;
  next();
};
```

### 3. Custom-Breadcrumbs

```javascript
import { addBreadcrumb } from './services/sentryService';

function analyzeVideo(features) {
  addBreadcrumb('Video analysis started', {
    posture_angle: features.posture_angle,
    eye_contact: features.eye_contact_quality
  });
  
  // ... analyse ...
}
```

### 4. Performance-Monitoring

```javascript
import * as Sentry from '@sentry/node';

async function expensiveOperation() {
  const transaction = Sentry.startTransaction({
    op: 'video-analysis',
    name: 'Analyze MediaPipe Features'
  });

  try {
    await analyzeFeatures();
    transaction.setStatus('ok');
  } catch (err) {
    transaction.setStatus('internal_error');
    throw err;
  } finally {
    transaction.finish();
  }
}
```

## 🚨 Alerting

### Slack-Integration

1. Sentry Dashboard → Settings → Integrations
2. Suche "Slack" → Install
3. Authorize Workspace
4. Erstelle Alert-Rule:

```
IF new issue is created
AND project = aura-backend
THEN notify #engineering in Slack
```

### E-Mail-Alerts

1. Settings → Alerts → Create Alert Rule
2. Conditions:
   - **Trigger**: Error-Count > 10 in 1 hour
   - **Filters**: Environment = production
3. Actions:
   - Send email to team@example.com

### PagerDuty (für Critical Errors)

1. Settings → Integrations → PagerDuty
2. Erstelle Service in PagerDuty
3. Verbinde mit Sentry
4. Alert-Rule für 5xx Errors

## 💰 Pricing & Limits

### Free Tier

- **5,000 errors/month**
- **10,000 performance transactions/month**
- **Unlimited team members**
- **7 days error retention**

### Paid Plans

- **Team**: $26/month
  - 50k errors/month
  - 100k transactions/month
  - 90 days retention

- **Business**: $80/month
  - Unlimited errors
  - Unlimited transactions
  - 90 days retention
  - Priority support

**Tipp:** Für Start ist Free Tier ausreichend!

## 🐛 Troubleshooting

### "Sentry: Deaktiviert"

→ `SENTRY_DSN` nicht gesetzt. Prüfe `.env` File.

### Errors erscheinen nicht in Dashboard

```bash
# 1. Prüfe DSN
echo $SENTRY_DSN

# 2. Prüfe Logs
# Backend: Sollte "✅ Sentry initialisiert" zeigen
npm run dev

# 3. Test-Error senden
curl -X POST http://localhost:3001/api/test-error

# 4. Warte 30-60 Sekunden
# Sentry batched Requests!
```

### "Invalid DSN"

→ DSN-Format falsch. Muss starten mit `https://`

```env
# RICHTIG
SENTRY_DSN=https://abc123@o123.ingest.sentry.io/456

# FALSCH
SENTRY_DSN=abc123@o123.ingest.sentry.io/456
```

### Zu viele Events (Rate-Limited)

```bash
# Sentry Dashboard zeigt: "Rate limit exceeded"

# Lösung 1: Sample-Rate senken
# In sentry.js:
tracesSampleRate: 0.1  # Nur 10% der Transactions

# Lösung 2: Upgrade Plan
# Settings → Subscription → Upgrade
```

### Source-Maps fehlen

```bash
# Production-Build zeigt minifizierten Code

# Lösung: Upload Source-Maps
npm install --save-dev @sentry/cli

# In package.json:
"scripts": {
  "build": "vite build && npm run sentry:sourcemaps",
  "sentry:sourcemaps": "sentry-cli releases files $SENTRY_RELEASE upload-sourcemaps ./dist"
}
```

## 📚 Weiterführende Ressourcen

- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)

---

**Happy Error-Hunting! 🐛🔍**

