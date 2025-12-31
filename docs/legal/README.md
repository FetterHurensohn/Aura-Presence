# Rechtliche Dokumente - Templates

⚠️ **WICHTIGER HINWEIS:** Diese Dokumente sind **VORLAGEN** und **NICHT rechtsverbindlich**!

## 📋 Übersicht

Dieser Ordner enthält Template-Versionen für die rechtlich erforderlichen Dokumente:

1. **DATENSCHUTZ.md** - Datenschutzerklärung (Privacy Policy)
2. **AGB.md** - Allgemeine Geschäftsbedingungen (Terms of Service)
3. **IMPRESSUM.md** - Impressum (Legal Notice, Pflicht in Deutschland)

## ⚠️ RECHTLICHER DISCLAIMER

**Diese Vorlagen dürfen NICHT ungeprüft verwendet werden!**

### Warum?

- ❌ Keine individuelle Rechtsberatung
- ❌ Nicht auf Ihr spezifisches Geschäftsmodell angepasst
- ❌ Können veraltet sein (Rechtsänderungen)
- ❌ Keine Haftung für Vollständigkeit/Richtigkeit

### Risiken bei fehlerhaften/fehlenden Dokumenten

| Dokument | Risiko bei Fehlen/Fehlern |
|----------|---------------------------|
| **Datenschutzerklärung** | DSGVO-Verstoß: Bußgeld bis **20 Mio. €** oder 4% des Jahresumsatzes |
| **AGB** | Unwirksame Klauseln, Abmahnungen, Vertragsrisiken |
| **Impressum** | Wettbewerbsverstoß: Bußgeld bis **50.000 €**, Abmahnungen |

**Das ist kein Scherz!** Diese Strafen werden in Deutschland aktiv verhängt.

## ✅ Nächste Schritte (ERFORDERLICH!)

### 1. Anwalt konsultieren

**Empfohlene Spezialisten:**

- **[IT-Recht Kanzlei München](https://www.it-recht-kanzlei.de/)**
  - Spezialisiert auf SaaS/Tech
  - Paketpreise für Startups
  - Update-Service bei Rechtsänderungen

- **[Rechtsanwalt Dr. Schwenke](https://drschwenke.de/)**
  - Experte für Datenschutz & Social Media
  - Spricht Developer-Sprache
  - Autor vieler Fachartikel

- **[HÄRTING Rechtsanwälte](https://www.haerting.de/)**
  - Große Kanzlei, etabliert
  - Spezialisiert auf Datenschutz & IT
  - Berät viele Tech-Startups

**Kosten-Schätzung:**
- Datenschutzerklärung: 300-800 €
- AGB: 500-1.500 €
- Impressum: 100-300 €
- **Paket:** Oft 1.000-2.000 € (günstiger als einzeln)

### 2. Online-Generatoren (Nicht empfohlen für Production!)

**Nur für MVP/Testing geeignet:**

- **[eRecht24 Premium](https://www.e-recht24.de/mitglieder/)**
  - ~15 €/Monat
  - Generatoren für Datenschutz, AGB, Impressum
  - Update-Service
  - ⚠️ Kein Anwalts-Review!

- **[Trusted Shops](https://www.trustedshops.de/rechtstexte)**
  - Rechtssicherer als eRecht24
  - Integration in Website
  - ⚠️ Teurer (~40 €/Monat)

- **[Datenschutz-Generator.de](https://datenschutz-generator.de/)**
  - Von RA Dr. Schwenke
  - Kostenlos (Basis-Version)
  - ⚠️ Nicht für kommerzielle Nutzung ohne Premium!

**Wichtig:** Online-Generatoren sind **besser als nichts**, aber **kein Ersatz für Anwalt**!

### 3. Datenschutzbeauftragter

**Pflicht wenn:**
- ≥20 Mitarbeiter mit regelmäßiger Datenverarbeitung
- Besondere Kategorien (Art. 9 DSGVO) verarbeitet werden
- Haupttätigkeit ist Datenverarbeitung in großem Umfang

**Für Aura Presence:**
- Wahrscheinlich **nicht sofort erforderlich**
- Bei Wachstum prüfen
- Externer DSB: 200-500 €/Monat

## 📝 Was in den Vorlagen angepasst werden MUSS

### Datenschutzerklärung

- [ ] Firmen-Details (Name, Adresse, Kontakt)
- [ ] Datenschutzbeauftragter (falls erforderlich)
- [ ] Drittanbieter-Dienste (Liste vervollständigen)
- [ ] Speicherfristen (an eigene Policies anpassen)
- [ ] Cookie-Banner (falls verwendet)
- [ ] Analytics (falls Google Analytics/ähnliches)
- [ ] Auftragsverarbeitungsverträge (AVV) mit Drittanbietern abschließen

### AGB

- [ ] Firmen-Details (Name, Adresse, etc.)
- [ ] Preise & Features (Free vs. Pro)
- [ ] Kündigungsfristen (an Geschäftsmodell anpassen)
- [ ] Haftungsbeschränkungen (an deutsche Rechtsprechung)
- [ ] Gerichtsstand (Stadt eintragen)
- [ ] Verbraucherschlichtungsstelle (Teilnahme ja/nein)

### Impressum

- [ ] **ALLE** Platzhalter [IN ECKIGEN KLAMMERN] ausfüllen
- [ ] Rechtsform (GmbH, UG, Einzelunternehmen)
- [ ] Registereintrag (nur bei eingetragenen Firmen)
- [ ] USt-ID (nur wenn vorhanden)
- [ ] Vertretungsberechtigter (Geschäftsführer, Inhaber)

## 🚀 Integration in die App

### Frontend

**Erstelle Routen:**

```javascript
// In App.jsx oder Router
<Route path="/datenschutz" element={<Datenschutz />} />
<Route path="/agb" element={<AGB />} />
<Route path="/impressum" element={<Impressum />} />
```

**Footer-Links:**

```jsx
<footer>
  <Link to="/impressum">Impressum</Link>
  <Link to="/datenschutz">Datenschutz</Link>
  <Link to="/agb">AGB</Link>
</footer>
```

**Registrierungs-Checkbox:**

```jsx
<Checkbox required>
  Ich akzeptiere die <Link to="/agb">AGB</Link> und{' '}
  <Link to="/datenschutz">Datenschutzerklärung</Link>
</Checkbox>
```

### Backend

**API-Endpoints (optional):**

```javascript
// routes/legal.js
app.get('/api/legal/datenschutz', (req, res) => {
  res.sendFile('DATENSCHUTZ.md');
});
```

## 📚 Zusätzliche erforderliche Dokumente

### 1. Auftragsverarbeitungsverträge (AVV)

**Erforderlich für alle Drittanbieter, die Daten verarbeiten:**

- [ ] Stripe (Zahlungen)
- [ ] OpenAI (KI-Feedback)
- [ ] Sentry (Error-Tracking)
- [ ] Metered.ca (TURN-Server)
- [ ] Vercel (Frontend-Hosting)
- [ ] Railway (Backend-Hosting)

**Wo zu finden:**
- Meist im Dashboard des Anbieters unter "Legal" oder "DPA"
- Beispiel: Stripe → https://stripe.com/legal/dpa

### 2. Widerrufsbelehrung

**Erforderlich bei Online-Verkauf an Verbraucher (Fernabsatzgesetz):**

```
Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen
diesen Vertrag zu widerrufen...
```

**Vorlage:** [Muster-Widerrufsbelehrung](https://www.bmj.de/SharedDocs/Gesetzgebungsverfahren/DE/Umsetzung_Verbraucherrechterichtlinie.html)

### 3. Cookie-Banner (falls Cookies verwendet)

**DSGVO-konform:**
- Opt-In (nicht Opt-Out!)
- Vor Tracking-Start (nicht nachträglich)
- Granulare Auswahl (nicht "Alles oder nichts")

**Empfohlene Tools:**
- [Cookiebot](https://www.cookiebot.com/) (~9 €/Monat)
- [Usercentrics](https://usercentrics.com/)
- [CookieYes](https://www.cookieyes.com/)

## 🔍 Self-Check vor Launch

### Datenschutz-Checkliste

- [ ] Datenschutzerklärung vorhanden & verlinkt
- [ ] Impressum vorhanden & verlinkt (Footer!)
- [ ] AGB vorhanden & bei Registrierung akzeptiert
- [ ] SSL/HTTPS aktiv
- [ ] Cookie-Banner (falls Cookies verwendet)
- [ ] AVVs mit allen Drittanbietern abgeschlossen
- [ ] Recht auf Löschung implementiert (Account-Löschung)
- [ ] Recht auf Auskunft (DSGVO Art. 15) implementierbar
- [ ] Datenschutzbeauftragter bestellt (falls erforderlich)
- [ ] Team in Datenschutz geschult

### Legal-Checkliste

- [ ] Alle Dokumente von Anwalt geprüft
- [ ] Impressum im Footer verlinkt (Pflicht!)
- [ ] AGB-Checkbox bei Registrierung
- [ ] Widerrufsbelehrung vorhanden (bei kostenpflichtigen Abos)
- [ ] Preise inkl. MwSt. ausgewiesen
- [ ] Zahlungsarten korrekt beschrieben
- [ ] Kündigungsfristen klar kommuniziert

## ⚡ Quick-Fix für MVP (nur temporär!)

**Wenn Launch dringend ist:**

1. Nutze [eRecht24 Premium](https://www.e-recht24.de/) für Generatoren (15 €/Monat)
2. Erstelle Datenschutzerklärung, AGB, Impressum
3. Integriere in App (Footer-Links, Checkboxen)
4. **WICHTIG:** Plane zeitnah Anwalts-Review ein (max. 3 Monate!)
5. Setze Reminder für regelmäßige Updates (alle 6 Monate prüfen)

**Warum temporär OK:**
- eRecht24 aktualisiert bei Rechtsänderungen
- Besser als gar keine Dokumente
- ⚠️ Aber kein dauerhafter Ersatz für Anwalt!

## 📞 Support & Beratung

### Kostenlose Erstberatung

Viele Anwaltskanzleien bieten **kostenloses Erstgespräch** (15-30 Minuten):
- Grobe Kosten-Schätzung
- Machbarkeits-Check
- Empfehlungen für Ihr Projekt

**Vorbereitung:**
- Geschäftsmodell beschreiben (SaaS, Subscription)
- Datenflüsse skizzieren (Was wird wo verarbeitet?)
- Liste der Drittanbieter
- Budget-Rahmen nennen

### Fördermöglichkeiten

**KfW-Kredit für Startups:**
- Rechtsberatung ist förderfähig
- Bis zu 100.000 € Kredit
- [Mehr Infos](https://www.kfw.de/inlandsfoerderung/Unternehmen/Gr%C3%BCnden-Nachfolgen/)

**EXIST-Gründerstipendium:**
- Für Uni-Absolventen
- Coaching-Budget inkl. Rechtsberatung
- [Mehr Infos](https://www.exist.de/)

## 🔗 Nützliche Links

- [DSGVO-Volltext](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679)
- [Telemediengesetz (TMG)](https://www.gesetze-im-internet.de/tmg/)
- [BfDI - Datenschutzbehörde](https://www.bfdi.bund.de/)
- [e-Recht24 Blog](https://www.e-recht24.de/news.html) - Aktuelle Rechts-News

---

## ❓ FAQ

### Brauche ich wirklich einen Anwalt?

**Ja, wenn:**
- Du kommerziell arbeitest (Geld verdienst)
- Du personenbezogene Daten verarbeitest (E-Mail = schon relevant!)
- Du in der EU tätig bist (DSGVO gilt!)

**Risiko ohne Anwalt:**
- Hohe Bußgelder (DSGVO: bis 20 Mio. €)
- Abmahnungen (Wettbewerbsrecht)
- Unwirksame AGB (Vertragsrisiken)

### Was kostet eine Abmahnung?

**Wettbewerbsrecht:**
- Anwaltskosten: 500-2.000 €
- Vertragsstrafe: 5.000-50.000 €
- Gerichtskosten: 1.000-10.000 €

**DSGVO-Verstoß:**
- Bußgeld: bis 20 Mio. € (realistisch: 5.000-50.000 € für kleine Unternehmen)
- Zusätzlich: Schadensersatz für Betroffene

### Kann ich einfach AGB von anderen Startups kopieren?

**Nein!**
- ❌ Urheberrechtsverletzung
- ❌ Nicht auf Ihr Geschäftsmodell angepasst
- ❌ Womöglich veraltet oder fehlerhaft
- ❌ Keine Haftung bei Fehlern

### Reicht ein Online-Generator?

**Kurzfristig:** Ja, für MVP/Testing  
**Langfristig:** Nein, für Production

**Warum nicht langfristig:**
- Nicht individuell auf Ihr Geschäftsmodell
- Keine persönliche Haftung des Generator-Anbieters
- Updates müssen manuell übernommen werden
- Komplexe Sachverhalte nicht abgebildet

---

**⚖️ HAFTUNGSAUSSCHLUSS**

Diese Informationen stellen **keine Rechtsberatung** dar. Der Autor übernimmt **keine Haftung** für die Richtigkeit, Vollständigkeit oder Aktualität. Konsultieren Sie einen Fachanwalt für IT-Recht.

---

**Letzte Aktualisierung:** 2025-12-30  
**Version:** 1.0

