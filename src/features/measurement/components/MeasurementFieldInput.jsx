import React from 'react';
import { getFieldRange } from '../../../shared/measurements/measurementFields';

/**
 * One labelled numeric measurement input with a unit suffix, the valid range beside the
 * label, an optional note (e.g. the camera estimate's ± range) and an inline error.
 */
export default function MeasurementFieldInput({ field, value, unit, error, note, required = false, onChange }) {
  const inputId = `field-${field.id}`;
  const hintId = `hint-${field.id}`;
  const noteId = `note-${field.id}`;
  const errorId = `error-${field.id}`;
  const { min, max } = getFieldRange(field, unit);
  const describedBy = [error && errorId, hintId, note && noteId].filter(Boolean).join(' ');

  return (
    <div className="form-group measure-field">
      <div className="measure-field-head">
        <label htmlFor={inputId} className="form-label">
          {field.label}
          {required && <span className="measure-field-required"> (required)</span>}
        </label>
        <span id={hintId} className="form-hint measure-field-range">
          {min}–{max} {unit}
        </span>
      </div>
      <span className="measure-field-desc">{field.description}</span>

      <div className="measure-field-control">
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
          className="form-input measure-field-input"
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <span className="measure-field-unit" aria-hidden="true">
          {unit}
        </span>
      </div>

      {error && (
        <p id={errorId} className="form-error-text" role="alert">
          {error}
        </p>
      )}
      {note && (
        <span id={noteId} className="form-hint">
          {note}
        </span>
      )}
    </div>
  );
}
