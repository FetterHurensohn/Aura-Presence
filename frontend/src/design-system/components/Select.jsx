import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Select Component
 * 
 * Native Select mit Custom Styling.
 * 
 * @param {array} options - Array von Options: [{value: '', label: ''}]
 * @param {string} label - Label-Text
 * @param {string} error - Error-Message
 * @param {boolean} disabled - Deaktiviert das Select
 * @param {string} placeholder - Placeholder-Text
 * @param {string} value - Ausgewählter Wert
 * @param {function} onChange - Change-Handler
 */
const Select = ({
  options = [],
  label = '',
  error = '',
  disabled = false,
  placeholder = 'Auswählen...',
  value,
  onChange,
  className = '',
  ...props
}) => {
  const selectId = React.useId();

  // Base Classes
  const baseClasses = 'w-full px-4 py-2.5 pr-11 bg-surface-700 text-white rounded-button transition-all duration-base appearance-none focus:outline-none';

  // Border Classes
  const borderClasses = error
    ? 'border-2 border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
    : 'border border-white/10 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20';

  // Disabled State
  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  // Kombiniere Classes
  const combinedClasses = `
    ${baseClasses}
    ${borderClasses}
    ${stateClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block mb-2 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={combinedClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="chevron-down" size={20} color="muted" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-sm text-danger flex items-center gap-1">
          <Icon name="error" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Select;



