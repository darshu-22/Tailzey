import React, { useState } from 'react';
import { Edit2, Plus, Info, Check } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import AdjustmentControl from './AdjustmentControl';
import MeasurementEditForm from './MeasurementEditForm';

/**
 * MeasurementResultCard Component
 * Displays individual measurement cards with value, unit, source badge,
 * edit controls, empty states, and tailoring ease adjustment controls.
 */
export default function MeasurementResultCard({
  field,
  value,
  originalValue,
  unit = 'cm',
  adjustment = 0,
  onSaveMeasurement,
  onAdjustmentChange,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);

  const hasValue = value !== null && value !== undefined && value !== '' && !isNaN(value);
  const wasEdited = hasValue && originalValue !== undefined && originalValue !== null && originalValue !== value;

  const handleSave = (newValue) => {
    onSaveMeasurement(field.id, newValue);
    setIsEditing(false);
  };

  return (
    <div
      className={`measurement-result-card ${!hasValue ? 'is-empty' : ''} ${className}`.trim()}
      role="region"
      aria-label={`${field.label} measurement card`}
    >
      {/* Top Header Row */}
      <div className="card-top-header">
        <div>
          <span className="card-category-tag">{field.category}</span>
          <h3 className="card-field-title">{field.label}</h3>
        </div>

        {/* Source Status Indicator */}
        <div className="card-source-badge-wrap">
          {hasValue ? (
            <StatusBadge variant="gold" dot>
              {wasEdited ? 'Manually Edited' : 'Manually Entered'}
            </StatusBadge>
          ) : (
            <StatusBadge variant="neutral">
              Not Available
            </StatusBadge>
          )}
        </div>
      </div>

      <p className="card-anatomical-desc">{field.description}</p>

      {/* Main Value Display or Inline Edit Form */}
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

            <button
              type="button"
              className="card-edit-btn"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${field.label}`}
              title={`Edit ${field.label}`}
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
          </div>
        ) : (
          <div className="card-empty-state-block">
            <span className="card-empty-text">No measurement recorded</span>
            <button
              type="button"
              className="card-add-measurement-btn"
              onClick={() => setIsEditing(true)}
              aria-label={`Enter ${field.label}`}
            >
              <Plus size={14} />
              <span>Enter Value</span>
            </button>
          </div>
        )}

        {/* Subtext if value was edited */}
        {wasEdited && !isEditing && (
          <span className="card-edited-subtext">
            Originally recorded: {originalValue} {unit}
          </span>
        )}
      </div>

      {/* Adjustment Control (+0, +1, +2) - Only available if measurement exists */}
      {hasValue && !isEditing && (
        <div className="card-adjustment-section">
          <AdjustmentControl
            fieldId={field.id}
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
