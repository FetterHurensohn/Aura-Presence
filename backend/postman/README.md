# Aura Presence API - Postman Collection

Vollständige Postman Collection für alle Backend-API-Endpunkte.

## 📦 Dateien

- **`Aura-Presence-API.postman_collection.json`** - Hauptsammlung mit allen Endpoints
- **`Aura-Presence.postman_environment.json`** - Development-Umgebung (localhost)
- **`Aura-Presence-Production.postman_environment.json`** - Production-Umgebung (HTTPS)

## 🚀 Quick Start

### 1. Import in Postman

**Option A: Über Postman Desktop/Web**

1. Öffne Postman
2. Klicke auf **Import** (oben links)
3. Drag & Drop alle 3 JSON-Dateien
4. Wähle Environment: **Aura Presence - Development**

**Option B: Via Link**

```bash
# Collection Link (GitHub Raw URL)
https://raw.githubusercontent.com/YOUR_USER/aura-presence/main/backend/postman/Aura-Presence-API.postman_collection.json
```

### 2. Environment auswählen

Oben rechts: **Aura Presence - Development** auswählen

### 3. Server starten

```bash
cd backend
npm run dev
```

### 4. Erste Requests

1. **Health Check** → Verifiziere Server läuft
2. **Auth → Register User** → Erstelle Test-Account
3. Token wird automatisch in `{{authToken}}` gespeichert
4. **Analysis → Submit Analysis** → Teste geschützte Route

## 📚 Endpoints-Übersicht

### Health Check

- `GET /health` - Server-Status prüfen

### Authentication

- `POST /api/auth/register` - Neuen User registrieren
- `POST /api/auth/login` - User einloggen
- `GET /api/auth/me` - Aktuellen User abrufen (benötigt Token)
- `POST /api/auth/refresh` - Token erneuern

**Auto-Token-Speicherung**: Register/Login speichern Token automatisch in `{{authToken}}`

### Analysis

- `POST /api/analyze` - Video-Analyse-Features senden (benötigt Token)

**Zwei Beispiele:**

- **Minimal**: Nur Posture-Daten
- **Complete**: Alle MediaPipe-Features (Pose, Face Mesh, Hands)

### Subscription (Stripe)

- `POST /api/subscription/create-checkout-session` - Checkout-URL generieren
- `GET /api/subscription/status` - Subscription-Status abrufen
- `POST /api/subscription/webhook` - Stripe Webhook (nur für Stripe)

### WebRTC Signaling

- `GET /api/signaling/stats` - Aktive Rooms & Connections

## 🔐 Authentication

Die Collection nutzt **Bearer Token Authentication**:

1. Nach Login/Register wird Token automatisch gespeichert
2. Alle geschützten Routen verwenden `Authorization: Bearer {{authToken}}`
3. Token ist 7 Tage gültig (default)
4. Bei Ablauf: **Auth → Refresh Token** verwenden

## 🧪 Testing Features

### Automatische Tests

Alle Auth-Requests haben **Test Scripts**:

```javascript
// Automatische Token-Speicherung
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set('authToken', jsonData.token);
}
```

### Test Runner verwenden

1. Wähle **Collection** → **Run**
2. Selektiere alle Requests (außer Webhook)
3. Reihenfolge:
   - Health Check
   - Register/Login
   - Get Current User
   - Submit Analysis
   - Get Subscription Status
4. Klicke **Run Aura Presence API**

**Erwartung**: Alle Tests grün ✅

## 🌐 Environments

### Development (localhost)

```json
{
  "BASE_URL": "http://localhost:3001",
  "testEmail": "test@example.com",
  "testPassword": "Test1234"
}
```

**Verwendung:**

- Lokale Entwicklung
- Backend muss mit `npm run dev` laufen
- SQLite-Datenbank

### Production (HTTPS)

```json
{
  "BASE_URL": "https://api.aurapresence.com",
  "testEmail": "your-email@example.com",
  "testPassword": "YourPassword"
}
```

**Verwendung:**

- Nach Deployment auf Vercel/Railway
- Echte PostgreSQL-Datenbank
- SSL/HTTPS erforderlich

**⚠️ Wichtig**: Verwende NICHT deine echten Credentials in der Environment-Datei! Setze sie manuell in Postman.

## 📋 Example Payloads

### Complete Analysis Request

```json
{
  "features": {
    "posture_angle": 5,
    "eye_contact_quality": 0.85,
    "blink_rate": 18,
    "facial_expression": "smiling",
    "head_pose": {
      "pitch": 5,
      "yaw": -3,
      "roll": 1
    },
    "hands_detected": ["left", "right"],
    "left_hand_gesture": "open",
    "right_hand_gesture": "pointing",
    "hand_movement_speed": 0.25
  }
}
```

### Analysis Response

```json
{
  "evaluation": {
    "posture_good": true,
    "eye_contact_good": true,
    "blink_rate_normal": true,
    "facial_expression_positive": true,
    "head_pose_neutral": true,
    "hands_visible": true,
    "hand_gestures_appropriate": true,
    "hand_movement_calm": true
  },
  "interpretation": "Sehr gute Präsenz! Deine Körperhaltung ist aufrecht...",
  "timestamp": "2025-12-30T10:30:00.000Z"
}
```

## 🔧 Stripe Testing

### Lokal mit Stripe CLI

```bash
# 1. Stripe CLI installieren
# Windows: scoop install stripe
# macOS: brew install stripe/stripe-cli/stripe

# 2. Login
stripe login

# 3. Webhook-Forwarding starten
stripe listen --forward-to localhost:3001/api/subscription/webhook

# 4. Event triggern
stripe trigger checkout.session.completed

# 5. In Postman: Webhook-Request wird automatisch verarbeitet
```

### Test Cards (Stripe)

- **Erfolg**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- Expiry: Beliebig in Zukunft
- CVC: Beliebig 3 Ziffern

## 🐛 Troubleshooting

### "Connection refused"

→ Backend läuft nicht. Starte mit `npm run dev`

### "Unauthorized"

→ Token abgelaufen. Führe **Auth → Login** oder **Refresh Token** aus

### "Missing required fields"

→ Prüfe Request-Body. Siehe Collection-Beschreibung für erforderliche Felder

### Webhook "Invalid signature"

→ Verwende Stripe CLI für lokale Tests. Manuelle Webhooks benötigen echte Signatur

## 📖 API-Dokumentation

Vollständige API-Docs:

- **`docs/API_DOCUMENTATION.md`** - Detaillierte Endpoint-Beschreibungen
- **`README.md`** - Projekt-Übersicht
- **`QUICKSTART.md`** - Schnelleinstieg

## 🤝 Contributing

Bei neuen Endpoints:

1. Füge Request zur Collection hinzu
2. Füge Beschreibung hinzu
3. Füge Test-Script hinzu (wenn relevant)
4. Update diese README

## 🆘 Support

- **Issues**: GitHub Issues öffnen
- **Dokumentation**: `docs/` Ordner
- **Tests**: `backend/tests/` für Unit-Tests

---

**Viel Erfolg beim Testing! 🚀**

