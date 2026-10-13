import React from 'react';

/**
 * Responsive PageContainer component for consistent layout width and horizontal spacing
 */
export default function PageContainer({
  children,
  narrow = false,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const containerType = narrow ? 'page-container-narrow' : 'page-container';

  return (
    <Component className={`${containerType} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
