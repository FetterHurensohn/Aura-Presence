import React from 'react';
import PropTypes from 'prop-types';

/**
 * Container Component
 * 
 * Ein responsiver Container mit max-width und automatischem Padding.
 * Zentriert Inhalte und bietet konsistente Seitenränder.
 * 
 * @param {string} maxWidth - Maximale Breite: sm, md, lg, xl, 2xl, full
 * @param {boolean} centered - Zentriert den Container horizontal
 * @param {string} padding - Padding: none, sm, md, lg
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Container-Inhalt
 */
const Container = ({
  maxWidth = 'xl',
  centered = true,
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  // Max-Width Classes
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',   // 640px
    md: 'max-w-screen-md',   // 768px
    lg: 'max-w-screen-lg',   // 1024px
    xl: 'max-w-screen-xl',   // 1280px
    '2xl': 'max-w-screen-2xl', // 1536px
    full: 'max-w-full',
  };

  // Padding Classes
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  // Centered Class
  const centeredClass = centered ? 'mx-auto' : '';

  const containerClasses = [
    'w-full',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    centeredClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  centered: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Container;



