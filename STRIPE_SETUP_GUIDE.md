# 💳 Stripe Integration Guide - Aura Presence

## Übersicht

Aura Presence nutzt Stripe für:
- ✅ Subscription Management (monatliche Abos)
- ✅ Payment Processing (sichere Zahlungen)
- ✅ Webhook Events (automatische Updates)

---

## 📋 SCHRITT 1: Stripe Account erstellen (3 Min)

### 1.1 Account anlegen:

1. Gehe zu: **https://dashboard.stripe.com/register**
2. Sign up mit:
   - E-Mail + Passwort
   - Oder: Google/GitHub Account
3. Bestätige E-Mail

### 1.2 Business Details:

Stripe fragt nach:
- **Business Name:** `Aura Presence`
- **Business Type:** `Individual` oder `Company`
- **Country:** `Germany` (oder dein Land)
- **Industry:** `Software/SaaS`

⚠️ **WICHTIG:** Nutze erstmal **TEST MODE** (oben rechts Toggle)!

---

## 🔑 SCHRITT 2: API Keys kopieren (2 Min)

### 2.1 Secret Key:

1. Stripe Dashboard → **Developers** → **API Keys**
2. Stelle sicher: **Test Mode** ist aktiviert (oben rechts)
3. Kopiere **"Secret key"**:
   - Format: `sk_test_...` (sehr lang)
   - Beginnt mit `sk_test_` für Testing
   - Speichere temporär (Notepad)

### 2.2 Publishable Key:

4. Kopiere auch **"Publishable key"**:
   - Format: `pk_test_...`
   - Beginnt mit `pk_test_` für Testing
   - Wird später für Frontend gebraucht

**Keys sicher aufbewahren!** 🔐

---

## 💰 SCHRITT 3: Produkt & Preis erstellen (5 Min)

### 3.1 Neues Produkt:

1. Dashboard → **Products** → **+ Add product**
2. Eingeben:

```
Product Name: Aura Presence Pro
Description: Premium-Zugang zu Aura Presence mit unbegrenzten Analysen
```

### 3.2 Preismodell:

3. **Pricing:**
   - Model: **Recurring** (monatliches Abo)
   - Price: `9.99` EUR (oder dein Wunschpreis)
   - Billing Period: **Monthly**
   - Currency: **EUR** (oder USD)

4. Klicke **"Add product"**

### 3.3 Price ID kopieren:

5. Nach Erstellung: Klicke auf das Produkt
6. Kopiere die **Price ID**:
   - Format: `price_xxxxxxxxxxxxxxxxxxxxx`
   - Beginnt mit `price_`
   - Speichere diese ID! **WICHTIG!**

---

## 🪝 SCHRITT 4: Webhook einrichten (5 Min)

### 4.1 Webhook Endpoint hinzufügen:

1. Dashboard → **Developers** → **Webhooks**
2. Klicke **"+ Add endpoint"**
3. Eingeben:

```
Endpoint URL: https://aura-presence-backend.onrender.com/api/subscription/webhook
```

4. **Description:** `Aura Presence Subscription Events`

### 4.2 Events auswählen:

5. Klicke **"Select events"**
6. Wähle diese Events:

```
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
✅ checkout.session.completed
```

7. Klicke **"Add events"**
8. Klicke **"Add endpoint"**

### 4.3 Webhook Secret kopieren:

9. Nach Erstellung: Klicke **"Reveal"** neben "Signing secret"
10. Kopiere den **Webhook Secret**:
    - Format: `whsec_...`
    - Beginnt mit `whsec_`
    - Speichere sicher! **WICHTIG!**

---

## 🔧 SCHRITT 5: Keys in Render eintragen (3 Min)

### 5.1 Render öffnen:

1. Gehe zu: **https://dashboard.render.com**
2. Backend Service: **"aura-presence-backend"**
3. Linkes Menü → **"Environment"**

### 5.2 Environment Variables hinzufügen:

Klicke **"Add Environment Variable"** für jedes:

#### 1. Stripe Secret Key:
```
Key:   STRIPE_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2. Stripe Webhook Secret:
```
Key:   STRIPE_WEBHOOK_SECRET
Value: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 3. Stripe Price ID:
```
Key:   STRIPE_PRICE_ID
Value: price_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5.3 Speichern:

- Klicke **"Save Changes"**
- Render deployed automatisch neu (~2-3 Min)
- Warte bis Status: **"Live"** ✅

---

## ✅ SCHRITT 6: Verifizieren (2 Min)

### 6.1 Backend Logs prüfen:

1. Render → Backend Service → **"Logs"**
2. Sollte zeigen:

```
💳 Stripe: ✓  (statt ✗)
```

### 6.2 Webhook Status prüfen:

1. Zurück zu Stripe Dashboard
2. **Developers** → **Webhooks**
3. Dein Endpoint sollte zeigen:
   - Status: **Enabled** ✅
   - Last Response: `200 OK` (nach erstem Event)

---

## 🧪 SCHRITT 7: Stripe testen (Optional - 5 Min)

### Test Cards für Testing:

Stripe bietet Test-Kreditkarten:

**Erfolgreiche Zahlung:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34 (beliebiges zukünftiges Datum)
CVC: 123
ZIP: 12345
```

**Fehlerhafte Zahlung:**
```
Card Number: 4000 0000 0000 0002
(Simuliert abgelehnte Zahlung)
```

**Test durchführen:**
1. Frontend öffnen (nach Vercel Update)
2. Versuche Subscription zu kaufen
3. Nutze Test-Card
4. Prüfe in Stripe Dashboard → **Payments**

---

## 📊 CHECKLISTE:

| Schritt | Zu tun | Status |
|---------|--------|--------|
| 1. Stripe Account | Erstellen | ⏳ |
| 2. API Keys | Kopieren (Secret + Publishable) | ⏳ |
| 3. Produkt | Erstellen + Price ID kopieren | ⏳ |
| 4. Webhook | Endpoint + Secret | ⏳ |
| 5. Render | 3 Environment Variables | ⏳ |
| 6. Deploy | Warten auf Render | ⏳ |
| 7. Verifizieren | Logs prüfen | ⏳ |

---

## 💡 WICHTIGE HINWEISE:

### Test Mode vs. Production:

**Test Mode (jetzt):**
- ✅ Keine echten Zahlungen
- ✅ Test-Cards funktionieren
- ✅ Perfekt für Development
- Keys: `sk_test_...` / `pk_test_...`

**Production Mode (später):**
- 💰 Echte Zahlungen
- 🔐 Neue Keys nötig
- 📝 Business-Verifizierung erforderlich
- Keys: `sk_live_...` / `pk_live_...`

### Wechsel zu Production (später):

Wenn du Live gehen willst:
1. Stripe Business-Details vervollständigen
2. Bank-Account hinzufügen (für Auszahlungen)
3. Neue Live-Keys kopieren
4. In Render Production-Keys eintragen

---

## 🚨 TROUBLESHOOTING:

**Problem: Webhook erhält keine Events**
- ✅ Prüfe URL: `https://aura-presence-backend.onrender.com/api/subscription/webhook`
- ✅ Prüfe Events sind ausgewählt
- ✅ Teste mit "Send test webhook" in Stripe

**Problem: "Invalid API Key"**
- ✅ Prüfe Key beginnt mit `sk_test_`
- ✅ Kopiere Key nochmal (ohne Leerzeichen)
- ✅ Render neu deployen

**Problem: "No such price"**
- ✅ Prüfe STRIPE_PRICE_ID in Render
- ✅ Format: `price_xxxxx` (nicht `prod_xxxxx`)

---

## 📱 FRONTEND INTEGRATION:

Nach Render-Setup brauchst du für's Frontend:

**Vercel Environment Variables:**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

(Machen wir beim Vercel Update!)

---

## 💰 KOSTEN:

**Stripe Gebühren:**
- Test Mode: **Kostenlos**
- Live Mode: **1.4% + 0.25€** pro erfolgreicher Zahlung (EU-Karten)
- Keine monatlichen Fixkosten
- Keine Setup-Gebühren

**Beispiel:**
- Abo-Preis: 9.99€
- Stripe-Gebühr: ~0.39€
- Du erhältst: ~9.60€

---

## 🎯 NÄCHSTE SCHRITTE:

Nach Stripe-Setup:
1. ✅ Datenbank Migrationen
2. ✅ Vercel Environment Variables
3. ✅ Frontend Testing
4. ✅ Test-Zahlung durchführen

---

## 📞 SUPPORT:

**Stripe Docs:** https://stripe.com/docs  
**Stripe Support:** https://support.stripe.com

---

**Geschätzte Zeit für komplettes Setup: ~15-20 Minuten**

🎉 **Los geht's!**

