# Privacy & Security Checklist

## 🔒 Datenschutz-Checkliste für Aura Presence

Diese Checkliste dient als Leitfaden für Datenschutz- und Sicherheitsaspekte vor dem Production-Launch und für App-Store-Reviews.

---

## 📋 Allgemeine Datenschutzprinzipien

- [x] **Datenminimierung**: Nur notwendige Daten werden erfasst
- [x] **Privacy by Design**: Datenschutz ist in Architektur eingebaut
- [x] **Transparenz**: User werden über Datenverarbeitung informiert
- [ ] **Einwilligung**: User müssen explizit zustimmen (Cookie-Banner fehlt noch)
- [ ] **Recht auf Löschung**: API-Endpunkt für Datenlöschung implementieren
- [ ] **Recht auf Datenportabilität**: Export-Funktion implementieren

---

## 🎥 Video- und Bilddatenverarbeitung

### ✅ Was wir GUT machen:

- [x] **Keine Rohbilder übertragen**: Nur strukturierte Metriken verlassen den Browser
- [x] **Lokale Verarbeitung**: MediaPipe läuft vollständig im Browser (WASM)
- [x] **Keine Speicherung**: Videos/Bilder werden nicht auf Server gespeichert
- [x] **Keine Drittanbieter-Zugriff**: OpenAI erhält nur numerische Metriken, keine Bilder

### Error-Handling & Privacy

- [x] Error-Messages enthalten keine PII (E-Mail, Namen, IDs nur wo nötig)
- [x] Stack-Traces nur in Development-Mode, NICHT in Production
- [x] Toast-Messages sind nutzerfreundlich und enthalten keine technischen Details
- [x] Logs enthalten keine sensiblen Daten (Passwörter, vollständige Tokens, Kreditkarten)
- [ ] Sentry (wenn aktiviert): PII-Scrubbing aktiv

### ⚠️ Was zu beachten ist:

- [ ] **User-Disclosure**: Klare Hinweise in UI, dass keine Videos gespeichert werden
- [ ] **Kamera-Permission-Prompt**: Browser-native Prompts sind vorhanden
- [ ] **Opt-Out**: User können Analyse jederzeit pausieren/stoppen

---

## 🔐 Authentifizierung & Datenspeicherung

### Backend (User-Daten):

- [x] **Passwort-Hashing**: bcrypt mit 12 Rounds
- [x] **JWT Tokens**: Sicher signiert mit Secret
- [ ] **Token-Refresh**: Implementieren für bessere UX
- [ ] **2FA**: Für erhöhte Sicherheit (optional, aber empfohlen)
- [ ] **Rate Limiting**: Implementiert, aber Limits sollten produktionsreif getestet werden

### Datenbank:

- [x] **SQLite für Dev**: OK für Starter
- [ ] **PostgreSQL für Production**: Migration empfohlen
- [ ] **Verschlüsselung at rest**: Database-Encryption aktivieren
- [ ] **Backups**: Automatisierte, verschlüsselte Backups

---

## 💳 Payment-Daten (Stripe)

- [x] **PCI-Compliance**: Stripe übernimmt Kartendaten (wir speichern keine)
- [x] **Webhook-Signatur**: Stripe-Signaturen werden validiert
- [x] **Stripe Customer ID**: Nur ID wird gespeichert, keine Kartendaten
- [x] **Webhook-Events-Tabelle**: Keine PII im payload-Feld (nur Event-Metadata)
- [x] **Webhook-Logs**: Enthalten keine Kreditkartendaten (regelmäßig geprüft!)
- [x] **Idempotenz**: Duplicate Events werden erkannt und übersprungen
- [ ] **Refund-Policy**: Klar kommunizieren in UI

---

## 🌐 Netzwerk & API-Sicherheit

- [x] **HTTPS**: Erforderlich für Production (aktuell nur Dev)
- [x] **CORS**: Konfiguriert für Frontend-Origin
- [x] **Input-Validierung**: Joi-Schemas für alle API-Inputs
- [x] **Rate Limiting**: Express-rate-limit implementiert
- [ ] **API-Keys**: Rotation-Policy implementieren
- [ ] **CSRF-Protection**: Für Form-Submissions
- [ ] **XSS-Prevention**: Content-Security-Policy Header

---

## 📱 Mobile App (Android/iOS) Spezifisch

### Android (Google Play):

- [x] **Permissions deklariert**: `CAMERA`, `RECORD_AUDIO`, `INTERNET` in `capacitor.config.json`
- [ ] **Privacy Policy Link**: Muss in Play Store Listing angegeben werden
- [ ] **Data Safety Form**: Google Play Anforderung ausfüllen
  - ❌ Keine Videos/Fotos werden gespeichert
  - ✅ User-Account-Daten (E-Mail) werden gespeichert
  - ✅ Analytics-Daten (aggregiert, anonym)
- [ ] **App Content Rating**: USK/PEGI bewerten lassen

### iOS (App Store):

- [x] **Permissions Descriptions**: `NSCameraUsageDescription`, `NSMicrophoneUsageDescription` in `capacitor.config.json`
- [ ] **Privacy Nutrition Labels**: Apple-Formular ausfüllen
  - Data Used to Track You: Nein (aktuell keine Tracking)
  - Data Linked to You: E-Mail, Subscription-Status
  - Data Not Linked to You: Aggregierte Analyse-Metriken
- [ ] **App Store Guidelines**: Review Guidelines 5.1.1 (Privacy) beachten

---

## 📄 Rechtsdokumente (erforderlich)

- [ ] **Datenschutzerklärung (DSGVO-konform)**
  - Welche Daten werden erfasst?
  - Wie werden sie verarbeitet?
  - Weitergabe an Dritte (OpenAI, Stripe)
  - Rechte der Betroffenen
  - Kontaktdaten Datenschutzbeauftragter (falls erforderlich)
  - Cookie-Nutzung
- [ ] **Nutzungsbedingungen (AGB)**
- [ ] **Impressum** (für DE/EU)
- [ ] **Cookie-Banner** (DSGVO-konform)

**Empfehlung:** Anwalt oder Datenschutzbeauftragten konsultieren!

---

## 💾 Datenbank & Backups (PostgreSQL)

- [x] **Connection-String niemals committed** (nur in .env, gitignored)
- [x] **SSL-Mode für PostgreSQL-Connections** aktiv (sslmode=require)
- [ ] **Automatische Backups konfiguriert** (Supabase macht das automatisch)
- [ ] **DB-User hat Least-Privilege** (kein SUPERUSER)
- [ ] **Backup-Restore getestet** (mindestens einmal)
- [x] **Knex-Migrations-System** für Schema-Änderungen
- [x] **SQLite-Fallback** für Development (keine Production-Daten gefährdet)

---

## 🧪 Testing & Audits

- [ ] **Penetration Testing**: Vor Launch
- [ ] **OWASP Top 10 Check**: Jährlich
- [ ] **Dependency Audit**: `npm audit` regelmäßig
- [ ] **Code Review**: Sicherheitsfokus
- [ ] **DSGVO-Audit**: Durch Experten

---

## 📊 Logging & Monitoring

### Was wir loggen:

- [x] API-Requests (ohne sensible Daten)
- [x] Fehler und Exceptions
- [x] Login-Versuche

### Was wir NICHT loggen sollten:

- ❌ Passwörter (auch nicht gehashed in Logs)
- ❌ Volle JWT-Tokens
- ❌ Kreditkartendaten
- ❌ IP-Adressen (DSGVO-relevant, nur wenn notwendig)

### Log-Retention:

- [ ] Policy definieren (z.B. 30 Tage)
- [ ] Automatisches Löschen alter Logs

---

## 🌍 Geografische Compliance

### EU (DSGVO):

- [ ] Datenschutzerklärung auf DE/EN
- [ ] Cookie-Banner mit Opt-In
- [ ] Data Processing Agreement (DPA) mit Stripe, OpenAI
- [ ] Server-Standort beachten (EU bevorzugt)

### USA (CCPA/CPRA - California):

- [ ] "Do Not Sell My Personal Information" Link
- [ ] Privacy Policy muss CCPA-Anforderungen erfüllen

### Andere Regionen:

- Lokale Datenschutzgesetze prüfen

---

## 🛡️ Third-Party Services

### OpenAI:

- [x] **Keine Rohbilder**: Nur strukturierte Metriken
- [ ] **DPA unterzeichnen**: Falls verfügbar
- [ ] **User informieren**: "Daten werden an OpenAI gesendet zur Interpretation"
- [ ] **Opt-Out-Option**: User können Mock-Modus wählen

### Stripe:

- [x] **PCI-konform**: Stripe-Checkout übernimmt Kartendaten
- [ ] **DPA**: Stripe Data Processing Addendum akzeptieren

### MediaPipe (Google):

- [x] **Lokal**: Keine Daten verlassen Browser (WASM)
- [x] **Open Source**: Keine Tracking-Komponenten

---

## ✅ Pre-Launch Checklist

**Vor Production-Deployment:**

- [ ] HTTPS aktiviert und erzwungen
- [ ] Alle ENV-Variablen auf Production gesetzt
- [ ] Datenschutzerklärung veröffentlicht und verlinkt
- [ ] Cookie-Banner implementiert
- [ ] Error-Monitoring aktiv (Sentry, etc.)
- [ ] Backups konfiguriert
- [ ] Incident-Response-Plan dokumentiert

**Vor App-Store-Submission:**

- [ ] Privacy Policy öffentlich zugänglich (URL)
- [ ] App Permissions begründet
- [ ] Data Safety / Privacy Labels ausgefüllt
- [ ] Screenshots ohne echte User-Daten
- [ ] Test-Account für Reviewer bereitstellen

---

## 🚨 Incident Response

**Im Fall eines Security-Breach:**

1. **Sofort**: Betroffene Systeme isolieren
2. **Innerhalb 1h**: Incident-Team informieren
3. **Innerhalb 24h**: Ausmaß bewerten
4. **Innerhalb 72h**: Datenschutzbehörde informieren (DSGVO-Pflicht bei personenbezogenen Daten)
5. **Schnellstmöglich**: Betroffene User informieren
6. **Post-Mortem**: Ursache analysieren, Maßnahmen implementieren

---

## 📞 Kontakt & Verantwortlichkeiten

**Datenschutzbeauftragter:** [E-Mail eintragen]  
**Security Lead:** [Name eintragen]  
**Incident Response:** [Telefon/Slack-Kanal eintragen]

---

## 📚 Ressourcen

- [DSGVO Volltext](https://dsgvo-gesetz.de/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Play Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Apple Privacy Labels](https://developer.apple.com/app-store/app-privacy-details/)
- [Stripe Security](https://stripe.com/docs/security)
- [OpenAI Terms](https://openai.com/policies/terms-of-use)

---

**Letztes Review:** 2025-01-01  
**Nächstes Review:** 2025-03-01  
**Verantwortlich:** [Name eintragen]

---

**⚠️ WICHTIG:** Diese Checkliste ersetzt keine rechtliche Beratung. Vor Production-Launch sollte ein Anwalt oder Datenschutzbeauftragter konsultiert werden!

