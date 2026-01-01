import React from 'react';
import PropTypes from 'prop-types';

/**
 * Grid Component
 * 
 * Ein responsives Grid-System basierend auf CSS Grid.
 * Unterstützt 1-12 Spalten und flexible Abstände.
 * 
 * @param {number} cols - Anzahl der Spalten (1-12)
 * @param {number} gap - Abstand zwischen Grid-Items (0-12)
 * @param {object} responsive - Responsive Spalten: { sm: 1, md: 2, lg: 3, xl: 4 }
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Grid-Items
 */
const Grid = ({
  cols = 3,
  gap = 4,
  responsive = null,
  className = '',
  children,
  ...props
}) => {
  // Column Classes
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  // Gap Classes
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12',
  };

  // Responsive Classes
  let responsiveClasses = '';
  if (responsive) {
    const breakpoints = {
      sm: 'sm:grid-cols-',
      md: 'md:grid-cols-',
      lg: 'lg:grid-cols-',
      xl: 'xl:grid-cols-',
    };
    
    responsiveClasses = Object.entries(responsive)
      .map(([breakpoint, cols]) => `${breakpoints[breakpoint]}${cols}`)
      .join(' ');
  }

  const gridClasses = [
    'grid',
    colClasses[cols] || colClasses[3],
    gapClasses[gap] || gapClasses[4],
    responsiveClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  cols: PropTypes.number,
  gap: PropTypes.number,
  responsive: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * GridItem Component
 * 
 * Ein einzelnes Grid-Item mit optionaler span-Eigenschaft.
 * 
 * @param {number} span - Anzahl der Spalten die das Item überspannt (1-12)
 * @param {object} responsiveSpan - Responsive span: { sm: 1, md: 2, lg: 3 }
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Item-Inhalt
 */
export const GridItem = ({
  span = 1,
  responsiveSpan = null,
  className = '',
  children,
  ...props
}) => {
  // Span Classes
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  };

  // Responsive Span Classes
  let responsiveSpanClasses = '';
  if (responsiveSpan) {
    const breakpoints = {
      sm: 'sm:col-span-',
      md: 'md:col-span-',
      lg: 'lg:col-span-',
      xl: 'xl:col-span-',
    };
    
    responsiveSpanClasses = Object.entries(responsiveSpan)
      .map(([breakpoint, span]) => `${breakpoints[breakpoint]}${span}`)
      .join(' ');
  }

  const itemClasses = [
    spanClasses[span] || spanClasses[1],
    responsiveSpanClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses} {...props}>
      {children}
    </div>
  );
};

GridItem.propTypes = {
  span: PropTypes.number,
  responsiveSpan: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Grid;



