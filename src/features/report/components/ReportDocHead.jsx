import { STATUS_LABELS } from '../lib/reportModel';

/** Letterhead of the printed document: brand plus the report's key reference details. */
export default function ReportDocHead({ design, reference, date, status, unit }) {
  const meta = [
    ['Design', design.name || 'Untitled design'],
    ['Reference', reference],
    ['Date', date],
    ['Status', STATUS_LABELS[status]],
    ['Units', unit === 'in' ? 'Inches' : 'Centimetres'],
  ];

  return (
    <header className="report-doc-head">
      <p className="report-brand">Tailzey</p>
      <dl className="report-meta">
        {meta.map(([label, value]) => (
          <div key={label} className="report-meta-item">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
