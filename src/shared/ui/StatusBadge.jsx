import React from 'react';

/**
 * Small status label. Variants: gold (accent) | bronze (warning) | info | neutral | success.
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
      {dot && <span className="status-badge-dot" aria-hidden="true" />}
      {Icon && <Icon size={12} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
