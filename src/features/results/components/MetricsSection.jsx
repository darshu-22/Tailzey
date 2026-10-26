import React from 'react';
import { Camera } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import MeasurementRow from './MeasurementRow';

/** Dense list of every measurement (one row each), all read from the workspace measurement. */
export default function MetricsSection({ measurement, counts, valueErrors, onSave, onAdjustmentChange, onMeasure }) {
  const { values, unit, fieldStatus, uncertainty, adjustments, analysis } = measurement;
  const isEmpty = counts.entered + counts.estimated === 0;

  return (
    <section className="card fit-panel" aria-labelledby="metrics-title">
      <div className="fit-panel-head">
        <h2 id="metrics-title" className="fit-section-title">
          Measurements
        </h2>
        <ul className="profile-counts" aria-label="Measurement sources">
          <li>
            <StatusBadge variant={counts.entered ? 'gold' : 'neutral'}>{counts.entered} entered</StatusBadge>
          </li>
          <li>
            <StatusBadge variant={counts.estimated ? 'info' : 'neutral'}>{counts.estimated} camera</StatusBadge>
          </li>
          {counts.missing > 0 && (
            <li>
              <StatusBadge variant="bronze">{counts.missing} not recorded</StatusBadge>
            </li>
          )}
        </ul>
      </div>
      <p className="fit-section-text">Edit any value. Ease adds room to the garment only; your body measurement stays the same.</p>

      {isEmpty && (
        <div className="fit-alert is-info fit-empty">
          <p>No measurements yet. Measure with the camera, or add values below.</p>
          <Button variant="outline" size="sm" icon={Camera} onClick={onMeasure}>
            Measure me
          </Button>
        </div>
      )}

      <ul className="metric-list">
        <li className="metric-list-head" aria-hidden="true">
          <span>Measurement</span>
          <span>Value</span>
          <span>Source</span>
          <span>Ease ({unit})</span>
          <span>Garment</span>
        </li>
        {MANUAL_MEASUREMENT_FIELDS.map((field) => (
          <MeasurementRow
            key={field.id}
            field={field}
            value={values[field.id]}
            unit={unit}
            status={fieldStatus[field.id]}
            uncertaintyCm={uncertainty[field.id]}
            estimate={analysis?.measurements?.[field.id]}
            adjustment={adjustments[field.id] || 0}
            serverError={valueErrors[field.id]}
            onSave={onSave}
            onAdjustmentChange={onAdjustmentChange}
          />
        ))}
      </ul>
    </section>
  );
}
