import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          ← Zurück
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒 Privacy & Datenschutz</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</p>
        
        <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)', lineHeight: '1.6' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Datenverarbeitung</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Aura Presence analysiert deine Videoaufnahmen <strong>lokal in deinem Browser</strong>. 
            Keine Videoframes werden an unsere Server gesendet oder gespeichert.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Was wird gespeichert?</h3>
          <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Analyse-Ergebnisse (Scores, Metriken)</li>
            <li>Session-Metadaten (Datum, Dauer, Typ)</li>
            <li>Account-Informationen (E-Mail, Subscription-Status)</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Was wird NICHT gespeichert?</h3>
          <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Video-Aufnahmen</li>
            <li>Screenshots oder Bilder</li>
            <li>Rohe Gesichts-Landmarks</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Deine Rechte</h3>
          <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem' }}>
            <li>Zugriff auf deine Daten</li>
            <li>Löschung deiner Daten</li>
            <li>Widerspruch zur Verarbeitung</li>
            <li>Datenportabilität</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '2rem', background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>📧 Kontakt</h3>
          <p style={{ color: '#cbd5e1', margin: 0 }}>
            Bei Fragen zu deinen Daten: <a href="mailto:privacy@aura-presence.com" style={{ color: '#6366f1', textDecoration: 'none' }}>privacy@aura-presence.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

