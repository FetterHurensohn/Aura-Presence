import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function SessionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { session } = location.state || {};

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem', color: '#fff' }}>
        <button onClick={() => navigate('/sessions')} style={{ marginBottom: '1rem' }}>← Zurück</button>
        <p>Session nicht gefunden</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem', color: '#fff' }}>
      <button onClick={() => navigate('/sessions')} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
        ← Zurück zu Sessions
      </button>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Session Detail #{id}</h1>
      
      <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <p><strong>Datum:</strong> {new Date(session.date).toLocaleDateString('de-DE')}</p>
        <p><strong>Dauer:</strong> {session.duration} Minuten</p>
        <p><strong>Typ:</strong> {session.type === 'focus' ? 'Focus Mode' : 'Coach Mode'}</p>
        <p><strong>Confidence:</strong> {session.confidence}%</p>
        <p><strong>Körperhaltung:</strong> {session.posture}%</p>
        <p><strong>Blickkontakt:</strong> {session.eyeContact}%</p>
      </div>
      
      <button 
        onClick={() => navigate('/session-prepare')}
        style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
      >
        Neue Session starten
      </button>
    </div>
  );
}

export default SessionDetail;


