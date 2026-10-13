import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * Reusable PasswordInput with show/hide toggle and accessible aria attributes
 */
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

  return (
    <div className={`form-group ${className}`.trim()}>
      <label htmlFor={inputId} className="form-label">
        <span>{label} {required && <span style={{ color: 'var(--color-gold)' }}>*</span>}</span>
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
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className="form-input form-input-with-icon"
          style={{ paddingRight: '2.75rem', ...(error ? { borderColor: 'var(--color-status-error)' } : {}) }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle-btn"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '0.85rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color var(--transition-fast)',
          }}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
