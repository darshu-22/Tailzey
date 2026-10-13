import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

/**
 * MeasurementEditForm Component
 * Inline editing form for an individual measurement card.
 * Validates positive numeric entry with field-level limits.
 */
export default function MeasurementEditForm({
  field,
  currentValue,
  unit = 'cm',
  onSave,
  onCancel,
}) {
  const [value, setValue] = useState(currentValue || '');
  const [error, setError] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();

    if (!value || value.trim() === '') {
      setError('Value cannot be empty. Please enter a valid number.');
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a positive numeric value.');
      return;
    }

    const min = unit === 'cm' ? field.minCm : field.minIn;
    const max = unit === 'cm' ? field.maxCm : field.maxIn;

    if (num < min || num > max) {
      setError(`Expected range between ${min} and ${max} ${unit}.`);
      return;
    }

    setError(null);
    onSave(value);
  };

  return (
    <form className="measurement-edit-form" onSubmit={handleSave} noValidate>
      <div className="edit-form-input-wrap">
        <input
          type="number"
          step="0.1"
          min="0"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          className={`measurement-inline-input ${error ? 'has-error' : ''}`}
          placeholder={field.placeholder}
          autoFocus
          aria-label={`Edit ${field.label}`}
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
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={Check}
          ariaLabel="Save measurement"
        >
          Save
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onCancel}
          ariaLabel="Cancel editing"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
