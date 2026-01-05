# 🔧 Vercel Update für Render-Backend

## ❌ Problem

Die Sprachübersetzung funktioniert nicht, weil Vercel immer noch die **alte Railway-URL** nutzt:

```
POST https://aura-presence-backend-production.up.railway.app/api/auth/update-language
→ 404 Not Found
```

**Aber:** Wir haben zu **Render** migriert:

```
✅ https://aura-presence-backend.onrender.com
```

---

## ✅ Lösung: Vercel Environment Variables aktualisieren

### Schritt-für-Schritt Anleitung

#### 1. Öffne Vercel Dashboard
```
https://vercel.com/dashboard
```

#### 2. Wähle dein Projekt
- Projekt: **`aura-presence-analyser`**
- (oder wie auch immer dein Frontend-Projekt heißt)

#### 3. Gehe zu Settings
- Oben rechts: **Settings** Button

#### 4. Öffne Environment Variables
- Linke Sidebar: **Environment Variables**

---

### 5. Aktualisiere `VITE_API_URL`

**Finde:**
```
Name:  VITE_API_URL
Value: https://aura-presence-backend-production.up.railway.app
```

**Klicke auf "Edit"** (Stift-Icon)

**Ändere zu:**
```
https://aura-presence-backend.onrender.com
```

**Wichtig:** Achte darauf, dass die Variable für **Production** gilt!

**Klicke "Save"**

---

### 6. Aktualisiere `VITE_BACKEND_URL`

**Finde:**
```
Name:  VITE_BACKEND_URL
Value: https://aura-presence-backend-production.up.railway.app
```

**Klicke auf "Edit"**

**Ändere zu:**
```
https://aura-presence-backend.onrender.com
```

**Klicke "Save"**

---

### 7. Redeploy auslösen

#### Option A: Automatisches Redeploy
- Vercel wird automatisch redeployen, wenn du die Env Vars änderst
- Warte 2-3 Minuten

#### Option B: Manuelles Redeploy (sicherer)
1. Gehe zu **Deployments** Tab
2. Finde das letzte erfolgreiche Deployment
3. Klicke auf die **3 Punkte** (...)
4. Wähle **"Redeploy"**
5. Bestätige mit **"Redeploy"**

---

## 🧪 Testen

### 1. Warte auf Deployment
- Vercel zeigt "Building..." → "Ready"
- Dauer: ~2-3 Minuten

### 2. Öffne Production-URL
```
https://aura-presence-analyser.vercel.app
```

### 3. Melde dich an
- Mit deinem bestehenden Account

### 4. Gehe zu Account Settings
- Navigation → Account / Einstellungen

### 5. Ändere Sprache
- Wähle eine andere Sprache (z.B. English)
- Klicke auf den Sprach-Button

### 6. ✅ Erwartetes Ergebnis

**Console (F12):**
```
✅ POST https://aura-presence-backend.onrender.com/api/auth/update-language 200 OK
✅ Language changed to: en
🔄 Reloading page...
```

**Seite:**
- Wird neu geladen
- Ist jetzt auf Englisch
- Keine 404-Fehler!

---

## 🔍 Debugging

### Fall 1: Immer noch Railway-URL in Console

**Ursache:** Alter Build gecached

**Lösung:**
1. Vercel → Deployments
2. Letztes Deployment → "Redeploy"
3. Warte auf Build
4. Hard-Reload im Browser (Strg+Shift+R)

### Fall 2: Environment Variable nicht vorhanden

**Symptom:**
```
POST https://localhost/api/auth/update-language 404
```

**Lösung:**
1. Vercel → Settings → Environment Variables
2. Klicke "Add New"
3. Name: `VITE_API_URL`
4. Value: `https://aura-presence-backend.onrender.com`
5. Environment: **Production** ✅
6. Save
7. Redeploy

### Fall 3: Lokaler Dev-Server (localhost:5173)

**Symptom:**
Funktioniert lokal nicht, aber auf Vercel schon

**Erklärung:**
- Lokaler Dev-Server nutzt **Vite Proxy** (`/api`)
- Proxy ist konfiguriert für `localhost:3001` (Backend)
- Für lokale Tests: Backend lokal starten (`npm start` in `backend/`)

**Alternative:**
- Teste Übersetzung auf **Production**: `https://aura-presence-analyser.vercel.app`

---

## 📊 Environment Variables Übersicht

| Variable | Wert (Production) | Verwendung |
|----------|-------------------|------------|
| `VITE_API_URL` | `https://aura-presence-backend.onrender.com` | API Base URL für Axios |
| `VITE_BACKEND_URL` | `https://aura-presence-backend.onrender.com` | WebRTC/WebSocket Backend |
| `VITE_SENTRY_DSN` | (optional) | Sentry Error Tracking |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_...` | Stripe Public Key (wenn du Stripe einrichtest) |

---

## ✅ Nach dem Update

### Frontend (Vercel)
- ✅ Nutzt Render-Backend
- ✅ Sprachübersetzung funktioniert
- ✅ `/api/auth/update-language` → 200 OK

### Backend (Render)
- ✅ Online: `https://aura-presence-backend.onrender.com`
- ✅ Health Check: `/health` → OK
- ✅ Alle Routes verfügbar

### Railway
- ❌ Nicht mehr verwendet
- Kann gelöscht werden (oder als Backup behalten)

---

## 🚀 Deployment-Flow (ab jetzt)

### 1. Code-Änderungen
```bash
git add .
git commit -m "feat: Neue Funktion"
git push
```

### 2. Automatisches Deployment
- **Vercel** (Frontend): Deployed automatisch bei `git push`
- **Render** (Backend): Deployed automatisch bei `git push`

### 3. Kein manuelles Action nötig!
- Beide Plattformen überwachen den `main` Branch
- Auto-Deploy bei jedem Push

---

## 📝 Cheat Sheet

### Vercel URLs
- **Dashboard**: https://vercel.com/dashboard
- **Production**: https://aura-presence-analyser.vercel.app

### Render URLs
- **Dashboard**: https://dashboard.render.com
- **Production**: https://aura-presence-backend.onrender.com
- **Health Check**: https://aura-presence-backend.onrender.com/health

### Environment Variables zu ändern
1. `VITE_API_URL` → Render-URL
2. `VITE_BACKEND_URL` → Render-URL

### Nach Änderung
1. Save
2. Redeploy
3. Warte 2-3 Min
4. Teste auf Production

---

## ✅ Zusammenfassung

| Schritt | Status |
|---------|--------|
| Backend zu Render migriert | ✅ |
| Render Online | ✅ |
| Vercel Env Vars aktualisieren | ⏳ **DU MUSST DAS TUN** |
| Vercel Redeploy | ⏳ **NACH ENV VAR UPDATE** |
| Sprachübersetzung testen | ⏳ **NACH REDEPLOY** |

**Du bist dran!** Gehe jetzt zu Vercel und ändere die Environment Variables! 🚀

