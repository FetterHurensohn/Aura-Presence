# Production Launch Checklist

**Projekt:** Aura Presence  
**Version:** 1.0.0  
**Status:** Pre-Launch  
**Letztes Update:** 2025-01-03

---

## 📋 Übersicht

Diese Checkliste führt durch alle notwendigen Schritte für einen erfolgreichen Production-Launch von Aura Presence. Jeder Abschnitt enthält konkrete Aufgaben, Verantwortlichkeiten und Verifikations-Schritte.

**Geschätzter Gesamt-Aufwand:** 5-7 Werktage (ohne Legal-Review)

---

## 🔴 Phase 1: Legal & Compliance (KRITISCH)

**Deadline:** Vor Launch  
**Verantwortlich:** User + Anwalt  
**Geschätzter Aufwand:** 1-2 Wochen

### 1.1 Datenschutzerklärung

- [ ] **Template prüfen:** `docs/legal/DATENSCHUTZ.md` durchlesen
- [ ] **Anwalt konsultieren:** DSGVO-Compliance verifizieren
- [ ] **Anpassungen vornehmen:** Spezifische Details zum Geschäftsmodell
- [ ] **Verantwortlichen benennen:** Datenschutzbeauftragten (falls erforderlich)
- [ ] **AVV abschließen:** Auftragsverarbeitungsverträge mit:
  - [ ] Stripe (Payment-Processing)
  - [ ] OpenAI (AI-Interpretation)
  - [ ] Sentry (Error-Tracking)
  - [ ] Hosting-Provider (Vercel, Railway)

**Verifikation:**
```bash
# Prüfe, ob Datenschutzerklärung im Frontend erreichbar ist
curl https://your-domain.com/datenschutz
```

---

### 1.2 AGB (Allgemeine Geschäftsbedingungen)

- [ ] **Template prüfen:** `docs/legal/AGB.md` durchlesen
- [ ] **Anwalt konsultieren:** Rechtssicherheit gewährleisten
- [ ] **Refund-Policy definieren:** Stripe-Subscription-Rückerstattungen
- [ ] **Haftungsausschluss anpassen:** Für Video-Analyse-Kontext
- [ ] **AGB-Checkbox testen:** Registrierung ohne Akzeptanz sollte fehlschlagen

**Verifikation:**
```bash
# Prüfe AGB-Seite
curl https://your-domain.com/agb

# Teste AGB-Checkbox (sollte 400 zurückgeben)
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

---

### 1.3 Impressum

- [ ] **Template ausfüllen:** `docs/legal/IMPRESSUM.md` mit echten Daten
  - [ ] Vollständiger Name / Firmenname
  - [ ] Vollständige Adresse
  - [ ] E-Mail-Adresse
  - [ ] Telefonnummer (optional, aber empfohlen)
  - [ ] Handelsregisternummer (falls GmbH/UG)
  - [ ] USt-IdNr. (falls vorhanden)
- [ ] **Anwalt prüfen lassen:** Vollständigkeit gemäß TMG

**Verifikation:**
```bash
# Prüfe Impressum-Seite
curl https://your-domain.com/impressum
```

---

### 1.4 Cookie-Banner & Consent

- [ ] **Cookie-Banner testen:** Beim ersten Besuch sollte Banner erscheinen
- [ ] **Consent-Optionen prüfen:** Alle 4 Kategorien (Essential, Analytics, Camera, AI)
- [ ] **Ablehnen-Funktion testen:** Analyse sollte ohne Camera-Consent blockiert sein
- [ ] **LocalStorage prüfen:** `aura_presence_consent` sollte gespeichert werden
- [ ] **Settings-Seite testen:** Consent-Änderungen sollten funktionieren

**Verifikation:**
```javascript
// Browser-Konsole
localStorage.getItem('aura_presence_consent')
// Sollte JSON mit consent-Daten zurückgeben
```

---

## 🟡 Phase 2: Infrastructure Setup

**Deadline:** Vor Launch  
**Verantwortlich:** User (DevOps)  
**Geschätzter Aufwand:** 1-2 Tage

### 2.1 Domain & DNS

- [ ] **Domain kaufen:** z.B. `aurapresence.com` (Empfehlung: Namecheap, Cloudflare)
- [ ] **DNS konfigurieren:**
  - [ ] A-Record für Root-Domain (oder CNAME zu Vercel)
  - [ ] CNAME für `www` (optional)
  - [ ] CNAME für `api` (zu Railway Backend)
- [ ] **SSL-Zertifikate:** Automatisch via Vercel/Railway (nichts zu tun)
- [ ] **DNS-Propagation warten:** 1-24 Stunden

**Verifikation:**
```bash
# DNS-Lookup prüfen
nslookup aurapresence.com
nslookup api.aurapresence.com

# SSL-Zertifikat prüfen
curl -I https://aurapresence.com
# Sollte 200 OK zurückgeben
```

---

### 2.2 Hosting-Accounts

#### 2.2.1 Vercel (Frontend)

- [ ] **Account erstellen:** [vercel.com](https://vercel.com/)
- [ ] **GitHub verbinden:** Repository autorisieren
- [ ] **Projekt importieren:** `frontend/` als Root-Directory
- [ ] **Build-Settings:**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] **Custom Domain hinzufügen:** `aurapresence.com`

**Verifikation:**
```bash
# Frontend erreichbar
curl -I https://aurapresence.com
```

---

#### 2.2.2 Railway (Backend)

- [ ] **Account erstellen:** [railway.app](https://railway.app/)
- [ ] **GitHub verbinden:** Repository autorisieren
- [ ] **Projekt erstellen:** "New Project" → "Deploy from GitHub"
- [ ] **Root-Directory setzen:** `backend/`
- [ ] **Start-Command:** `npm start`
- [ ] **Custom Domain hinzufügen:** `api.aurapresence.com`

**Verifikation:**
```bash
# Backend Health-Check
curl https://api.aurapresence.com/api/health
# Sollte {"status":"ok"} zurückgeben
```

---

#### 2.2.3 PostgreSQL (Production-Datenbank)

**Option A: Railway PostgreSQL Plugin (empfohlen)**

- [ ] **Plugin hinzufügen:** Im Railway-Projekt → "New" → "Database" → "PostgreSQL"
- [ ] **Connection-String kopieren:** `DATABASE_URL` aus Railway-Dashboard
- [ ] **ENV-Variable setzen:** In Backend-Service

**Option B: Supabase**

- [ ] **Projekt erstellen:** [app.supabase.com](https://app.supabase.com/)
- [ ] **Connection-String kopieren:** Settings → Database → Connection String
- [ ] **ENV-Variable setzen:** `DATABASE_URL` in Railway

**Verifikation:**
```bash
# Datenbank-Verbindung testen (lokal)
psql $DATABASE_URL -c "\dt"
# Sollte noch leer sein (keine Tabellen)
```

---

### 2.3 Environment-Variablen

#### 2.3.1 Backend (Railway)

Setze folgende ENV-Variablen im Railway-Dashboard:

**Kritisch (ohne diese läuft nichts):**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...  # Von Railway/Supabase
JWT_SECRET=<generiere mit: openssl rand -base64 48>
FRONTEND_URL=https://aurapresence.com
```

**Payment (Stripe):**
```env
STRIPE_SECRET_KEY=sk_live_...  # Von Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...  # Nach Webhook-Setup
STRIPE_PRICE_ID=price_...  # Subscription-Price-ID
```

**AI (OpenAI):**
```env
OPENAI_API_KEY=sk-...  # Optional, Mock-Modus wenn nicht gesetzt
```

**Monitoring (Sentry):**
```env
SENTRY_DSN=https://...@sentry.io/...  # Backend-Projekt
SENTRY_RELEASE=1.0.0
```

**GDPR & Logging:**
```env
GDPR_DELETION_DELAY_DAYS=30
SESSION_RETENTION_DAYS=90
LOG_RETENTION_DAYS=30
AI_VALIDATION_STRICT_MODE=true
```

**Verifikation:**
```bash
# Prüfe, ob ENV-Variablen gesetzt sind (Railway CLI)
railway variables
```

---

#### 2.3.2 Frontend (Vercel)

Setze folgende ENV-Variablen im Vercel-Dashboard:

**Kritisch:**
```env
VITE_API_URL=https://api.aurapresence.com/api
```

**WebRTC (TURN-Server):**
```env
VITE_TURN_USERNAME=<von Metered.ca>
VITE_TURN_CREDENTIAL=<von Metered.ca>
```

**Monitoring (Sentry):**
```env
VITE_SENTRY_DSN=https://...@sentry.io/...  # Frontend-Projekt
VITE_SENTRY_RELEASE=1.0.0
```

**Optional (Performance):**
```env
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000
VITE_MAX_PERSONS=1
VITE_DEFAULT_LANGUAGE=de
```

**Verifikation:**
```bash
# Prüfe, ob ENV-Variablen im Build eingebunden sind
curl https://aurapresence.com/_next/static/chunks/main.js | grep "VITE_API_URL"
```

---

#### 2.3.3 GitHub Actions Secrets

Setze folgende Secrets im GitHub-Repository (Settings → Secrets → Actions):

**Vercel:**
```
VERCEL_TOKEN=<von Vercel Dashboard → Settings → Tokens>
VERCEL_ORG_ID=<von Vercel Dashboard → Settings → General>
VERCEL_FRONTEND_PROJECT_ID=<von Vercel Projekt-Settings>
VERCEL_SCOPE=<dein Vercel-Username oder Team-Name>
```

**Railway:**
```
RAILWAY_TOKEN=<von Railway Dashboard → Account → Tokens>
```

**Alle Backend-ENV-Variablen (siehe 2.3.1):**
```
JWT_SECRET=...
DATABASE_URL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
OPENAI_API_KEY=...
SENTRY_DSN=...
# etc.
```

**Verifikation:**
```bash
# Prüfe GitHub Actions Workflow
git push origin main
# Workflow sollte erfolgreich durchlaufen
```

---

### 2.4 Database Migrations

- [ ] **Migrations ausführen:**

**Lokal (Test):**
```bash
cd backend
DATABASE_URL="postgresql://..." npm run migrate:latest
```

**Production (Railway):**
```bash
# Option 1: Railway CLI
railway run npm run migrate:latest

# Option 2: GitHub Actions (automatisch bei Deployment)
# Siehe .github/workflows/deploy-production.yml
```

- [ ] **Verify Tabellen:**
```bash
psql $DATABASE_URL -c "\dt"
# Sollte anzeigen:
# - users
# - refresh_tokens
# - analysis_sessions
# - webhook_events
# - subscriptions
```

- [ ] **Verify Indexes:**
```bash
psql $DATABASE_URL -c "\di"
# Sollte Indexes für email, token, deletion_scheduled_at, etc. anzeigen
```

**Verifikation:**
```bash
# Test-User erstellen (via API)
curl -X POST https://api.aurapresence.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# User in DB prüfen
psql $DATABASE_URL -c "SELECT id, email FROM users WHERE email='test@example.com';"
```

---

## 🟢 Phase 3: External Services

**Deadline:** Vor Launch  
**Verantwortlich:** User  
**Geschätzter Aufwand:** 2-3 Stunden

### 3.1 Stripe (Payment)

- [ ] **Account erstellen:** [stripe.com](https://stripe.com/)
- [ ] **Live-Mode aktivieren:** Stripe Dashboard → Developers → API Keys
- [ ] **Keys kopieren:**
  - [ ] `STRIPE_SECRET_KEY` (sk_live_...)
  - [ ] `STRIPE_PUBLISHABLE_KEY` (pk_live_...) - Frontend braucht dies nicht, nur Backend
- [ ] **Product erstellen:**
  - [ ] Dashboard → Products → "Add Product"
  - [ ] Name: "Aura Presence Premium"
  - [ ] Preis: z.B. 9,99€/Monat
  - [ ] Recurring: Monatlich
  - [ ] Price-ID kopieren: `STRIPE_PRICE_ID`
- [ ] **Webhook einrichten:**
  - [ ] Dashboard → Developers → Webhooks → "Add Endpoint"
  - [ ] URL: `https://api.aurapresence.com/api/subscription/webhook`
  - [ ] Events auswählen:
    - [ ] `checkout.session.completed`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
  - [ ] Webhook-Secret kopieren: `STRIPE_WEBHOOK_SECRET` (whsec_...)

**Verifikation:**
```bash
# Test-Checkout erstellen
curl -X POST https://api.aurapresence.com/api/subscription/create-checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Webhook testen (Stripe CLI)
stripe listen --forward-to https://api.aurapresence.com/api/subscription/webhook
stripe trigger checkout.session.completed
```

---

### 3.2 OpenAI (AI-Interpretation)

- [ ] **Account erstellen:** [platform.openai.com](https://platform.openai.com/)
- [ ] **Billing einrichten:** Payment-Method hinzufügen
- [ ] **API Key erstellen:** API Keys → "Create new secret key"
- [ ] **Key kopieren:** `OPENAI_API_KEY` (sk-...)
- [ ] **Usage-Limits setzen:** Settings → Limits (empfohlen: $50/Monat für Start)

**Verifikation:**
```bash
# Test-Analyse mit AI-Interpretation
curl -X POST https://api.aurapresence.com/api/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "eye_contact_quality": 0.8,
      "blink_rate": 18,
      "posture_angle": 5,
      "frame_timestamp": 1234567890
    },
    "sessionId": "test-session-123",
    "metadata": {"samplesCount": 5}
  }'

# Response sollte "interpretation.feedback" mit echtem OpenAI-Text enthalten
```

---

### 3.3 Sentry (Error-Monitoring)

- [ ] **Account erstellen:** [sentry.io](https://sentry.io/)
- [ ] **2 Projekte erstellen:**
  - [ ] **Frontend-Projekt:**
    - Platform: JavaScript → React
    - Name: "Aura Presence Frontend"
    - DSN kopieren: `VITE_SENTRY_DSN`
  - [ ] **Backend-Projekt:**
    - Platform: Node.js → Express
    - Name: "Aura Presence Backend"
    - DSN kopieren: `SENTRY_DSN`
- [ ] **Alerts konfigurieren:**
  - [ ] E-Mail-Benachrichtigungen bei neuen Errors
  - [ ] Slack-Integration (optional)
- [ ] **Performance-Monitoring aktivieren:** (optional, aber empfohlen)

**Verifikation:**
```bash
# Test-Error triggern (Backend)
curl https://api.aurapresence.com/api/test-error

# Test-Error triggern (Frontend)
# Browser-Konsole: throw new Error("Sentry Test")

# Prüfe Sentry-Dashboard
# Sollte neuen Error anzeigen
```

---

### 3.4 TURN-Server (WebRTC)

**Option A: Metered.ca (empfohlen, einfach)**

- [ ] **Account erstellen:** [metered.ca](https://www.metered.ca/)
- [ ] **Free-Tier aktivieren:** 50 GB/Monat kostenlos
- [ ] **Credentials kopieren:**
  - [ ] `VITE_TURN_USERNAME`
  - [ ] `VITE_TURN_CREDENTIAL`
- [ ] **Server-URLs notieren:** (automatisch in metered.ca)

**Option B: Eigener coturn-Server (komplex)**

- [ ] **Server provisionieren:** VPS mit öffentlicher IP (z.B. DigitalOcean)
- [ ] **coturn installieren:** `sudo apt install coturn`
- [ ] **Konfigurieren:** `/etc/turnserver.conf`
- [ ] **Ports öffnen:** 3478 (UDP/TCP), 5349 (TLS)
- [ ] **Credentials generieren:** `turnadmin -a -u username -p password`

**Verifikation:**
```bash
# WebRTC-Connection testen (im Browser)
# Frontend → AnalysisView → Live-Kamera starten
# Browser-Konsole sollte zeigen:
# "ICE Candidate: relay" (bedeutet TURN wird genutzt)

# Oder mit WebRTC-Test-Tool:
# https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
```

---

## 🔵 Phase 4: Deployment

**Deadline:** Launch-Tag  
**Verantwortlich:** User (DevOps)  
**Geschätzter Aufwand:** 2-4 Stunden

### 4.1 Initial Deployment

- [ ] **Code committen:**
```bash
git add .
git commit -m "Production-ready: All ENV-variables configured"
git push origin main
```

- [ ] **GitHub Actions prüfen:**
  - [ ] Workflow läuft durch (grüner Haken)
  - [ ] Frontend deployed zu Vercel
  - [ ] Backend deployed zu Railway
  - [ ] Migrations ausgeführt

- [ ] **Deployment-Logs prüfen:**
  - [ ] Vercel-Dashboard → Deployments → Latest → Logs
  - [ ] Railway-Dashboard → Deployments → Latest → Logs

**Verifikation:**
```bash
# Frontend erreichbar
curl -I https://aurapresence.com
# Sollte 200 OK zurückgeben

# Backend erreichbar
curl https://api.aurapresence.com/api/health
# Sollte {"status":"ok","timestamp":...} zurückgeben
```

---

### 4.2 Smoke-Tests

**Backend-API:**
```bash
# Health-Check
curl https://api.aurapresence.com/api/health

# Registrierung
curl -X POST https://api.aurapresence.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"smoketest@example.com","password":"Test1234"}'

# Login
curl -X POST https://api.aurapresence.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smoketest@example.com","password":"Test1234"}'

# Sollte Access-Token + Refresh-Token zurückgeben
```

**Frontend:**
- [ ] **Startseite lädt:** https://aurapresence.com
- [ ] **Registrierung funktioniert:** /register
- [ ] **Login funktioniert:** /login
- [ ] **Dashboard lädt:** Nach Login
- [ ] **Kamera-Zugriff:** AnalysisView → Live-Kamera
- [ ] **MediaPipe lädt:** Pose/Face/Hands-Detection
- [ ] **Analyse funktioniert:** "Analyse starten" Button
- [ ] **Legal-Pages laden:** /datenschutz, /agb, /impressum
- [ ] **Cookie-Banner erscheint:** Beim ersten Besuch

---

### 4.3 Integration-Tests

**Stripe-Integration:**
```bash
# Checkout-Session erstellen
curl -X POST https://api.aurapresence.com/api/subscription/create-checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Sollte Stripe-Checkout-URL zurückgeben
```

- [ ] **Test-Payment durchführen:**
  - [ ] Checkout-URL im Browser öffnen
  - [ ] Test-Kreditkarte: `4242 4242 4242 4242`
  - [ ] Expiry: Beliebiges zukünftiges Datum
  - [ ] CVC: Beliebige 3 Ziffern
  - [ ] Payment abschließen
  - [ ] Redirect zu Frontend sollte funktionieren

- [ ] **Webhook-Event prüfen:**
```bash
# In Railway-Logs sollte stehen:
# "Webhook received: checkout.session.completed"

# In DB prüfen:
psql $DATABASE_URL -c "SELECT * FROM webhook_events ORDER BY processed_at DESC LIMIT 1;"
# Sollte Event mit type='checkout.session.completed' anzeigen

# Subscription-Status prüfen:
curl https://api.aurapresence.com/api/subscription/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Sollte "status": "active" zurückgeben
```

**GDPR-Flows:**
```bash
# Data-Export
curl https://api.aurapresence.com/api/gdpr/export \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Sollte User-Daten + Analysis-Sessions zurückgeben

# Account-Deletion planen
curl -X DELETE https://api.aurapresence.com/api/gdpr/delete-account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Sollte scheduledFor-Timestamp zurückgeben (30 Tage in Zukunft)

# Deletion abbrechen
curl -X POST https://api.aurapresence.com/api/gdpr/cancel-deletion \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Sollte success: true zurückgeben
```

---

## 🟣 Phase 5: Monitoring & Observability

**Deadline:** Innerhalb 24h nach Launch  
**Verantwortlich:** User (DevOps)  
**Geschätzter Aufwand:** 1-2 Stunden

### 5.1 Sentry-Dashboards

- [ ] **Frontend-Dashboard einrichten:**
  - [ ] Issues → Filter: "is:unresolved"
  - [ ] Performance → Transactions sortieren nach "p95 duration"
  - [ ] Alerts: E-Mail bei neuen Errors
- [ ] **Backend-Dashboard einrichten:**
  - [ ] Issues → Filter: "is:unresolved"
  - [ ] Performance → Endpoints sortieren nach "throughput"
  - [ ] Alerts: E-Mail bei Error-Rate > 5%

---

### 5.2 Log-Monitoring

- [ ] **Railway-Logs prüfen:**
  - [ ] Backend-Service → Logs → Filter: "error"
  - [ ] Keine kritischen Errors in letzten 24h
- [ ] **Winston-Logs prüfen:**
```bash
# SSH in Railway-Container (falls möglich) oder via Railway CLI
railway logs --tail 100

# Sollte strukturierte JSON-Logs zeigen
```

---

### 5.3 Performance-Monitoring

- [ ] **Frontend-Performance:**
  - [ ] Lighthouse-Score > 90 (Performance)
  - [ ] First Contentful Paint < 2s
  - [ ] Time to Interactive < 3s
- [ ] **Backend-Performance:**
  - [ ] `/api/health` Response-Time < 100ms
  - [ ] `/api/analyze` Response-Time < 2s (mit OpenAI)
  - [ ] Database-Query-Time < 50ms (durchschnittlich)

**Tools:**
```bash
# Lighthouse (Frontend)
npx lighthouse https://aurapresence.com --view

# API-Response-Times (Backend)
curl -w "@curl-format.txt" -o /dev/null -s https://api.aurapresence.com/api/health

# curl-format.txt:
# time_total: %{time_total}s
```

---

### 5.4 Uptime-Monitoring (optional)

- [ ] **UptimeRobot einrichten:** [uptimerobot.com](https://uptimerobot.com/)
  - [ ] Monitor für Frontend: https://aurapresence.com
  - [ ] Monitor für Backend: https://api.aurapresence.com/api/health
  - [ ] Alert via E-Mail bei Downtime
- [ ] **Oder: Sentry Cron-Monitoring:**
  - [ ] Cron-Job für Health-Checks
  - [ ] Alert bei Ausfall

---

## 🟠 Phase 6: Post-Launch

**Deadline:** Erste Woche nach Launch  
**Verantwortlich:** User  
**Geschätzter Aufwand:** Ongoing

### 6.1 User-Feedback sammeln

- [ ] **Feedback-Formular:** Im Dashboard oder Footer
- [ ] **Analytics einrichten:** (optional, DSGVO-konform)
  - [ ] Plausible Analytics (Privacy-First)
  - [ ] ODER: Matomo (Self-Hosted)
- [ ] **User-Interviews:** Erste 10 User befragen

---

### 6.2 Bug-Tracking

- [ ] **Sentry-Issues priorisieren:**
  - [ ] Kritische Bugs (Crash, Payment-Fehler) → Sofort fixen
  - [ ] Mittlere Bugs (UI-Glitches) → Innerhalb 1 Woche
  - [ ] Kleine Bugs (Typos) → Backlog
- [ ] **GitHub-Issues erstellen:** Für Feature-Requests

---

### 6.3 Performance-Optimierung

- [ ] **Database-Queries optimieren:**
```bash
# Slow-Query-Log aktivieren (PostgreSQL)
psql $DATABASE_URL -c "ALTER SYSTEM SET log_min_duration_statement = 1000;"
# Queries > 1s werden geloggt

# Indexes hinzufügen falls nötig
```

- [ ] **CDN für Static-Assets:** (Vercel bietet automatisch)
- [ ] **Caching-Strategy:** Redis für AI-Responses (optional)

---

### 6.4 Security-Audit

- [ ] **Dependency-Scan:**
```bash
cd backend && npm audit
cd frontend && npm audit

# Kritische Vulnerabilities fixen
npm audit fix
```

- [ ] **OWASP-Check:** [owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)
  - [ ] SQL-Injection: ✅ Knex.js schützt automatisch
  - [ ] XSS: ✅ React schützt automatisch
  - [ ] CSRF: ✅ JWT-basiert (kein Cookie)
  - [ ] Rate-Limiting: ✅ Implementiert
  - [ ] Input-Validierung: ✅ Joi-Schemas

- [ ] **Penetration-Test:** (optional, aber empfohlen)
  - [ ] Externer Dienstleister beauftragen
  - [ ] ODER: Bug-Bounty-Programm starten

---

### 6.5 Backup-Strategy

- [ ] **Database-Backups:**
  - [ ] Railway: Automatische Backups aktiviert (täglich)
  - [ ] Supabase: Point-in-Time-Recovery aktiviert
  - [ ] ODER: Eigenes Backup-Script:
```bash
# backend/scripts/backup-db.sh bereits vorhanden
chmod +x backend/scripts/backup-db.sh

# Cron-Job einrichten (täglich um 3 Uhr)
0 3 * * * /path/to/backend/scripts/backup-db.sh
```

- [ ] **Code-Backups:**
  - [ ] GitHub-Repository ist bereits Backup
  - [ ] Regelmäßige Releases taggen: `git tag v1.0.0 && git push --tags`

---

## 🔴 Rollback-Strategy

Falls kritische Bugs nach Launch auftreten:

### Option 1: Railway Rollback

```bash
# Railway CLI
railway rollback

# Oder im Dashboard: Deployments → Previous Deployment → "Redeploy"
```

### Option 2: Vercel Rollback

```bash
# Vercel CLI
vercel rollback

# Oder im Dashboard: Deployments → Previous Deployment → "Promote to Production"
```

### Option 3: Git-Revert

```bash
# Letzten Commit rückgängig machen
git revert HEAD
git push origin main

# GitHub Actions deployed automatisch die vorherige Version
```

---

## 📊 Success-Metriken

Nach Launch sollten folgende Metriken getrackt werden:

### Woche 1
- [ ] **Uptime:** > 99.5%
- [ ] **Error-Rate:** < 1%
- [ ] **Response-Time (Backend):** < 500ms (p95)
- [ ] **User-Registrierungen:** > 10
- [ ] **Successful Payments:** > 1

### Monat 1
- [ ] **Uptime:** > 99.9%
- [ ] **Error-Rate:** < 0.5%
- [ ] **Active Users:** > 50
- [ ] **Conversion-Rate (Free → Paid):** > 5%
- [ ] **Churn-Rate:** < 10%

---

## 🎉 Launch-Checklist (Final)

**Am Launch-Tag:**

- [ ] **Alle ENV-Variablen gesetzt** (Backend + Frontend)
- [ ] **Database-Migrations erfolgreich**
- [ ] **Smoke-Tests bestanden**
- [ ] **Legal-Pages live** (Datenschutz, AGB, Impressum)
- [ ] **Stripe-Webhooks konfiguriert**
- [ ] **Sentry-Monitoring aktiv**
- [ ] **TURN-Server funktioniert**
- [ ] **Domain-DNS propagiert**
- [ ] **SSL-Zertifikate aktiv**
- [ ] **Backup-Strategy aktiviert**
- [ ] **Team-Kommunikation:** Alle Stakeholder informiert

**Nach Launch:**

- [ ] **Social-Media-Announcement** (optional)
- [ ] **Product-Hunt-Launch** (optional)
- [ ] **Monitoring-Dashboards im Auge behalten** (erste 24h)
- [ ] **User-Support bereitstellen** (E-Mail, Chat)

---

## 📞 Support & Kontakt

**Bei Problemen:**
1. **Sentry-Dashboard prüfen:** Errors & Performance
2. **Railway/Vercel-Logs prüfen:** Deployment-Fehler
3. **GitHub-Issues erstellen:** Für Bugs/Features
4. **Community-Support:** (falls vorhanden)

**Wichtige Links:**
- Frontend: https://aurapresence.com
- Backend: https://api.aurapresence.com
- Sentry: https://sentry.io/organizations/your-org/
- Railway: https://railway.app/project/your-project
- Vercel: https://vercel.com/your-team/aura-presence-frontend
- Stripe: https://dashboard.stripe.com/

---

**Viel Erfolg beim Launch! 🚀**

*Letzte Aktualisierung: 2025-01-03*

