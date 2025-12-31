# Aura Presence

**Echtzeit-Video-Analyse mit KI-gestütztem Feedback für Präsenz und Körpersprache**

Aura Presence ist eine Web-App, die Live-Video per WebRTC empfängt, Frames mit MediaPipe (Pose Detection) analysiert, strukturierte Merkmale extrahiert und mittels regelbasierter Evaluation und KI-gestützter Interpretation verständliches Feedback liefert.

## 🎯 Features

### Core Funktionalität
- ✅ **Echtzeit-Analyse**: MediaPipe Pose, Face Mesh & Hands Detection im Browser (WASM)
- ✅ **Präzise Gesichtserkennung**: 468 Face Landmarks mit Iris-Tracking für Eye Contact Analysis
- ✅ **Hand-Tracking**: 21 Landmarks pro Hand mit Gesture Recognition (open, closed, pointing, etc.)
- ✅ **Erweiterte Metriken**: Augenkontakt, Blinzelrate, Gesichtsausdruck, Kopfhaltung, Handgesten
- ✅ **KI-Feedback**: OpenAI GPT-basierte Interpretation (mit Mock-Fallback & Schema-Validierung)

### Security & Auth
- ✅ **Authentifizierung**: E-Mail/Passwort mit bcrypt + JWT
- ✅ **Refresh Tokens**: Automatische Token-Rotation für erhöhte Sicherheit
- ✅ **2FA-Ready**: Infrastructure vorbereitet (TOTP-Implementation optional)
- ✅ **Rate Limiting**: API-Schutz gegen Missbrauch

### Payment & Subscription
- ✅ **Stripe Integration**: Checkout + Webhook mit Idempotenz
- ✅ **Subscription-Management**: Status-Tracking in DB
- ✅ **Payment-Events**: `checkout.completed`, `invoice.failed`, `subscription.*`

### Infrastructure & Production
- ✅ **PostgreSQL Support**: Knex.js-basierte Migrations für Production
- ✅ **WebRTC Signaling**: Socket.IO-Server mit JWT-Auth
- ✅ **GDPR-Compliance**: Cookie-Banner, Consent-Management, Data-Export/Deletion APIs
- ✅ **Error Monitoring**: Sentry-Integration (Frontend + Backend) mit PII-Scrubbing
- ✅ **Structured Logging**: Winston mit täglicher Log-Rotation
- ✅ **Docker Support**: Dev + Production Container-Configs
- ✅ **CI/CD-Pipeline**: GitHub Actions für Vercel + Railway Deployment

### User Experience
- ✅ **Demo-Modus**: Video-Testing ohne Kamera
- ✅ **Toast-Notifications**: User-freundliche Fehler- & Success-Messages
- ✅ **Error Boundaries**: Graceful Degradation bei React-Crashes
- ✅ **Session Tracking**: Historische Analyse-Daten in DB
- ✅ **Mobile-Ready**: Capacitor-Konfiguration für Android/iOS

### Privacy & Compliance
- ✅ **Datenschutz**: Keine Rohbilder werden übertragen - nur strukturierte Metriken
- ✅ **Legal Pages**: Datenschutzerklärung, AGB, Impressum (Templates)
- ✅ **Consent-Flow**: Granulare Einwilligung für Kamera, Analytics, AI
- ✅ **Account-Deletion**: 30-Tage-Gnadenfrist mit Auto-Cleanup

## 🚀 Production Readiness Status

**Stand:** Dezember 2024  
**Status:** ~90% Production-Ready

### ✅ Vollständig Implementiert

| Komponente | Status | Details |
|------------|--------|---------|
| **Auth & Security** | ✅ | JWT + Refresh Tokens, Rate Limiting, Input-Validierung |
| **Database** | ✅ | PostgreSQL-Support mit Knex.js, Migrations-System |
| **Payment** | ✅ | Stripe Integration mit Webhook-Handling & Idempotenz |
| **GDPR** | ✅ | Cookie-Banner, Consent-Management, Data-Export/Deletion |
| **Monitoring** | ✅ | Sentry (Frontend + Backend), Structured Logging |
| **CI/CD** | ✅ | GitHub Actions Pipeline für Deployment |
| **Error Handling** | ✅ | Toast-System, Error Boundaries, Retry-Logic |
| **Legal** | ✅ | Datenschutz, AGB, Impressum (Templates - Review ausstehend) |

### 🟡 User-Aktionen Erforderlich

| Task | Priorität | Aufwand |
|------|-----------|---------|
| Legal-Review durch Anwalt | 🔴 KRITISCH | 1-2 Wochen |
| Domain kaufen & DNS konfigurieren | 🔴 HOCH | 1 Tag |
| Hosting-Accounts (Vercel + Railway) | 🔴 HOCH | 1 Tag |
| PostgreSQL provisionieren | 🔴 HOCH | 2 Stunden |
| Secrets generieren & setzen | 🔴 HOCH | 2 Stunden |
| TURN-Server Credentials (Metered.ca) | 🟡 MITTEL | 1 Stunde |
| Sentry-Projekte erstellen | 🟡 MITTEL | 30 Min |
| Production Testing | 🔴 HOCH | 1-2 Tage |

### ⚪ Optional (Nach Launch)

- **2FA**: Two-Factor Authentication für User-Accounts
- **Prometheus/Grafana**: Erweiterte Metriken (Sentry reicht für MVP)
- **Native MediaPipe**: Mobile-Performance-Optimierung (WASM reicht für MVP)

**→ Nächster Schritt:** Legal-Review, dann Deployment-Setup

Siehe [`PRODUCTION_CHECKLIST.md`](PRODUCTION_CHECKLIST.md) für detaillierte Pre-Launch Checkliste.

---

## 🏗️ Architektur

```
aura-presence/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
├── docs/              # Dokumentation
│   ├── legal/         # Datenschutz, AGB, Impressum
│   └── ...
├── capacitor.config.json
└── package.json
```

## 🚀 Quick Start

### Voraussetzungen

- Node.js >= 18.x
- npm >= 9.x
- (Optional) OpenAI API Key
- (Optional) Stripe Test-Credentials

### Installation

1. **Repository klonen**
```bash
cd "Aura Presence"
```

2. **Dependencies installieren**
```bash
npm run install:all
```

3. **Umgebungsvariablen konfigurieren**

Backend `.env` erstellen (basierend auf [`backend/.env.example`](backend/.env.example)):

```bash
cd backend
cp .env.example .env
```

⚠️ **Wichtig**: Die Datei [`backend/.env.example`](backend/.env.example) enthält alle verfügbaren Environment-Variablen mit Dokumentation. Bitte prüfe diese Datei für Details zu jedem Parameter.

Bearbeite `backend/.env` und setze **mindestens**:
```env
JWT_SECRET=dein-super-geheimes-jwt-secret-hier-mindestens-32-zeichen-lang
```

Für vollständige Funktionalität auch:
```env
OPENAI_API_KEY=sk-...           # Optional - Mock-Modus wenn nicht gesetzt
STRIPE_SECRET_KEY=sk_test_...   # Optional - für Subscriptions
STRIPE_WEBHOOK_SECRET=whsec_... # Optional - für Webhooks
```

4. **Development-Server starten**
```bash
npm run dev
```

Dies startet:
- Backend auf `http://localhost:3001`
- Frontend auf `http://localhost:5173`

5. **App öffnen**

Öffne Browser: `http://localhost:5173`

## 📖 Verwendung

### 1. Registrierung / Login

- Navigiere zu `/register` und erstelle einen Account
- Passwort muss mindestens 8 Zeichen, Groß-, Kleinbuchstaben und eine Zahl enthalten

### 2. Dashboard

Nach Login siehst du:
- Subscription-Status
- Quick-Actions zur Analyse

### 3. Analyse starten

- Wähle zwischen **Live-Kamera** oder **Demo-Video** (für Testing)
- Erlaube Kamera-Zugriff (nur bei Live-Kamera)
- MediaPipe erkennt automatisch:
  - 🧍 **Pose** (33 Körper-Landmarks)
  - 😊 **Face Mesh** (468 Gesichts-Landmarks + Iris-Tracking)
  - 👋 **Hands** (21 Hand-Landmarks pro Hand)
- Klicke "▶ Analyse starten" für Live-Feedback
- Alle 2 Sekunden werden Metriken an Backend gesendet
- Erhalte KI-gestütztes Feedback in Echtzeit

### 4. Subscription (Optional)

- Klicke auf "Jetzt upgraden" im Dashboard
- Du wirst zu Stripe Checkout weitergeleitet
- Verwende Test-Kreditkarte: `4242 4242 4242 4242`

## 🔧 Konfiguration

### OpenAI API

Wenn `OPENAI_API_KEY` nicht gesetzt ist, verwendet die App einen Mock-Modus mit regelbasierten Antworten.

Für echte KI-Interpretation:
1. Registriere dich bei [OpenAI](https://platform.openai.com/)
2. Erstelle einen API Key
3. Setze `OPENAI_API_KEY` in `backend/.env`

### Stripe

Für Subscription-Testing:
1. Registriere dich bei [Stripe](https://stripe.com)
2. Wechsle zu Test-Modus
3. Kopiere Secret Key → `STRIPE_SECRET_KEY`
4. Erstelle ein Product + Price → `STRIPE_PRICE_ID`
5. Konfiguriere Webhook-Endpoint: `http://your-domain.com/api/subscription/webhook`
6. Kopiere Webhook-Secret → `STRIPE_WEBHOOK_SECRET`

#### Stripe-Webhook-Testing (lokal)

1. **Stripe CLI installieren:**
```bash
brew install stripe/stripe-cli/stripe  # macOS
scoop install stripe                   # Windows
```

2. **Webhook-Forwarding starten:**
```bash
stripe listen --forward-to localhost:3001/api/subscription/webhook
# Kopiere Webhook Secret: whsec_... → backend/.env
```

3. **Events triggern:**
```bash
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
```

4. **DB prüfen:**
```bash
sqlite3 backend/data/aura-presence.db
SELECT * FROM webhook_events ORDER BY processed_at DESC LIMIT 5;
```

Siehe [`docs/STRIPE_SETUP.md`](docs/STRIPE_SETUP.md) für Details.

### Datenbank

#### Development
Verwendet SQLite (lokal, schnell):
```bash
npm run dev  # SQLite-File wird automatisch erstellt
```

#### Production (PostgreSQL)

Empfohlen für Skalierung und Production-Deployment:

1. **Supabase-Instance erstellen:**
- [app.supabase.com](https://app.supabase.com/) → New Project
- Kopiere Connection-String
- Alternativ: Railway PostgreSQL Plugin

2. **.env konfigurieren:**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require
NODE_ENV=production
```

3. **Migrations ausführen:**
```bash
cd backend
npm run migrate:latest
```

Dies erstellt automatisch alle Tabellen:
- `users` - User-Accounts mit bcrypt-Hashes
- `refresh_tokens` - JWT Refresh Tokens mit Token-Rotation
- `analysis_sessions` - Historische Analyse-Daten
- `webhook_events` - Stripe Event-Idempotenz
- `subscriptions` - Stripe Subscription-Status

4. **Verify:**
```bash
psql $DATABASE_URL -c "\dt"
# Sollte 5 Tabellen anzeigen
```

**Wichtig:** SQLite (Dev) und PostgreSQL (Production) sind via Knex.js nahtlos austauschbar.

Siehe [`docs/DATABASE_MIGRATION.md`](docs/DATABASE_MIGRATION.md) für Details zu Connection-Pooling und Migrations.

## 🧪 Tests

```bash
# Backend-Tests ausführen
cd backend
npm test

# Mit Coverage
npm test -- --coverage
```

## 📱 Mobile Build (Capacitor)

### Android

```bash
# Build
npm run build

# Capacitor sync
npm run capacitor:sync

# Android Studio öffnen
npm run capacitor:open:android
```

In Android Studio:
- Prüfe `AndroidManifest.xml` für Permissions
- Build & Run auf Emulator/Device

### iOS

```bash
# Build
npm run build

# Capacitor sync
npm run capacitor:sync

# Xcode öffnen
npm run capacitor:open:ios
```

In Xcode:
- Prüfe `Info.plist` für Camera/Microphone Usage Descriptions
- Signing konfigurieren
- Build & Run auf Simulator/Device

**Wichtig für Mobile:**
- MediaPipe läuft auch auf Mobile (WebAssembly)
- Für native Performance: Erwäge MediaPipe Android/iOS SDKs
- Kamera-Permissions sind in `capacitor.config.json` vorkonfiguriert

## 🔒 Sicherheit & Datenschutz

### Was wird NICHT übertragen:
- ❌ Rohbilder oder Video-Frames
- ❌ Kamera-Streams an externe APIs
- ❌ Persönliche biometrische Rohdaten

### Was wird übertragen:
- ✅ Strukturierte numerische Metriken (z.B. Augenkontakt: 0.8, Blinzelrate: 20/min)
- ✅ Evaluationsergebnisse (Status: "good", Score: 0.9)
- ✅ Aggregierte Durchschnittswerte über 2-Sekunden-Intervalle

### Maßnahmen:
- MediaPipe läuft vollständig lokal im Browser
- JWT-basierte Authentifizierung
- Bcrypt für Passwort-Hashing (12 Rounds)
- Rate Limiting auf allen API-Endpunkten
- Input-Validierung mit Joi
- Content-Filter für KI-Antworten
- Stripe Webhook-Signatur-Validierung

## 🚨 Error Handling

Die App verwendet ein strukturiertes Error-Handling-System:

- **Toast-Notifications:** Alle API-Fehler werden als nutzerfreundliche Toasts angezeigt
- **ErrorBoundary:** React-Crashes zeigen Fallback-UI statt White-Screen
- **Auto-Logout:** Bei 401 (Session expired) automatischer Logout mit Redirect zu Login

### Für Entwickler
- Verwende `showSuccess()`, `showError()`, `showWarning()` aus `toastService.js`
- ErrorBoundary ist in `App.jsx` konfiguriert
- Backend-Errors haben Format: `{error, message, code}`

## 🛠️ Entwicklung

### Verfügbare Scripts

**Root:**
```bash
npm run dev              # Start Backend + Frontend
npm run build            # Build Frontend
npm test                 # Run Backend Tests
```

**Backend:**
```bash
npm start                # Production Start
npm run dev              # Development (nodemon)
npm test                 # Jest Tests
```

**Frontend:**
```bash
npm run dev              # Vite Dev Server
npm run build            # Production Build
npm run preview          # Preview Build
```

### API-Endpunkte

**Auth:**
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login (liefert Access + Refresh Token)
- `POST /api/auth/refresh` - Access Token erneuern mit Refresh Token
- `POST /api/auth/logout` - Logout (revoziert Refresh Token)
- `GET /api/auth/me` - Aktueller User (geschützt)

**GDPR:**
- `GET /api/gdpr/export` - Export aller User-Daten (geschützt)
- `DELETE /api/gdpr/delete-account` - Account-Löschung planen (geschützt)
- `POST /api/gdpr/cancel-deletion` - Löschung abbrechen (geschützt)

**Sessions:**
- `GET /api/sessions` - Alle Analyse-Sessions des Users (geschützt)
- `GET /api/sessions/:id` - Spezifische Session abrufen (geschützt)

**Analyse:**
- `POST /api/analyze` - Verhaltensanalyse (geschützt)
  - Unterstützt Pose, Face Mesh und Hands Features

**WebRTC Signaling:**
- Socket.IO Events: `join-room`, `offer`, `answer`, `ice-candidate`
- `GET /api/signaling/stats` - Signaling-Server-Statistiken

**Subscription:**
- `POST /api/subscription/create-checkout` - Stripe Checkout (geschützt)
- `POST /api/subscription/webhook` - Stripe Webhook
- `GET /api/subscription/status` - Subscription-Status (geschützt)

### Beispiel-Requests

**Registrierung:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234"}'
```

**Analyse (mit erweiterten Features):**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "features": {
      "eye_contact_quality": 0.85,
      "blink_rate": 18,
      "facial_expression": "smiling",
      "head_pose": {"pitch": 5, "yaw": -3, "roll": 1},
      "hands_detected": ["left", "right"],
      "left_hand_gesture": "open",
      "right_hand_gesture": "pointing",
      "hand_movement_speed": 0.25,
      "posture_angle": 5,
      "frame_timestamp": 1234567890
    }
  }'
```

## 📋 Acceptance Criteria

### Basis-Features ✅
- [x] User kann sich registrieren und einloggen
- [x] JWT Refresh Token System funktioniert
- [x] Demo-Stream läuft im Video-Element
- [x] Capacitor-Konfiguration für Android/iOS vorhanden

### MediaPipe Features ✅
- [x] MediaPipe Pose liefert 33 Landmark-Daten
- [x] MediaPipe Face Mesh liefert 468 Landmarks + Iris-Tracking
- [x] MediaPipe Hands erkennt beide Hände mit je 21 Landmarks
- [x] Canvas visualisiert alle drei MediaPipe-Lösungen gleichzeitig
- [x] Sequential Processing optimiert Performance

### Feature Extraction & Evaluation ✅
- [x] Präziser Eye Contact über Iris-Position
- [x] Präzise Blink Detection über Eye Aspect Ratio
- [x] Facial Expression Recognition (smiling, frowning, neutral, speaking)
- [x] Head Pose Estimation (pitch, yaw, roll)
- [x] Hand Gesture Recognition (open, closed, pointing, peace, ok)
- [x] Hand Movement Speed Analysis

### Backend Integration ✅
- [x] Frontend sendet erweiterte JSON-Metriken an Backend
- [x] Backend evaluiert Face Mesh & Hands Metriken
- [x] Backend generiert erweiterte KI-Interpretation (Mock + OpenAI)
- [x] Frontend zeigt erweiterte Feedback-UI mit allen Metriken

### WebRTC & Demo ✅
- [x] Socket.IO Signaling-Server mit Auth implementiert
- [x] Demo-Video-Modus für Testing ohne Kamera
- [x] Toggle zwischen Live-Kamera und Demo-Video

### Payment & Security ✅
- [x] Stripe Checkout Session kann erstellt werden
- [x] Webhook-Endpunkt validiert Stripe-Signatur
- [x] Rate Limiting aktiv
- [x] Input-Validierung mit Joi

## 📝 Next Steps für Production Launch

**Status:** 90% Ready - Nur noch User-Aktionen erforderlich

### 🔴 Kritisch (vor Launch)
1. **Legal-Review** - Anwalt muss Datenschutz/AGB/Impressum prüfen
2. **Hosting Setup** - Domain, Vercel, Railway, PostgreSQL
3. **Secrets** - JWT_SECRET, Stripe, OpenAI, Sentry generieren
4. **Deployment** - GitHub Actions Pipeline triggern
5. **Testing** - Manuelle Tests in Production

### 🟡 Empfohlen (kurz nach Launch)
6. **TURN-Server** - WebRTC-Verbindungen über NAT (Metered.ca Credentials)
7. **Performance-Monitoring** - Sentry-Dashboards einrichten

### ⚪ Optional (langfristig)
8. **2FA** - Two-Factor Authentication (2-3 Tage Aufwand)
9. **Prometheus/Grafana** - Erweiterte Metriken (Sentry reicht für MVP)
10. **Native MediaPipe** - Mobile-Performance-Boost (40-60h Aufwand)

Siehe [`PRIORITY_TASKS.md`](PRIORITY_TASKS.md) für vollständige Roadmap und [`PRODUCTION_CHECKLIST.md`](PRODUCTION_CHECKLIST.md) für Launch-Checkliste.

## 🐛 Troubleshooting

**MediaPipe lädt nicht:**
- Prüfe Browser-Konsole auf CORS/CDN-Fehler
- Stelle sicher, dass `@mediapipe/pose` installiert ist
- Versuche: `npm install --legacy-peer-deps`

**Kamera-Zugriff verweigert:**
- Erlaube Kamera in Browser-Settings
- Verwende HTTPS (localhost funktioniert auch mit HTTP)
- Mobile: Prüfe App-Permissions in OS-Einstellungen

**JWT Token expired:**
- Access Token ist standardmäßig 15 Minuten gültig
- Refresh Token ist 7 Tage gültig
- Frontend verwendet automatisch `/api/auth/refresh` bei 401-Errors
- Anpassbar via `JWT_EXPIRES_IN` und `JWT_REFRESH_EXPIRES_IN` in `.env`

**Stripe Webhook nicht erhalten:**
- Verwende `stripe listen --forward-to localhost:3001/api/subscription/webhook`
- Kopiere Webhook-Secret: `whsec_...`
- Setze in `.env`: `STRIPE_WEBHOOK_SECRET`

## 🤝 Beitragen

Contributions sind willkommen! Bitte:
1. Forke das Repo
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Pushe zum Branch
5. Öffne einen Pull Request

## 📄 Lizenz

Proprietary - Alle Rechte vorbehalten.

## 👤 Autor

Aura Presence Team

## 🙏 Danksagungen

- [MediaPipe](https://google.github.io/mediapipe/) - Google's ML Frameworks
- [OpenAI](https://openai.com/) - GPT API
- [Stripe](https://stripe.com/) - Payment Processing
- [React](https://react.dev/) & [Vite](https://vitejs.dev/) - Frontend
- [Express](https://expressjs.com/) - Backend

---

**Viel Erfolg mit Aura Presence! 🚀**

