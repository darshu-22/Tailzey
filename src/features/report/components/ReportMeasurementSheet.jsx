import React from 'react';
import { Camera } from 'lucide-react';
import MeasurementRow from './MeasurementRow';

/**
 * Section 2: every tracked measurement with its unit, source (camera estimate /
 * entered by you / not recorded), ± uncertainty for camera estimates, ease and target.
 * Missing values are shown as missing, never as zero.
 */
export default function ReportMeasurementSheet({ rows, summary, measurement, onMeasure }) {
  const { unit, cameraCaptureCount, analysis } = measurement;
  const hasCamera = summary.cameraEstimates > 0;

  return (
    <section className="report-section" aria-labelledby="section-measurements-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">02.</span>
          <h2 id="section-measurements-title" className="report-section-title">
            Measurement Sheet
          </h2>
        </div>
        <span className="report-section-subtitle">
          {summary.recorded > 0
            ? `${summary.recorded} of ${summary.total} recorded (${unit})`
            : 'No measurements recorded'}
        </span>
      </div>

      <div className="report-table-wrapper">
        <table className="report-table" aria-label="Measurements and ease allowances">
          <thead>
            <tr>
              <th scope="col">Measurement</th>
              <th scope="col">Category</th>
              <th scope="col">Source</th>
              <th scope="col">Value ({unit})</th>
              <th scope="col">Ease Allowance</th>
              <th scope="col">Target</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <MeasurementRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="report-disclaimer-box" role="note">
        <div className="report-note-heading">
          <Camera size={14} aria-hidden="true" />
          <strong>About these measurements</strong>
        </div>
        {hasCamera ? (
          <>
            <span>
              {summary.cameraEstimates} value{summary.cameraEstimates === 1 ? ' was' : 's were'} estimated from{' '}
              {cameraCaptureCount || 'your'} guided photo{cameraCaptureCount === 1 ? '' : 's'}; each shows its
              expected error (±). Values marked “Entered by you” were typed in by hand.
            </span>
            {analysis?.disclaimer && <span className="report-analysis-disclaimer">{analysis.disclaimer}</span>}
          </>
        ) : (
          <span>
            {summary.recorded > 0
              ? 'All recorded values were entered by you.'
              : 'Nothing has been measured yet.'}
          </span>
        )}
        {summary.recorded < summary.total && onMeasure && (
          <button type="button" className="report-inline-link no-print" onClick={onMeasure}>
            Add measurements
          </button>
        )}
      </div>
    </section>
  );
}
