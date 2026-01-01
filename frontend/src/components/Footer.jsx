/**
 * Footer Component - Sitewide Footer mit Legal-Links
 * Redesigned mit Tailwind CSS und Design-System
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../design-system/components/Icon';

function Footer() {
  return (
    <footer className="bg-surface-800 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-accent-500 text-2xl">✨</span>
              <h4 className="text-white font-semibold text-lg">Aura Presence</h4>
            </div>
            <p className="text-muted-500 text-sm leading-relaxed">
              Echtzeit-Video-Analyse für bessere Präsenz und Körpersprache.
            </p>
          </div>
          
          {/* Legal Section */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/impressum" 
                  className="text-muted-500 hover:text-white transition-colors duration-base text-sm flex items-center gap-2"
                >
                  <Icon name="shield" size={16} />
                  Impressum
                </Link>
              </li>
              <li>
                <Link 
                  to="/datenschutz" 
                  className="text-muted-500 hover:text-white transition-colors duration-base text-sm flex items-center gap-2"
                >
                  <Icon name="lock" size={16} />
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link 
                  to="/agb" 
                  className="text-muted-500 hover:text-white transition-colors duration-base text-sm flex items-center gap-2"
                >
                  <Icon name="edit" size={16} />
                  AGB
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@aurapresence.com" 
                  className="text-muted-500 hover:text-white transition-colors duration-base text-sm flex items-center gap-2"
                >
                  <Icon name="bell" size={16} />
                  Kontakt
                </a>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="text-muted-500 hover:text-white transition-colors duration-base text-sm flex items-center gap-2"
                >
                  <Icon name="settings" size={16} />
                  Einstellungen
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Privacy Note Section */}
          <div>
            <h4 className="text-white font-semibold mb-4">Datenschutz</h4>
            <div className="bg-surface-700 rounded-button p-3 border border-success/20">
              <div className="flex items-start gap-2">
                <Icon name="lock" size={16} color="success" className="mt-0.5" />
                <p className="text-sm text-muted-500 leading-relaxed">
                  Keine Videos werden gespeichert oder übertragen. Nur strukturierte Metriken.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-bg-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-muted-500">
            &copy; {new Date().getFullYear()} Aura Presence. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

