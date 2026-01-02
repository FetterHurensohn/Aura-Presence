import React from 'react';
import { useNavigate } from 'react-router-dom';

function Insights() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem', color: '#fff' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
        ← Dashboard
      </button>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>💡 Insights</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📈 Entwicklung (letzte 7 Tage)</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Deine Confidence hat sich um <strong style={{ color: '#10b981' }}>+5%</strong> verbessert!</p>
          <div style={{ height: '200px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Chart Placeholder (TODO: Add Chart.js)
          </div>
        </div>

        <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>🎯 Stärken & Schwächen</h2>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#10b981', marginBottom: '0.5rem' }}>✓ <strong>Stärken:</strong></p>
            <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem' }}>
              <li>Konstanter Blickkontakt (87% Durchschnitt)</li>
              <li>Verbesserte Körperhaltung (+10% in 2 Wochen)</li>
            </ul>
          </div>
          <div>
            <p style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>⚠ <strong>Verbesserungspotenzial:</strong></p>
            <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem' }}>
              <li>Entspannung der Schultern</li>
              <li>Längere Session-Dauer für bessere Ergebnisse</li>
            </ul>
          </div>
        </div>

        <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>💪 Empfehlungen</h2>
          <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem' }}>
            <li>Plane 2-3 Sessions pro Woche für optimale Ergebnisse</li>
            <li>Versuche Sessions von mindestens 20 Minuten</li>
            <li>Nutze den Coach Mode für direktes Feedback</li>
          </ul>
        </div>
      </div>
      
      <div style={{ height: '72px' }}></div>
    </div>
  );
}

export default Insights;

