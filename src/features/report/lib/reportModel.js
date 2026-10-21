import { isDesignEmpty } from '../../../app/providers/workspace/workspaceState';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { convertValue, isMissing } from '../../../shared/utils/units';

/**
 * Pure view-model builders for the design report. Nothing here invents data:
 * missing measurements stay missing and are labelled "Not recorded".
 */

const SOURCE_LABELS = {
  camera_estimate: 'Camera estimate',
  user_entered: 'Entered by you',
  not_recorded: 'Not recorded',
};

const round1 = (n) => Math.round(n * 10) / 10;

/** Source of one measurement, falling back sensibly when fieldStatus is absent. */
function sourceOf(measurement, key) {
  if (isMissing(measurement.values?.[key])) return 'not_recorded';
  const status = measurement.fieldStatus?.[key];
  return status === 'camera_estimate' ? 'camera_estimate' : 'user_entered';
}

/**
 * One row per tracked measurement.
 * value / adjustment / target are in `measurement.unit`; uncertainty (± cm from the
 * backend) is converted to the same unit for camera estimates.
 */
export function buildMeasurementRows(measurement) {
  const { unit } = measurement;
  return MANUAL_MEASUREMENT_FIELDS.map((field) => {
    const source = sourceOf(measurement, field.id);
    const value = source === 'not_recorded' ? null : Number(measurement.values[field.id]);
    const adjustment = Number(measurement.adjustments?.[field.id]) || 0;
    const rawUncertainty = measurement.uncertainty?.[field.id];
    const uncertainty =
      source === 'camera_estimate' && !isMissing(rawUncertainty) ? convertValue(rawUncertainty, 'cm', unit) : null;

    return {
      id: field.id,
      label: field.label,
      description: field.description,
      category: field.category,
      source,
      sourceLabel: SOURCE_LABELS[source],
      value,
      uncertainty,
      adjustment,
      target: value === null ? null : round1(value + adjustment),
      unit,
    };
  });
}

export function summarizeMeasurements(rows) {
  return {
    recorded: rows.filter((r) => r.source !== 'not_recorded').length,
    total: rows.length,
    cameraEstimates: rows.filter((r) => r.source === 'camera_estimate').length,
    adjusted: rows.filter((r) => r.value !== null && r.adjustment !== 0).length,
  };
}

/** True once the user has changed anything from the blank starting design (or saved one). */
export function hasDesignContent(design) {
  return !isDesignEmpty(design);
}

/** Report reference: derived from the saved design id, otherwise marked as a draft. */
export function reportReference(design) {
  return design.designId ? `TLZ-${String(design.designId).slice(0, 8).toUpperCase()}` : 'Draft';
}

/** Design save status (workspace `designStatus`) as shown on the report. */
export const STATUS_LABELS = {
  saved: 'Saved',
  dirty: 'Unsaved changes',
  new: 'Not saved yet',
};

/** Signed ease allowance, e.g. "+2 cm" or "−1.5 in". */
export const formatAdjustment = (n, unit) => `${n < 0 ? '−' : '+'}${Math.abs(n)} ${unit}`;

export function formatToday() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
