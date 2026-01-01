import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner Component
 * 
 * Loading Spinner mit verschiedenen Größen und Styles.
 * 
 * @param {string} size - Größe: xs, sm, md, lg, xl
 * @param {string} variant - Farbe: accent, white, muted
 * @param {string} style - Stil: circle, dots, bars
 * @param {string} label - Accessibility Label
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Spinner = ({
  size = 'md',
  variant = 'accent',
  style = 'circle',
  label = 'Lädt...',
  className = '',
  ...props
}) => {
  // Size Classes
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Variant Colors
  const variantClasses = {
    accent: 'border-accent-500',
    white: 'border-white',
    muted: 'border-muted-500',
  };

  // Circle Spinner
  if (style === 'circle') {
    return (
      <div
        className={`
          inline-block
          ${sizeClasses[size]}
          border-2 ${variantClasses[variant]}
          border-t-transparent
          rounded-full
          animate-spin
          ${className}
        `}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Dots Spinner
  if (style === 'dots') {
    const dotSizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
    };

    const dotColors = {
      accent: 'bg-accent-500',
      white: 'bg-white',
      muted: 'bg-muted-500',
    };

    return (
      <div
        className={`inline-flex items-center gap-1 ${className}`}
        role="status"
        aria-label={label}
        {...props}
      >
        <span
          className={`
            ${dotSizeClasses[size]}
            ${dotColors[variant]}
            rounded-full
            animate-[bounce_1s_ease-in-out_0s_infinite]
          `}
        />
        <span
          className={`
            ${dotSizeClasses[size]}
            ${dotColors[variant]}
            rounded-full
            animate-[bounce_1s_ease-in-out_0.1s_infinite]
          `}
        />
        <span
          className={`
            ${dotSizeClasses[size]}
            ${dotColors[variant]}
            rounded-full
            animate-[bounce_1s_ease-in-out_0.2s_infinite]
          `}
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Bars Spinner
  if (style === 'bars') {
    const barHeightClasses = {
      xs: 'h-3',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
    };

    const barColors = {
      accent: 'bg-accent-500',
      white: 'bg-white',
      muted: 'bg-muted-500',
    };

    return (
      <div
        className={`inline-flex items-center gap-1 ${barHeightClasses[size]} ${className}`}
        role="status"
        aria-label={label}
        {...props}
      >
        <span
          className={`
            w-1 h-full
            ${barColors[variant]}
            rounded-pill
            animate-[pulse_1s_ease-in-out_0s_infinite]
          `}
        />
        <span
          className={`
            w-1 h-full
            ${barColors[variant]}
            rounded-pill
            animate-[pulse_1s_ease-in-out_0.15s_infinite]
          `}
        />
        <span
          className={`
            w-1 h-full
            ${barColors[variant]}
            rounded-pill
            animate-[pulse_1s_ease-in-out_0.3s_infinite]
          `}
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return null;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['accent', 'white', 'muted']),
  style: PropTypes.oneOf(['circle', 'dots', 'bars']),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;



