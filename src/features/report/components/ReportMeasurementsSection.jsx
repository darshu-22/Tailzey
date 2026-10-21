import MeasurementRow from './MeasurementRow';

/**
 * Section 2: every tracked measurement with its value, source (camera estimate /
 * entered by you / not recorded), ± error for camera estimates, ease and target.
 * Missing values are shown as missing, never as zero.
 */
export default function ReportMeasurementsSection({ rows, summary, onMeasure }) {
  const unit = rows[0]?.unit ?? 'cm';

  return (
    <section className="report-section" aria-labelledby="report-measurements-title">
      <div className="report-section-head">
        <h2 id="report-measurements-title" className="report-section-title">
          Measurements
        </h2>
        <p className="report-section-meta">
          {summary.recorded > 0 ? `${summary.recorded} of ${summary.total} recorded, in ${unit}` : 'None recorded yet'}
        </p>
      </div>

      <table className="report-table">
        <caption className="sr-only">Body measurements, their source, ease allowance and target size</caption>
        <thead>
          <tr>
            <th scope="col">Measurement</th>
            <th scope="col">Value</th>
            <th scope="col">Source</th>
            <th scope="col">Ease</th>
            <th scope="col">Target</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <MeasurementRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>

      <p className="report-table-note">
        Target = value + ease. Camera estimates show their typical error (±) measured on people the model has not
        seen.
        {summary.recorded < summary.total && (
          <>
            {' '}
            <button type="button" className="report-link no-print" onClick={onMeasure}>
              Add missing measurements
            </button>
          </>
        )}
      </p>
    </section>
  );
}
