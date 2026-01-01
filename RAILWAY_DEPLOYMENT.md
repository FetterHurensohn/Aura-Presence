# Railway Backend Deployment Guide

## 🚂 Backend auf Railway deployen

### Schritt 1: Railway Account erstellen

1. Gehe zu **https://railway.app**
2. Klicke **"Start a New Project"** oder **"Login"**
3. Wähle **"Login with GitHub"**
4. Autorisiere Railway

---

### Schritt 2: Neues Projekt erstellen

1. Nach Login → **"New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. Wähle dein Repository **"aura-presence"**
4. Railway erkennt automatisch Node.js

---

### Schritt 3: Root Path konfigurieren

Railway muss wissen, dass das Backend im `backend/` Ordner liegt:

1. Klicke auf dein Projekt
2. Gehe zu **"Settings"** (Zahnrad oben rechts)
3. Scrolle zu **"Root Directory"**
4. Trage ein: `backend`
5. **Save**

---

### Schritt 4: Environment Variables konfigurieren

Klicke auf **"Variables"** und füge **ALLE** diese Variablen hinzu:

#### **Datenbank (Supabase)**
```bash
DATABASE_URL=postgresql://postgres.fefrkchgotntfdodouqg:5LrJLqO7FTpoHZ3M@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

#### **JWT Secrets**
```bash
JWT_SECRET=dein-super-geheimes-jwt-secret-mindestens-32-zeichen-lang
JWT_REFRESH_SECRET=dein-super-geheimes-refresh-secret-mindestens-32-zeichen-lang
```

#### **Node Environment**
```bash
NODE_ENV=production
PORT=3000
```

#### **CORS (Frontend URL)**
```bash
FRONTEND_URL=https://aura-presence-xxxxx.vercel.app
CORS_ORIGINS=https://aura-presence-xxxxx.vercel.app
```
⚠️ **Ersetze mit deiner echten Vercel-URL!**

#### **Supabase (Optional für Storage/Realtime)**
```bash
SUPABASE_URL=https://fefrkchgotntfdodouqg.supabase.co
SUPABASE_ANON_KEY=dein-anon-key-aus-supabase-dashboard
SUPABASE_SERVICE_KEY=dein-service-key-aus-supabase-dashboard
```

#### **OpenAI (Optional - für KI-Feedback)**
```bash
OPENAI_API_KEY=sk-...
```

#### **Stripe (Optional - für Subscriptions)**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...
```

#### **Sentry (Optional - Error Tracking)**
```bash
SENTRY_DSN=https://...@sentry.io/...
```

---

### Schritt 5: Deploy!

1. Nachdem alle Environment Variables gesetzt sind
2. Railway deployed **automatisch**
3. Warte ~2-3 Minuten

**Status:** Unter "Deployments" siehst du den Fortschritt

---

### Schritt 6: Domain URL kopieren

Nach erfolgreichem Deploy:

1. Klicke auf dein Service
2. Gehe zu **"Settings"**
3. Scrolle zu **"Domains"**
4. Klicke **"Generate Domain"**
5. Du bekommst: `aura-presence-backend.up.railway.app`

**Kopiere diese URL!** 📋

---

### Schritt 7: Backend-URL in Vercel setzen

Jetzt verbinden wir Frontend mit Backend:

1. Gehe zu **Vercel Dashboard**
2. Öffne dein Projekt **"aura-presence"**
3. Gehe zu **"Settings"** > **"Environment Variables"**
4. Füge hinzu oder aktualisiere:

```bash
VITE_API_URL=https://aura-presence-backend.up.railway.app
VITE_BACKEND_URL=https://aura-presence-backend.up.railway.app
```

5. **Save**
6. Gehe zu **"Deployments"**
7. Bei deinem letzten Deployment → **⋮** (3 Punkte) → **"Redeploy"**

---

### Schritt 8: Datenbank-Migrationen ausführen

Railway führt Migrationen **nicht automatisch** aus. Du musst sie manuell starten:

**Option 1: Railway CLI (empfohlen)**

```bash
# Installiere Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link zum Projekt
railway link

# Run Migrations
railway run npm run db:migrate
```

**Option 2: Über Railway Dashboard**

1. Klicke auf dein Service
2. Gehe zu **"Settings"**
3. Scrolle zu **"Deploy"**
4. Bei **"Custom Start Command"** ändere temporär zu:
   ```bash
   npm run db:migrate && npm start
   ```
5. Nach dem nächsten Deploy läuft es

⚠️ **Ändere danach zurück zu:** `npm start`

---

### Schritt 9: Testen!

**Backend Health Check:**
```
https://aura-presence-backend.up.railway.app/health
```

**Erwartete Ausgabe:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

**User Registrierung testen:**

```powershell
$backend = "https://aura-presence-backend.up.railway.app"
$body = @{email="railway-test@example.com"; password="Test1234!"} | ConvertTo-Json

Invoke-RestMethod -Uri "$backend/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Erwartete Ausgabe:**
```json
{
  "message": "Registrierung erfolgreich",
  "user": { "id": 1, "email": "railway-test@example.com" },
  "token": "eyJhbGc...",
  "refreshToken": "..."
}
```

---

## 🔧 CORS Konfiguration

Dein Backend muss die Vercel-URL erlauben. Überprüfe `backend/src/server.js`:

Die CORS-Konfiguration sollte so aussehen:
```javascript
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

✅ **Das sollte bereits konfiguriert sein!**

---

## 📊 Monitoring

Railway Dashboard zeigt:
- **Deployments:** Verlauf aller Deployments
- **Metrics:** CPU, Memory, Network
- **Logs:** Real-time Server-Logs
- **Usage:** Kosten-Tracking

---

## 💰 Kosten

**Free Tier:**
- $5 Gratis-Guthaben/Monat
- Begrenzte Ressourcen
- Automatisches Sleep nach Inaktivität

**Hobby Plan ($5/Monat):**
- $5 Guthaben + Pay-as-you-go
- Kein Auto-Sleep
- Mehr Ressourcen

Für MVP reicht **Free Tier** vollkommen!

---

## 🔍 Troubleshooting

### Problem: "Module not found"
**Lösung:**
- Root Directory muss `backend` sein
- Build Command: `npm ci` (nicht `npm install`)

### Problem: "Database connection failed"
**Lösung:**
- Überprüfe `DATABASE_URL` in Variables
- Format: `postgresql://postgres.[ref]:[pass]@aws-1-[region].pooler.supabase.com:6543/postgres`

### Problem: "CORS error" im Frontend
**Lösung:**
- `FRONTEND_URL` und `CORS_ORIGINS` müssen Vercel-URL enthalten
- Redeploy Backend nach Änderung

### Problem: "Migrations not run"
**Lösung:**
- Führe manuell aus: `railway run npm run db:migrate`

### Problem: "Application crashed"
**Lösung:**
- Überprüfe Logs in Railway Dashboard
- Meist fehlen Environment Variables

---

## ✅ Vollständige Checkliste

### Railway Setup
- [ ] Account erstellt und mit GitHub verbunden
- [ ] Projekt aus Repository erstellt
- [ ] Root Directory auf `backend` gesetzt
- [ ] Alle Environment Variables gesetzt
- [ ] Deploy abgeschlossen (Status: Running)
- [ ] Domain generiert und kopiert
- [ ] Migrations ausgeführt
- [ ] `/health` Endpoint funktioniert

### Vercel Integration
- [ ] Backend-URL in Vercel Environment Variables
- [ ] Frontend redeployed
- [ ] CORS funktioniert

### Funktionstest
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Token-Refresh funktioniert
- [ ] Frontend kann mit Backend kommunizieren

---

## 🎯 Nach erfolgreicher Railway-Einrichtung:

Du hast dann:
- ✅ Frontend auf Vercel
- ✅ Backend auf Railway
- ✅ Datenbank auf Supabase
- ✅ Vollständig funktionsfähige App!

---

**Los geht's! Folge den Schritten und sag Bescheid wenn du Hilfe brauchst!** 🚂

