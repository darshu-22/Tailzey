import React from 'react';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import MeasurementResultCard from './MeasurementResultCard';

export const METRICS_SECTION_ID = 'results-cards-section';

/** Grid of measurement cards, all read from the workspace measurement. */
export default function MetricsSection({ measurement, valueErrors, onSave, onAdjustmentChange }) {
  const { values, unit, fieldStatus, uncertainty, adjustments, analysis } = measurement;

  return (
    <>
      <div className="results-section-header" id={METRICS_SECTION_ID}>
        <h2 className="results-section-heading">Anatomical Metrics</h2>
        <span className="results-section-sub">
          Edit values independently or apply optional comfort ease allowances.
        </span>
      </div>

      <div className="measurement-cards-grid">
        {MANUAL_MEASUREMENT_FIELDS.map((field) => (
          <MeasurementResultCard
            key={field.id}
            field={field}
            value={values[field.id]}
            unit={unit}
            status={fieldStatus[field.id]}
            uncertaintyCm={uncertainty[field.id]}
            estimate={analysis?.measurements?.[field.id]}
            adjustment={adjustments[field.id] || 0}
            serverError={valueErrors[field.id]}
            onSave={onSave}
            onAdjustmentChange={onAdjustmentChange}
          />
        ))}
      </div>
    </>
  );
}
