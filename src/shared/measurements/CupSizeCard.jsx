import React, { useId } from 'react';
import { cupSize, formatBraSize } from './cupSize';

/** Bra-size guide (EU / UK / US) from the bust and underbust; renders nothing without an underbust. */
export default function CupSizeCard({ measurement, className = '' }) {
  const titleId = useId();
  const result = cupSize(measurement);
  if (!result) return null;

  return (
    <section className={`cup-size ${className}`.trim()} aria-labelledby={titleId}>
      <h3 id={titleId} className="cup-size-title">
        Bra size guide
      </h3>
      {result.reason ? (
        <p className="cup-size-note">{result.reason}</p>
      ) : (
        <>
          <dl className="cup-size-grid">
            {result.sizes.map((size) => (
              <div key={size.system} className="cup-size-item">
                <dt className="cup-size-system">{size.system}</dt>
                <dd className="cup-size-value">{formatBraSize(size)}</dd>
                {size.range[0] !== size.range[1] && (
                  <dd className="cup-size-range">
                    {formatBraSize(size, size.range[0])}–{formatBraSize(size, size.range[1])}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <p className="cup-size-note">
            {result.estimated
              ? 'Camera estimate: the range covers its ± error. A tape-measured underbust narrows it. '
              : 'From your tape measurements. '}
            Brands vary, so treat it as a starting size.
          </p>
        </>
      )}
    </section>
  );
}
