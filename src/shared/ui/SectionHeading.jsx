import React from 'react';

/**
 * Reusable SectionHeading component with luxury eyebrow pill, editorial serif title, and supporting description
 */
export default function SectionHeading({
  eyebrow,
  title,
  titleGradient = false,
  description,
  align = 'center',
  className = '',
  id,
}) {
  const alignClass = align === 'left' ? 'section-heading-left' : 'section-heading-center';

  return (
    <div className={`section-heading-wrapper ${alignClass} ${className}`.trim()} id={id}>
      {eyebrow && (
        <div className="eyebrow-badge">
          <span className="ornament-star">✦</span>
          <span>{eyebrow}</span>
          <span className="ornament-star">✦</span>
        </div>
      )}
      {title && (
        <h2 className="section-title">
          {titleGradient ? (
            <span className="text-gold-gradient">{title}</span>
          ) : (
            title
          )}
        </h2>
      )}
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
