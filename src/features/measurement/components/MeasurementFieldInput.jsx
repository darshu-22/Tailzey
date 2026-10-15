import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getFieldRange } from '../../../shared/measurements/measurementFields';

/** One labelled numeric measurement input with unit badge, range hint and inline error. */
export default function MeasurementFieldInput({ field, value, unit, error, note, required = false, onChange }) {
  const inputId = `field-${field.id}`;
  const { min, max } = getFieldRange(field, unit);
  const describedBy = error ? `error-${field.id}` : `hint-${field.id}`;

  return (
    <div className={`measurement-field-card ${error ? 'has-error' : ''}`}>
      <label htmlFor={inputId} className="field-label">
        {field.label}
        {required && <span className="field-required-mark"> *</span>}
      </label>
      <span className="field-desc">{field.description}</span>

      <div className="field-input-wrap">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          step="0.1"
          min={min}
          max={max}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="measurement-number-input"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <span className="field-unit-badge">{unit}</span>
      </div>

      {error ? (
        <p id={`error-${field.id}`} className="field-error-text" role="alert">
          <AlertCircle size={13} />
          <span>{error}</span>
        </p>
      ) : (
        <span id={`hint-${field.id}`} className="field-range-hint">
          {note ? `${note} · ` : ''}Range {min}–{max} {unit}
        </span>
      )}
    </div>
  );
}
