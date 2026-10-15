import { getColorById, getGarmentById } from '../../../shared/data/designerData';

const MEASUREMENT_KEYS = ['height', 'neck', 'shoulderWidth', 'chest', 'waist', 'hip', 'armLength', 'legLength'];

const dateFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/** "14 Oct 2026" from an ISO timestamp; empty string if missing/invalid. */
export function formatDate(iso) {
  const date = iso ? new Date(iso) : null;
  return date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : '';
}

/** Display names for a saved design's garment and colour. */
export function describeDesign(design) {
  return {
    garment: getGarmentById(design.garmentId).name,
    color: getColorById(design.colorId).name,
  };
}

/** How many of the eight body measurements a saved profile has a value for. */
export function countRecorded(values = {}) {
  const recorded = MEASUREMENT_KEYS.filter((key) => values[key] !== null && values[key] !== undefined).length;
  return { recorded, total: MEASUREMENT_KEYS.length };
}

/** A profile counts as camera-based once any capture has been analysed. */
export function isCameraProfile(profile) {
  return Boolean(profile.isCameraCompleted || profile.cameraCaptureCount > 0);
}

/** First letters of up to two words, for the avatar circle. */
export function initialsOf(name = '') {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
  return letters || 'TZ';
}
