import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Button from './Button';

/**
 * EmptyState Component
 * 
 * Zeigt einen Leerzustand mit Icon, Titel, Beschreibung und optionaler Action.
 * Ideal für leere Listen, fehlende Daten, etc.
 * 
 * @param {string} icon - Icon-Name
 * @param {string} title - Titel
 * @param {string} description - Beschreibung
 * @param {ReactNode} action - Action-Button oder Link
 * @param {ReactNode} illustration - Custom Illustration (ersetzt Icon)
 * @param {string} size - Größe: sm, md, lg
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const EmptyState = ({
  icon = 'info',
  title = 'Keine Daten',
  description = null,
  action = null,
  illustration = null,
  size = 'md',
  className = '',
  ...props
}) => {
  // Size Classes
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-h3',
      description: 'text-small',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-h2',
      description: 'text-body',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-h1',
      description: 'text-h3',
    },
  };

  const containerClasses = [
    'flex flex-col items-center justify-center text-center',
    sizeClasses[size].container,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {/* Icon or Illustration */}
      {illustration ? (
        <div className="mb-4">
          {illustration}
        </div>
      ) : (
        <div className="mb-4">
          <Icon 
            name={icon} 
            className={`${sizeClasses[size].icon} text-muted-500`}
          />
        </div>
      )}

      {/* Title */}
      <h3 className={`${sizeClasses[size].title} font-semibold text-white mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${sizeClasses[size].description} text-muted-500 max-w-md mb-6`}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  illustration: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default EmptyState;



