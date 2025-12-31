/**
 * Footer Component - Sitewide Footer mit Legal-Links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Aura Presence</h4>
          <p>Echtzeit-Video-Analyse für bessere Präsenz und Körpersprache.</p>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/impressum">Impressum</Link>
            </li>
            <li>
              <Link to="/datenschutz">Datenschutzerklärung</Link>
            </li>
            <li>
              <Link to="/agb">AGB</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="mailto:support@aurapresence.com">Kontakt</a>
            </li>
            <li>
              <Link to="/settings">Einstellungen</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Datenschutz</h4>
          <p className="footer-privacy-note">
            🔒 Keine Videos werden gespeichert oder übertragen.<br />
            Nur strukturierte Metriken.
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aura Presence. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
}

export default Footer;

