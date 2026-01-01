import React from 'react';
import PropTypes from 'prop-types';

/**
 * Progress Component
 * 
 * Progress Bar für Fortschrittsanzeigen.
 * Unterstützt determinate und indeterminate States.
 * 
 * @param {number} value - Aktueller Wert (0-max)
 * @param {number} max - Maximaler Wert
 * @param {string} variant - Farbe: accent, success, danger
 * @param {string} size - Größe: sm, md, lg
 * @param {boolean} indeterminate - Unbestimmter Fortschritt (Loading)
 * @param {boolean} animated - Animierter Gradient
 * @param {boolean} showLabel - Zeigt Prozent-Label
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Progress = ({
  value = 0,
  max = 100,
  variant = 'accent',
  size = 'md',
  indeterminate = false,
  animated = false,
  showLabel = false,
  className = '',
  ...props
}) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Variant Classes
  const variantClasses = {
    accent: 'bg-accent-500',
    success: 'bg-success',
    danger: 'bg-danger',
  };

  // Size Classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  // Animated Gradient
  const animatedClass = animated ? 'bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]' : '';

  // Indeterminate Animation
  const indeterminateClass = indeterminate ? 'animate-[indeterminate_1.5s_ease-in-out_infinite]' : '';

  const trackClasses = [
    'relative w-full overflow-hidden rounded-pill',
    'bg-surface-700',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  const barClasses = [
    'h-full transition-all duration-slow',
    'rounded-pill',
    variantClasses[variant],
    animatedClass,
    indeterminateClass,
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full" {...props}>
      <div className={trackClasses} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className={barClasses}
          style={{
            width: indeterminate ? '40%' : `${percentage}%`,
          }}
        />
      </div>
      
      {showLabel && !indeterminate && (
        <div className="mt-1 text-small text-muted-500 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['accent', 'success', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  indeterminate: PropTypes.bool,
  animated: PropTypes.bool,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default Progress;



