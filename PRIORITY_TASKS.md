# Priority Tasks & Roadmap

## 🎯 Übersicht

Diese Datei enthält priorisierte Aufgaben für die Weiterentwicklung von Aura Presence nach dem initialen Setup.

---

## ✅ Completed (High Priority)

### 1. MediaPipe Face Mesh & Hands Integration ✅
**Status:** ✅ Completed  
**Completed:** 2025-12-30

**Was implementiert:**
- Face Mesh Service mit 468 Landmarks + Iris-Tracking
- Hands Service mit 21 Landmarks pro Hand + Gesture Recognition
- Unified Feature Extractor für Pose + Face Mesh + Hands
- Canvas-Visualisierung für alle drei MediaPipe-Lösungen
- Präzise Eye Contact Detection über Iris-Position
- Eye Aspect Ratio Blink Detection
- Facial Expression Recognition (smiling, frowning, neutral, speaking)
- Head Pose Estimation (pitch, yaw, roll)
- Hand Gesture Recognition (open, closed, pointing, peace, ok)
- Hand Movement Speed Analysis
- Backend Evaluation-Service erweitert
- AI-Service Prompts erweitert
- Sequential Processing für Performance
- Tests geschrieben

### 2. WebRTC Signaling-Server mit Socket.IO ✅
**Status:** ✅ Completed  
**Completed:** 2025-12-30

**Was implementiert:**
- Socket.IO Server Integration in Backend
- Signaling-Service mit Room-Management
- Socket-Auth-Middleware mit JWT
- Offer/Answer/ICE-Candidate-Routing
- Stats-Endpoint für Monitoring
- Tests geschrieben

### 3. Demo-Video-Support ✅
**Status:** ✅ Completed  
**Completed:** 2025-12-30

**Was implementiert:**
- VideoReceiver erweitert für Demo-Video-Modus
- Toggle zwischen Live-Kamera und Demo-Video
- demo-video-info.md mit Anleitung
- AnalysisView UI mit Video-Source-Toggle
- Erweiterte Metriken-Anzeige in UI

### 4. Error Handling & Toast-Notifications System ✅
**Status:** ✅ Completed  
**Completed:** 2025-01-01

**Was implementiert:**
- Toast-Service mit `react-hot-toast`
- ErrorBoundary für React-Crash-Recovery
- API-Interceptor mit strukturierter Error-Kategorisierung
- Backend-Error-Format standardisiert: `{error, message, code}`
- Alle Auth-Komponenten verwenden Toasts
- MediaPipe-Error-Handling mit nutzerfreundlichen Messages
- Tests geschrieben (toastService, errorHandling)

---

### 5. Stripe Webhook Testing & Enhanced Event Handling ✅
**Status:** ✅ Completed  
**Completed:** 2025-01-01

**Was implementiert:**
- Idempotenz-Checks mit `webhook_events` Tabelle
- Event-Handler: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.*`
- Stripe CLI Integration dokumentiert (`docs/STRIPE_SETUP.md`)
- Tests mit Mock-Fixtures und Idempotenz-Tests
- Comprehensive Webhook-Handling-Flow

---

### 6. Database Migration: SQLite → PostgreSQL ✅
**Status:** ✅ Completed  
**Completed:** 2025-01-01

**Was implementiert:**
- Knex.js als DB-Abstraktions-Layer
- Support für SQLite (Dev) und PostgreSQL (Production)
- Migration-System mit `knex migrate`
- Supabase-Setup dokumentiert (`docs/DATABASE_MIGRATION.md`)
- User-Model refactored zu Knex-Queries
- Connection-Pooling für PostgreSQL

### 7. JWT Refresh Token System ✅
**Status:** ✅ Completed  
**Completed:** 2025-01-02

**Was implementiert:**
- RefreshToken-Model mit Token-Rotation
- `/api/auth/refresh` Endpoint
- `/api/auth/logout` mit Token-Revocation
- Auto-Cleanup für abgelaufene Tokens
- Frontend Auto-Refresh bei 401-Errors
- Tests geschrieben

---

### 8. Production-Readiness Features ✅
**Status:** ✅ Completed  
**Completed:** 2025-01-03

**Was implementiert:**
- **GDPR-Compliance:** Cookie-Banner, Consent-Management, Data-Export/Deletion APIs
- **Legal Pages:** Datenschutz, AGB, Impressum (Templates)
- **Session Tracking:** Analyse-Sessions in DB mit Cleanup-Job
- **API Retry-Logic:** Exponential Backoff für transiente Fehler
- **Sentry PII-Scrubbing:** Enhanced Privacy-Protection
- **Structured Logging:** Winston mit täglicher Rotation
- **CI/CD-Pipeline:** GitHub Actions für Vercel + Railway
- **AI-Response-Validation:** Joi-Schema für OpenAI-Outputs

---

## 🔥 High Priority (User-Aktionen erforderlich)

### 1. Legal-Review ⚠️ KRITISCH
**Status:** 🔴 User-Action erforderlich  
**Warum wichtig:** Rechtliche Absicherung vor Launch

**User muss:**
- [ ] Anwalt konsultieren für Datenschutzerklärung (`docs/legal/DATENSCHUTZ.md`)
- [ ] AGB prüfen lassen (`docs/legal/AGB.md`)
- [ ] Impressum mit echten Daten füllen (`docs/legal/IMPRESSUM.md`)
- [ ] Cookie-Banner-Texte anpassen falls nötig

**Cursor hat vorbereitet:** Vollständige Templates mit DSGVO-konformen Platzhaltern

**Deadline:** Vor Production-Launch

---

### 2. Hosting & Domain Setup
**Status:** 🔴 User-Action erforderlich  
**Warum wichtig:** Ohne Hosting keine Production-App

**User muss:**
- [ ] Domain kaufen (z.B. aurapresence.com)
- [ ] Vercel-Account erstellen (Frontend-Hosting)
- [ ] Railway-Account erstellen (Backend-Hosting)
- [ ] PostgreSQL provisionieren (Railway oder Supabase)
- [ ] DNS konfigurieren (A/CNAME Records)

**Cursor hat vorbereitet:** 
- `vercel.json` für Frontend-Deployment
- `railway.json` für Backend-Deployment
- `docker-compose.prod.yml` für Self-Hosting-Alternative
- Vollständige Deployment-Dokumentation in `docs/DEPLOYMENT.md`

**Geschätzter Aufwand:** 1 Tag

---

### 3. Secrets & Credentials generieren
**Status:** 🔴 User-Action erforderlich  
**Warum wichtig:** Ohne Secrets keine Authentifizierung/Payment

**User muss generieren:**
```bash
# JWT Secret (mindestens 32 Zeichen)
openssl rand -base64 48

# Stripe Keys (von Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# OpenAI API Key
OPENAI_API_KEY=sk-...

# Sentry DSNs (2 Projekte: Frontend + Backend)
SENTRY_DSN=https://...@sentry.io/...

# TURN-Server (Metered.ca oder eigener coturn)
VITE_TURN_USERNAME=...
VITE_TURN_CREDENTIAL=...
```

**Cursor hat vorbereitet:** 
- `backend/.env.example` mit allen Variablen
- `.github/workflows/deploy-production.yml` mit Secret-Injection
- Dokumentation in `docs/DEPLOYMENT.md`

**Geschätzter Aufwand:** 2-3 Stunden

---

### 4. TURN-Server Setup für WebRTC
**Status:** 🟡 Code vorbereitet, Credentials fehlen  
**Warum wichtig:** WebRTC funktioniert sonst nur in lokalen Netzwerken

**User muss:**
- [ ] Metered.ca-Account erstellen (empfohlen, einfach)
- [ ] ODER eigenen coturn-Server aufsetzen (komplex)
- [ ] Credentials in ENV-Variablen setzen:
  - `VITE_TURN_USERNAME`
  - `VITE_TURN_CREDENTIAL`

**Cursor hat vorbereitet:** 
- `frontend/src/services/webrtcService.js` nutzt ENV-Variablen
- Fallback auf STUN-only wenn keine TURN-Credentials
- Dokumentiert in `docs/WEBRTC_SETUP.md`

**Resources:**
- [Metered.ca](https://www.metered.ca/) - Managed TURN (empfohlen)
- [Coturn Setup Guide](https://github.com/coturn/coturn) - Self-Hosted

**Geschätzter Aufwand:** 1 Stunde (Metered.ca) oder 1 Tag (coturn)

---

### 5. HTTPS / SSL Zertifikate
**Status:** ✅ Automatisch via Vercel/Railway  
**Warum wichtig:** Browser blockieren Kamera-Zugriff auf HTTP

**User muss:**
- [ ] Domain in Vercel hinzufügen → SSL automatisch
- [ ] Domain in Railway hinzufügen → SSL automatisch
- [ ] DNS-Records verifizieren

**Cursor hat vorbereitet:** 
- Deployment-Guides für Vercel + Railway (automatisches SSL)
- Custom Domain Setup dokumentiert
- Dokumentiert in `docs/DEPLOYMENT.md`

**Geschätzter Aufwand:** 30 Minuten (wenn Domain vorhanden)

---

### 6. Production Testing
**Status:** 🔴 User-Action erforderlich  
**Warum wichtig:** Bugs in Production sind teuer

**User muss testen:**
- [ ] Registrierung + Login
- [ ] Kamera-Zugriff + MediaPipe-Analyse
- [ ] Stripe Checkout (Test-Mode)
- [ ] Stripe Webhooks (mit `stripe listen`)
- [ ] GDPR-Flows (Data-Export, Account-Deletion)
- [ ] Error-Handling (Netzwerk-Fehler, ungültige Inputs)
- [ ] Mobile-Responsiveness

**Cursor hat vorbereitet:** 
- Postman-Collection für API-Testing (`backend/postman/`)
- Health-Check-Endpoints
- Smoke-Tests in CI/CD-Pipeline

**Geschätzter Aufwand:** 1-2 Tage

---

## 🟢 Medium Priority (Optional, nach Launch)

### 7. 2FA (Two-Factor Authentication)
**Status:** 🔴 Nicht implementiert (Infrastructure vorbereitet)  
**Warum wichtig:** Erhöhte Account-Sicherheit

**Tasks:**
- [ ] `npm install speakeasy qrcode` (Backend)
- [ ] `backend/src/services/twoFactorService.js` erstellen
- [ ] Routes: `/api/auth/2fa/setup`, `/api/auth/2fa/verify`, `/api/auth/2fa/disable`
- [ ] Migration für `users.two_factor_secret`
- [ ] Frontend-Komponente `TwoFactorSetup.jsx`
- [ ] Login-Flow anpassen (2FA-Check nach Password)

**Geschätzter Aufwand:** 2-3 Tage

**Cursor kann:** Vollständig implementieren (wenn User wünscht)

---

### 8. Environment-spezifische Configs
**Status:** ✅ Templates vorhanden  
**Warum wichtig:** Development/Staging/Production sollten getrennte Configs haben

**Cursor hat vorbereitet:**
- `backend/.env.example` mit allen Variablen
- `frontend/.env.production` (Template, globalignore blockiert)
- CI/CD-Pipeline mit ENV-Injection

**User muss:**
- [ ] ENV-Variablen in Vercel/Railway setzen
- [ ] GitHub Secrets für CI/CD konfigurieren

**Geschätzter Aufwand:** 1 Stunde

---

### 9. Error Handling & User Notifications
**Status:** ✅ Vollständig implementiert

**Was implementiert:**
- Toast-Notification-System (`react-hot-toast`)
- Globaler Error Boundary in React
- Detaillierte Error-Messages für häufige Fehler
- Retry-Logic für API-Calls (Exponential Backoff)
- Strukturiertes Backend-Error-Format

---

## 🟢 Medium Priority (Nach Launch)

### 10. Performance-Optimierungen
**Status:** 🟢 Basis implementiert, Erweiterungen optional

**Was implementiert:**
- [x] Sequential Processing in MediaPipe Orchestrator (rotiert zwischen Pose, Face Mesh, Hands)
- [x] Adaptive FPS bereits konfigurierbar
- [x] Model Complexity Settings vorhanden

**Noch offen (optional):**
- [ ] Device-Performance-Monitoring und automatische FPS-Anpassung
- [ ] Lazy Loading für React-Komponenten
- [ ] Backend Caching (Redis) für AI-Responses
- [ ] Database Indexing optimieren (aktuell: Basic Indexes vorhanden)

**Geschätzter Aufwand:** 3-5 Tage

---

### 11. Erweiterte Analytics
**Status:** 🟢 Session-Tracking implementiert, UI fehlt

**Was implementiert:**
- [x] Session-Tracking in DB speichern (`analysis_sessions` Tabelle)
- [x] `/api/sessions` Endpoint für historische Daten

**Noch offen:**
- [ ] Historische Analysen anzeigen (Charts mit Chart.js/Recharts)
- [ ] Fortschritts-Tracking über Zeit
- [ ] Export-Funktion (PDF-Report mit jsPDF)

**Geschätzter Aufwand:** 2-3 Tage

---

### 12. Native Mobile Performance
**Status:** 🟡 Capacitor vorbereitet, Native-SDKs optional

**Was vorbereitet:**
- [x] Capacitor-Konfiguration für Android/iOS
- [x] Camera/Microphone Permissions vorkonfiguriert
- [x] MediaPipe WASM läuft auf Mobile

**Noch offen (optional für Performance-Boost):**
- [ ] MediaPipe Android/iOS SDK integrieren (anstatt Web-WASM)
- [ ] Native Kamera-API verwenden
- [ ] App Icons und Splash Screens
- [ ] Push-Notifications für Feedback
- [ ] App Store / Play Store Submission vorbereiten

**Dokumentiert in:** `docs/NATIVE_MEDIAPIPE.md`

**Geschätzter Aufwand:** 40-60 Stunden

**Empfehlung:** WASM reicht für MVP, Native-SDKs später optimieren

---

### 13. Monitoring & Logging
**Status:** ✅ Vollständig implementiert

**Was implementiert:**
- [x] Sentry für Error-Tracking (Frontend + Backend)
- [x] Winston mit täglicher Log-Rotation
- [x] Structured Logging mit JSON-Format
- [x] PII-Scrubbing in Sentry

**Optional (nach Launch):**
- [ ] Prometheus + Grafana für Metriken (Sentry reicht für MVP)
- [ ] Uptime-Monitoring (UptimeRobot, Pingdom)
- [ ] Log-Aggregation (ELK Stack, Papertrail)

**Geschätzter Aufwand (Prometheus/Grafana):** 2-3 Tage

---

### 14. Erweiterte KI-Features
**Status:** 🟢 Basis komplett implementiert

**Was implementiert:**
- [x] Face Mesh mit 468 Landmarks + Iris-Tracking
- [x] Hands mit 21 Landmarks pro Hand + Gesture Recognition
- [x] Facial Expression Recognition
- [x] Head Pose Estimation
- [x] OpenAI GPT-Integration mit Schema-Validierung

**Noch offen (optional):**
- [ ] Speech-to-Text für Redeanalyse (z.B. mit Web Speech API)
- [ ] Multi-Person-Support (aktuell: 1 Person)
- [ ] Emotion-Intensität-Analyse (aktuell nur Kategorien)
- [ ] Erweiterte Gesture-Library (custom gestures)

**Geschätzter Aufwand:** 5-10 Tage

---

## 🔵 Low Priority (Backlog)

### 10. Admin Dashboard
**Status:** 🔴 Offen

**Tasks:**
- [ ] Admin-Benutzerrolle
- [ ] User-Management-UI
- [ ] System-Metriken-Dashboard
- [ ] Subscription-Übersicht
- [ ] Content-Moderation-Tools

---

### 11. Internationalisierung (i18n)
**Status:** 🔴 Offen (aktuell nur Deutsch)

**Tasks:**
- [ ] i18next integrieren
- [ ] Übersetzungen für EN, ES, FR
- [ ] Locale-Detection
- [ ] RTL-Support

---

### 12. A/B Testing & Feature Flags
**Status:** 🔴 Offen

**Tasks:**
- [ ] Feature-Flag-System (LaunchDarkly, Unleash)
- [ ] A/B Testing für UI-Varianten
- [ ] Analytics-Integration

---

### 13. Social Features
**Status:** 🔴 Offen (zukünftig)

**Tasks:**
- [ ] User-Profile
- [ ] Coaching-Sessions teilen
- [ ] Leaderboards / Gamification
- [ ] Community-Forum

---

## 🛡️ Security & Compliance

### 15. Security Audit
**Status:** 🟡 Basis-Security implementiert, Audit ausstehend  
**Deadline:** Vor Production-Launch

**Was implementiert:**
- [x] Rate Limiting auf allen API-Endpunkten
- [x] Input-Validierung mit Joi
- [x] bcrypt für Passwort-Hashing (12 Rounds)
- [x] JWT + Refresh Token mit Rotation
- [x] Stripe Webhook-Signatur-Validierung
- [x] Content-Filter für KI-Antworten
- [x] PII-Scrubbing in Sentry

**Noch offen (User-Action):**
- [ ] Penetration Testing (externer Dienstleister)
- [ ] OWASP Top 10 Check (manuell oder mit Tool)
- [ ] Dependency Vulnerability Scan: `npm audit` regelmäßig ausführen
- [ ] Secrets-Rotation-Policy definieren
- [ ] 2FA für User-Accounts (optional, siehe Task #7)

**Geschätzter Aufwand:** 3-5 Tage (extern) oder 1-2 Wochen (intern)

---

### 16. DSGVO-Compliance
**Status:** ✅ Vollständig implementiert, Legal-Review ausstehend  
**Deadline:** Vor EU-Launch

**Was implementiert:**
- [x] Cookie-Banner mit granularer Einwilligung
- [x] Consent-Management (localStorage-basiert)
- [x] User-Data-Export-API (`/api/gdpr/export`)
- [x] User-Data-Deletion-API (`/api/gdpr/delete-account` mit 30-Tage-Gnadenfrist)
- [x] Datenschutzerklärung-Template (`docs/legal/DATENSCHUTZ.md`)
- [x] Verarbeitungsverzeichnis in Datenschutzerklärung
- [x] Keine Rohbilder/Videos übertragen (nur strukturierte Metriken)

**Noch offen (User-Action):**
- [ ] Datenschutzerklärung von Anwalt prüfen lassen ⚠️ KRITISCH
- [ ] Datenschutzbeauftragten benennen (falls erforderlich)
- [ ] Auftragsverarbeitungsverträge mit Drittanbietern (Stripe, OpenAI, Sentry)

**Siehe auch:** `PRIVACY_CHECKLIST.md`

---

### 17. Legal & Terms
**Status:** ✅ Templates vorhanden, Review ausstehend

**Was implementiert:**
- [x] AGB-Template (`docs/legal/AGB.md`)
- [x] Impressum-Template (`docs/legal/IMPRESSUM.md`)
- [x] Datenschutzerklärung (`docs/legal/DATENSCHUTZ.md`)
- [x] Frontend-Integration (Footer-Links, AGB-Checkbox bei Registrierung)

**Noch offen (User-Action):**
- [ ] AGB von Anwalt prüfen lassen ⚠️ KRITISCH
- [ ] Impressum mit echten Daten füllen (Name, Adresse, Kontakt)
- [ ] Haftungsausschluss anpassen
- [ ] Refund-Policy für Stripe-Subscriptions definieren

**Geschätzter Aufwand:** 1-2 Wochen (mit Anwalt)

---

## 🚀 Deployment & DevOps

### 18. Docker-Container
**Status:** ✅ Vollständig implementiert

**Was implementiert:**
- [x] Dockerfile für Backend (`backend/Dockerfile`)
- [x] Dockerfile für Frontend (`frontend/Dockerfile`)
- [x] `docker-compose.yml` für Development
- [x] `docker-compose.prod.yml` für Production
- [x] Multi-Stage Builds für optimierte Image-Größe
- [x] Health-Checks in Docker-Compose

**Dokumentiert in:** `docs/DOCKER.md`

---

### 19. CI/CD Pipeline
**Status:** ✅ Vollständig implementiert

**Was implementiert:**
- [x] GitHub Actions Workflow (`.github/workflows/deploy-production.yml`)
- [x] Automated Testing on Push (Backend-Tests)
- [x] Automated Deployment on Merge to `main`
- [x] Frontend → Vercel (automatisches SSL)
- [x] Backend → Railway (automatisches SSL)
- [x] Database Migrations in Pipeline
- [x] Smoke-Tests nach Deployment

**Noch offen (optional):**
- [ ] Blue-Green Deployment (Railway unterstützt Zero-Downtime)
- [ ] Rollback-Strategy (manuell via Railway Dashboard)
- [ ] Staging-Environment (separate Branch)

**User muss:**
- [ ] GitHub Secrets konfigurieren (siehe `docs/DEPLOYMENT.md`)
- [ ] Vercel + Railway Accounts verbinden

---

### 20. Skalierung
**Status:** 🟢 Basis vorhanden, Erweiterungen für >1000 Users

**Was implementiert:**
- [x] PostgreSQL Connection-Pooling (Knex.js)
- [x] Rate Limiting (Express-Rate-Limit)
- [x] Stateless Backend (JWT-basiert, horizontal skalierbar)

**Noch offen (für >1000 concurrent users):**
- [ ] Load Balancer (Nginx, HAProxy) - Railway bietet automatisch
- [ ] Horizontal Scaling (Kubernetes) - Railway Auto-Scaling nutzen
- [ ] Database Replication (PostgreSQL Read-Replicas)
- [ ] CDN für Static Assets (Vercel bietet automatisch)
- [ ] WebSocket Scaling (Redis Adapter für Socket.IO)

**Geschätzter Aufwand:** 5-10 Tage (wenn Skalierung nötig)

---

## 📊 Metriken & KPIs

**Zu tracken:**
- [ ] Daily Active Users (DAU)
- [ ] Conversion Rate (Free → Paid)
- [ ] Average Session Duration
- [ ] Churn Rate
- [ ] API Response Times
- [ ] Error Rates
- [ ] MediaPipe Processing FPS

---

## 🔄 Regelmäßige Wartung

**Wöchentlich:**
- [ ] Dependency Updates prüfen
- [ ] Log-Files durchsehen
- [ ] Monitoring-Alerts prüfen

**Monatlich:**
- [ ] Security Patches
- [ ] Performance-Review
- [ ] User-Feedback auswerten

**Quartalsweise:**
- [ ] Major Version Updates
- [ ] Feature-Prioritäten neu bewerten
- [ ] Tech-Debt reduzieren

---

## 📝 Notes

- Diese Liste ist dynamisch und sollte regelmäßig aktualisiert werden
- Neue Tasks können per Issue/PR hinzugefügt werden
- Priorisierung basiert auf User-Feedback und Business-Value

**Status-Legende:**
- 🔴 Offen
- 🟡 In Arbeit / Teilweise
- 🟢 Erledigt

---

**Letztes Update:** 2025-01-03  
**Nächstes Review:** 2025-01-20

---

## 📊 Production-Readiness Summary

### ✅ Vollständig Implementiert (90%)
- MediaPipe (Pose + Face Mesh + Hands)
- WebRTC Signaling mit Socket.IO
- Auth (JWT + Refresh Tokens)
- Payment (Stripe mit Webhooks)
- GDPR (Cookie-Banner, Data-Export/Deletion)
- Monitoring (Sentry + Winston)
- CI/CD (GitHub Actions)
- Docker (Dev + Production)
- Database (SQLite + PostgreSQL)
- Error Handling (Toasts + Boundaries + Retry)
- Legal (Templates für Datenschutz/AGB/Impressum)

### 🔴 User-Aktionen Erforderlich (10%)
1. **Legal-Review** - Anwalt konsultieren ⚠️ KRITISCH
2. **Hosting-Setup** - Domain, Vercel, Railway, PostgreSQL
3. **Secrets** - JWT, Stripe, OpenAI, Sentry generieren
4. **TURN-Server** - Metered.ca Credentials
5. **Deployment** - GitHub Actions triggern
6. **Testing** - Manuelle Tests in Production

### ⚪ Optional (Nach Launch)
- 2FA (2-3 Tage)
- Prometheus/Grafana (2-3 Tage)
- Native MediaPipe für Mobile (40-60h)

**→ Nächster Schritt:** Siehe [`PRODUCTION_CHECKLIST.md`](../PRODUCTION_CHECKLIST.md) für detaillierte Launch-Checkliste

---

## 🎉 Neu Hinzugefügte Features (2025-12-30)

### MediaPipe Face Mesh
- 468 Gesichts-Landmarks (+ 10 Iris-Landmarks bei refineLandmarks)
- Präzises Eye Tracking mit Iris-Position
- Eye Aspect Ratio für präzise Blink Detection
- Facial Expression Recognition
- Head Pose Estimation (Pitch, Yaw, Roll)

### MediaPipe Hands
- 21 Landmarks pro Hand (max 2 Hände)
- Hand Gesture Recognition (open, closed, pointing, peace, ok, other)
- Hand Movement Speed Analysis
- Hand Presence Detection

### WebRTC Signaling
- Socket.IO-basierter Signaling-Server
- Room-Management (max 2 User pro Room)
- JWT-Auth für Socket-Connections
- Offer/Answer/ICE-Candidate-Routing

### Demo-Video-Modus
- Toggle zwischen Live-Kamera und Demo-Video
- Ideal für Testing ohne Webcam
- Loop-fähiges MP4-Video

### Performance
- Sequential Processing (rotiert zwischen Models)
- Adaptive FPS-Konfiguration
- Model Complexity Settings

