import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import NavBar from './NavBar';

/**
 * AppLayout Component
 * 
 * Vollständiges App-Layout mit NavBar, Sidebar und Content-Bereich.
 * Verwaltet Sidebar-State (collapsed/mobile) intern.
 * 
 * @param {ReactNode} navbar - NavBar Component (oder null)
 * @param {array} sidebarItems - Navigation Items für Sidebar
 * @param {boolean} showSidebar - Sidebar anzeigen
 * @param {array} breadcrumbs - Breadcrumb-Pfad
 * @param {ReactNode} children - Hauptinhalt
 * @param {string} className - Zusätzliche CSS-Klassen für Content
 */
const AppLayout = ({
  navbar,
  sidebarItems = [],
  showSidebar = true,
  breadcrumbs = [],
  children,
  className = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg-900">
      {/* NavBar */}
      {navbar && (
        <div className="fixed top-0 left-0 right-0 z-30">
          {React.cloneElement(navbar, {
            onMenuClick: toggleMobileSidebar,
          })}
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          items={sidebarItems}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          ${navbar ? 'pt-16' : ''}
          ${showSidebar ? (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64') : ''}
          transition-all duration-slow
        `}
      >
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="bg-surface-800 border-b border-white/10 px-6 py-4">
            <nav className="flex items-center space-x-2 text-small">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-white font-medium'
                        : 'text-muted-500'
                    }
                  >
                    {crumb}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-muted-500">/</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <div className={`min-h-screen ${className}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

AppLayout.propTypes = {
  navbar: PropTypes.element,
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      path: PropTypes.string.isRequired,
      active: PropTypes.bool,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  showSidebar: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  className: PropTypes.string,
};

export default AppLayout;



