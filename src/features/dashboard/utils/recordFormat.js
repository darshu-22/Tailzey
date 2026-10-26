import { getColorById, getGarmentById } from '../../../shared/data/designerData';
import { fieldsFor } from '../../../shared/measurements/measurementFields';

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

/** How many of the body measurements that apply to a saved profile have a value. */
export function countRecorded(values = {}) {
  const fields = fieldsFor({ values });
  const recorded = fields.filter((f) => values[f.id] !== null && values[f.id] !== undefined).length;
  return { recorded, total: fields.length };
}

/** A profile counts as camera-based once any capture has been analysed. */
export function isCameraProfile(profile) {
  return Boolean(profile.isCameraCompleted || profile.cameraCaptureCount > 0);
}
