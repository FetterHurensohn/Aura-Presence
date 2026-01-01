import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Button from './Button';

/**
 * NavBar Component
 * 
 * Fixed Top Navigation mit Logo, Links, User-Menu und Responsive Burger-Menu.
 * 
 * @param {object} user - User-Objekt mit {name, email}
 * @param {function} onLogout - Logout-Handler
 */
const NavBar = ({ user = null, onLogout = null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/analyze', label: 'Analyse', icon: 'video' },
    { path: '/settings', label: 'Einstellungen', icon: 'settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUserMenuOpen(false);
    onLogout?.();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-surface-800 shadow-md border-b border-white/10" role="navigation" aria-label="Hauptnavigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-white font-bold text-xl hover:text-accent-500 transition-colors duration-base"
            >
              <span className="text-accent-500">✨</span>
              Aura Presence
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all duration-base
                  ${isActive(link.path)
                    ? 'bg-accent-500 text-white'
                    : 'text-white/80 hover:text-white hover:bg-surface-700'
                  }
                `.trim().replace(/\s+/g, ' ')}
              >
                <Icon name={link.icon} size={20} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {user ? (
              /* Desktop User Menu */
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-button hover:bg-surface-700 transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-accent-500"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm">{user.name}</span>
                  <Icon name="chevron-down" size={16} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-surface-700 rounded-card shadow-lg border border-white/10 py-2 z-20">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm text-white font-medium">{user.name}</p>
                        <p className="text-xs text-muted-500">{user.email}</p>
                      </div>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-surface-800 transition-colors duration-base"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon name="settings" size={16} />
                        Einstellungen
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-surface-800 transition-colors duration-base"
                      >
                        <Icon name="logout" size={16} />
                        Abmelden
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Anmelden
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-button hover:bg-surface-700 transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Menü öffnen"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-700">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-all duration-base
                  ${isActive(link.path)
                    ? 'bg-accent-500 text-white'
                    : 'text-white/80 hover:text-white hover:bg-surface-800'
                  }
                `.trim().replace(/\s+/g, ' ')}
              >
                <Icon name={link.icon} size={20} />
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="px-4 py-3 border-t border-white/10 mt-2">
                  <p className="text-sm text-white font-medium">{user.name}</p>
                  <p className="text-xs text-muted-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium text-danger hover:bg-surface-800 transition-colors duration-base"
                >
                  <Icon name="logout" size={20} />
                  Abmelden
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 py-3 border-t border-white/10 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="md" fullWidth>
                    Anmelden
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

NavBar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

export default NavBar;



