/**
 * Label / value list used throughout the report.
 * @param {Array<{label, value, sub?}>} props.items
 */
export default function SpecList({ items, className = '' }) {
  return (
    <dl className={`report-spec ${className}`.trim()}>
      {items.map(({ label, value, sub }) => (
        <div key={label} className="report-spec-row">
          <dt>{label}</dt>
          <dd>
            <span className="report-spec-value">{value}</span>
            {sub && <span className="report-spec-sub">{sub}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
