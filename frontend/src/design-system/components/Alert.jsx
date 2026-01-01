import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Alert Component
 * 
 * Informative Nachrichten mit verschiedenen Variants.
 * Optional dismissible mit Actions.
 * 
 * @param {string} variant - Alert-Typ: info, success, warning, danger
 * @param {string} title - Alert-Titel (optional)
 * @param {boolean} dismissible - Zeigt Close-Button
 * @param {function} onDismiss - Callback beim Dismissing
 * @param {ReactNode} actions - Action-Buttons (optional)
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Alert-Inhalt
 */
const Alert = ({
  variant = 'info',
  title = null,
  dismissible = false,
  onDismiss,
  actions = null,
  className = '',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't render if dismissed
  if (!isVisible) return null;

  // Variant Styles
  const variantStyles = {
    info: {
      container: 'bg-cyan/10 border-cyan/30',
      icon: 'info',
      iconColor: 'text-cyan',
    },
    success: {
      container: 'bg-success/10 border-success/30',
      icon: 'check',
      iconColor: 'text-success',
    },
    warning: {
      container: 'bg-yellow-500/10 border-yellow-500/30',
      icon: 'warning',
      iconColor: 'text-yellow-400',
    },
    danger: {
      container: 'bg-danger/10 border-danger/30',
      icon: 'error',
      iconColor: 'text-danger',
    },
  };

  const style = variantStyles[variant];

  const alertClasses = [
    'flex gap-3 p-4 rounded-card border',
    style.container,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} role="alert" {...props}>
      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon name={style.icon} className={`w-5 h-5 ${style.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-white mb-1">
            {title}
          </h4>
        )}
        <div className="text-small text-muted-500">
          {children}
        </div>
        {actions && (
          <div className="mt-3 flex gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-button hover:bg-white/10 transition-colors duration-base"
          aria-label="Schließen"
        >
          <Icon name="close" className="w-4 h-4 text-muted-500" />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  actions: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Alert;



