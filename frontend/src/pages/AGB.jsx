/**
 * Allgemeine Geschäftsbedingungen (AGB) Page
 * Konvertiert von docs/legal/AGB.md
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

function AGB() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">← Zurück zur Startseite</Link>
        
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <p className="legal-warning">
          <strong>⚠️ WICHTIG:</strong> Dieses Dokument ist eine Vorlage und muss von einem Rechtsanwalt geprüft und angepasst werden!
        </p>
        
        <p><strong>Stand:</strong> 30.12.2024</p>
        
        <hr />
        
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Web-Applikation <strong>Aura Presence</strong> 
          (im Folgenden "die App") durch registrierte Nutzer (im Folgenden "Nutzer" oder "Sie").
        </p>
        <p>
          Betreiber der App ist:<br />
          [FIRMENNAME EINFÜGEN]<br />
          [ADRESSE EINFÜGEN]
        </p>
        
        <hr />
        
        <h2>§ 2 Vertragsschluss</h2>
        <p>
          Mit der Registrierung und Erstellung eines Nutzer-Accounts erklären Sie sich mit diesen AGB einverstanden. 
          Der Vertrag kommt mit der Bestätigung Ihrer Registrierung durch uns zustande.
        </p>
        
        <hr />
        
        <h2>§ 3 Leistungsumfang</h2>
        
        <h3>3.1 Kostenlose Basis-Version</h3>
        <p>Die App bietet eine kostenlose Basis-Version mit eingeschränktem Funktionsumfang:</p>
        <ul>
          <li>Echtzeit-Video-Analyse mit MediaPipe (Pose, Face Mesh, Hands)</li>
          <li>Basis-Feedback ohne KI-Interpretation</li>
          <li>Begrenzte Analyse-Sessions pro Monat</li>
        </ul>
        
        <h3>3.2 Premium-Abonnement</h3>
        <p>Das Premium-Abonnement bietet erweiterte Funktionen:</p>
        <ul>
          <li>Unbegrenzte Analyse-Sessions</li>
          <li>KI-gestützte Interpretation mit OpenAI</li>
          <li>Historische Analysen & Fortschritts-Tracking</li>
          <li>Erweiterte Metriken & Visualisierungen</li>
        </ul>
        <p>
          Die Preise für das Premium-Abonnement sind auf der Website ersichtlich und verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
        </p>
        
        <hr />
        
        <h2>§ 4 Pflichten des Nutzers</h2>
        
        <h3>4.1 Registrierung</h3>
        <p>Sie verpflichten sich:</p>
        <ul>
          <li>Wahre und vollständige Angaben bei der Registrierung zu machen</li>
          <li>Ihre Zugangsdaten geheim zu halten</li>
          <li>Uns unverzüglich zu informieren, falls Ihr Account kompromittiert wurde</li>
        </ul>
        
        <h3>4.2 Verbotene Nutzung</h3>
        <p>Es ist untersagt:</p>
        <ul>
          <li>Die App für illegale Zwecke zu nutzen</li>
          <li>Andere Nutzer zu belästigen oder zu diskriminieren</li>
          <li>Technische Schutzmaßnahmen zu umgehen</li>
          <li>Die App durch automatisierte Mittel (Bots) zu nutzen</li>
          <li>Reverse Engineering, Dekompilierung oder Disassemblierung der Software</li>
        </ul>
        
        <hr />
        
        <h2>§ 5 Zahlungsbedingungen (Premium-Abonnement)</h2>
        
        <h3>5.1 Zahlungsabwicklung</h3>
        <p>
          Die Zahlungsabwicklung erfolgt über unseren Zahlungsdienstleister <strong>Stripe</strong>. 
          Es gelten die <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Stripe-Nutzungsbedingungen</a>.
        </p>
        
        <h3>5.2 Abonnement-Laufzeit</h3>
        <p>
          Das Premium-Abonnement verlängert sich automatisch um die gewählte Laufzeit (monatlich oder jährlich), 
          sofern es nicht vor Ablauf der Periode gekündigt wird.
        </p>
        
        <h3>5.3 Kündigung</h3>
        <p>
          Sie können Ihr Abonnement jederzeit über die Einstellungen kündigen. 
          Die Kündigung wird zum Ende der aktuellen Abrechnungsperiode wirksam. 
          Bereits gezahlte Beträge werden nicht anteilig erstattet.
        </p>
        
        <h3>5.4 Zahlungsverzug</h3>
        <p>
          Bei Zahlungsverzug behalten wir uns vor, den Zugang zum Premium-Abonnement zu sperren, 
          bis die ausstehenden Beträge beglichen sind.
        </p>
        
        <hr />
        
        <h2>§ 6 Widerrufsrecht (Verbraucher)</h2>
        <p>
          Verbrauchern steht ein gesetzliches Widerrufsrecht von 14 Tagen zu. 
          Das Widerrufsrecht erlischt vorzeitig, wenn Sie ausdrücklich zustimmen, 
          dass wir mit der Leistungserbringung vor Ablauf der Widerrufsfrist beginnen.
        </p>
        <p>
          <strong>Widerrufsbelehrung:</strong><br />
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung 
          (z.B. per E-Mail an [KONTAKT@EMAIL.DE]) über Ihren Entschluss informieren.
        </p>
        
        <hr />
        
        <h2>§ 7 Gewährleistung & Haftung</h2>
        
        <h3>7.1 Verfügbarkeit</h3>
        <p>
          Wir bemühen uns um eine hohe Verfügbarkeit der App, können jedoch keine 100%-ige Verfügbarkeit garantieren. 
          Wartungsarbeiten werden nach Möglichkeit angekündigt.
        </p>
        
        <h3>7.2 Haftungsbeschränkung</h3>
        <p>
          Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. 
          Für leichte Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), 
          wobei die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt ist.
        </p>
        
        <h3>7.3 Keine medizinische Beratung</h3>
        <p>
          <strong>WICHTIG:</strong> Die App dient ausschließlich zur Verbesserung von Präsenz und Körpersprache. 
          Sie ersetzt keine medizinische, therapeutische oder psychologische Beratung. 
          Bei gesundheitlichen Problemen konsultieren Sie bitte einen Arzt.
        </p>
        
        <hr />
        
        <h2>§ 8 Urheberrecht & Nutzungsrechte</h2>
        <p>
          Alle Inhalte der App (Texte, Grafiken, Code, Designs) sind urheberrechtlich geschützt. 
          Sie erhalten ein nicht-exklusives, nicht-übertragbares Nutzungsrecht für die Dauer Ihres Abonnements.
        </p>
        <p>
          Die von Ihnen generierten Analyse-Daten bleiben Ihr Eigentum. 
          Wir verwenden diese Daten nur zur Erbringung unserer Dienstleistung und gemäß unserer <Link to="/datenschutz">Datenschutzerklärung</Link>.
        </p>
        
        <hr />
        
        <h2>§ 9 Änderungen der AGB</h2>
        <p>
          Wir behalten uns vor, diese AGB zu ändern. Änderungen werden Ihnen per E-Mail mitgeteilt. 
          Widersprechen Sie nicht innerhalb von 4 Wochen, gelten die geänderten AGB als akzeptiert.
        </p>
        
        <hr />
        
        <h2>§ 10 Schlussbestimmungen</h2>
        
        <h3>10.1 Anwendbares Recht</h3>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
        </p>
        
        <h3>10.2 Gerichtsstand</h3>
        <p>
          Gerichtsstand für alle Streitigkeiten ist [ORT EINFÜGEN], sofern Sie Kaufmann, 
          juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen sind.
        </p>
        
        <h3>10.3 Salvatorische Klausel</h3>
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, 
          bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
        
        <hr />
        
        <p className="legal-footer">
          <strong>Hinweis:</strong> Diese AGB wurden mit größter Sorgfalt erstellt, 
          ersetzen jedoch keine rechtliche Beratung. Lassen Sie das Dokument vor Produktiveinsatz von einem Anwalt prüfen.
        </p>
      </div>
    </div>
  );
}

export default AGB;

