/** Section 4: how to read this report — measurement sources, sizing limits and the illustration. */
export default function ReportNotesSection({ measurement, summary }) {
  const { cameraCaptureCount, analysis } = measurement;
  const photos = cameraCaptureCount ? `${cameraCaptureCount} guided photo${cameraCaptureCount === 1 ? '' : 's'}` : 'your guided photos';

  let sourceNote = 'No measurements have been recorded yet.';
  if (summary.cameraEstimates > 0) {
    sourceNote = `${summary.cameraEstimates} value${summary.cameraEstimates === 1 ? ' was' : 's were'} estimated from ${photos}. Values marked “Entered by you” were typed in by hand.`;
  } else if (summary.recorded > 0) {
    sourceNote = 'All recorded values were entered by you.';
  }

  return (
    <section className="report-section report-notes" aria-labelledby="report-notes-title">
      <h2 id="report-notes-title" className="report-section-title">
        Notes
      </h2>
      <ul className="report-notes-list">
        <li>{sourceNote}</li>
        {analysis?.disclaimer && <li>{analysis.disclaimer}</li>}
        <li>
          Size guides and ease allowances are for planning only. They are not a guaranteed fit — a made-to-measure
          garment still needs a fitting with your tailor.
        </li>
        <li>The outfit illustration is a sketch of your choices. It is not generated from your body or measurements.</li>
      </ul>
    </section>
  );
}
