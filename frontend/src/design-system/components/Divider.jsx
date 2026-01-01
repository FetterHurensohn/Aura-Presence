import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Divider Component
 * 
 * Trennlinie horizontal oder vertikal.
 * Optional mit Text oder Icon in der Mitte.
 * 
 * @param {string} orientation - Ausrichtung: horizontal, vertical
 * @param {string} text - Text in der Mitte (optional)
 * @param {string} icon - Icon in der Mitte (optional)
 * @param {string} color - Farbe: default, muted, accent
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Divider = ({
  orientation = 'horizontal',
  text = null,
  icon = null,
  color = 'default',
  className = '',
  ...props
}) => {
  // Color Classes
  const colorClasses = {
    default: 'bg-white/10',
    muted: 'bg-muted-500/20',
    accent: 'bg-accent-500/30',
  };

  // Horizontal Divider
  if (orientation === 'horizontal') {
    if (text || icon) {
      return (
        <div className={`flex items-center gap-3 my-4 ${className}`} {...props}>
          <div className={`flex-1 h-px ${colorClasses[color]}`} />
          <div className="text-small text-muted-500 flex items-center gap-2">
            {icon && <Icon name={icon} className="w-4 h-4" />}
            {text && <span>{text}</span>}
          </div>
          <div className={`flex-1 h-px ${colorClasses[color]}`} />
        </div>
      );
    }

    return (
      <hr
        className={`border-none h-px ${colorClasses[color]} my-4 ${className}`}
        {...props}
      />
    );
  }

  // Vertical Divider
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full ${colorClasses[color]} mx-2 ${className}`}
        {...props}
      />
    );
  }

  return null;
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  text: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.oneOf(['default', 'muted', 'accent']),
  className: PropTypes.string,
};

export default Divider;



