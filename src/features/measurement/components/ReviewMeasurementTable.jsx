import React from 'react';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { isMissing } from '../../../shared/utils/units';
import { CONFIDENCE_LABELS, FIELD_STATUS_LABELS, formatUncertainty, getEstimate } from '../../../shared/measurements/estimates';

function describeSource(key, measurement) {
  const status = measurement.fieldStatus[key];
  if (status !== 'camera_estimate') return FIELD_STATUS_LABELS[status] || FIELD_STATUS_LABELS.user_entered;
  const confidence = CONFIDENCE_LABELS[getEstimate(measurement.analysis, key)?.confidence];
  return [FIELD_STATUS_LABELS.camera_estimate, confidence].filter(Boolean).join(' · ');
}

/**
 * Every measurement field with its value, ± range and where it came from. Missing values
 * show the analysis' reason (when there is one) instead of a number.
 */
export default function ReviewMeasurementTable({ measurement }) {
  const { values, unit, analysis, fieldStatus, uncertainty } = measurement;

  return (
    <table className="review-table">
      <thead>
        <tr>
          <th scope="col">Measurement</th>
          <th scope="col">Source</th>
          <th scope="col" className="review-table-num">
            Value ({unit})
          </th>
        </tr>
      </thead>
      <tbody>
        {MANUAL_MEASUREMENT_FIELDS.map((field) => {
          const value = values[field.id];
          const missing = isMissing(value);
          const isEstimate = fieldStatus[field.id] === 'camera_estimate';
          const reason = missing ? getEstimate(analysis, field.id)?.reason : null;

          return (
            <tr key={field.id} className={missing ? 'is-missing' : ''}>
              <th scope="row" className="review-table-label">
                {field.label}
              </th>
              <td className="review-table-source">
                {missing ? reason || FIELD_STATUS_LABELS.not_recorded : describeSource(field.id, measurement)}
              </td>
              <td className="review-table-num">
                {missing ? (
                  <span className="review-table-empty">Not recorded</span>
                ) : (
                  <>
                    <span className="review-table-value">
                      {value} {unit}
                    </span>
                    {isEstimate && uncertainty[field.id] != null && (
                      <span className="review-table-range">{formatUncertainty(uncertainty[field.id], unit)}</span>
                    )}
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
