import React from 'react';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { isMissing } from '../../../shared/utils/units';
import { CONFIDENCE_LABELS, FIELD_STATUS_LABELS, formatUncertainty, getEstimate } from '../../../shared/measurements/estimates';

function describeSource(key, measurement) {
  const status = measurement.fieldStatus[key];
  if (status !== 'camera_estimate') return FIELD_STATUS_LABELS[status] || FIELD_STATUS_LABELS.user_entered;
  const estimate = getEstimate(measurement.analysis, key);
  return [
    FIELD_STATUS_LABELS.camera_estimate,
    formatUncertainty(measurement.uncertainty[key], measurement.unit),
    CONFIDENCE_LABELS[estimate?.confidence],
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Every measurement field with its current value and where it came from. Missing
 * values show the analysis' reason (when there is one) instead of a number.
 */
export default function ReviewMeasurementTable({ measurement }) {
  const { values, unit, analysis } = measurement;

  return (
    <div className="review-measurements-table">
      {MANUAL_MEASUREMENT_FIELDS.map((field) => {
        const value = values[field.id];
        const missing = isMissing(value);
        const status = measurement.fieldStatus[field.id];
        const reason = missing ? getEstimate(analysis, field.id)?.reason : null;

        return (
          <div key={field.id} className="review-measure-row">
            <div className="measure-name-col">
              <span className="measure-label">{field.label}</span>
              <span className="measure-category">{field.category}</span>
            </div>
            <div className="measure-val-col">
              {missing ? (
                <>
                  <span className="measure-empty">Not recorded</span>
                  {reason && <span className="measure-reason">{reason}</span>}
                </>
              ) : (
                <>
                  <span className={`measure-number ${status === 'camera_estimate' ? 'is-estimate' : 'highlight'}`}>
                    {value} <span className="measure-unit">{unit}</span>
                  </span>
                  <span className="measure-source">{describeSource(field.id, measurement)}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
