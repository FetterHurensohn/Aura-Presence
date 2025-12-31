# API Documentation - Aura Presence

## Übersicht

Diese Dokumentation beschreibt alle API-Endpunkte und erweiterten Features von Aura Presence.

**Letzte Aktualisierung:** 2025-12-30  
**API Version:** 1.1.0

---

## Basis-URL

- **Development:** `http://localhost:3001`
- **Production:** `https://your-domain.com`

---

## Authentifizierung

Alle geschützten Endpunkte erfordern einen JWT-Token im Authorization-Header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Token-Format

```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Endpunkte

### Auth

#### POST `/api/auth/register`

Registriere einen neuen Benutzer.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Registrierung erfolgreich",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST `/api/auth/login`

Authentifiziere einen Benutzer.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login erfolgreich",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST `/api/auth/refresh`

Erneuere Access Token mit Refresh Token.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

#### POST `/api/auth/logout`

Widerrufe Refresh Token.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "message": "Logout erfolgreich"
}
```

---

### Analyse

#### POST `/api/analyze`

🔒 **Geschützt** - Sende Video-Analyse-Features zur Evaluation.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (Erweiterte Feature-Structure):**
```json
{
  "features": {
    // Face Mesh Features
    "eye_contact_quality": 0.85,
    "blink_rate": 18,
    "facial_expression": "smiling",
    "head_pose": {
      "pitch": 5,
      "yaw": -3,
      "roll": 1
    },
    
    // Hands Features
    "hands_detected": ["left", "right"],
    "left_hand_gesture": "open",
    "right_hand_gesture": "pointing",
    "hand_movement_speed": 0.25,
    
    // Pose Features
    "posture_angle": 5,
    "hand_movement_freq": 0.3,
    
    // Meta
    "frame_timestamp": 1234567890,
    "confidence": 0.92
  }
}
```

**Feature Descriptions:**

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| `eye_contact_quality` | float | 0-1 | Augenkontakt-Qualität basierend auf Iris-Position |
| `blink_rate` | int | 0-60+ | Blinzelrate pro Minute |
| `facial_expression` | string | enum | `smiling`, `neutral`, `speaking`, `frowning` |
| `head_pose.pitch` | int | -90 to 90 | Kopfneigung vertikal (Nicken) |
| `head_pose.yaw` | int | -90 to 90 | Kopfdrehung horizontal |
| `head_pose.roll` | int | -45 to 45 | Kopfneigung seitlich |
| `hands_detected` | array | [] | Liste erkannter Hände: `["left"]`, `["right"]`, `["left", "right"]` |
| `left_hand_gesture` | string | enum | `open`, `closed`, `pointing`, `peace`, `ok`, `other` |
| `right_hand_gesture` | string | enum | Wie `left_hand_gesture` |
| `hand_movement_speed` | float | 0-2+ | Bewegungsgeschwindigkeit (0 = ruhig, >1 = sehr aktiv) |
| `posture_angle` | int | -45 to 45 | Körperhaltung in Grad (0 = aufrecht) |
| `hand_movement_freq` | float | 0-2+ | Gestik-Frequenz (Legacy, aus Pose) |

**Response:**
```json
{
  "evaluation": {
    "timestamp": 1234567890,
    "metrics": {
      "eyeContactQuality": {
        "value": 0.85,
        "status": "excellent",
        "score": 1.0,
        "description": "Exzellenter Augenkontakt"
      },
      "blinkRate": {
        "value": 18,
        "status": "normal",
        "score": 1.0,
        "description": "Normale Blinzelrate"
      },
      "facialExpression": {
        "value": "smiling",
        "status": "smiling",
        "score": 1.0,
        "description": "Freundliches Lächeln"
      },
      "headPose": {
        "value": {"pitch": 5, "yaw": -3, "roll": 1},
        "status": "good",
        "score": 1.0,
        "description": "Kopfhaltung frontal und aufrecht"
      },
      "handsDetected": {
        "value": 2,
        "description": "2 Hände erkannt",
        "status": "info"
      },
      "handMovementSpeed": {
        "value": 0.25,
        "status": "moderate",
        "score": 0.9,
        "description": "Moderate Handbewegungen"
      },
      "handGestures": {
        "value": [
          {"hand": "left", "gesture": "open"},
          {"hand": "right", "gesture": "pointing"}
        ],
        "status": "detected",
        "score": 0.9,
        "description": "left: open, right: pointing"
      },
      "posture": {
        "value": 5,
        "status": "good",
        "score": 1.0,
        "description": "Aufrechte Haltung"
      }
    },
    "flags": [],
    "confidence": 0.95
  },
  "interpretation": {
    "feedback": "Sehr gut! Dein exzellenter Augenkontakt und freundliches Lächeln wirken professionell und überzeugend...",
    "tone": "constructive",
    "source": "openai"
  }
}
```

**Error Response:**
```json
{
  "error": "Validation failed",
  "message": "Invalid features format",
  "code": "VALIDATION_ERROR"
}
```

---

### Subscription

#### POST `/api/subscription/create-checkout`

🔒 **Geschützt** - Erstelle Stripe Checkout Session.

**Body:**
```json
{
  "priceId": "price_test_123"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/..."
}
```

#### POST `/api/subscription/webhook`

Stripe Webhook Endpoint (nicht authentifiziert, aber signiert).

**Headers:**
```
stripe-signature: <signature>
```

#### GET `/api/subscription/status`

🔒 **Geschützt** - Hole Subscription-Status.

**Response:**
```json
{
  "status": "active",
  "plan": "pro",
  "currentPeriodEnd": "2025-02-01T00:00:00.000Z"
}
```

---

### WebRTC Signaling (Socket.IO)

#### Connection

**URL:** `ws://localhost:3001` oder `wss://your-domain.com`

**Auth:**
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt_token'
  }
});
```

#### Events

##### Client → Server

**`join-room`**
```javascript
socket.emit('join-room', 'room_id');
```

**`offer`**
```javascript
socket.emit('offer', {
  to: 'socket_id',
  offer: { type: 'offer', sdp: '...' }
});
```

**`answer`**
```javascript
socket.emit('answer', {
  to: 'socket_id',
  answer: { type: 'answer', sdp: '...' }
});
```

**`ice-candidate`**
```javascript
socket.emit('ice-candidate', {
  to: 'socket_id',
  candidate: { ... }
});
```

**`leave-room`**
```javascript
socket.emit('leave-room');
```

##### Server → Client

**`room-joined`**
```javascript
socket.on('room-joined', (data) => {
  // data: { roomId, users: [...] }
});
```

**`user-joined`**
```javascript
socket.on('user-joined', (data) => {
  // data: { userId, socketId, userName }
});
```

**`user-left`**
```javascript
socket.on('user-left', (data) => {
  // data: { userId, socketId }
});
```

**`offer`**
```javascript
socket.on('offer', (data) => {
  // data: { from, offer }
});
```

**`answer`**
```javascript
socket.on('answer', (data) => {
  // data: { from, answer }
});
```

**`ice-candidate`**
```javascript
socket.on('ice-candidate', (data) => {
  // data: { from, candidate }
});
```

**`error`**
```javascript
socket.on('error', (data) => {
  // data: { message }
});
```

#### GET `/api/signaling/stats`

Hole Signaling-Server-Statistiken.

**Response:**
```json
{
  "totalRooms": 5,
  "totalConnections": 8,
  "rooms": [
    {
      "roomId": "room1",
      "userCount": 2
    }
  ]
}
```

---

## Rate Limiting

- **Window:** 15 Minuten
- **Max Requests:** 100
- **Header:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## MediaPipe Feature Detection

### Pose (33 Landmarks)

Erkennt Körper-Keypoints:
- 0-10: Gesicht (Nase, Augen, Ohren, Mund)
- 11-24: Oberkörper (Schultern, Ellbogen, Handgelenke, Hüfte, Knie, Knöchel)
- 25-32: Füße

### Face Mesh (468 Landmarks)

Erkennt Gesichts-Details:
- Gesichtskontur
- Augen (linkes/rechtes Eye)
- Augenbrauen
- Nase
- Lippen/Mund
- **468-477:** Iris-Landmarks (wenn `refineLandmarks: true`)

### Hands (21 Landmarks pro Hand)

Erkennt Hand-Keypoints:
- 0: Handgelenk (Wrist)
- 1-4: Daumen
- 5-8: Zeigefinger
- 9-12: Mittelfinger
- 13-16: Ringfinger
- 17-20: Kleiner Finger

---

## Best Practices

1. **Sende Features alle 2 Sekunden** (nicht pro Frame) zur Reduzierung der Backend-Last
2. **Aggregiere Metriken** über mehrere Frames für stabilere Ergebnisse
3. **Validiere Features** im Frontend bevor du sie sendest
4. **Nutze Refresh Tokens** für persistente Sessions
5. **Implementiere Exponential Backoff** bei API-Errors
6. **Überwache Rate Limits** in Production

---

## Beispiel-Integration

```javascript
// Frontend: Features senden
const sendFeatures = async (features) => {
  try {
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ features })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Analysis failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error sending features:', error);
    throw error;
  }
};
```

---

## Support

Bei Fragen oder Problemen:
- **Email:** support@aurapresence.com
- **Docs:** https://docs.aurapresence.com
- **GitHub Issues:** https://github.com/your-org/aura-presence/issues

