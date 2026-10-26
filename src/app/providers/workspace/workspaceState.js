import { convertValue, convertValues, isMissing } from '../../../shared/utils/units';

/**
 * Shape of the in-progress (unsaved) work the user is editing.
 * Saved copies live on the backend; `designId` / `profileId` link the buffer to them.
 */
export const INITIAL_DESIGN = Object.freeze({
  designId: null,
  name: 'Untitled design',
  garmentId: 'jacket',
  colorId: 'black',
  styleId: 'classic',
  fitId: 'regular',
  customOptions: {},
});

export const INITIAL_MEASUREMENT = Object.freeze({
  profileId: null,
  profileName: 'My measurements',
  unit: 'cm',
  values: {}, // { height, neck, shoulderWidth, chest, underbust, waist, hip, armLength, legLength } in `unit`
  includeBust: false, // opt-in bust & cup sizing (adds underbust)
  fieldStatus: {}, // key -> 'user_entered' | 'camera_estimate' | 'not_recorded'
  uncertainty: {}, // key -> ± cm, only for camera estimates
  cameraCaptureCount: 0,
  isCameraCompleted: false,
  skippedCount: 0,
  selectedSize: 'M',
  selectedSizeType: 'letter',
  fitPreference: 'regular',
  adjustments: {},
  analysis: null, // last camera analysis summary { warnings, views, model, disclaimer }
});

// ---------- reducers (pure) ----------

export function setMeasurementValue(state, key, value) {
  const missing = isMissing(value);
  const { [key]: _dropped, ...uncertainty } = state.uncertainty;
  return {
    ...state,
    values: { ...state.values, [key]: missing ? null : Number(value) },
    fieldStatus: { ...state.fieldStatus, [key]: missing ? 'not_recorded' : 'user_entered' },
    uncertainty,
  };
}

/** Turn bust & cup sizing on or off. Turning it off forgets the underbust entirely. */
export function setBustSizing(state, on) {
  if (on) return { ...state, includeBust: true };
  const drop = ({ underbust: _dropped, ...rest } = {}) => rest;
  return {
    ...state,
    includeBust: false,
    values: drop(state.values),
    fieldStatus: drop(state.fieldStatus),
    uncertainty: drop(state.uncertainty),
    adjustments: drop(state.adjustments),
  };
}

export function changeUnit(state, unit) {
  if (unit === state.unit) return state;
  return {
    ...state,
    unit,
    values: convertValues(state.values, state.unit, unit),
    adjustments: convertValues(state.adjustments, state.unit, unit),
  };
}

/** Merge a backend analysis (always cm) into the measurement buffer. */
export function applyAnalysis(state, analysis, { captureCount = 0 } = {}) {
  const values = { ...state.values };
  const fieldStatus = { ...state.fieldStatus };
  const uncertainty = {};
  for (const [key, m] of Object.entries(analysis.measurements)) {
    if (m.value === null) {
      if (isMissing(values[key])) fieldStatus[key] = 'not_recorded';
      continue;
    }
    values[key] = convertValue(m.value, 'cm', state.unit);
    fieldStatus[key] = m.source;
    if (m.uncertainty !== null) uncertainty[key] = m.uncertainty;
  }
  return {
    ...state,
    values,
    fieldStatus,
    uncertainty,
    cameraCaptureCount: captureCount,
    isCameraCompleted: true,
    analysis: {
      warnings: analysis.warnings,
      views: analysis.views,
      model: analysis.model,
      disclaimer: analysis.disclaimer,
      measurements: analysis.measurements,
    },
  };
}

// ---------- API mappers ----------

export function designToPayload(design) {
  const { designId: _id, ...payload } = design;
  return payload;
}

export function designFromRecord(record) {
  return {
    designId: record.id,
    name: record.name,
    garmentId: record.garmentId,
    colorId: record.colorId,
    styleId: record.styleId,
    fitId: record.fitId,
    customOptions: record.customOptions || {},
  };
}

export function profileToPayload(m) {
  return {
    profileName: m.profileName,
    unit: m.unit,
    values: m.values,
    fieldStatus: m.fieldStatus,
    fitPreference: m.fitPreference,
    selectedSize: m.selectedSize,
    selectedSizeType: m.selectedSizeType,
    adjustments: m.adjustments,
    cameraCaptureCount: m.cameraCaptureCount,
    isCameraCompleted: m.isCameraCompleted,
  };
}

export function profileFromRecord(record) {
  return {
    ...INITIAL_MEASUREMENT,
    profileId: record.id,
    profileName: record.profileName,
    unit: record.unit,
    values: record.values || {},
    includeBust: !isMissing(record.values?.underbust),
    fieldStatus: record.fieldStatus || {},
    fitPreference: record.fitPreference || INITIAL_MEASUREMENT.fitPreference,
    selectedSize: record.selectedSize || INITIAL_MEASUREMENT.selectedSize,
    selectedSizeType: record.selectedSizeType || INITIAL_MEASUREMENT.selectedSizeType,
    adjustments: record.adjustments || {},
    cameraCaptureCount: record.cameraCaptureCount || 0,
    isCameraCompleted: Boolean(record.isCameraCompleted),
  };
}

// ---------- design status ----------

/** Stable fingerprint of the user-editable parts of a design. */
export function designSignature(design) {
  const options = design.customOptions || {};
  const sorted = Object.fromEntries(Object.keys(options).sort().map((k) => [k, options[k]]));
  return JSON.stringify([design.name, design.garmentId, design.colorId, design.styleId, design.fitId, sorted]);
}

/** 'new' (never saved) | 'saved' (matches the server copy) | 'dirty' (unsaved edits). */
export function designSaveStatus(design, savedSignature) {
  if (!design.designId) return 'new';
  return designSignature(design) === savedSignature ? 'saved' : 'dirty';
}

/** True while the design is still the untouched starting point. */
export function isDesignEmpty(design) {
  return !design.designId && designSignature(design) === designSignature(INITIAL_DESIGN);
}
