import React from 'react';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { isMissing } from '../../../shared/utils/units';
import { withAdjustment } from '../lib/studioMath';

/** Each measurement with its ease applied, as listed in the summary panel. */
export default function SummaryMetricsList({ values, adjustments, fieldStatus, unit }) {
  return (
    <div className="summary-metrics-list">
      <span className="metrics-list-title">Anatomical Metrics & Comfort Ease ({unit.toUpperCase()})</span>

      {MANUAL_MEASUREMENT_FIELDS.map((field) => {
        const base = values[field.id];
        const adj = adjustments[field.id] || 0;
        const isEstimate = fieldStatus[field.id] === 'camera_estimate';

        return (
          <div key={field.id} className="summary-metric-row">
            <div className="metric-row-name-col">
              <span className="metric-name">{field.label}</span>
              <span className="metric-cat">
                {field.category}
                {isEstimate && ' · camera estimate'}
              </span>
            </div>

            <div className="metric-row-val-col">
              {isMissing(base) ? (
                <span className="metric-unsupplied">Not recorded</span>
              ) : (
                <div className="metric-val-calc">
                  {adj > 0 ? (
                    <>
                      <span className="metric-base-sub">{base}</span>
                      <span className="metric-adj-tag">+{adj}</span>
                      <span className="metric-final-val highlight">
                        {withAdjustment(base, adj)} {unit}
                      </span>
                    </>
                  ) : (
                    <span className="metric-final-val">
                      {base} {unit}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
