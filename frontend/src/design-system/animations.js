/**
 * Animation Utilities
 * 
 * Vordefinierte Animationen für konsistente UX.
 * Verwendet mit Tailwind CSS Klassen.
 */

/**
 * Animation Classes
 * Kombiniere diese mit deinen Komponenten für sofortige Animationen
 */
export const animations = {
  // Fade Animations
  fadeIn: 'opacity-0 animate-fadeIn',
  fadeOut: 'opacity-100 animate-fadeOut',
  
  // Slide Animations
  slideInUp: 'translate-y-4 opacity-0 animate-slideInUp',
  slideInDown: '-translate-y-4 opacity-0 animate-slideInDown',
  slideInLeft: 'translate-x-4 opacity-0 animate-slideInLeft',
  slideInRight: '-translate-x-4 opacity-0 animate-slideInRight',
  
  // Scale Animations
  scaleIn: 'scale-95 opacity-0 animate-scaleIn',
  scaleOut: 'scale-100 opacity-100 animate-scaleOut',
  
  // Built-in Tailwind Animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
};

/**
 * Durations
 * Timing für Animationen (bereits in Tailwind integriert)
 */
export const durations = {
  micro: 'duration-micro',    // 100ms
  quick: 'duration-quick',    // 150ms
  base: 'duration-base',      // 220ms
  slow: 'duration-slow',      // 350ms
};

/**
 * Easing Functions
 * Für transition-timing-function
 */
export const easings = {
  default: 'ease-in-out',
  enter: 'ease-out',
  exit: 'ease-in',
  linear: 'ease-linear',
};

/**
 * Helper: Kombiniere Animation mit Duration
 */
export const withDuration = (animation, duration = 'base') => {
  return `${animations[animation]} ${durations[duration]}`;
};

/**
 * Usage Examples:
 * 
 * // Einfach
 * <div className={animations.fadeIn}>Content</div>
 * 
 * // Mit Duration
 * <div className={withDuration('slideInUp', 'slow')}>Content</div>
 * 
 * // Kombiniert mit anderen Klassen
 * <div className={`${animations.scaleIn} ${durations.quick} p-4 bg-surface-800`}>
 *   Content
 * </div>
 */

export default animations;



