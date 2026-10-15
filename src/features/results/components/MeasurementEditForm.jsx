import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { toInputValue, validateFieldInput } from '../../../shared/measurements/measurementFields';

/** Inline editor for one measurement, validated against the field's range in `unit`. */
export default function MeasurementEditForm({ field, currentValue, unit, onSave, onCancel }) {
  const [value, setValue] = useState(() => toInputValue(currentValue));
  const [error, setError] = useState(null);

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
    <form className="measurement-edit-form" onSubmit={handleSave} noValidate>
      <div className="edit-form-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          className={`measurement-inline-input ${error ? 'has-error' : ''}`}
          placeholder={field.placeholder}
          autoFocus
          aria-label={`Edit ${field.label}`}
          aria-invalid={Boolean(error)}
        />
        <span className="edit-form-unit">{unit}</span>
      </div>

      {error && (
        <p className="edit-form-error" role="alert">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}

      <div className="edit-form-actions">
        <Button type="submit" variant="primary" size="sm" icon={Check}>
          Save
        </Button>
        <Button variant="ghost" size="sm" icon={X} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
