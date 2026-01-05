# 🚀 Render.com Migration Guide - Von Railway zu Render

## ✅ Vorbereitung abgeschlossen!

Alle notwendigen Dateien wurden aktualisiert:
- ✅ `render.yaml` erstellt (Render Blueprint)
- ✅ `frontend/src/services/apiService.js` aktualisiert
- ✅ `frontend/src/services/webrtcService.js` aktualisiert

---

## 📋 MIGRATIONS-CHECKLISTE

### ⏱️ Geschätzte Zeit: 15-20 Minuten

---

## 🎯 SCHRITT 1: Render Account erstellen (2 Minuten)

1. Gehe zu: **https://render.com**
2. Klicke auf **"Get Started"**
3. Wähle **"Sign up with GitHub"**
4. Autorisiere Render für dein GitHub-Konto
5. ✅ Account erstellt!

---

## 🗄️ SCHRITT 2: Blueprint Deployment (5 Minuten)

### 2.1 Blueprint starten:
1. Im Render Dashboard: Klicke **"New +"** (oben rechts)
2. Wähle **"Blueprint"**
3. Verbinde dein Repository: **"FetterHurensohn/Aura-Presence"**
4. Render erkennt automatisch die `render.yaml`

### 2.2 Blueprint Review:
Du siehst:
- 🖥️ **Web Service:** aura-presence-backend
- 🗄️ **Database:** aura-presence-db (PostgreSQL)

### 2.3 Service Namen anpassen (optional):
- Backend Service Name: `aura-presence-backend` ✅
- Database Name: `aura-presence-db` ✅

### 2.4 Deploy starten:
- Klicke **"Apply"**
- ⏳ Render erstellt jetzt Backend + Datenbank (~3-5 Minuten)

---

## 🔐 SCHRITT 3: API Keys & Secrets setzen (3 Minuten)

### 3.1 Backend Service öffnen:
1. Dashboard → **"aura-presence-backend"**
2. Klicke auf **"Environment"** (linkes Menü)

### 3.2 Fehlende Secrets hinzufügen:

Klicke **"Add Environment Variable"** für jedes:

```
OPENAI_API_KEY=<dein-openai-key>
STRIPE_SECRET_KEY=<dein-stripe-key>
STRIPE_WEBHOOK_SECRET=<dein-stripe-webhook-secret>
SENTRY_DSN=<dein-sentry-dsn> (optional)
```

**Wo finde ich diese Keys?**
- **OpenAI:** https://platform.openai.com/api-keys
- **Stripe:** https://dashboard.stripe.com/apikeys
- **Sentry:** https://sentry.io (optional)

### 3.3 Speichern:
- Nach jedem Key: Klicke **"Add"**
- Render deployed automatisch neu

---

## 🗃️ SCHRITT 4: Datenbank Migrationen (2 Minuten)

### 4.1 Backend Shell öffnen:
1. Backend Service → **"Shell"** (oben rechts)
2. Warte bis Shell lädt

### 4.2 Migrationen ausführen:
Im Shell Terminal eingeben:

```bash
cd backend
npm run migrate
```

✅ Output sollte zeigen:
```
Batch 1 run: 4 migrations
✅ Migration successful
```

### 4.3 Verifizieren:
```bash
npm run migrate:status
```

---

## 🌐 SCHRITT 5: Vercel Environment Variables aktualisieren (2 Minuten)

### 5.1 Neue Render URL kopieren:
1. In Render: Backend Service → oben steht die URL
2. Beispiel: `https://aura-presence-backend.onrender.com`
3. **Kopiere diese URL!**

### 5.2 Vercel Dashboard öffnen:
1. Gehe zu: **https://vercel.com**
2. Wähle Projekt: **"aura-presence-analyser"**
3. Settings → **"Environment Variables"**

### 5.3 URLs aktualisieren:
Bearbeite diese Variables:

```
VITE_API_URL=https://aura-presence-backend.onrender.com
VITE_BACKEND_URL=https://aura-presence-backend.onrender.com
```

### 5.4 Redeploy Frontend:
- Vercel → Deployments → **"Redeploy"**
- Oder: Einfach zu GitHub pushen (Auto-Deploy)

---

## ✅ SCHRITT 6: Testen (2 Minuten)

### 6.1 Backend Health Check:
Öffne in Browser:
```
https://aura-presence-backend.onrender.com/health
```

✅ Sollte zeigen:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 6.2 Frontend testen:
1. Öffne: **https://aura-presence-analyser.vercel.app**
2. Teste **Login** mit: `jacquesdong9@gmail.com`
3. Teste **Profile Update** (Name ändern)
4. Teste **Sprache ändern**

### 6.3 Routes testen (optional):
Auf deinem Computer:
```bash
cd backend
node test-railway-routes.js
```

Ändere im Script die URL zu Render:
```javascript
const BASE_URL = 'https://aura-presence-backend.onrender.com';
```

---

## 🎉 FERTIG!

### ✅ Was du jetzt hast:

- 🖥️ **Backend:** Render.com (kostenlos)
- 🗄️ **PostgreSQL:** Render.com (500 MB kostenlos)
- 🌐 **Frontend:** Vercel.com (kostenlos)
- 💰 **Kosten:** $0/Monat!

---

## ⚠️ WICHTIG: Cold Starts

**Was sind Cold Starts?**
- Render schläft Backend ein nach **15 Min Inaktivität**
- Erster Request nach Schlaf: **~30-60 Sekunden**
- Danach: Normal schnell

**Workaround (optional):**
1. Nutze **Uptime Robot** (https://uptimerobot.com) - Kostenlos
2. Ping dein Backend alle 10 Minuten
3. Backend schläft nie ein ✅

---

## 📊 Nach der Migration

### Railway deaktivieren:
1. Railway Dashboard öffnen
2. Service → Settings → **"Delete Service"**
3. Database → Settings → **"Delete Database"**
4. ✅ Railway vollständig entfernt

### Git Commit:
```bash
git add .
git commit -m "🚀 Migrate from Railway to Render.com

- Added render.yaml blueprint
- Updated frontend URLs to Render
- Backend now on: https://aura-presence-backend.onrender.com
- PostgreSQL on Render (500 MB free)
- Total cost: $0/month 🎉"
git push origin main
```

---

## 🆘 Troubleshooting

### Problem: "Database migration failed"
**Lösung:**
```bash
# Im Render Shell:
npm install
npm run migrate
```

### Problem: "Frontend kann nicht mit Backend verbinden"
**Lösung:**
1. Prüfe Vercel Environment Variables
2. Prüfe CORS in `backend/src/server.js`
3. Redeploy Frontend

### Problem: "Backend antwortet nicht"
**Lösung:**
1. Warte 60 Sekunden (Cold Start)
2. Prüfe Render Logs: Service → "Logs"
3. Prüfe Environment Variables

---

## 📞 Support

**Render Docs:** https://render.com/docs
**Render Community:** https://community.render.com

---

## 🎊 Glückwunsch!

Du hostest jetzt deine komplette App **100% kostenlos** auf professioneller Infrastruktur!

**Nächste Schritte:**
- ✅ Teste alle Features
- ✅ Lösche Railway
- ✅ Freue dich über $0/Monat 🎉

