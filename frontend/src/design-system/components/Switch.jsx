import React from 'react';
import PropTypes from 'prop-types';

/**
 * Switch Component
 * 
 * Toggle-Switch für On/Off States.
 * 
 * @param {boolean} checked - Switch ist aktiviert
 * @param {function} onChange - Change-Handler
 * @param {string} label - Label-Text
 * @param {boolean} disabled - Deaktiviert den Switch
 */
const Switch = ({
  checked = false,
  onChange,
  label = '',
  disabled = false,
  className = '',
  ...props
}) => {
  const switchId = React.useId();

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <input
          id={switchId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={switchId}
          className={`
            block w-11 h-6 rounded-pill transition-all duration-base cursor-pointer
            ${checked ? 'bg-accent-500' : 'bg-surface-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            peer-focus:ring-2 peer-focus:ring-accent-500 peer-focus:ring-offset-2 peer-focus:ring-offset-bg-900
          `.trim().replace(/\s+/g, ' ')}
        >
          <span
            className={`
              block w-4 h-4 bg-white rounded-full transition-all duration-base
              ${checked ? 'translate-x-6' : 'translate-x-1'}
              mt-1
            `.trim().replace(/\s+/g, ' ')}
          />
        </label>
      </div>

      {label && (
        <label
          htmlFor={switchId}
          className={`ml-3 text-sm text-white cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Switch;



