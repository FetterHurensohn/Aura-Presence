import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Checkbox Component
 * 
 * Standard-Checkbox mit Accent-Farbe und Label.
 * 
 * @param {boolean} checked - Checkbox ist angehakt
 * @param {function} onChange - Change-Handler
 * @param {string} label - Label-Text
 * @param {boolean} disabled - Deaktiviert die Checkbox
 */
const Checkbox = ({
  checked = false,
  onChange,
  label = '',
  disabled = false,
  className = '',
  ...props
}) => {
  const checkboxId = React.useId();

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={`
            flex items-center justify-center w-5 h-5 border-2 rounded transition-all duration-base cursor-pointer
            ${checked 
              ? 'bg-accent-500 border-accent-500' 
              : 'bg-surface-700 border-white/10 hover:border-accent-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:ring-offset-2 peer-focus:ring-offset-bg-900
          `.trim().replace(/\s+/g, ' ')}
        >
          {checked && (
            <Icon name="check" size={14} color="white" />
          )}
        </label>
      </div>

      {label && (
        <label
          htmlFor={checkboxId}
          className={`ml-2 text-sm text-white cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;


