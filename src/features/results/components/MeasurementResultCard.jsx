import React, { useState } from 'react';
import { Edit2, Plus, AlertCircle } from 'lucide-react';
import { convertValue, isMissing } from '../../../shared/utils/units';
import AdjustmentControl from './AdjustmentControl';
import MeasurementEditForm from './MeasurementEditForm';
import MeasurementStatusBadge from './MeasurementStatusBadge';

/**
 * One measurement: value and source badge, inline editing, server validation error,
 * and the optional tailoring ease control. `estimate` is the camera result (cm) for
 * this field, used to show what the camera measured after the user overrides it.
 */
export default function MeasurementResultCard({
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

  const handleSave = (next) => {
    onSave(field.id, next);
    setIsEditing(false);
  };

  return (
    <div className={`measurement-result-card ${hasValue ? '' : 'is-empty'}`.trim()} role="region" aria-label={`${field.label} measurement`}>
      <div className="card-top-header">
        <div>
          <span className="card-category-tag">{field.category}</span>
          <h3 className="card-field-title">{field.label}</h3>
        </div>
        <div className="card-source-badge-wrap">
          <MeasurementStatusBadge
            hasValue={hasValue}
            status={status}
            uncertaintyCm={uncertaintyCm}
            confidence={estimate?.confidence}
            unit={unit}
          />
        </div>
      </div>

      <p className="card-anatomical-desc">{field.description}</p>

      <div className="card-body-section">
        {isEditing ? (
          <MeasurementEditForm
            field={field}
            currentValue={value}
            unit={unit}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : hasValue ? (
          <div className="card-value-display-row">
            <div className="card-metric-block">
              <span className="card-number-val">{value}</span>
              <span className="card-unit-label">{unit}</span>
            </div>
            <button type="button" className="card-edit-btn" onClick={() => setIsEditing(true)} aria-label={`Edit ${field.label}`}>
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          </div>
        ) : (
          <div className="card-empty-state-block">
            <span className="card-empty-text">{estimate?.reason || 'No measurement recorded'}</span>
            <button type="button" className="card-add-measurement-btn" onClick={() => setIsEditing(true)} aria-label={`Enter ${field.label}`}>
              <Plus size={14} />
              <span>Enter Value</span>
            </button>
          </div>
        )}

        {overrodeCamera && !isEditing && (
          <span className="card-edited-subtext">
            Camera estimate was {cameraValue} {unit}
          </span>
        )}

        {serverError && (
          <p className="edit-form-error" role="alert">
            <AlertCircle size={12} />
            <span>{serverError}</span>
          </p>
        )}
      </div>

      {hasValue && !isEditing && (
        <div className="card-adjustment-section">
          <AdjustmentControl
            field={field}
            baseValue={value}
            adjustment={adjustment}
            unit={unit}
            onAdjustmentChange={onAdjustmentChange}
          />
        </div>
      )}
    </div>
  );
}
