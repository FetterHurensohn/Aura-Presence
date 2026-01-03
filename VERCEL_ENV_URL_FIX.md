# 🚨 VERCEL ENVIRONMENT VARIABLE FIX

## ❌ **FEHLER IN DER CONSOLE:**

```
POST https://aura-presence-analyser.vercel.app/aura-presence-backend-production.up.railway.app/api/auth/login
405 (Method Not Allowed)
```

Die URL ist **FALSCH ZUSAMMENGEBAUT**! 

Das Frontend nutzt die Backend-URL **relativ** zur eigenen Domain!

---

## 🔍 **URSACHE:**

Im Code (`frontend/src/services/apiService.js`):

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`  // ← Fügt /api hinzu!
  : '/api';  // ← Fallback: Relativ
```

**Problem:** Die `VITE_API_URL` Variable ist entweder:
1. ❌ **Nicht gesetzt** → Verwendet `/api` (relativ)
2. ❌ **Falsches Format** → Enthält bereits `/api`
3. ❌ **Falscher Wert** → Ohne `https://`

---

## ✅ **LÖSUNG:**

### **In Vercel Dashboard:**

1. Gehe zu: https://vercel.com/dashboard
2. Wähle: **aura-presence-analyser** Projekt
3. Gehe zu: **Settings** → **Environment Variables**
4. **PRÜFE/SETZE:**

```
Name:  VITE_API_URL
Value: https://aura-presence-backend-production.up.railway.app
```

**⚠️ WICHTIG:**
- ✅ **MIT** `https://`
- ✅ **OHNE** `/api` am Ende
- ✅ **OHNE** Trailing Slash

### **FALSCHE Werte:**
```
❌ aura-presence-backend-production.up.railway.app (Kein https://)
❌ https://aura-presence-backend-production.up.railway.app/ (Trailing slash)
❌ https://aura-presence-backend-production.up.railway.app/api (Hat schon /api)
```

### **RICHTIGER Wert:**
```
✅ https://aura-presence-backend-production.up.railway.app
```

---

## 🔧 **ALTERNATIVE: Code-Fix (wenn Vercel Env nicht funktioniert)**

Falls die Environment Variable Probleme macht, können wir den Code hardcoden:

**In `frontend/src/services/apiService.js`:**

```javascript
// Hardcoded Production Backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : import.meta.env.PROD 
    ? 'https://aura-presence-backend-production.up.railway.app/api'
    : '/api';
```

---

## 📋 **SCHRITTE:**

### **Option 1: Vercel Env Variable korrigieren**
1. ✅ Gehe zu Vercel Dashboard
2. ✅ Settings → Environment Variables
3. ✅ Setze `VITE_API_URL` = `https://aura-presence-backend-production.up.railway.app`
4. ✅ Klicke "Save"
5. ✅ Redeploy: Deployments → Latest → "⋯" → "Redeploy"

### **Option 2: Code-Fix (schneller!)**
1. ✅ Ich ändere den Code
2. ✅ Commit & Push
3. ✅ Vercel deployed automatisch

---

## 🚀 **WELCHE OPTION?**

**Ich empfehle Option 2** (Code-Fix), weil:
- ✅ Schneller
- ✅ Funktioniert garantiert
- ✅ Keine Vercel Dashboard Änderungen nötig
- ✅ Fallback für lokale Entwicklung bleibt erhalten

---

Soll ich **Option 2** umsetzen? (Code-Fix)

