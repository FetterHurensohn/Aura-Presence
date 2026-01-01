/**
 * Design System - Main Export
 * 
 * Zentraler Export für alle Design System Ressourcen.
 * 
 * Usage:
 * import { Button, tokens, animations } from '@/design-system';
 */

// Export all components
export * from './components';

// Export animations
export * as animations from './animations';
export { default as animationUtils } from './animations';

// Export tokens
export { default as tokens } from './tokens.json';



