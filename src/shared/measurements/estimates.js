import { convertValue, isMissing } from '../utils/units';

/** Labels for the per-field `fieldStatus` the workspace keeps. */
export const FIELD_STATUS_LABELS = {
  user_entered: 'Entered by you',
  camera_estimate: 'Camera estimate',
  not_recorded: 'Not recorded',
};

export const CONFIDENCE_LABELS = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
};

/** "± 1.2 cm" for a ± cm uncertainty shown in `unit`, or null. */
export function formatUncertainty(uncertaintyCm, unit) {
  if (isMissing(uncertaintyCm)) return null;
  return `± ${convertValue(uncertaintyCm, 'cm', unit)} ${unit}`;
}

/** Per-field camera estimate details from the last analysis (cm), or null. */
export function getEstimate(analysis, key) {
  return analysis?.measurements?.[key] ?? null;
}
