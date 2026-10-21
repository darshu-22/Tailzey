import { getGarmentById } from '../data/designerData';

/**
 * Pure helpers for a design's garment-specific ("custom") options.
 * The backend only accepts keys from the garment's `customControls`, each set to
 * one of that control's option ids, so everything here is derived from the catalog.
 */

/** The garment's default custom options, restricted to keys the backend accepts. */
export function defaultCustomOptions(garmentId) {
  const garment = getGarmentById(garmentId);
  return Object.fromEntries(
    Object.keys(garment.customControls || {}).map((key) => [key, garment.defaultOptions[key]])
  );
}

/** Garment defaults for every editable field (used by "Reset"). */
export function garmentDefaults(garmentId) {
  const { defaultOptions } = getGarmentById(garmentId);
  return {
    colorId: defaultOptions.color,
    styleId: defaultOptions.style,
    fitId: defaultOptions.fit,
    customOptions: defaultCustomOptions(garmentId),
  };
}

/** Selected options with the garment's defaults filled in for any key not chosen yet. */
export function resolveCustomOptions(garmentId, customOptions = {}) {
  return { ...defaultCustomOptions(garmentId), ...customOptions };
}

/**
 * Label details for one custom control of a garment.
 * @returns {{ label, valueLabel, subtext } | null} null when the garment has no such control.
 */
export function describeOption(garment, key, value) {
  const control = garment.customControls?.[key];
  if (!control) return null;
  const option = control.options.find((o) => o.id === value);
  return {
    label: control.label,
    valueLabel: option ? option.label : 'Standard',
    subtext: option ? option.subtext : '',
  };
}
