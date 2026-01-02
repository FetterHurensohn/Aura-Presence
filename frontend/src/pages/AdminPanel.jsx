import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('logs');

  // Check if user is admin (mock check)
  const isAdmin = user?.role === 'admin' || user?.role === 'enterprise';

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>⛔ Zugriff verweigert</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Diese Seite ist nur für Administratoren zugänglich.</p>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.5rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
          Zurück zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          ← Dashboard
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🛡️ Admin Panel</h1>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <button onClick={() => setActiveTab('logs')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'logs' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'logs' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            📋 Logs
          </button>
          <button onClick={() => setActiveTab('users')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'users' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'users' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            👥 Users
          </button>
          <button onClick={() => setActiveTab('debug')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'debug' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'debug' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            🐛 Debug
          </button>
        </div>

        {/* Content */}
        {activeTab === 'logs' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>System Logs</h2>
            <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ marginBottom: '0.5rem' }}>[2026-01-02 10:15:32] INFO: User login successful (user_id: 123)</div>
              <div style={{ marginBottom: '0.5rem' }}>[2026-01-02 10:14:18] INFO: Session completed (session_id: 456, duration: 25min)</div>
              <div style={{ marginBottom: '0.5rem' }}>[2026-01-02 10:12:05] WARN: High API usage detected (user_id: 789)</div>
              <div style={{ marginBottom: '0.5rem', color: '#ef4444' }}>[2026-01-02 10:10:22] ERROR: Database connection timeout (retry: 1/3)</div>
              <div style={{ marginBottom: '0.5rem' }}>[2026-01-02 10:08:15] INFO: Subscription upgraded (user_id: 234, plan: pro)</div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Management</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8' }}>User ID</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8' }}>Plan</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8' }}>Sessions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.05)' }}>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>123</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>user1@example.com</td>
                  <td style={{ padding: '1rem', color: '#6366f1', fontWeight: '600' }}>Pro</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>47</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.05)' }}>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>456</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>user2@example.com</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>Free</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>12</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>789</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>user3@example.com</td>
                  <td style={{ padding: '1rem', color: '#818cf8', fontWeight: '600' }}>Enterprise</td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>203</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'debug' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Debug Tools</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', color: '#6366f1', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                🔄 Clear Cache
              </button>
              <button style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px', color: '#6366f1', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                📊 Generate Test Data
              </button>
              <button style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                🗑️ Reset Database (Dev Only)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;

