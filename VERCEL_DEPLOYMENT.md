# Vercel Deployment Guide

## 🚀 Frontend Deployment auf Vercel

### Schritt 1: Vercel Account erstellen

1. Gehe zu https://vercel.com
2. Klicke auf **"Sign Up"**
3. Wähle **"Continue with GitHub"** (empfohlen)
4. Autorisiere Vercel für dein GitHub-Konto

---

### Schritt 2: Projekt importieren

1. Nach dem Login → Klicke **"Add New..."** → **"Project"**
2. Wähle dein Repository **"aura-presence"** aus der Liste
3. Klicke **"Import"**

---

### Schritt 3: Build-Konfiguration

Vercel sollte automatisch erkennen, dass es ein Vite-Projekt ist.

**Überprüfe diese Einstellungen:**

**Framework Preset:** `Vite`

**Root Directory:** `frontend` (wichtig!)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

---

### Schritt 4: Environment Variables konfigurieren

Klicke auf **"Environment Variables"** und füge hinzu:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.railway.app` | Production |
| `VITE_BACKEND_URL` | `https://your-backend.railway.app` | Production |
| `NODE_ENV` | `production` | Production |

⚠️ **Wichtig:** Backend-URL später anpassen, nachdem Railway eingerichtet ist!

---

### Schritt 5: Deploy!

Klicke auf **"Deploy"**

Vercel wird:
1. ✅ Repository klonen
2. ✅ Dependencies installieren
3. ✅ Frontend builden
4. ✅ Auf Vercel CDN deployen

**Dauer:** ~2-3 Minuten

---

### Schritt 6: Domain konfigurieren (optional)

Nach erfolgreichem Deploy:

1. Du bekommst eine URL: `aura-presence-xxx.vercel.app`
2. Gehe zu **"Settings"** > **"Domains"**
3. Füge deine eigene Domain hinzu (optional)

---

## 🔧 Automatische Deployments

**Jetzt bei jedem Push:**
- Push zu `main` → Production Deploy
- Push zu anderen Branches → Preview Deploy
- Pull Requests → Preview Deploy mit Kommentar

---

## 📋 Vercel-Konfiguration (vercel.json)

Die Datei `vercel.json` wurde bereits erstellt mit:

```json
{
  "version": 2,
  "name": "aura-presence",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "frontend/dist" }
    }
  ],
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

Diese Konfiguration:
- ✅ Baut das Frontend aus dem `frontend/` Ordner
- ✅ Routet alle Anfragen zu `index.html` (SPA)
- ✅ Serviert Assets korrekt

---

## ⚙️ Backend-Integration

Das Frontend benötigt die Backend-URL. 

**Option 1: Nach Backend-Deploy aktualisieren**

Wenn Backend auf Railway läuft:
1. Gehe zu Vercel Dashboard
2. **Settings** > **Environment Variables**
3. Aktualisiere `VITE_API_URL` auf Railway-URL
4. **Redeploy** (Vercel → Deployments → ⋮ → Redeploy)

**Option 2: Umgebungsvariable im Code nutzen**

Dein Frontend sollte bereits so konfiguriert sein:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## 🧪 Testen

Nach dem Deploy:

1. **Öffne die Vercel-URL** (z.B. `https://aura-presence-xxx.vercel.app`)
2. Teste die Seite (ohne Backend wird Auth nicht funktionieren)
3. Überprüfe die **Browser-Konsole** auf Fehler

---

## 🔍 Troubleshooting

### Problem: "404 on Refresh"
→ Lösung: `vercel.json` routet alle Pfade zu `index.html` ✅

### Problem: "API calls fail"
→ Lösung: Backend-URL in Environment Variables setzen

### Problem: "Build fails"
→ Lösung: 
- Überprüfe Root Directory: `frontend`
- Überprüfe Build Command: `npm run build`

---

## 📊 Monitoring

**Vercel Dashboard zeigt:**
- Build Logs
- Runtime Logs
- Analytics (Visits, Performance)
- Deployment History

---

## 🎯 Next Steps

Nach Vercel-Setup:
1. ✅ Frontend deployed
2. ⏳ Backend auf Railway deployen
3. ⏳ Environment Variables verknüpfen
4. ⏳ Custom Domain einrichten (optional)

---

**Bereit für Vercel? Folge den Schritten oben!** 🚀

Wenn du Hilfe brauchst, sag Bescheid!

