# 🚀 Production Deployment Guide

Vollständige Schritt-für-Schritt-Anleitung für Production-Deployment mit HTTPS/SSL.

## 📋 Übersicht

**Deployment-Strategie:**
- **Frontend**: Vercel (automatisches HTTPS, CDN, zero-config)
- **Backend**: Railway (automatisches HTTPS, PostgreSQL, scaling)
- **Database**: PostgreSQL (via Railway oder Supabase)
- **TURN-Server**: Metered.ca (WebRTC, managed)

**Voraussetzungen:**
- [ ] Domain gekauft (z.B. `aurapresence.com`)
- [ ] DNS-Zugriff (Nameserver/A-Records konfigurierbar)
- [ ] Vercel Account
- [ ] Railway Account
- [ ] GitHub Repository

---

## 🌐 Teil 1: Frontend-Deployment (Vercel)

### Schritt 1: Vercel Account erstellen

1. Gehe zu https://vercel.com/signup
2. Signup mit GitHub Account (empfohlen)
3. Autorisiere Vercel-Zugriff auf GitHub

### Schritt 2: Projekt importieren

1. Vercel Dashboard → **New Project**
2. **Import Git Repository** → Wähle dein Aura Presence Repo
3. **Root Directory**: `frontend/`
4. **Framework Preset**: Vite (automatisch erkannt)

### Schritt 3: Environment-Variablen setzen

**Vercel Dashboard → Settings → Environment Variables**

```env
VITE_API_URL=https://api.aurapresence.com
VITE_TURN_USERNAME=your-turn-username
VITE_TURN_CREDENTIAL=your-turn-credential
VITE_SENTRY_DSN=https://your-sentry-dsn@o123.ingest.sentry.io/789
VITE_SENTRY_RELEASE=v1.0.0
```

**Wichtig:**
- `VITE_API_URL` MUSS auf Backend-URL zeigen (siehe Teil 2)
- Variablen werden **beim Build** eingebunden (nicht Runtime!)

### Schritt 4: Build-Settings prüfen

**Vercel sollte automatisch erkennen:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

**Falls nicht:** Settings → General → Build & Development Settings

### Schritt 5: Deploy

1. Klicke **Deploy**
2. Warte ~2 Minuten (Build-Log anschauen)
3. **Success!** → Du erhältst URL wie `https://aura-presence-123abc.vercel.app`

### Schritt 6: Custom Domain hinzufügen

1. Vercel Dashboard → Settings → **Domains**
2. Klicke **Add**
3. Gib Domain ein: `app.aurapresence.com`
4. Vercel zeigt DNS-Konfiguration:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

5. Gehe zu deinem Domain-Provider (Namecheap, GoDaddy, etc.)
6. Füge CNAME-Record hinzu
7. Warte ~10 Minuten (DNS-Propagation)
8. Vercel verifiziert automatisch & aktiviert **Let's Encrypt SSL**

**Erwartung:** `https://app.aurapresence.com` ist jetzt live mit **HTTPS**! 🎉

### Schritt 7: Auto-Deploys aktivieren

**Bereits aktiv!** Vercel deployed automatisch bei:
- Push zu `main` → Production
- Push zu anderen Branches → Preview

**Deaktivieren:** Settings → Git → Auto-Deploy

---

## 🖥️ Teil 2: Backend-Deployment (Railway)

### Schritt 1: Railway Account erstellen

1. Gehe zu https://railway.app/
2. Signup mit GitHub Account
3. Autorisiere Railway-Zugriff

### Schritt 2: PostgreSQL-Datenbank erstellen

1. Railway Dashboard → **New Project**
2. Wähle **PostgreSQL** Template
3. Database wird automatisch erstellt
4. **Connection Details** kopieren:

```
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

**Wichtig:** Notiere `DATABASE_URL` für später!

### Schritt 3: Backend-Service erstellen

1. Im selben Project → **New Service**
2. Wähle **GitHub Repo** → Aura Presence
3. **Root Directory**: `backend/`
4. **Start Command**: `npm start`

### Schritt 4: Environment-Variablen setzen

**Railway Dashboard → Service → Variables**

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=generate-with-openssl-rand-base64-48
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=https://app.aurapresence.com
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
SENTRY_DSN=https://...
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=warn
DB_POOL_MIN=2
DB_POOL_MAX=10
```

**Spezial-Syntax:**
- `${{Postgres.DATABASE_URL}}` → Referenziert automatisch die DB-URL
- Keine Anführungszeichen nötig

**JWT_SECRET generieren:**

```bash
# PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Bash/macOS
openssl rand -base64 48
```

### Schritt 5: Deploy

1. Railway deployed automatisch nach Variable-Setup
2. Warte ~3 Minuten
3. **Success!** → URL wie `https://aura-backend-production.up.railway.app`

### Schritt 6: Health-Check

```bash
curl https://your-railway-url.up.railway.app/health
```

**Erwartung:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T10:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Schritt 7: Database-Migrations ausführen

**Via Railway CLI:**

```bash
# 1. Railway CLI installieren
npm i -g @railway/cli

# 2. Login
railway login

# 3. Link zu Project
railway link

# 4. Run Migration
railway run npm run migrate:latest
```

**Alternative:** In Backend `src/database/db.js` → Migrations laufen automatisch bei Server-Start

### Schritt 8: Custom Domain hinzufügen

1. Railway Dashboard → Settings → **Networking**
2. **Custom Domain** → Add Domain
3. Gib ein: `api.aurapresence.com`
4. Railway zeigt DNS-Konfiguration:

```
Type: CNAME
Name: api
Value: your-app.up.railway.app
```

5. Gehe zu Domain-Provider
6. Füge CNAME-Record hinzu
7. Warte ~10 Minuten
8. Railway aktiviert **Let's Encrypt SSL** automatisch

**Erwartung:** `https://api.aurapresence.com` ist jetzt live! 🚀

### Schritt 9: Frontend-Backend verbinden

**Vercel Environment-Variable updaten:**

1. Vercel Dashboard → Settings → Environment Variables
2. Edit `VITE_API_URL`
3. Setze auf: `https://api.aurapresence.com`
4. **Redeploy** triggern (Settings → Deployments → ... → Redeploy)

**Test:**

```bash
# Öffne https://app.aurapresence.com
# Login → Analyse starten
# Erwartung: Backend-Requests erfolgreich
```

---

## 🔒 Teil 3: SSL/HTTPS-Verifizierung

### SSL-Zertifikat prüfen

**Browser-Test:**

1. Öffne `https://app.aurapresence.com`
2. Klicke auf Schloss-Symbol (URL-Bar)
3. **Erwartung:** "Verbindung ist sicher"

**SSL Labs Test:**

1. Gehe zu https://www.ssllabs.com/ssltest/
2. Gib ein: `app.aurapresence.com`
3. Warte ~2 Minuten
4. **Erwartung:** Rating **A** oder **A+**

**Command-Line-Test:**

```bash
# Frontend
curl -I https://app.aurapresence.com

# Backend
curl -I https://api.aurapresence.com/health

# Erwartung: HTTP/2 200, kein Zertifikats-Error
```

### HTTPS-Erzwingung (HTTP → HTTPS Redirect)

**Vercel:** Automatisch aktiviert (keine Konfiguration nötig)

**Railway:** Automatisch aktiviert

**Manuell prüfen:**

```bash
curl -I http://app.aurapresence.com
# Erwartung: 301 Moved Permanently → https://app.aurapresence.com
```

### HSTS-Header aktivieren

**Was ist HSTS?**
Strict-Transport-Security: Browser merken sich "immer HTTPS verwenden"

**Vercel:**
1. `vercel.json` im Frontend-Root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

2. Git commit + push → Auto-Deploy

**Railway:**
In `backend/src/server.js` (via Helmet - bereits aktiv!):

```javascript
app.use(helmet({
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 🔧 Teil 4: Monitoring & Logs

### Vercel-Logs

**Real-Time:**
1. Vercel Dashboard → Project → **Logs**
2. Filter: All, Errors, Runtime

**Integration mit externen Tools:**
- Vercel → Datadog
- Vercel → Sentry (automatisch via Sentry SDK)

### Railway-Logs

**Real-Time:**
1. Railway Dashboard → Service → **Logs**
2. Filter nach Level (info, warn, error)

**Via CLI:**

```bash
railway logs --follow
```

### Sentry-Monitoring

**Dashboard:** https://sentry.io/

**Erwartung:**
- Errors mit Stack-Traces
- Performance-Metriken (Response-Times)
- User-Context (anonymisiert)

**Alert-Regeln:**
1. Sentry → Alerts → Create Alert
2. Bedingung: Error-Count > 10 in 1 hour
3. Action: E-Mail / Slack

---

## 💡 Teil 5: Production-Best-Practices

### Environment-Variables-Checkliste

- [ ] `JWT_SECRET`: Min. 32 Zeichen, kryptografisch sicher
- [ ] `DATABASE_URL`: PostgreSQL (nicht SQLite!)
- [ ] `NODE_ENV`: Auf `production` gesetzt
- [ ] `LOG_LEVEL`: Auf `warn` oder `error` (nicht `debug`)
- [ ] `FRONTEND_URL`: HTTPS-URL (nicht `localhost`)
- [ ] Alle Secrets rotiert (nicht Development-Keys!)

### Sicherheits-Checks

- [ ] HTTPS aktiv (A+ Rating bei ssllabs.com)
- [ ] HSTS-Header gesetzt
- [ ] Secure Cookies (`secure: true, sameSite: 'strict'`)
- [ ] CSP-Header konfiguriert (via Helmet)
- [ ] CORS nur auf eigene Domain begrenzt
- [ ] Rate-Limiting aktiv
- [ ] Passwörter mit bcrypt (10+ Rounds)
- [ ] JWT-Tokens mit HMAC SHA256

### Performance-Optimierung

**Frontend (Vercel):**
- ✅ CDN (automatisch)
- ✅ Brotli-Kompression (automatisch)
- ✅ Asset-Caching (automatisch)

**Backend (Railway):**
- [ ] PostgreSQL Connection-Pool konfiguriert (`DB_POOL_MAX=10`)
- [ ] Monitoring aktiv (Sentry)
- [ ] Auto-Scaling aktiviert (Railway Pro-Plan)

### Backup-Strategie

**PostgreSQL-Backups:**

**Railway:**
- Automatische Backups: Täglich (Pro-Plan)
- Manueller Backup:

```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

**Supabase:** (Alternative zu Railway-DB)
- Automatische Backups: Täglich
- Point-in-Time-Recovery (PITR): 7 Tage

### Rollback-Plan

**Frontend (Vercel):**

1. Vercel Dashboard → Deployments
2. Finde letzte funktionierende Version
3. Klicke **...** → **Rollback**

**Backend (Railway):**

1. Railway Dashboard → Deployments
2. Wähle vorherige Version
3. Klicke **Rollback**

**Alternative:** Git-basierter Rollback:

```bash
# 1. Finde letzten working commit
git log --oneline -n 10

# 2. Revert zu diesem Commit
git revert <commit-hash>

# 3. Push → Auto-Deploy
git push origin main
```

---

## 📊 Teil 6: Domain-Konfiguration (Cheat Sheet)

### Namecheap

1. Login → Domain-Liste → **Manage**
2. **Advanced DNS** Tab
3. **Add New Record**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | app | cname.vercel-dns.com | Automatic |
| CNAME | api | your-app.up.railway.app | Automatic |

### GoDaddy

1. Login → My Products → **DNS**
2. **Add** → CNAME

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | app | cname.vercel-dns.com | 1 hour |
| CNAME | api | your-app.up.railway.app | 1 hour |

### Cloudflare

1. Login → Domain → **DNS**
2. **Add record**

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | app | cname.vercel-dns.com | ❌ DNS only |
| CNAME | api | your-app.up.railway.app | ❌ DNS only |

**Wichtig:** Proxy OFF (orange cloud OFF), sonst funktioniert Vercel-SSL nicht!

---

## 🐛 Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"

→ Domain nicht richtig konfiguriert

**Lösung:**
1. Prüfe DNS-Records (https://dnschecker.org/)
2. Warte 10-60 Minuten (DNS-Propagation)
3. Lösche Browser-Cache

### "ERR_CERT_COMMON_NAME_INVALID"

→ SSL-Zertifikat nicht für Custom Domain

**Lösung:**
1. Vercel/Railway Dashboard → Domain-Status prüfen
2. Falls "Pending": Warte noch
3. Falls "Error": DNS-Record prüfen (CNAME korrekt?)

### "Network Error" im Frontend

→ Backend nicht erreichbar

**Checkliste:**
1. `curl https://api.aurapresence.com/health` → Funktioniert?
2. CORS-Fehler? (Browser DevTools → Console)
3. `FRONTEND_URL` im Backend auf richtige URL?
4. `VITE_API_URL` im Frontend auf richtige URL?

### "500 Internal Server Error"

→ Backend-Fehler

**Debug:**
1. Railway Dashboard → Logs
2. Suche nach Error-Messages
3. Häufige Ursachen:
   - `DATABASE_URL` falsch
   - `JWT_SECRET` nicht gesetzt
   - Migration nicht gelaufen

### Database-Connection-Error

→ PostgreSQL nicht erreichbar

**Lösung:**
1. Railway Dashboard → PostgreSQL → Status prüfen
2. `DATABASE_URL` kopieren
3. Testen:

```bash
railway run psql $DATABASE_URL -c "SELECT version();"
```

---

## 📚 Weiterführende Ressourcen

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs](https://www.ssllabs.com/)
- [DNS Checker](https://dnschecker.org/)

---

**🎉 Geschafft! Deine App ist jetzt Production-Ready mit HTTPS! 🚀**

**Nächste Schritte:**
1. [WEBRTC_SETUP.md](WEBRTC_SETUP.md) - TURN-Server konfigurieren
2. [SENTRY_SETUP.md](SENTRY_SETUP.md) - Error-Tracking aktivieren
3. [STRIPE_SETUP.md](STRIPE_SETUP.md) - Subscriptions testen

