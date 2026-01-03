import React from 'react';
import { useNavigate } from 'react-router-dom';

function Methodology() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          ← Zurück
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔬 Methodik & Grenzen</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Wie Aura Presence funktioniert und was es kann (und was nicht)</p>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚙️ Technologie</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
              Aura Presence nutzt <strong>MediaPipe Face Mesh</strong> und <strong>TensorFlow.js</strong> 
              für Echtzeit-Gesichtserkennung im Browser.
            </p>
            <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem' }}>
              <li>468 Facial Landmarks</li>
              <li>Erkennung von Körperhaltung & Blickrichtung</li>
              <li>Emotions-Klassifikation (7 Basis-Emotionen)</li>
            </ul>
          </div>

          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Metriken</h2>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#6366f1' }}>Körperhaltung (0-100%)</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Gemessen an der Ausrichtung von Kopf, Schultern und Rumpf. 
              Idealwert: aufrecht, entspannt, leicht nach vorne geneigt.
            </p>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#6366f1' }}>Blickkontakt (0-100%)</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Prozentsatz der Zeit mit direktem Blick in die Kamera. 
              Empfohlen: 60-80% (zu viel wirkt unnatürlich).
            </p>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#6366f1' }}>Confidence (0-100%)</h3>
            <p style={{ color: '#94a3b8' }}>
              Gewichteter Durchschnitt aus allen Metriken plus Micro-Expressions 
              (Lächeln, Stirnrunzeln, Augenbrauen-Bewegung).
            </p>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>⚠️ Grenzen & Einschränkungen</h2>
            <ul style={{ color: '#fca5a5', paddingLeft: '1.5rem' }}>
              <li><strong>Keine medizinische Diagnose:</strong> Aura Presence ist ein Training-Tool, keine psychologische Bewertung.</li>
              <li><strong>Kontext fehlt:</strong> Die KI kennt nicht den Inhalt deiner Präsentation oder Situation.</li>
              <li><strong>Kulturelle Unterschiede:</strong> Normen für Blickkontakt und Körpersprache variieren.</li>
              <li><strong>Beleuchtung & Kamera-Qualität:</strong> Ergebnisse können bei schlechter Beleuchtung ungenau sein.</li>
              <li><strong>Bias:</strong> Die Trainingsdaten der KI können Verzerrungen enthalten.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10b981' }}>✅ Best Practices</h2>
            <ul style={{ color: '#6ee7b7', paddingLeft: '1.5rem' }}>
              <li>Nutze Aura Presence als <strong>Übungs-Tool</strong>, nicht als absolute Wahrheit.</li>
              <li>Kombiniere mit professionellem Coaching für beste Ergebnisse.</li>
              <li>Fokussiere auf Trends über Zeit, nicht einzelne Sessions.</li>
              <li>Achte auf gute Beleuchtung und Kamera-Position.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Methodology;


