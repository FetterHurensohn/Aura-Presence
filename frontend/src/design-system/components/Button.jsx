import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Button Component
 * 
 * Wiederverwendbare Button-Komponente mit verschiedenen Variants, Sizes und States.
 * 
 * @param {string} variant - Button-Variante: primary, secondary, ghost, danger
 * @param {string} size - Button-Größe: sm (32px), md (40px), lg (48px)
 * @param {boolean} disabled - Deaktiviert den Button
 * @param {boolean} loading - Zeigt Loading-Spinner
 * @param {string} icon - Icon-Name (optional, wird links angezeigt)
 * @param {boolean} fullWidth - Button nimmt volle Breite ein
 * @param {string} type - Button-Type (button, submit, reset)
 * @param {function} onClick - Click-Handler
 * @param {ReactNode} children - Button-Text/Inhalt
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...props
}) => {
  // Base Classes - für alle Buttons gleich
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-all duration-base focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-bg-900';

  // Variant Classes
  const variantClasses = {
    primary: 'bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-300 shadow-sm hover:shadow-accent',
    secondary: 'bg-surface-700 text-white border border-white/10 hover:bg-surface-800 hover:border-white/20 active:bg-bg-700',
    ghost: 'bg-transparent text-white hover:bg-surface-800 active:bg-surface-700',
    danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  };

  // Size Classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm h-8',
    md: 'px-4 py-2.5 text-body h-10',
    lg: 'px-6 py-3 text-lg h-12',
  };

  // Disabled/Loading State
  const stateClasses = (disabled || loading) 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';

  // Full Width
  const widthClasses = fullWidth ? 'w-full' : '';

  // Icon Size basierend auf Button Size
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  // Kombiniere alle Classes
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${stateClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {loading ? (
        <>
          <Icon 
            name="spinner" 
            size={iconSize} 
            className="animate-spin" 
          />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {icon && (
            <Icon 
              name={icon} 
              size={iconSize} 
            />
          )}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;



