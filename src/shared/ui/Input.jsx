import React from 'react';

/**
 * Labelled text input with optional icon, hint and error message.
 */
export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  hint,
  error,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="form-required-mark" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="form-input-container">
        {Icon && (
          <div className="form-input-icon">
            <Icon size={16} aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={`form-input ${Icon ? 'form-input-with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <span id={`${inputId}-error`} className="form-error-text">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${inputId}-hint`} className="form-hint">
          {hint}
        </span>
      )}
    </div>
  );
}
