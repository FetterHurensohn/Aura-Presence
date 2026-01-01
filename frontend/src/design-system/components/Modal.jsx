import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import Button from './Button';

/**
 * Modal Component
 * 
 * Overlay-Modal mit Backdrop, Close-Button, Focus-Trap und ESC-Key Handler.
 * Vollständige Accessibility-Unterstützung.
 * 
 * @param {boolean} open - Modal ist geöffnet
 * @param {function} onClose - Close-Handler
 * @param {string} title - Modal-Titel
 * @param {ReactNode} children - Modal-Content
 * @param {ReactNode} footer - Footer-Content (z.B. Buttons)
 * @param {string} size - Modal-Größe: sm, md, lg
 */
const Modal = ({
  open = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md',
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Size Classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  };

  // Focus Management
  useEffect(() => {
    if (open) {
      // Speichere das aktuelle aktive Element
      previousActiveElement.current = document.activeElement;

      // Fokussiere das Modal
      modalRef.current?.focus();

      // Verhindere Scrollen im Hintergrund
      document.body.style.overflow = 'hidden';

      return () => {
        // Stelle Scrollen wieder her
        document.body.style.overflow = '';
        // Stelle Focus wieder her
        previousActiveElement.current?.focus();
      };
    }
  }, [open]);

  // ESC-Key Handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Focus Trap
  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-900/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onKeyDown={handleTabKey}
        className={`
          w-full ${sizeClasses[size]} bg-surface-800 rounded-modal shadow-xl border border-white/10
          transform transition-all duration-base scale-100 opacity-100
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          {title && (
            <h2 id="modal-title" className="text-h2 font-semibold text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-button hover:bg-surface-700 transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Modal schließen"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-surface-700/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render via Portal
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Modal;



