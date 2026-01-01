import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Input Component
 * 
 * Text-Input mit Label, Error-States, Helper-Text und optionalen Icons.
 * 
 * @param {string} type - Input-Type (text, email, password, number)
 * @param {string} label - Label-Text
 * @param {string} error - Error-Message
 * @param {string} helperText - Helper-Text unterhalb des Inputs
 * @param {string} icon - Icon-Name (wird als Prefix angezeigt)
 * @param {string} suffixIcon - Icon-Name (wird als Suffix angezeigt)
 * @param {boolean} disabled - Deaktiviert das Input
 * @param {string} placeholder - Placeholder-Text
 * @param {string} value - Input-Wert
 * @param {function} onChange - Change-Handler
 */
const Input = ({
  type = 'text',
  label = '',
  error = '',
  helperText = '',
  icon = null,
  suffixIcon = null,
  disabled = false,
  placeholder = '',
  value,
  onChange,
  className = '',
  ...props
}) => {
  const inputId = React.useId();

  // Base Classes
  const baseClasses = 'w-full px-4 py-2.5 bg-surface-700 text-white rounded-button transition-all duration-base placeholder:text-muted-500 focus:outline-none';

  // Border Classes (Normal vs Error)
  const borderClasses = error
    ? 'border-2 border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
    : 'border border-white/10 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20';

  // Disabled State
  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-text';

  // Icon Padding
  const paddingClasses = icon ? 'pl-11' : suffixIcon ? 'pr-11' : '';

  // Kombiniere Classes
  const combinedClasses = `
    ${baseClasses}
    ${borderClasses}
    ${stateClasses}
    ${paddingClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block mb-2 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={icon} size={20} color="muted" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={combinedClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {suffixIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={suffixIcon} size={20} color="muted" />
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger flex items-center gap-1">
          <Icon name="error" size={16} />
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-muted-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url']),
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.string,
  suffixIcon: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Input;



