# Stripe Setup & Webhook-Testing

## Übersicht

Dieses Dokument beschreibt, wie du Stripe für lokale Entwicklung und Production konfigurierst, inklusive Webhook-Testing mit der Stripe CLI.

## Voraussetzungen

- Stripe-Account (kostenlos registrieren auf [stripe.com](https://stripe.com))
- Stripe CLI installiert (siehe unten)

---

## 1. Stripe CLI Installation

### macOS

```bash
brew install stripe/stripe-cli/stripe
```

### Windows (mit Scoop)

```bash
scoop install stripe
```

### Linux

```bash
# Download von https://github.com/stripe/stripe-cli/releases/latest
# Oder via Package Manager (siehe Stripe-Dokumentation)
```

### Verifizierung

```bash
stripe --version
```

---

## 2. Stripe CLI Login

```bash
stripe login
```

Dies öffnet deinen Browser und authentifiziert die CLI mit deinem Stripe-Account.

---

## 3. Lokale Webhook-Entwicklung

### Webhook-Forwarding starten

```bash
stripe listen --forward-to localhost:3001/api/subscription/webhook
```

**Wichtig:** Kopiere das angezeigte Webhook-Secret (`whsec_...`) in deine `.env`-Datei:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Backend starten (in separatem Terminal)

```bash
cd backend
npm run dev
```

---

## 4. Test-Events triggern

### Checkout Session Completed

```bash
stripe trigger checkout.session.completed
```

### Subscription Created

```bash
stripe trigger customer.subscription.created
```

### Subscription Updated

```bash
stripe trigger customer.subscription.updated
```

### Subscription Deleted

```bash
stripe trigger customer.subscription.deleted
```

### Invoice Payment Succeeded

```bash
stripe trigger invoice.payment_succeeded
```

### Invoice Payment Failed

```bash
stripe trigger invoice.payment_failed
```

### Customer Deleted

```bash
stripe trigger customer.deleted
```

---

## 5. Webhook-Logs prüfen

### Backend-Logs

```bash
tail -f backend/logs/combined.log
```

Erwartete Ausgabe:

```
Stripe Webhook erhalten: checkout.session.completed (ID: evt_...)
Webhook evt_... erfolgreich verarbeitet und gespeichert
```

### Datenbank prüfen

```bash
sqlite3 backend/data/aura-presence.db

# Webhook-Events anzeigen
SELECT * FROM webhook_events ORDER BY processed_at DESC LIMIT 10;

# User mit Subscription anzeigen
SELECT id, email, stripe_customer_id, subscription_status, subscription_plan 
FROM users 
WHERE stripe_customer_id IS NOT NULL;
```

---

## 6. Manuelle Webhook-Tests (mit curl)

### Event-Payload vorbereiten

Erstelle eine Datei `test-event.json` mit einem Mock-Event:

```json
{
  "id": "evt_manual_test_123",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "customer": "cus_test_123",
      "client_reference_id": "1",
      "subscription": "sub_test_123"
    }
  }
}
```

### Event senden (mit Signatur)

**Wichtig:** Die Signatur muss mit der Stripe CLI generiert werden:

```bash
# Generiere Signatur
stripe webhook sign test-event.json --secret whsec_...

# Oder sende direkt:
curl -X POST http://localhost:3001/api/subscription/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: $(stripe webhook sign test-event.json --secret whsec_...)" \
  --data @test-event.json
```

---

## 7. Idempotenz-Tests

### Test: Duplicate Event wird erkannt

```bash
# Event zweimal senden
stripe trigger checkout.session.completed
stripe trigger checkout.session.completed
```

**Erwartung:** Backend-Log zeigt:

```
Webhook evt_... wurde bereits verarbeitet (Idempotenz) - überspringe
```

### Datenbank prüfen

```bash
sqlite3 backend/data/aura-presence.db
SELECT COUNT(*) FROM webhook_events WHERE event_id = 'evt_...';
# Sollte 1 sein (nicht 2)
```

---

## 8. Production-Setup

### Webhook-Endpoint konfigurieren

1. Gehe zu [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klicke "Add endpoint"
3. URL: `https://your-production-domain.com/api/subscription/webhook`
4. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.deleted`
5. Webhook erstellen
6. **Wichtig:** Kopiere das Signing Secret (`whsec_...`) in deine Production-ENV-Variablen

### Environment-Variablen (Production)

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

**Wichtig:** Verwende LIVE-Keys in Production, nicht Test-Keys!

---

## 9. Troubleshooting

### Webhook-Signatur-Fehler

**Fehler:** `Webhook-Signatur-Validierung fehlgeschlagen`

**Lösung:**
- Prüfe, dass `STRIPE_WEBHOOK_SECRET` korrekt gesetzt ist
- Bei lokalem Testing: Verwende das Secret von `stripe listen` (beginnt mit `whsec_`)
- Bei Production: Verwende das Secret aus dem Stripe-Dashboard

### Webhook wird nicht empfangen

**Prüfe:**
1. Backend läuft und ist erreichbar: `curl http://localhost:3001/health`
2. Stripe CLI ist verbunden: `stripe listen` zeigt "Ready!"
3. Route ist korrekt: `/api/subscription/webhook`

### Datenbank-Fehler

**Fehler:** `no such table: webhook_events`

**Lösung:**
```bash
# Stoppe Backend
# Lösche DB
rm backend/data/aura-presence.db
# Starte Backend neu (erstellt Tabellen automatisch)
npm run dev
```

---

## 10. Best Practices

### Webhook-Retry-Handling

Stripe retried fehlgeschlagene Webhooks automatisch:
- Exponentieller Backoff
- Bis zu 3 Tage lang
- HTTP 200: Success (kein Retry)
- HTTP 500: Retry
- HTTP 400: No Retry (Bad Request)

### Idempotenz

Alle Webhook-Handler sind idempotent:
- Event-ID wird in `webhook_events` gespeichert
- Duplicate Events werden automatisch erkannt und übersprungen
- UNIQUE Constraint auf `event_id` verhindert Doppel-Processing

### Logging

Alle Webhook-Events werden geloggt:
- `backend/logs/combined.log` (alle Logs)
- `backend/logs/error.log` (nur Errors)
- Webhook-Events in DB: `SELECT * FROM webhook_events;`

### Security

- **Signatur-Validierung:** Niemals Webhooks ohne Stripe-Signatur verarbeiten
- **HTTPS:** Production-Webhooks nur über HTTPS
- **Rate Limiting:** Optional (Stripe sendet nicht viele Requests)

---

## 11. Testing-Checkliste

- [ ] Stripe CLI installiert und eingeloggt
- [ ] `stripe listen` läuft und forwarded zu Backend
- [ ] Backend läuft auf Port 3001
- [ ] Webhook-Secret in `.env` gesetzt
- [ ] Test-Event getriggered: `stripe trigger checkout.session.completed`
- [ ] Backend-Log zeigt: "Stripe Webhook erhalten"
- [ ] Datenbank zeigt Event in `webhook_events` Tabelle
- [ ] User hat `subscription_status = 'active'`
- [ ] Idempotenz-Test: Event zweimal senden → nur einmal verarbeitet

---

## 12. Weitere Ressourcen

- [Stripe CLI Dokumentation](https://stripe.com/docs/stripe-cli)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)

---

**Bei Fragen oder Problemen:** Siehe `README.md` oder öffne ein Issue.





