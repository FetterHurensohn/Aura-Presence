import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Dropdown Component
 * 
 * Dropdown-Menü mit Keyboard-Navigation und Auto-Positioning.
 * 
 * @param {ReactNode} trigger - Element das Dropdown öffnet
 * @param {string} placement - Position: bottom-left, bottom-right, top-left, top-right
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Dropdown-Items (DropdownItem Komponenten)
 */
const Dropdown = ({
  trigger,
  placement = 'bottom-left',
  className = '',
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggle = () => setIsOpen(!isOpen);

  // Close dropdown
  const close = () => setIsOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Placement classes
  const placementClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
  };

  const dropdownClasses = [
    'absolute z-50',
    'min-w-48 py-1',
    'bg-surface-700 rounded-card shadow-lg border border-white/10',
    placementClasses[placement],
    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
    'transition-all duration-quick origin-top',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="relative inline-block" ref={dropdownRef} {...props}>
      {/* Trigger */}
      <div onClick={toggle}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <div className={dropdownClasses} role="menu">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onClick: (e) => {
                if (child.props.onClick) {
                  child.props.onClick(e);
                }
                close();
              },
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownItem Component
 * 
 * Einzelnes Item im Dropdown-Menü.
 * 
 * @param {string} icon - Icon-Name (optional)
 * @param {boolean} danger - Rotes Styling für gefährliche Aktionen
 * @param {boolean} disabled - Item deaktiviert
 * @param {function} onClick - Click-Handler
 * @param {ReactNode} children - Item-Text
 */
export const DropdownItem = ({
  icon = null,
  danger = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const itemClasses = [
    'flex items-center gap-3 px-4 py-2.5',
    'text-small font-medium',
    'transition-colors duration-base',
    'cursor-pointer',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : danger
      ? 'text-danger hover:bg-danger/10'
      : 'text-white hover:bg-surface-800',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={itemClasses}
      onClick={handleClick}
      role="menuitem"
      {...props}
    >
      {icon && (
        <Icon 
          name={icon} 
          className={`w-4 h-4 ${danger ? 'text-danger' : 'text-muted-500'}`}
        />
      )}
      <span>{children}</span>
    </div>
  );
};

DropdownItem.propTypes = {
  icon: PropTypes.string,
  danger: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * DropdownDivider Component
 * 
 * Trennlinie zwischen Dropdown-Items.
 */
export const DropdownDivider = () => (
  <div className="h-px my-1 bg-white/10" />
);

export default Dropdown;



