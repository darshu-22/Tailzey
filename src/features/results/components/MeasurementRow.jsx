import React, { useState } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { convertValue, isMissing } from '../../../shared/utils/units';
import AdjustmentControl from './AdjustmentControl';
import MeasurementEditForm from './MeasurementEditForm';
import MeasurementStatusBadge from './MeasurementStatusBadge';
import { withAdjustment } from '../lib/studioMath';

/**
 * One measurement as a compact row: name · value · source (± for camera) · ease · garment
 * value · edit. Editing swaps the value cells for an inline form. `estimate` is the camera
 * result (cm) for this field, used to show what the camera measured after an override.
 */
export default function MeasurementRow({
  field,
  value,
  unit,
  status,
  uncertaintyCm,
  estimate,
  adjustment = 0,
  serverError,
  onSave,
  onAdjustmentChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const hasValue = !isMissing(value);
  const cameraValue = isMissing(estimate?.value) ? null : convertValue(estimate.value, 'cm', unit);
  const overrodeCamera = status === 'user_entered' && cameraValue !== null && cameraValue !== value;
  const action = hasValue ? 'Edit' : 'Add';

  const handleSave = (next) => {
    onSave(field.id, next);
    setIsEditing(false);
  };

  return (
    <li className={`metric-row ${hasValue ? '' : 'is-empty'} ${isEditing ? 'is-editing' : ''}`.trim()}>
      <h3 className="metric-name" title={field.description}>
        {field.label}
      </h3>

      {isEditing ? (
        <MeasurementEditForm
          field={field}
          currentValue={value}
          unit={unit}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : hasValue ? (
        <>
          <p className="metric-value">
            {value} <span className="metric-unit">{unit}</span>
          </p>
          <div className="metric-source">
            <MeasurementStatusBadge
              hasValue
              status={status}
              uncertaintyCm={uncertaintyCm}
              confidence={estimate?.confidence}
              unit={unit}
            />
          </div>
          <AdjustmentControl field={field} adjustment={adjustment} unit={unit} onAdjustmentChange={onAdjustmentChange} />
          {adjustment > 0 ? (
            <p className="metric-garment">
              <span className="metric-garment-label">Garment measurement: </span>
              {withAdjustment(value, adjustment)} {unit}
            </p>
          ) : (
            <p className="metric-garment is-none">
              <span aria-hidden="true">—</span>
              <span className="sr-only">No extra room added</span>
            </p>
          )}
        </>
      ) : (
        <p className="metric-missing">
          <MeasurementStatusBadge hasValue={false} />
          {estimate?.reason && <span className="metric-muted">{estimate.reason}</span>}
        </p>
      )}

      {!isEditing && (
        <button
          type="button"
          className="metric-edit-btn"
          onClick={() => setIsEditing(true)}
          aria-label={`${action} ${field.label}`}
          title={`${action} ${field.label}`}
        >
          {hasValue ? <Edit2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        </button>
      )}

      {(overrodeCamera && !isEditing) || serverError ? (
        <div className="metric-notes">
          {overrodeCamera && !isEditing && (
            <p className="metric-note">
              Camera estimate was {cameraValue} {unit}
            </p>
          )}
          {serverError && (
            <p className="form-error-text" role="alert">
              {serverError}
            </p>
          )}
        </div>
      ) : null}
    </li>
  );
}
