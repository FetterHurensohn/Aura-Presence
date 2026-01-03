# Password Reset Documentation

## Problem
Alte User-Accounts hatten Passwörter, die nicht mehr bekannt waren.

## Lösung
Das Passwort für den Account `jacquesdong9@gmail.com` wurde zurückgesetzt.

## Neue Login-Daten

### Account: jacquesdong9@gmail.com
- **Email:** `jacquesdong9@gmail.com`
- **Passwort:** `Aura2024!`

## Test-Ergebnisse

### ✅ Alter Account (nach Reset):
- Login erfolgreich mit neuem Passwort

### ✅ Neue Registrierungen:
- `user1@test.com` ✅
- `user2@test.com` ✅
- `test123@gmail.com` ✅
- `newaccount@aura.de` ✅
- Alle neuen Accounts funktionieren einwandfrei

### ✅ Test-Account:
- `testuser@aura.de` / `Test123456` ✅

## Verwendung

### Login:
```javascript
POST /api/auth/login
{
  "email": "jacquesdong9@gmail.com",
  "password": "Aura2024!"
}
```

### Registrierung:
```javascript
POST /api/auth/register
{
  "email": "newemail@example.com",
  "password": "YourPassword123"
}
```

## Status
✅ Alle Auth-Funktionen arbeiten korrekt
✅ CORS konfiguriert für alle localhost-Ports
✅ Passwort-Hashing mit bcrypt funktioniert

