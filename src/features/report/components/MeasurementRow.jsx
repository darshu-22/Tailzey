import StatusBadge from '../../../shared/ui/StatusBadge';
import { formatAdjustment } from '../lib/reportModel';

const SOURCE_BADGE = {
  camera_estimate: 'info',
  user_entered: 'success',
  not_recorded: 'neutral',
};

/**
 * One measurement line of the report table (see buildMeasurementRows).
 * `data-label` lets the table stack into cards on narrow screens.
 */
export default function MeasurementRow({ row }) {
  const isRecorded = row.value !== null;

  return (
    <tr className={isRecorded ? undefined : 'is-missing'}>
      <th scope="row">{row.label}</th>
      <td data-label="Value">
        {isRecorded ? (
          <>
            <span className="report-num">
              {row.value} {row.unit}
            </span>
            {row.uncertainty !== null && (
              <span className="report-uncertainty">
                ± {row.uncertainty} {row.unit}
              </span>
            )}
          </>
        ) : (
          '—'
        )}
      </td>
      <td data-label="Source">
        <StatusBadge variant={SOURCE_BADGE[row.source]}>{row.sourceLabel}</StatusBadge>
      </td>
      <td data-label="Ease">
        {isRecorded ? (row.adjustment !== 0 ? formatAdjustment(row.adjustment, row.unit) : 'None') : '—'}
      </td>
      <td data-label="Target">
        {isRecorded ? (
          <span className="report-num">
            {row.target} {row.unit}
          </span>
        ) : (
          '—'
        )}
      </td>
    </tr>
  );
}
