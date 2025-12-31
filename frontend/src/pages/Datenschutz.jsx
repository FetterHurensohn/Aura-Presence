/**
 * Datenschutzerklärung Page
 * Konvertiert von docs/legal/DATENSCHUTZ.md
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

function Datenschutz() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">← Zurück zur Startseite</Link>
        
        <h1>Datenschutzerklärung</h1>
        
        <p className="legal-warning">
          <strong>⚠️ WICHTIG:</strong> Dieses Dokument ist eine Vorlage und muss von einem Rechtsanwalt geprüft und angepasst werden!
        </p>
        
        <p><strong>Stand:</strong> 30.12.2024</p>
        
        <hr />
        
        <h2>1. Verantwortlicher</h2>
        <p>
          [FIRMENNAME EINFÜGEN]<br />
          [STRASSE UND HAUSNUMMER]<br />
          [PLZ UND ORT]<br />
          [LAND]
        </p>
        <p>
          <strong>E-Mail:</strong> [KONTAKT@EMAIL.DE]<br />
          <strong>Telefon:</strong> [TELEFONNUMMER]
        </p>
        <p>
          <strong>Datenschutzbeauftragter:</strong><br />
          [NAME EINFÜGEN]<br />
          [E-MAIL EINFÜGEN]
        </p>
        
        <hr />
        
        <h2>2. Allgemeine Hinweise</h2>
        <p>
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten bei der Nutzung von <strong>Aura Presence</strong> (im Folgenden "die App").
        </p>
        <p>
          Die Datenverarbeitung erfolgt auf Grundlage der gesetzlichen Vorschriften der <strong>Datenschutz-Grundverordnung (DSGVO)</strong> und des <strong>Bundesdatenschutzgesetzes (BDSG)</strong>.
        </p>
        
        <hr />
        
        <h2>3. Welche Daten werden erhoben?</h2>
        
        <h3>3.1 Account-Daten</h3>
        <p>Bei Registrierung werden folgende Daten erhoben:</p>
        <ul>
          <li><strong>E-Mail-Adresse</strong> (erforderlich)</li>
          <li><strong>Passwort</strong> (verschlüsselt mit bcrypt)</li>
          <li><strong>Account-Erstellungsdatum</strong></li>
        </ul>
        <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
        
        <h3>3.2 Video-Analyse-Daten</h3>
        <p>
          Bei Nutzung der Analyse-Funktion werden <strong>KEINE</strong> Rohbilder oder Videos an unsere Server übertragen.
        </p>
        <p><strong>Was wird LOKAL im Browser verarbeitet:</strong></p>
        <ul>
          <li>Kamera-Video-Stream (bleibt lokal!)</li>
          <li>MediaPipe-Analyse (vollständig im Browser via WebAssembly)</li>
        </ul>
        <p><strong>Was wird an unsere Server gesendet:</strong></p>
        <ul>
          <li>Strukturierte, numerische Metriken (z.B. Augenkontakt-Score: 0.85)</li>
          <li>Keine Bilder, keine Videos, keine Gesichter</li>
        </ul>
        <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
        
        <h3>3.3 KI-Interpretation (OpenAI)</h3>
        <p>
          Falls Sie der KI-Interpretation zugestimmt haben, werden die strukturierten Metriken an OpenAI (USA) gesendet zur Generierung von personalisiertem Feedback.
        </p>
        <p><strong>Was OpenAI erhält:</strong></p>
        <ul>
          <li>Numerische Metriken (z.B. "Augenkontakt: 0.85, Blinzelrate: 15/min")</li>
          <li>KEINE Rohbilder, KEINE Videos, KEINE Namen</li>
        </ul>
        <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
        <p><strong>Datenschutz bei OpenAI:</strong> <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></p>
        
        <h3>3.4 Zahlungsdaten (Stripe)</h3>
        <p>
          Bei Abschluss eines Abonnements werden Zahlungsdaten über Stripe (USA/Irland) verarbeitet. Wir speichern <strong>KEINE</strong> Kreditkartendaten.
        </p>
        <p><strong>Was wir speichern:</strong></p>
        <ul>
          <li>Stripe Customer ID</li>
          <li>Subscription-Status (aktiv/gekündigt)</li>
          <li>Ablaufdatum</li>
        </ul>
        <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
        <p><strong>Datenschutz bei Stripe:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></p>
        
        <h3>3.5 Cookies & Local Storage</h3>
        <p>Wir verwenden folgende Technologien:</p>
        <ul>
          <li><strong>Essentielle Cookies:</strong> JWT-Token für Login (erforderlich)</li>
          <li><strong>Analytics (opt-in):</strong> Sentry Error-Tracking</li>
          <li><strong>Consent-State:</strong> Ihre Cookie-Einwilligungen (localStorage)</li>
        </ul>
        <p>Sie können Ihre Einwilligungen jederzeit in den <Link to="/settings">Einstellungen</Link> widerrufen.</p>
        
        <hr />
        
        <h2>4. Ihre Rechte (DSGVO)</h2>
        <p>Sie haben folgende Rechte:</p>
        <ul>
          <li><strong>Auskunft (Art. 15):</strong> Welche Daten wir über Sie speichern</li>
          <li><strong>Berichtigung (Art. 16):</strong> Korrektur falscher Daten</li>
          <li><strong>Löschung (Art. 17):</strong> "Recht auf Vergessenwerden"</li>
          <li><strong>Datenportabilität (Art. 20):</strong> Export Ihrer Daten</li>
          <li><strong>Widerspruch (Art. 21):</strong> Widerspruch gegen Verarbeitung</li>
        </ul>
        
        <h3>Daten exportieren</h3>
        <p>
          In den <Link to="/settings">Einstellungen</Link> können Sie alle Ihre Daten als JSON-Datei exportieren.
        </p>
        
        <h3>Account löschen</h3>
        <p>
          In den <Link to="/settings">Einstellungen</Link> können Sie Ihren Account löschen. 
          Die Löschung erfolgt nach einer 30-tägigen Wartefrist (kann abgebrochen werden).
        </p>
        
        <hr />
        
        <h2>5. Datenspeicherung & Aufbewahrung</h2>
        <ul>
          <li><strong>Account-Daten:</strong> Bis zur Löschung des Accounts</li>
          <li><strong>Analyse-Sessions:</strong> 90 Tage (dann automatisch gelöscht)</li>
          <li><strong>Logs:</strong> 30 Tage (dann automatisch gelöscht)</li>
          <li><strong>Stripe-Daten:</strong> Gemäß gesetzlicher Aufbewahrungspflichten (10 Jahre)</li>
        </ul>
        
        <hr />
        
        <h2>6. Datensicherheit</h2>
        <p>Wir schützen Ihre Daten durch:</p>
        <ul>
          <li>HTTPS-Verschlüsselung (SSL/TLS)</li>
          <li>Passwort-Hashing mit bcrypt (12 Rounds)</li>
          <li>Sichere JWT-Tokens</li>
          <li>Rate-Limiting gegen Brute-Force</li>
          <li>Regelmäßige Sicherheits-Audits</li>
        </ul>
        
        <hr />
        
        <h2>7. Drittanbieter-Dienste</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th>Dienst</th>
              <th>Zweck</th>
              <th>Standort</th>
              <th>Datenschutz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OpenAI</td>
              <td>KI-Feedback</td>
              <td>USA</td>
              <td><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Link</a></td>
            </tr>
            <tr>
              <td>Stripe</td>
              <td>Zahlungen</td>
              <td>USA/Irland</td>
              <td><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Link</a></td>
            </tr>
            <tr>
              <td>Sentry</td>
              <td>Error-Tracking</td>
              <td>USA</td>
              <td><a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">Link</a></td>
            </tr>
            <tr>
              <td>Metered.ca</td>
              <td>TURN-Server (WebRTC)</td>
              <td>Kanada</td>
              <td><a href="https://www.metered.ca/privacy" target="_blank" rel="noopener noreferrer">Link</a></td>
            </tr>
          </tbody>
        </table>
        
        <hr />
        
        <h2>8. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslage oder Funktionen anzupassen. 
          Die aktuelle Version ist immer unter <Link to="/datenschutz">dieser URL</Link> abrufbar.
        </p>
        
        <hr />
        
        <h2>9. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz kontaktieren Sie uns unter:<br />
          <strong>E-Mail:</strong> [DATENSCHUTZ@EMAIL.DE]
        </p>
        
        <hr />
        
        <p className="legal-footer">
          <strong>Hinweis:</strong> Diese Datenschutzerklärung wurde mit größter Sorgfalt erstellt, 
          ersetzt jedoch keine rechtliche Beratung. Lassen Sie das Dokument vor Produktiveinsatz von einem Anwalt prüfen.
        </p>
      </div>
    </div>
  );
}

export default Datenschutz;

