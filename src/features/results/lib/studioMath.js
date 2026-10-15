import { isMissing } from '../../../shared/utils/units';
import { GARMENT_CATEGORIES } from '../../../shared/data/resultsData';

/** Base value plus tailoring ease, rounded to 1 decimal; null when there is no base value. */
export function withAdjustment(value, adjustment = 0) {
  if (isMissing(value)) return null;
  return Math.round((Number(value) + Number(adjustment || 0)) * 10) / 10;
}

/** Size-chart category for a designer garment id (falls back to the first category). */
export function categoryForGarment(garmentId) {
  return GARMENT_CATEGORIES.some((c) => c.id === garmentId) ? garmentId : GARMENT_CATEGORIES[0].id;
}

/** Count fields by where their value came from. */
export function countSources(fields, values, fieldStatus) {
  const counts = { entered: 0, estimated: 0, missing: 0 };
  for (const field of fields) {
    if (isMissing(values[field.id])) counts.missing += 1;
    else if (fieldStatus[field.id] === 'camera_estimate') counts.estimated += 1;
    else counts.entered += 1;
  }
  return counts;
}
