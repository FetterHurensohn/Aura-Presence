import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Tooltip Component
 * 
 * Zeigt zusätzliche Informationen beim Hover oder Focus.
 * Auto-Positioning basierend auf verfügbarem Platz.
 * 
 * @param {string} content - Tooltip-Text
 * @param {string} placement - Position: top, bottom, left, right
 * @param {number} delay - Verzögerung in ms vor Anzeige
 * @param {string} trigger - Auslöser: hover, click, focus
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Element das Tooltip auslöst
 */
const Tooltip = ({
  content,
  placement = 'top',
  delay = 200,
  trigger = 'hover',
  className = '',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPlacement, setActualPlacement] = useState(placement);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Show tooltip
  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // Toggle tooltip (for click trigger)
  const toggle = () => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Event handlers based on trigger
  const getTriggerProps = () => {
    if (trigger === 'hover') {
      return {
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      };
    } else if (trigger === 'click') {
      return {
        onClick: toggle,
      };
    } else if (trigger === 'focus') {
      return {
        onFocus: show,
        onBlur: hide,
      };
    }
    return {};
  };

  // Placement classes
  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-surface-700',
  };

  const tooltipClasses = [
    'absolute z-50',
    'px-3 py-2 rounded-button',
    'bg-surface-700 text-white text-small',
    'shadow-lg border border-white/10',
    'max-w-xs',
    'whitespace-normal break-words',
    placementClasses[actualPlacement],
    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
    'transition-opacity duration-quick',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="relative inline-block" ref={triggerRef} {...props}>
      {/* Trigger Element */}
      <div {...getTriggerProps()}>
        {children}
      </div>

      {/* Tooltip */}
      {content && (
        <div ref={tooltipRef} className={tooltipClasses} role="tooltip">
          {content}
          
          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0
              border-4 border-transparent
              ${arrowClasses[actualPlacement]}
            `}
          />
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
  trigger: PropTypes.oneOf(['hover', 'click', 'focus']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tooltip;



