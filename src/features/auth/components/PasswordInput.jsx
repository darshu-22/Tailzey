import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/** Password field with a show/hide toggle; mirrors the shared Input's label/hint/error markup. */
export default function PasswordInput({
  id,
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  error,
  hint,
  required = false,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={inputId} className="form-label">
        <span>
          {label} {required && <span className="form-required-mark" aria-hidden="true">*</span>}
        </span>
      </label>
      <div className="form-input-container">
        <div className="form-input-icon">
          <Lock size={16} aria-hidden="true" />
        </div>
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="form-input form-input-with-icon password-input"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((shown) => !shown)}
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
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
