import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton Component
 * 
 * Loading Placeholder mit pulsierender Animation.
 * Verschiedene vordefinierte Types für häufige Use Cases.
 * 
 * @param {string} type - Typ: text, card, avatar, button, custom
 * @param {number} lines - Anzahl Textzeilen (für type="text")
 * @param {string} size - Größe für Avatar/Button: xs, sm, md, lg, xl
 * @param {string} width - Custom width (z.B. "200px", "50%")
 * @param {string} height - Custom height (z.B. "100px", "20rem")
 * @param {boolean} circle - Runde Form (für Avatar etc.)
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Skeleton = ({
  type = 'text',
  lines = 1,
  size = 'md',
  width = null,
  height = null,
  circle = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-surface-700 animate-pulse';

  // Size classes for avatar/button
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Render based on type
  if (type === 'text') {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`
              ${baseClasses}
              h-4 rounded
              ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
              ${className}
            `}
            style={{ width: width || undefined, height: height || undefined }}
          />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div
        className={`${baseClasses} rounded-card ${className}`}
        style={{
          width: width || '100%',
          height: height || '200px',
        }}
        {...props}
      />
    );
  }

  if (type === 'avatar') {
    return (
      <div
        className={`
          ${baseClasses}
          ${circle ? 'rounded-full' : 'rounded'}
          ${sizeClasses[size]}
          ${className}
        `}
        style={{ width: width || undefined, height: height || undefined }}
        {...props}
      />
    );
  }

  if (type === 'button') {
    return (
      <div
        className={`
          ${baseClasses}
          rounded-button
          ${size === 'sm' ? 'h-8 w-20' : size === 'lg' ? 'h-12 w-32' : 'h-10 w-24'}
          ${className}
        `}
        style={{ width: width || undefined, height: height || undefined }}
        {...props}
      />
    );
  }

  // Custom
  return (
    <div
      className={`
        ${baseClasses}
        ${circle ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(['text', 'card', 'avatar', 'button', 'custom']),
  lines: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  width: PropTypes.string,
  height: PropTypes.string,
  circle: PropTypes.bool,
  className: PropTypes.string,
};

export default Skeleton;



