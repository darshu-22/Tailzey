import { FIELDS_BY_ID } from '../../../shared/measurements/measurementFields';
import { convertValue, isMissing } from '../../../shared/utils/units';

/**
 * Turn the workspace measurement into the centimetre values the mannequin is built from.
 * Missing values fall back to typical proportions of the height (or of a default height),
 * and every fallback is flagged so the page can say it was estimated.
 */

export const DEFAULT_HEIGHT_CM = 170;

/** Fields that shape the mannequin, in display order, with their typical ratio to height. */
export const BODY_FIELDS = [
  { id: 'height', label: 'Height', ratio: null },
  { id: 'shoulderWidth', label: 'Shoulders', ratio: 0.259 },
  { id: 'chest', label: 'Chest', ratio: 0.56 },
  { id: 'waist', label: 'Waist', ratio: 0.48 },
  { id: 'hip', label: 'Hip', ratio: 0.57 },
  { id: 'armLength', label: 'Arm length', ratio: 0.355 },
  { id: 'legLength', label: 'Inseam', ratio: 0.45 },
  { id: 'neck', label: 'Neck', ratio: 0.22 },
];

const clampToField = (id, cm) => {
  const field = FIELDS_BY_ID[id];
  if (!field) return cm;
  return Math.min(field.maxCm, Math.max(field.minCm, cm));
};

/**
 * @returns {{ cm: Record<string, number>, estimated: Record<string, boolean>, heightKnown: boolean }}
 */
export function resolveBodyProfile(measurement) {
  const unit = measurement?.unit || 'cm';
  const values = measurement?.values || {};
  const toCm = (id) => (isMissing(values[id]) ? null : convertValue(values[id], unit, 'cm'));

  const measuredHeight = toCm('height');
  const height = clampToField('height', measuredHeight ?? DEFAULT_HEIGHT_CM);
  const cm = { height };
  const estimated = { height: measuredHeight === null };

  for (const { id, ratio } of BODY_FIELDS) {
    if (id === 'height') continue;
    const measured = toCm(id);
    estimated[id] = measured === null;
    cm[id] = clampToField(id, measured ?? height * ratio);
  }
  return { cm, estimated, heightKnown: measuredHeight !== null };
}

/** Half-width `a` of an ellipse with perimeter `p` and depth/width ratio `r` (Ramanujan I). */
export function ellipseHalfWidth(perimeter, ratio) {
  const k = 3 * (1 + ratio) - Math.sqrt((3 + ratio) * (1 + 3 * ratio));
  return perimeter / (Math.PI * k);
}

/** A circumference (cm) as ellipse half-axes in metres: { a: half-width, b: half-depth }. */
export function circumferenceToAxes(circumferenceCm, depthRatio) {
  const a = ellipseHalfWidth(circumferenceCm / 100, depthRatio);
  return { a, b: a * depthRatio };
}
