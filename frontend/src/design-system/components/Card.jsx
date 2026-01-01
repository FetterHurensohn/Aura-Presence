import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component
 * 
 * Container für strukturierte Inhalte mit optionalem Header und Footer.
 * 
 * @param {ReactNode} header - Header-Content
 * @param {ReactNode} children - Card-Content
 * @param {ReactNode} footer - Footer-Content
 * @param {boolean} hoverable - Zeigt Hover-Effect
 * @param {function} onClick - Click-Handler (macht Card anklickbar)
 * @param {string} className - Zusätzliche CSS-Klassen
 */
const Card = ({
  header = null,
  children,
  footer = null,
  hoverable = false,
  onClick = null,
  className = '',
  ...props
}) => {
  // Base Classes
  const baseClasses = 'bg-surface-800 rounded-card shadow-md border border-white/10 transition-all duration-base';

  // Hover Effect
  const hoverClasses = (hoverable || onClick)
    ? 'hover:shadow-lg hover:border-white/20 hover:-translate-y-0.5'
    : '';

  // Click Handler
  const interactiveClasses = onClick
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-bg-900'
    : '';

  // Kombiniere Classes
  const combinedClasses = `
    ${baseClasses}
    ${hoverClasses}
    ${interactiveClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const CardContent = (
    <div
      className={combinedClasses}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-white/10">
          {typeof header === 'string' ? (
            <h3 className="text-h3 font-semibold text-white">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      <div className="px-6 py-5">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-white/10 bg-surface-700/50">
          {footer}
        </div>
      )}
    </div>
  );

  return CardContent;
};

Card.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;



