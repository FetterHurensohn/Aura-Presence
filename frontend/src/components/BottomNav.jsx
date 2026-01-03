import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
        <div className="nav-icon">🏠</div>
        <div className="nav-label">Dashboard</div>
      </Link>
      <Link to="/sessions" className={`nav-item ${isActive('/sessions') || location.pathname.startsWith('/session') ? 'active' : ''}`}>
        <div className="nav-icon">📊</div>
        <div className="nav-label">Sessions</div>
      </Link>
      <Link to="/insights" className={`nav-item ${isActive('/insights') ? 'active' : ''}`}>
        <div className="nav-icon">💡</div>
        <div className="nav-label">Insights</div>
      </Link>
      <Link to="/account" className={`nav-item ${isActive('/account') ? 'active' : ''}`}>
        <div className="nav-icon">⚙️</div>
        <div className="nav-label">Account</div>
      </Link>
    </nav>
  );
}

export default BottomNav;


