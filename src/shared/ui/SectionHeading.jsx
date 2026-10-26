import React from 'react';

/** Section heading: optional eyebrow label, title and supporting description. */
export default function SectionHeading({ eyebrow, title, description, align = 'center', className = '', id }) {
  const alignClass = align === 'left' ? 'section-heading-left' : 'section-heading-center';

  return (
    <div className={`section-heading-wrapper ${alignClass} ${className}`.trim()} id={id}>
      {eyebrow && <p className="eyebrow-badge">{eyebrow}</p>}
      {title && <h2 className="section-title">{title}</h2>}
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
