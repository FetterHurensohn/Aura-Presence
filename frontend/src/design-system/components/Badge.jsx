import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * 
 * Kleine Label für Status, Kategorien, Counts etc.
 * Mit verschiedenen Variants, Größen und optionaler Animation.
 * 
 * @param {string} variant - Badge-Stil: success, warning, danger, info, accent, neutral
 * @param {string} size - Größe: sm, md, lg
 * @param {boolean} dot - Nur Dot ohne Text
 * @param {boolean} pulse - Pulsiert (für Notifications)
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Badge-Text
 */
const Badge = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  children,
  ...props
}) => {
  // Variant Classes
  const variantClasses = {
    success: 'bg-success/20 text-success border-success/40',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    danger: 'bg-danger/20 text-danger border-danger/40',
    info: 'bg-cyan/20 text-cyan border-cyan/40',
    accent: 'bg-accent-500/20 text-accent-300 border-accent-500/40',
    neutral: 'bg-muted-500/20 text-muted-500 border-muted-500/40',
  };

  // Size Classes
  const sizeClasses = {
    sm: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-caption',
    md: dot ? 'w-2.5 h-2.5' : 'px-2.5 py-1 text-small',
    lg: dot ? 'w-3 h-3' : 'px-3 py-1.5 text-body',
  };

  // Pulse Animation
  const pulseClass = pulse ? 'animate-pulse' : '';

  const badgeClasses = [
    'inline-flex items-center justify-center',
    'font-semibold',
    'border',
    dot ? 'rounded-full' : 'rounded-pill',
    variantClasses[variant],
    sizeClasses[size],
    pulseClass,
    className,
  ].filter(Boolean).join(' ');

  if (dot) {
    return <span className={badgeClasses} {...props} />;
  }

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'accent', 'neutral']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  pulse: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Badge;



