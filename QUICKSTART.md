# ⚡ Quick Start Guide

Schnelleinstieg für Entwickler - die wichtigsten Befehle und Schritte.

## 🏁 In 5 Minuten loslegen

### 1. Klonen & Installieren
```bash
cd "Aura Presence"
npm run install:all
```

### 2. Environment Setup
```bash
cd backend
cp .env.example .env
```

💡 **Tipp**: Die Datei [`backend/.env.example`](backend/.env.example) dokumentiert alle verfügbaren Environment-Variablen. Prüfe diese für vollständige Konfigurationsoptionen.

Öffne `backend/.env` und setze **mindestens**:
```env
JWT_SECRET=dein-geheimes-secret-mindestens-32-zeichen
```

Um JWT_SECRET zu generieren:
```bash
# PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Oder einfach einen zufälligen String mit 32+ Zeichen verwenden
```

### 3. Starten
```bash
# Zurück zum Root
cd ..

# Backend + Frontend starten
npm run dev
```

### 4. Öffnen
Browser: `http://localhost:5173`

### 5. Registrieren & Testen
- Erstelle Account mit beliebiger E-Mail
- Klicke "Analyse starten"
- Erlaube Kamera
- Klicke "▶ Analyse starten"

**Fertig! 🎉**

---

## 📌 Wichtige Commands

```bash
# Development
npm run dev                    # Start alles
npm run dev:backend            # Nur Backend
npm run dev:frontend           # Nur Frontend

# Build
npm run build                  # Build Frontend

# Tests
npm test                       # Backend Tests

# Capacitor (Mobile)
npm run capacitor:sync         # iOS/Android vorbereiten
npm run capacitor:open:android # Android Studio
npm run capacitor:open:ios     # Xcode
```

---

## 🔑 Wichtige URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## 🐛 Häufige Probleme

### "Module not found"
```bash
npm run install:all
```

### "Port already in use"
Ändere Ports in:
- Backend: `backend/.env` → `PORT=3002`
- Frontend: `frontend/vite.config.js` → `server.port: 5174`

### MediaPipe lädt nicht
```bash
cd frontend
npm install --legacy-peer-deps
```

### Kamera funktioniert nicht
- HTTPS verwenden (oder localhost ist OK)
- Browser-Permissions prüfen
- Andere Apps mit Kamera schließen

---

## 📚 Nächste Schritte

1. **OpenAI Key**: [README.md](README.md#-konfiguration) → Für echtes KI-Feedback
2. **Stripe**: [README.md](README.md#stripe) → Für Subscriptions
3. **PRIORITY_TASKS.md**: Roadmap anschauen
4. **PRIVACY_CHECKLIST.md**: Vor Production lesen!

---

## 🆘 Hilfe

- **Dokumentation**: [README.md](README.md)
- **Issues**: GitHub Issues öffnen
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

**Viel Erfolg! 🚀**





