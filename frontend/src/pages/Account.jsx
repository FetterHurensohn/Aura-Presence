import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function Account({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '2rem 1rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          ← Dashboard
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>⚙️ Account</h1>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <button onClick={() => setActiveTab('profile')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'profile' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'profile' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            Profil
          </button>
          <button onClick={() => setActiveTab('billing')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'billing' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'billing' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            Billing
          </button>
          <button onClick={() => setActiveTab('privacy')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', color: activeTab === 'privacy' ? '#6366f1' : '#94a3b8', borderBottom: activeTab === 'privacy' ? '2px solid #6366f1' : 'none', cursor: 'pointer', fontWeight: '600' }}>
            Privacy
          </button>
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Profil-Einstellungen</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>E-Mail</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                readOnly 
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Name</label>
              <input 
                type="text" 
                placeholder="Dein Name" 
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
              Speichern
            </button>
          </div>
        )}

        {activeTab === 'billing' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Billing & Subscription</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Aktueller Plan: <strong style={{ color: '#6366f1' }}>Free</strong></p>
            <button 
              onClick={() => navigate('/subscription')} 
              style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
            >
              Upgrade auf Pro
            </button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div style={{ background: '#151b2e', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Privacy & Datenschutz</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Verwalte deine Datenschutz-Einstellungen.</p>
            <button onClick={() => navigate('/privacy-policy')} style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#6366f1', fontWeight: '600', width: '100%', cursor: 'pointer' }}>
              Datenschutz-Richtlinie →
            </button>
            <button onClick={() => navigate('/methodology')} style={{ display: 'block', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#6366f1', fontWeight: '600', width: '100%', cursor: 'pointer' }}>
              Methodik & Grenzen →
            </button>
          </div>
        )}

        {/* Logout */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={onLogout} 
            style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
          >
            Abmelden
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Account;

