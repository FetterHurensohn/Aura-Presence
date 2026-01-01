import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { animations, durations } from '../animations';

/**
 * Transition Component
 * 
 * Wrapper für einfache Ein-/Aus-Animationen.
 * Basiert auf CSS Transitions und Tailwind Animations.
 * 
 * @param {boolean} show - Ob Inhalt sichtbar ist
 * @param {string} animation - Animation-Name aus animations.js
 * @param {string} duration - Dauer: micro, quick, base, slow
 * @param {function} onEnter - Callback wenn Animation startet
 * @param {function} onEntered - Callback wenn Animation endet
 * @param {function} onExit - Callback wenn Exit-Animation startet
 * @param {function} onExited - Callback wenn Exit-Animation endet
 * @param {boolean} unmountOnExit - Komponente unmounten wenn nicht sichtbar
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ReactNode} children - Animierter Inhalt
 */
const Transition = ({
  show = false,
  animation = 'fadeIn',
  duration = 'base',
  onEnter,
  onEntered,
  onExit,
  onExited,
  unmountOnExit = true,
  className = '',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  // Duration in milliseconds (for timeouts)
  const durationMs = {
    micro: 100,
    quick: 150,
    base: 220,
    slow: 350,
  };

  useEffect(() => {
    if (show) {
      // Enter
      setIsVisible(true);
      setIsAnimating(true);
      if (onEnter) onEnter();

      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (onEntered) onEntered();
      }, durationMs[duration]);

      return () => clearTimeout(timer);
    } else {
      // Exit
      if (isVisible) {
        setIsAnimating(true);
        if (onExit) onExit();

        const timer = setTimeout(() => {
          setIsAnimating(false);
          if (unmountOnExit) {
            setIsVisible(false);
          }
          if (onExited) onExited();
        }, durationMs[duration]);

        return () => clearTimeout(timer);
      }
    }
  }, [show]);

  // Don't render if unmounted
  if (!isVisible && unmountOnExit) {
    return null;
  }

  // Animation Classes
  const animationClass = show ? animations[animation] : '';
  const durationClass = durations[duration];

  const transitionClasses = [
    animationClass,
    durationClass,
    !show && !unmountOnExit ? 'opacity-0' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={transitionClasses} {...props}>
      {children}
    </div>
  );
};

Transition.propTypes = {
  show: PropTypes.bool,
  animation: PropTypes.oneOf([
    'fadeIn',
    'fadeOut',
    'slideInUp',
    'slideInDown',
    'slideInLeft',
    'slideInRight',
    'scaleIn',
    'scaleOut',
  ]),
  duration: PropTypes.oneOf(['micro', 'quick', 'base', 'slow']),
  onEnter: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExited: PropTypes.func,
  unmountOnExit: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Transition;



