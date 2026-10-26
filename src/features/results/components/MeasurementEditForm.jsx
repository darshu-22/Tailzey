import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { getFieldRange, toInputValue, validateFieldInput } from '../../../shared/measurements/measurementFields';

/** Inline editor for one measurement row, validated against the field's range in `unit`. */
export default function MeasurementEditForm({ field, currentValue, unit, onSave, onCancel }) {
  const [value, setValue] = useState(() => toInputValue(currentValue));
  const [error, setError] = useState(null);
  const { min, max } = getFieldRange(field, unit);
  const inputId = `edit-${field.id}`;

  const handleSave = (e) => {
    e.preventDefault();
    const message = validateFieldInput(field, value, unit, { required: true });
    if (message) {
      setError(message);
      return;
    }
    onSave(Number(value));
  };

  return (
    <form className="metric-edit" onSubmit={handleSave} noValidate>
      <label htmlFor={inputId} className="sr-only">
        {field.label} in {unit}
      </label>
      <div className="metric-edit-control">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          step="0.1"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          className="form-input metric-edit-input"
          placeholder={field.placeholder}
          autoFocus
          aria-invalid={Boolean(error)}
          aria-describedby={`${inputId}-hint`}
        />
        <span className="metric-edit-unit" aria-hidden="true">
          {unit}
        </span>
      </div>
      <div className="metric-edit-actions">
        <Button type="submit" size="sm" icon={Check}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {error ? (
        <p id={`${inputId}-hint`} className="form-error-text metric-edit-hint" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${inputId}-hint`} className="form-hint metric-edit-hint">
          {min}–{max} {unit}
        </p>
      )}
    </form>
  );
}
