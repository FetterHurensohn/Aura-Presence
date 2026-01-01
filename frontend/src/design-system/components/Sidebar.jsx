import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

/**
 * Sidebar Component
 * 
 * Eine collapsible Sidebar mit Navigation, Icons und Badge-Support.
 * Responsive: Desktop fixiert, Mobile als Overlay.
 * 
 * @param {boolean} collapsed - Sidebar eingeklappt
 * @param {function} onToggle - Callback beim Collapse-Toggle
 * @param {array} items - Navigation Items
 * @param {boolean} mobileOpen - Mobile-Overlay sichtbar
 * @param {function} onMobileClose - Callback beim Schließen (Mobile)
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Sidebar = ({
  collapsed = false,
  onToggle,
  items = [],
  mobileOpen = false,
  onMobileClose,
  className = '',
}) => {
  const location = useLocation();

  // Check if item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Sidebar Content (shared between desktop & mobile)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-white/10`}>
        {!collapsed && (
          <h2 className="text-h3 text-white font-semibold">
            Aura
          </h2>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-button hover:bg-surface-800 transition-colors duration-base hidden lg:block"
            aria-label={collapsed ? 'Sidebar erweitern' : 'Sidebar einklappen'}
          >
            <Icon 
              name={collapsed ? 'chevron-right' : 'chevron-left'} 
              className="w-5 h-5 text-muted-500" 
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item, index) => {
          const active = item.active !== undefined ? item.active : isActive(item.path);

          return (
            <Link
              key={index}
              to={item.path}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-button
                transition-all duration-base group
                ${active
                  ? 'bg-accent-500 text-white shadow-accent'
                  : 'text-muted-500 hover:text-white hover:bg-surface-800'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              {/* Icon */}
              {item.icon && (
                <Icon 
                  name={item.icon} 
                  className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'group-hover:text-white'}`}
                />
              )}

              {/* Label */}
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium text-small">
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 rounded-pill text-caption font-semibold
                      ${active
                        ? 'bg-white/20 text-white'
                        : 'bg-accent-500 text-white'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer (optional) */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-caption text-muted-500 text-center">
            Aura Presence v1.0
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-screen
          bg-surface-800 border-r border-white/10
          transition-all duration-slow
          ${collapsed ? 'w-20' : 'w-64'}
          ${className}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <aside
            className={`
              lg:hidden fixed left-0 top-0 h-screen w-64
              bg-surface-800 border-r border-white/10
              z-50
              transform transition-transform duration-slow
              ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* Close Button (Mobile) */}
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 rounded-button hover:bg-surface-700 transition-colors duration-base"
              aria-label="Sidebar schließen"
            >
              <Icon name="close" className="w-5 h-5 text-muted-500" />
            </button>

            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      path: PropTypes.string.isRequired,
      active: PropTypes.bool,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  mobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func,
  className: PropTypes.string,
};

export default Sidebar;



