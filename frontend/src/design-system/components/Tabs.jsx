import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Badge from './Badge';

/**
 * Tabs Component
 * 
 * Tab-Navigation mit verschiedenen Variants.
 * 
 * @param {string} defaultActive - Default aktiver Tab (ID)
 * @param {function} onChange - Callback bei Tab-Wechsel
 * @param {string} variant - Stil: underline, pills, buttons
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Tab Components
 */
const Tabs = ({
  defaultActive,
  onChange,
  variant = 'underline',
  className = '',
  children,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultActive);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Extract tabs from children
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  );

  // Variant Classes
  const containerClasses = {
    underline: 'border-b border-white/10',
    pills: '',
    buttons: 'bg-surface-800 p-1 rounded-button inline-flex',
  };

  const tabListClasses = [
    'flex',
    variant === 'underline' ? 'space-x-6' : 'space-x-1',
    containerClasses[variant],
  ].filter(Boolean).join(' ');

  return (
    <div className={className} {...props}>
      {/* Tab List */}
      <div className={tabListClasses} role="tablist">
        {tabs.map((tab) => {
          const { id, label, icon, badge, disabled } = tab.props;
          const isActive = activeTab === id;

          // Tab Button Classes based on variant
          let tabButtonClasses = '';
          
          if (variant === 'underline') {
            tabButtonClasses = [
              'flex items-center gap-2 px-1 py-3',
              'text-small font-medium transition-colors duration-base',
              'border-b-2',
              isActive
                ? 'text-white border-accent-500'
                : 'text-muted-500 border-transparent hover:text-white',
              disabled && 'opacity-50 cursor-not-allowed',
            ].filter(Boolean).join(' ');
          } else if (variant === 'pills') {
            tabButtonClasses = [
              'flex items-center gap-2 px-4 py-2',
              'text-small font-medium rounded-pill transition-all duration-base',
              isActive
                ? 'bg-accent-500 text-white shadow-accent'
                : 'text-muted-500 hover:text-white hover:bg-surface-800',
              disabled && 'opacity-50 cursor-not-allowed',
            ].filter(Boolean).join(' ');
          } else if (variant === 'buttons') {
            tabButtonClasses = [
              'flex items-center gap-2 px-4 py-2',
              'text-small font-medium rounded-button transition-all duration-base',
              isActive
                ? 'bg-surface-700 text-white shadow-sm'
                : 'text-muted-500 hover:text-white',
              disabled && 'opacity-50 cursor-not-allowed',
            ].filter(Boolean).join(' ');
          }

          return (
            <button
              key={id}
              onClick={() => !disabled && handleTabChange(id)}
              className={tabButtonClasses}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              disabled={disabled}
            >
              {icon && <Icon name={icon} className="w-4 h-4" />}
              <span>{label}</span>
              {badge && (
                <Badge size="sm" variant="accent">
                  {badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab) => {
          const { id, children } = tab.props;
          const isActive = activeTab === id;

          return (
            <div
              key={id}
              id={`tabpanel-${id}`}
              role="tabpanel"
              aria-labelledby={`tab-${id}`}
              hidden={!isActive}
            >
              {isActive && children}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  defaultActive: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['underline', 'pills', 'buttons']),
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Tab Component
 * 
 * Einzelner Tab (nur als Child von Tabs verwenden).
 * 
 * @param {string} id - Eindeutige Tab-ID
 * @param {string} label - Tab-Label
 * @param {string} icon - Icon-Name (optional)
 * @param {string|number} badge - Badge-Text (optional)
 * @param {boolean} disabled - Tab deaktiviert
 * @param {ReactNode} children - Tab-Content
 */
export const Tab = ({
  id,
  label,
  icon = null,
  badge = null,
  disabled = false,
  children,
}) => {
  // This component is only used as a child of Tabs
  // The actual rendering is handled by the Tabs component
  return <>{children}</>;
};

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Tabs;



