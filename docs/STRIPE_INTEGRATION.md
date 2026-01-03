# 💳 Stripe Integration - Aura Presence

## 📋 Überblick

Vollständige Stripe-Integration für **Subscription Management** mit:
- ✅ Checkout Sessions
- ✅ Webhook Handling
- ✅ Subscription Status Tracking
- ✅ Role-based Access Control
- ✅ Idempotenz-Checks

---

## 🎯 Features

### Backend
- **Stripe Checkout:** Erstelle Payment Sessions
- **Webhooks:** Automatische Subscription Updates
- **User Roles:** Free, Pro, Enterprise basierend auf Subscription
- **Payment Events:** Erfolg, Fehlschlag, Stornierung
- **Idempotenz:** Verhindert doppelte Event-Verarbeitung

### Frontend
- **Checkout Button:** Redirect zu Stripe Checkout
- **Subscription Status:** Zeigt aktuellen Plan & Limits
- **Success/Cancel Pages:** Redirect nach Payment

---

## 📦 Bereits Integriert

### Backend Files:
- ✅ `backend/src/services/stripeService.js` - Stripe SDK Integration
- ✅ `backend/src/routes/subscription.js` - API Routes
- ✅ `backend/src/models/User.js` - Subscription DB Fields
- ✅ `backend/src/config/featureGates.js` - Role-based Limits

### Frontend Files:
- ✅ `frontend/src/services/apiService.js` - API Calls
- ✅ `frontend/src/components/Dashboard.jsx` - Subscribe Button
- ✅ Subscription Status anzeigen

---

## 🔧 Setup

### 1. Stripe Account erstellen

1. Gehe zu: https://dashboard.stripe.com/register
2. Erstelle einen Account
3. Aktiviere den **Test Mode** (Toggle oben rechts)

---

### 2. API Keys kopieren

#### In Stripe Dashboard:

1. **Developers** → **API keys**
2. Kopiere:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - **Klicke "Reveal test key"**

---

### 3. Produkte & Preise erstellen

#### In Stripe Dashboard:

1. **Products** → **Add product**

#### **Produkt 1: Pro Plan**
```
Name: Aura Presence Pro
Description: Unbegrenzte Analysen, erweiterte Features
Pricing:
  - Type: Recurring
  - Price: €9.99 / month
  - Billing period: Monthly
```
**Speichern** → Kopiere **Price ID** (z.B. `price_1ABC...`)

#### **Produkt 2: Enterprise Plan** (Optional)
```
Name: Aura Presence Enterprise
Description: Alle Features, Priority Support
Pricing:
  - Type: Recurring
  - Price: €29.99 / month
  - Billing period: Monthly
```
**Speichern** → Kopiere **Price ID**

---

### 4. Webhook Endpoint erstellen

#### **Option A: Lokal mit Stripe CLI (Development)**

1. **Installiere Stripe CLI:**
   ```bash
   # Windows (mit Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   
   # Mac (mit Homebrew)
   brew install stripe/stripe-cli/stripe
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Webhook forwarden:**
   ```bash
   stripe listen --forward-to localhost:3000/api/subscription/webhook
   ```

4. **Webhook Secret kopieren:**
   Output: `whsec_...` → Speichere für `.env`

#### **Option B: Production (Railway/Vercel)**

1. In Stripe Dashboard:
   - **Developers** → **Webhooks** → **Add endpoint**

2. **Endpoint URL:**
   ```
   https://aura-presence-backend-production.up.railway.app/api/subscription/webhook
   ```

3. **Events to send:** (Wähle alle aus)
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.deleted`

4. **Add endpoint** → Kopiere **Signing secret** (`whsec_...`)

---

### 5. Environment Variables setzen

#### **Backend (`backend/.env`):**

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_1ABC...  # Default Price (Pro Plan)
STRIPE_PRO_PRICE_ID=price_1ABC...  # Pro Plan
STRIPE_ENTERPRISE_PRICE_ID=price_1XYZ...  # Enterprise Plan (optional)

# Frontend URL für Redirects
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://aura-presence-p5fl.vercel.app  # Production
```

#### **Frontend (`frontend/.env`):**

```bash
VITE_STRIPE_PRICE_ID=price_1ABC...  # Pro Plan Price ID
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_1XYZ...  # Enterprise (optional)
```

---

### 6. Railway Environment Variables (Production)

In Railway Dashboard → Variables:

```bash
STRIPE_SECRET_KEY=sk_live_...  # WICHTIG: Live Key für Production!
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
FRONTEND_URL=https://aura-presence-p5fl.vercel.app
```

---

### 7. Vercel Environment Variables (Production)

In Vercel → Settings → Environment Variables:

```bash
VITE_STRIPE_PRICE_ID=price_...
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_...
```

---

## 🧪 Testing

### **1. Backend starten:**
```bash
cd backend
npm start
```

### **2. Frontend starten:**
```bash
cd frontend
npm run dev
```

### **3. Stripe CLI (für Webhooks):**
```bash
stripe listen --forward-to localhost:3000/api/subscription/webhook
```

### **4. Test Flow:**

1. **Öffne:** http://localhost:5173
2. **Login** mit deinem Account
3. **Dashboard** → Klicke **"Subscribe to Pro"** Button
4. **Stripe Checkout** öffnet sich
5. **Test Kreditkarte verwenden:**
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/34 (oder beliebiges Datum in der Zukunft)
   CVC: 123
   ZIP: 12345
   ```
6. **Payment abschließen**
7. **Success Page** erscheint
8. **Prüfe Dashboard:** Role sollte `pro` sein

---

## 📊 API Endpoints

### **POST /api/subscription/create-checkout**
Erstelle Stripe Checkout Session

**Auth:** Required (JWT)

**Request Body:**
```json
{
  "priceId": "price_1ABC...",
  "successUrl": "https://your-app.com/success",
  "cancelUrl": "https://your-app.com/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/c/pay/..."
  }
}
```

---

### **GET /api/subscription/status**
Hole aktuellen Subscription Status

**Auth:** Required (JWT)

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "plan": "price_1ABC...",
    "role": "pro",
    "currentPeriodEnd": "2026-02-01T12:00:00Z",
    "limits": {
      "analysisPerMonth": 1000,
      "sessionDurationMinutes": 120,
      "storageRetentionDays": 365
    },
    "usage": {
      "analysisThisMonth": 42
    }
  }
}
```

---

### **POST /api/subscription/webhook**
Stripe Webhook Handler

**Auth:** None (Signatur-Validierung)

**Headers:**
```
stripe-signature: t=1234,v1=abc...
```

**Body:** Raw Stripe Event JSON

---

## 🎭 User Roles & Limits

### **Free (Default)**
```javascript
{
  analysisPerMonth: 10,
  sessionDurationMinutes: 15,
  storageRetentionDays: 7
}
```

### **Pro**
```javascript
{
  analysisPerMonth: 1000,
  sessionDurationMinutes: 120,
  storageRetentionDays: 365
}
```

### **Enterprise**
```javascript
{
  analysisPerMonth: -1,  // Unlimited
  sessionDurationMinutes: 360,
  storageRetentionDays: -1  // Unlimited
}
```

**Definiert in:** `backend/src/config/featureGates.js`

---

## 🔄 Webhook Events Flow

### **1. User kauft Subscription:**
```
checkout.session.completed
  → Speichere stripe_customer_id
  → Retrieve subscription
  → Update subscription_status, subscription_plan, role
```

### **2. Subscription erneuert:**
```
invoice.payment_succeeded
  → Log successful payment
  → (Status bleibt 'active')
```

### **3. Payment fehlgeschlagen:**
```
invoice.payment_failed
  → Set subscription_status = 'past_due'
  → (Role bleibt erhalten)
  → TODO: Send email notification
```

### **4. User kündigt:**
```
customer.subscription.deleted
  → Set subscription_status = 'canceled'
  → Set role = 'free'
  → Remove subscription_plan
```

---

## 🔐 Security

### **1. Webhook Signatur-Validierung**
Alle Webhooks werden mit `stripe.webhooks.constructEvent()` validiert.

### **2. Idempotenz**
Webhook Events werden in `webhook_events` Tabelle gespeichert, um Duplikate zu verhindern.

### **3. API Authentication**
Checkout Endpoint benötigt JWT Token.

### **4. Keys**
- ❌ **NIEMALS** Stripe Secret Key committen!
- ✅ Nur in `.env` speichern
- ✅ `.env` ist in `.gitignore`

---

## 🐛 Troubleshooting

### **Problem: "Stripe ist nicht konfiguriert"**
**Lösung:** `STRIPE_SECRET_KEY` in `.env` setzen

### **Problem: Webhook Signatur-Fehler**
**Lösung:**
1. Prüfe `STRIPE_WEBHOOK_SECRET` in `.env`
2. Stelle sicher, dass Stripe CLI läuft: `stripe listen`
3. Prüfe ob Raw Body verwendet wird (express.raw)

### **Problem: Role wird nicht updated**
**Lösung:**
1. Prüfe Webhook Events in Stripe Dashboard
2. Prüfe `STRIPE_PRO_PRICE_ID` und `STRIPE_ENTERPRISE_PRICE_ID` in `.env`
3. Prüfe Backend Logs für Errors

### **Problem: Test-Zahlung wird abgelehnt**
**Lösung:**
1. Verwende Test-Kreditkarten: https://stripe.com/docs/testing
2. Stelle sicher, dass Stripe im **Test Mode** ist
3. Verwende `pk_test_...` und `sk_test_...` Keys

---

## 📝 Nächste Schritte

### **TODO:**
- [ ] E-Mail Notifications für Payment Failed
- [ ] Customer Portal (Self-Service Subscription Management)
- [ ] Usage Tracking (analysisThisMonth)
- [ ] Proration bei Plan-Wechsel
- [ ] Annual Subscriptions
- [ ] Coupon Codes

---

## 🚀 Production Checklist

- [ ] Stripe Account auf **Live Mode** wechseln
- [ ] Live API Keys in Railway/Vercel setzen
- [ ] Webhook mit Production URL erstellen
- [ ] Test-Purchase durchführen (mit echtem Payment)
- [ ] Webhook Events in Stripe Dashboard prüfen
- [ ] Role-Update im Dashboard testen
- [ ] Subscription Cancellation testen
- [ ] Failed Payment Flow testen

---

## 📚 Weitere Ressourcen

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing)

---

**Happy Payments! 💳✨**


