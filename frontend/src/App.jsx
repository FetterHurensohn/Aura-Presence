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
import Footer from './components/Footer';
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
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
      </ConsentManager>
    </ErrorBoundary>
  );
}

export default App;

