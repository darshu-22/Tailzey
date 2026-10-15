import { MANUAL_MEASUREMENT_FIELDS } from '../data/measurementData';

/** Measurement field definitions keyed by id ('height', 'chest', ...). */
export const FIELDS_BY_ID = Object.fromEntries(MANUAL_MEASUREMENT_FIELDS.map((f) => [f.id, f]));

/** Valid { min, max } for a field in the given unit. */
export function getFieldRange(field, unit) {
  return unit === 'in' ? { min: field.minIn, max: field.maxIn } : { min: field.minCm, max: field.maxCm };
}

/**
 * Validate a raw input value against the field's range in `unit`.
 * Returns an error message, or null when valid. Empty input is valid unless `required`.
 */
export function validateFieldInput(field, raw, unit, { required = false } = {}) {
  const text = String(raw ?? '').trim();
  if (!text) return required ? `Please enter your ${field.label.toLowerCase()}.` : null;
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) return `${field.label} must be a positive number.`;
  const { min, max } = getFieldRange(field, unit);
  if (value < min || value > max) return `Expected a value between ${min} and ${max} ${unit}.`;
  return null;
}

/** Input-friendly string for a stored value (null → ''). */
export function toInputValue(value) {
  return value === null || value === undefined ? '' : String(value);
}
