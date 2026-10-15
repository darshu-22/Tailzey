/**
 * Unit conversion helpers. Numbers in, numbers out (1-decimal precision);
 * null/undefined/'' stay null so missing measurements are never turned into 0.
 */
const CM_PER_INCH = 2.54;

const round1 = (n) => Math.round(n * 10) / 10;

export function isMissing(value) {
  return value === null || value === undefined || value === '' || Number.isNaN(Number(value));
}

function cmToIn(cm) {
  return isMissing(cm) ? null : round1(Number(cm) / CM_PER_INCH);
}

function inToCm(inches) {
  return isMissing(inches) ? null : round1(Number(inches) * CM_PER_INCH);
}

/** Convert a single value between 'cm' and 'in'. */
export function convertValue(value, from, to) {
  if (isMissing(value)) return null;
  if (from === to) return Number(value);
  return from === 'cm' ? cmToIn(value) : inToCm(value);
}

/** Convert every value in a {key: number|null} map. */
export function convertValues(values, from, to) {
  return Object.fromEntries(Object.entries(values || {}).map(([k, v]) => [k, convertValue(v, from, to)]));
}
