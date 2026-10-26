import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import UnitToggle from '../../../shared/measurements/UnitToggle';
import { MANUAL_MEASUREMENT_FIELDS, MEASUREMENT_CATEGORIES } from '../../../shared/data/measurementData';
import { formatUncertainty } from '../../../shared/measurements/estimates';
import { useManualMeasurementForm } from '../hooks/useManualMeasurementForm';
import MeasurementFieldInput from './MeasurementFieldInput';

/**
 * Tape-measurement entry, grouped by body area. Values are validated against each
 * field's range in the chosen unit and written to the shared measurement workspace.
 */
export default function ManualMeasurementForm({ onSubmitted, onCancel }) {
  const form = useManualMeasurementForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.submit()) onSubmitted();
  };

  const cameraNote = (id) =>
    form.fieldStatus[id] === 'camera_estimate'
      ? `Camera estimate ${formatUncertainty(form.uncertainty[id], form.unit) ?? ''}`.trim()
      : null;

  return (
    <form className="manual-form" onSubmit={handleSubmit} noValidate aria-label="Manual measurements">
      <div className="manual-toolbar">
        <UnitToggle unit={form.unit} onChange={form.changeUnit} label="Unit" showLabel />
        <p className="manual-tip">Keep the tape snug but not tight, and stand naturally.</p>
      </div>

      {form.errors.form && (
        <p className="measure-alert is-danger" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{form.errors.form}</span>
        </p>
      )}

      <div className="manual-groups">
        {MEASUREMENT_CATEGORIES.map((category) => (
          <fieldset key={category} className="card measure-card manual-group">
            <legend className="manual-group-title">{category}</legend>
            <div className="manual-fields">
              {MANUAL_MEASUREMENT_FIELDS.filter((f) => f.category === category).map((field) => (
                <MeasurementFieldInput
                  key={field.id}
                  field={field}
                  value={form.drafts[field.id]}
                  unit={form.unit}
                  error={form.errors[field.id]}
                  note={cameraNote(field.id)}
                  onChange={(raw) => form.changeField(field.id, raw)}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="measure-actions">
        <div className="measure-actions-secondary">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="ghost" icon={RotateCcw} onClick={form.clearAll}>
            Clear all
          </Button>
        </div>
        <Button type="submit" size="lg" icon={ArrowRight} iconPosition="right">
          Save and review
        </Button>
      </div>
    </form>
  );
}
