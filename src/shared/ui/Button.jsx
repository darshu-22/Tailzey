import React from 'react';

/**
 * Reusable Button component for Tailzy luxury design system
 * Supports primary, secondary, outline, and ghost variants in sm, md, lg sizes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  ariaLabel,
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled || loading ? 'btn-disabled' : '';

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`btn ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span
          className="loading-spinner"
          style={{ width: '16px', height: '16px', borderWidth: '2px' }}
          aria-hidden="true"
        />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />
      )}
    </button>
  );
}
