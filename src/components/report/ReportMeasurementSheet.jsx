import React from 'react';
import { CheckCircle2, AlertCircle, Info, Camera } from 'lucide-react';
import { MANUAL_MEASUREMENT_FIELDS } from '../../data/measurementData';

/**
 * ReportMeasurementSheet Component (Phase 7)
 * Renders Section 2 of the Design Report:
 * Complete anatomical measurement sheet displaying recorded values,
 * unit precision, comfort ease allowances, and explicit empty-state indicators.
 *
 * Strictly adheres to data integrity:
 * - Does NOT fabricate missing measurements or treat nulls as zero.
 * - Accurately distinguishes User-Entered vs Not Recorded / Uncalibrated metrics.
 */
export default function ReportMeasurementSheet({
  measurementSession = {},
  unit = 'cm',
  adjustments = {},
}) {
  const manualValues = measurementSession.manualValues || {};
  const cameraCaptureCount = measurementSession.cameraCaptureCount || 0;
  const isCameraCompleted = measurementSession.isCameraCompleted || false;

  // Count entered metrics
  const recordedFields = MANUAL_MEASUREMENT_FIELDS.filter((field) => {
    const val = manualValues[field.id];
    return val !== null && val !== undefined && val !== '' && !isNaN(val);
  });

  const hasAnyMeasurements = recordedFields.length > 0;

  return (
    <section className="report-section" aria-labelledby="section-measurements-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">02.</span>
          <h2 id="section-measurements-title" className="report-section-title">
            Anatomical Measurement Sheet
          </h2>
        </div>
        <span className="report-section-subtitle">
          {hasAnyMeasurements
            ? `${recordedFields.length} of ${MANUAL_MEASUREMENT_FIELDS.length} Metrics Recorded (${unit.toUpperCase()})`
            : 'Uncalibrated Session Profile'}
        </span>
      </div>

      {/* Measurement Table */}
      <div className="report-table-wrapper">
        <table className="report-table" aria-label="Anatomical Measurements and Ease Allowances">
          <thead>
            <tr>
              <th scope="col">Anatomical Landmark</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Recorded Base ({unit})</th>
              <th scope="col">Ease Allowance</th>
              <th scope="col">Resulting Target</th>
            </tr>
          </thead>
          <tbody>
            {MANUAL_MEASUREMENT_FIELDS.map((field) => {
              const rawVal = manualValues[field.id];
              const isRecorded =
                rawVal !== null && rawVal !== undefined && rawVal !== '' && !isNaN(rawVal);
              const numBase = isRecorded ? parseFloat(rawVal) : null;
              const easeAdj = adjustments[field.id] || 0;
              const finalVal =
                numBase !== null
                  ? unit === 'in'
                    ? (numBase + easeAdj).toFixed(1)
                    : Math.round(numBase + easeAdj)
                  : null;

              return (
                <tr key={field.id}>
                  <td>
                    <div className="report-metric-name">{field.label}</div>
                    <div className="report-metric-desc">{field.description}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {field.category}
                    </span>
                  </td>
                  <td>
                    {isRecorded ? (
                      <span className="report-status-badge report-status-entered">
                        <CheckCircle2 size={11} aria-hidden="true" />
                        <span>Entered</span>
                      </span>
                    ) : (
                      <span className="report-status-badge report-status-empty">
                        <AlertCircle size={11} aria-hidden="true" />
                        <span>Not Recorded</span>
                      </span>
                    )}
                  </td>
                  <td>
                    {isRecorded ? (
                      <strong>
                        {numBase} {unit}
                      </strong>
                    ) : (
                      <span style={{ color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td>
                    {isRecorded ? (
                      easeAdj > 0 ? (
                        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                          +{easeAdj} {unit}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>+0 (Standard)</span>
                      )
                    ) : (
                      <span style={{ color: 'var(--color-text-faint)' }}>—</span>
                    )}
                  </td>
                  <td>
                    {isRecorded ? (
                      <strong style={{ color: 'var(--color-gold)' }}>
                        {finalVal} {unit}
                      </strong>
                    ) : (
                      <span style={{ color: 'var(--color-text-faint)', fontStyle: 'italic' }}>
                        Uncalibrated
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Camera Capture Status Note */}
      <div className="report-disclaimer-box" role="note">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <Camera size={14} style={{ color: 'var(--color-gold)' }} aria-hidden="true" />
          <strong style={{ color: 'var(--color-text-primary)' }}>
            Camera Pose Guidance Audit:
          </strong>
        </div>
        <span>
          {cameraCaptureCount > 0 ? (
            <>
              <strong>{cameraCaptureCount} of 6</strong> guided camera poses were logged during this session ({isCameraCompleted ? 'Full Sequence Completed' : 'Partial Sequence'}). Raw image frames are held exclusively in browser memory and are not stored in any external database.
            </>
          ) : (
            'No guided camera poses were captured for this session. Proportions are derived solely from manual tape entries.'
          )}
        </span>
      </div>
    </section>
  );
}
