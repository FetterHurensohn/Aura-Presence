/**
 * Main App Component - Routing und State Management
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ConsentManager from './components/ConsentManager';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import AnalysisView from './components/AnalysisView';
import Settings from './pages/Settings';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';
import Impressum from './pages/Impressum';
// New Pages
import SessionPrepare from './pages/SessionPrepare';
import LiveSession from './pages/LiveSession';
import AnalysisResult from './pages/AnalysisResult';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import Insights from './pages/Insights';
import Account from './pages/Account';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Methodology from './pages/Methodology';
import AdminPanel from './pages/AdminPanel';
import { getCurrentUser } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prüfe ob User bereits eingeloggt ist
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log('Nicht eingeloggt');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Lädt...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ConsentManager>
        <Router>
        <div className="app">
          <Toaster />
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analyze" 
              element={user ? <AnalysisView user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            
            {/* Session Flow */}
            <Route 
              path="/session-prepare" 
              element={user ? <SessionPrepare user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/live-session" 
              element={user ? <LiveSession /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analysis-result" 
              element={user ? <AnalysisResult /> : <Navigate to="/login" />} 
            />
            
            {/* Sessions & History */}
            <Route 
              path="/sessions" 
              element={user ? <Sessions user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/session/:id" 
              element={user ? <SessionDetail /> : <Navigate to="/login" />} 
            />
            
            {/* Insights */}
            <Route 
              path="/insights" 
              element={user ? <Insights /> : <Navigate to="/login" />} 
            />
            
            {/* Account & Settings */}
            <Route 
              path="/account" 
              element={user ? <Account user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            
            {/* Privacy & Compliance */}
            <Route 
              path="/privacy-policy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/methodology" 
              element={<Methodology />} 
            />
            <Route 
              path="/datenschutz" 
              element={<Datenschutz />} 
            />
            <Route 
              path="/agb" 
              element={<AGB />} 
            />
            <Route 
              path="/impressum" 
              element={<Impressum />} 
            />
            
            {/* Admin (role-based) */}
            <Route 
              path="/admin" 
              element={user ? <AdminPanel user={user} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </div>
      </Router>
      </ConsentManager>
    </ErrorBoundary>
  );
}

export default App;

