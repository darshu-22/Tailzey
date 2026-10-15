import React from 'react';
import { AlertCircle, Camera, CheckCircle2 } from 'lucide-react';
import { formatAdjustment } from '../lib/reportModel';

const SOURCE_STYLE = {
  camera_estimate: { className: 'report-status-camera', Icon: Camera },
  user_entered: { className: 'report-status-entered', Icon: CheckCircle2 },
  not_recorded: { className: 'report-status-empty', Icon: AlertCircle },
};

const Dash = () => <span className="report-cell-empty">—</span>;

/** One measurement line of the report table (see buildMeasurementRows). */
export default function MeasurementRow({ row }) {
  const { className, Icon } = SOURCE_STYLE[row.source];
  const isRecorded = row.value !== null;

  return (
    <tr>
      <td>
        <div className="report-metric-name">{row.label}</div>
        <div className="report-metric-desc">{row.description}</div>
      </td>
      <td>
        <span className="report-cell-muted">{row.category}</span>
      </td>
      <td>
        <span className={`report-status-badge ${className}`}>
          <Icon size={11} aria-hidden="true" />
          <span>{row.sourceLabel}</span>
        </span>
      </td>
      <td>
        {isRecorded ? (
          <>
            <strong>
              {row.value} {row.unit}
            </strong>
            {row.uncertainty !== null && (
              <span className="report-uncertainty">
                ± {row.uncertainty} {row.unit}
              </span>
            )}
          </>
        ) : (
          <Dash />
        )}
      </td>
      <td>
        {!isRecorded && <Dash />}
        {isRecorded && row.adjustment !== 0 && (
          <span className="report-cell-gold">{formatAdjustment(row.adjustment, row.unit)}</span>
        )}
        {isRecorded && row.adjustment === 0 && <span className="report-cell-muted">+0 (Standard)</span>}
      </td>
      <td>
        {isRecorded ? (
          <strong className="report-cell-gold">
            {row.target} {row.unit}
          </strong>
        ) : (
          <span className="report-cell-empty">Not recorded</span>
        )}
      </td>
    </tr>
  );
}
