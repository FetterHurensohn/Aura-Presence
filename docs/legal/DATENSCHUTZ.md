# Datenschutzerklärung

**⚠️ WICHTIG: Dieses Dokument ist eine VORLAGE und muss von einem Rechtsanwalt geprüft und angepasst werden!**

**Stand:** [DATUM EINFÜGEN]

---

## 1. Verantwortlicher

[FIRMENNAME EINFÜGEN]  
[STRASSE UND HAUSNUMMER]  
[PLZ UND ORT]  
[LAND]

**E-Mail:** [KONTAKT@EMAIL.DE]  
**Telefon:** [TELEFONNUMMER]

**Datenschutzbeauftragter:**  
[NAME EINFÜGEN]  
[E-MAIL EINFÜGEN]

---

## 2. Allgemeine Hinweise

Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten bei der Nutzung von **Aura Presence** (im Folgenden "die App").

Die Datenverarbeitung erfolgt auf Grundlage der gesetzlichen Vorschriften der **Datenschutz-Grundverordnung (DSGVO)** und des **Bundesdatenschutzgesetzes (BDSG)**.

---

## 3. Welche Daten werden erhoben?

### 3.1 Account-Daten

Bei Registrierung werden folgende Daten erhoben:

- **E-Mail-Adresse** (erforderlich)
- **Passwort** (verschlüsselt mit bcrypt)
- **Account-Erstellungsdatum**

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

### 3.2 Video-Analyse-Daten

Bei Nutzung der Analyse-Funktion werden **KEINE** Rohbilder oder Videos an unsere Server übertragen.

**Was wird LOKAL im Browser verarbeitet:**
- Kamera-Video-Stream (bleibt lokal!)
- MediaPipe-Landmarken (Pose, Face Mesh, Hands)

**Was wird an den Server gesendet:**
- **Aggregierte, numerische Metriken** (z.B. Posture-Winkel: 5°, Eye-Contact-Score: 0.85)
- **Keine biometrischen Rohdaten** (z.B. keine Face-Mesh-Koordinaten)
- **Keine Bilder oder Videos**

**Gespeichert werden:**
- Analyse-Ergebnisse (Evaluations & AI-Feedback)
- Zeitstempel der Analysen

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

### 3.3 Zahlungsdaten (Stripe)

Zahlungen werden über **Stripe** (Drittanbieter) abgewickelt. Wir speichern:

- Stripe-Customer-ID
- Subscription-Status (active/inactive)
- Subscription-Plan

**Nicht gespeichert:**
- Kreditkartennummern
- Bankverbindungen

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Stripe Datenschutzerklärung:** https://stripe.com/privacy

### 3.4 Server-Logs

Automatisch erfasst:

- IP-Adresse (anonymisiert nach 7 Tagen)
- Zeitstempel
- User-Agent (Browser/Gerät)
- Aufgerufene URLs
- HTTP-Status-Codes

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit und Fehleranalyse)

### 3.5 Error-Tracking (Sentry)

Bei technischen Fehlern werden Daten an **Sentry** übermittelt:

- Error-Messages & Stack-Traces
- Browser-Informationen
- Maskierte E-Mail-Adresse (z.B. us***@example.com)
- Anonymisierte User-ID

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Fehleranalyse)

**Sentry Datenschutzerklärung:** https://sentry.io/privacy/

---

## 4. Wie werden Daten verarbeitet?

### 4.1 Kamera-Zugriff

**Lokale Verarbeitung:**
- Der Kamera-Zugriff erfolgt ausschließlich in Ihrem Browser
- Kein Upload von Rohbildern oder Videos an unsere Server
- MediaPipe-Analyse läuft vollständig lokal (JavaScript WebAssembly)

**Berechtigungen:**
- Sie müssen aktiv den Kamera-Zugriff erlauben
- Sie können die Erlaubnis jederzeit widerrufen (Browser-Einstellungen)

### 4.2 AI-Interpretation (OpenAI)

Für KI-basiertes Feedback werden **anonymisierte, aggregierte Metriken** an OpenAI übertragen:

**Übertragen wird:**
- Numerische Scores (z.B. "eye_contact_quality: 0.85")
- Verhaltensflags (z.B. "posture_good: true")

**NICHT übertragen wird:**
- Bilder oder Videos
- Biometrische Rohdaten
- Name oder E-Mail-Adresse

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**OpenAI Datenschutzerklärung:** https://openai.com/privacy/

### 4.3 WebRTC-Verbindungen (TURN-Server)

Für Peer-to-Peer-Verbindungen nutzen wir **Metered.ca** als TURN-Server:

**Verarbeitet werden:**
- IP-Adressen (für NAT-Traversal)
- WebRTC-Metadaten

**NICHT verarbeitet:**
- Video-Inhalte (bleiben Peer-to-Peer)
- Persönliche Identifikationsdaten

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Metered.ca Datenschutzerklärung:** https://www.metered.ca/privacy

---

## 5. Wie lange werden Daten gespeichert?

| Datenart | Speicherdauer | Löschung |
|----------|---------------|----------|
| Account-Daten | Bis Account-Löschung | Auf Wunsch sofort |
| Analyse-Ergebnisse | 90 Tage | Automatisch |
| Server-Logs | 7 Tage | Automatisch |
| Sentry-Errors | 7 Tage (Free Tier) | Automatisch |
| Stripe-Daten | Gesetzliche Aufbewahrungsfrist (10 Jahre) | Nach Ablauf |

---

## 6. Ihre Rechte

Nach DSGVO haben Sie folgende Rechte:

### 6.1 Recht auf Auskunft (Art. 15 DSGVO)

Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen.

**Anfrage per E-Mail:** [DATENSCHUTZ@EMAIL.DE]

### 6.2 Recht auf Berichtigung (Art. 16 DSGVO)

Fehlerhafte Daten werden auf Anfrage korrigiert.

### 6.3 Recht auf Löschung (Art. 17 DSGVO)

Sie können die Löschung Ihres Accounts und aller Daten verlangen.

**In der App:**
1. Einstellungen → Account → "Account löschen"
2. Bestätigung

**Per E-Mail:** [DATENSCHUTZ@EMAIL.DE]

### 6.4 Recht auf Datenportabilität (Art. 20 DSGVO)

Sie können Ihre Daten in einem strukturierten Format (JSON) exportieren.

**In der App:** Einstellungen → Daten exportieren

### 6.5 Widerspruchsrecht (Art. 21 DSGVO)

Sie können der Datenverarbeitung widersprechen.

### 6.6 Beschwerderecht (Art. 77 DSGVO)

Sie können Beschwerde bei einer Datenschutz-Aufsichtsbehörde einlegen:

**Zuständige Behörde (Deutschland):**  
[LANDESBEAUFTRAGTE FÜR DATENSCHUTZ EINFÜGEN]

---

## 7. Datensicherheit

**Technische Maßnahmen:**
- ✅ HTTPS/TLS-Verschlüsselung (SSL-Zertifikat)
- ✅ Passwörter mit bcrypt verschlüsselt (10 Rounds)
- ✅ JWT-Tokens mit HMAC SHA256
- ✅ Rate-Limiting gegen Brute-Force
- ✅ Input-Validierung & Sanitization
- ✅ Content-Security-Policy (CSP)
- ✅ PostgreSQL mit verschlüsselten Verbindungen

**Organisatorische Maßnahmen:**
- Zugriffsbeschränkungen für Mitarbeiter
- Regelmäßige Sicherheits-Audits
- Datenschutz-Schulungen
- Incident-Response-Plan

---

## 8. Cookies & Tracking

**Wir verwenden KEINE Third-Party-Tracking-Cookies.**

**Technisch notwendige Cookies:**
- Session-Cookies für Login (httpOnly, secure)
- JWT-Tokens in LocalStorage (kein Cookie)

**Analytics:**
- [Optional: Wenn Google Analytics o.ä. verwendet wird, hier dokumentieren]

---

## 9. Drittanbieter-Dienste

| Dienst | Zweck | Datenschutzerklärung |
|--------|-------|----------------------|
| Stripe | Zahlungsabwicklung | https://stripe.com/privacy |
| OpenAI | KI-Feedback-Generierung | https://openai.com/privacy/ |
| Sentry | Error-Tracking | https://sentry.io/privacy/ |
| Metered.ca | WebRTC TURN-Server | https://www.metered.ca/privacy |
| Vercel | Frontend-Hosting | https://vercel.com/legal/privacy-policy |
| Railway | Backend-Hosting | https://railway.app/legal/privacy |

**Datentransfer außerhalb der EU:**
- OpenAI (USA) - Standardvertragsklauseln (Art. 46 DSGVO)
- Sentry (USA) - Standardvertragsklauseln

---

## 10. Kinder

Die App richtet sich an Personen ab **16 Jahren**. Wir verarbeiten wissentlich keine Daten von Kindern unter 16 Jahren.

Falls Sie feststellen, dass Ihr Kind Daten an uns übermittelt hat, kontaktieren Sie uns bitte umgehend.

---

## 11. Änderungen der Datenschutzerklärung

Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Änderungen werden in der App angekündigt.

**Letzte Aktualisierung:** [DATUM EINFÜGEN]

---

## 12. Kontakt

**Datenschutzanfragen:**  
[DATENSCHUTZ@EMAIL.DE]

**Allgemeine Fragen:**  
[SUPPORT@EMAIL.DE]

**Postadresse:**  
[FIRMENNAME]  
[STRASSE UND HAUSNUMMER]  
[PLZ UND ORT]  
[LAND]

---

**⚠️ RECHTLICHER HINWEIS:**

Diese Datenschutzerklärung ist eine **Vorlage** und **nicht rechtsverbindlich**. Sie muss von einem Fachanwalt für IT-Recht oder Datenschutzrecht geprüft und an Ihre spezifischen Gegebenheiten angepasst werden.

**Empfohlene Anwälte/Dienste:**
- [eRecht24.de](https://www.e-recht24.de/) - Datenschutz-Generator
- [Rechtsanwalt Dr. Schwenke](https://drschwenke.de/) - Datenschutz-Beratung
- [Activemind AG](https://www.activemind.de/) - Datenschutz-Generator

**Haftungsausschluss:** Der Autor übernimmt keine Haftung für die Vollständigkeit oder Richtigkeit dieser Vorlage.

