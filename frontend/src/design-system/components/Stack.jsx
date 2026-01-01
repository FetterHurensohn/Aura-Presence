import React from 'react';
import PropTypes from 'prop-types';

/**
 * Stack Component
 * 
 * Ein Flex-Container für einfaches vertikales oder horizontales Stacking von Elementen.
 * Ideal für schnelles Layout ohne manuelle Flex-Konfiguration.
 * 
 * @param {string} direction - Stack-Richtung: vertical, horizontal
 * @param {number} spacing - Abstand zwischen Items (0-12)
 * @param {string} align - Ausrichtung: start, center, end, stretch, baseline
 * @param {string} justify - Justify-Content: start, center, end, between, around, evenly
 * @param {boolean} wrap - Erlaubt Umbruch (flex-wrap)
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Stack-Items
 */
const Stack = ({
  direction = 'vertical',
  spacing = 4,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  children,
  ...props
}) => {
  // Direction Classes
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  // Spacing Classes (gap)
  const spacingClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12',
    16: 'gap-16',
  };

  // Align Classes (align-items)
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  // Justify Classes (justify-content)
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Wrap Class
  const wrapClass = wrap ? 'flex-wrap' : '';

  const stackClasses = [
    'flex',
    directionClasses[direction],
    spacingClasses[spacing] || spacingClasses[4],
    alignClasses[align],
    justifyClasses[justify],
    wrapClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={stackClasses} {...props}>
      {children}
    </div>
  );
};

Stack.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  spacing: PropTypes.oneOf([0, 1, 2, 3, 4, 6, 8, 12, 16]),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  wrap: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * HStack Component (Horizontal Stack)
 * Shorthand für Stack mit direction="horizontal"
 */
export const HStack = (props) => <Stack direction="horizontal" {...props} />;

/**
 * VStack Component (Vertical Stack)
 * Shorthand für Stack mit direction="vertical"
 */
export const VStack = (props) => <Stack direction="vertical" {...props} />;

export default Stack;



