import React from 'react';

/**
 * Reusable StatusBadge component for tags, states, and phase indicators
 */
export default function StatusBadge({
  children,
  variant = 'gold',
  icon: Icon,
  className = '',
  dot = false,
}) {
  const variantClass = `status-badge-${variant}`;

  return (
    <span className={`status-badge ${variantClass} ${className}`.trim()}>
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon size={12} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
