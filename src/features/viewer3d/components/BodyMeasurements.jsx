import React from 'react';
import { BODY_FIELDS, DEFAULT_HEIGHT_CM } from '../lib/bodyProfile';
import { convertValue } from '../../../shared/utils/units';

function formatLength(value, unit) {
  const rounded = unit === 'in' ? Math.round(value * 2) / 2 : Math.round(value);
  return `${rounded} ${unit}`;
}

/**
 * The measurements shaping the mannequin, as a compact two-column list. Estimated values are
 * muted and prefixed with "≈" (with a spoken label); the footnote explains where they come from.
 */
export default function BodyMeasurements({ profile, measurement }) {
  const unit = measurement.unit || 'cm';
  const measuredCount = BODY_FIELDS.filter((f) => !profile.estimated[f.id]).length;
  const estimatedNote = profile.heightKnown
    ? '≈ estimated from typical proportions for your height.'
    : `≈ estimated: no height recorded yet, so the shape uses a default height of ${formatLength(convertValue(DEFAULT_HEIGHT_CM, 'cm', unit), unit)} and typical proportions.`;

  return (
    <section className="studio-section" aria-labelledby="studio-body-heading">
      <div className="studio-section-head">
        <h2 id="studio-body-heading" className="studio-section-title">Measurements in use</h2>
        <span className="studio-count">
          {measuredCount} of {BODY_FIELDS.length} measured
        </span>
      </div>

      <dl className="studio-measures">
        {BODY_FIELDS.map((field) => {
          const estimated = profile.estimated[field.id];
          const value = estimated ? convertValue(profile.cm[field.id], 'cm', unit) : measurement.values[field.id];
          return (
            <div key={field.id} className="studio-measure">
              <dt>{field.label}</dt>
              <dd className={estimated ? 'studio-measure-value is-estimated' : 'studio-measure-value'}>
                {estimated && <span aria-hidden="true">≈ </span>}
                {formatLength(Number(value), unit)}
                {estimated && (
                  <span className="sr-only">
                    {field.id === 'height' ? ' (default height)' : ' (estimated from height)'}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {measuredCount < BODY_FIELDS.length && <p className="studio-footnote">{estimatedNote}</p>}
    </section>
  );
}
