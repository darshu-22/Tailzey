import { convertValue, isMissing } from '../utils/units';

/**
 * Bra size from bust (the chest measurement) and underbust, as a starting point for fitting.
 *
 * EU follows EN 13402-3: the band is the underbust rounded to 5 cm, and each 2 cm of
 * bust − underbust above 10 cm is one cup (10–12 AA, 12–14 A, 14–16 B, …). UK and US
 * sizes come from the standard conversion chart (EU 75 = UK/US 34; the n-th EU cup is the
 * n-th UK and US cup), so the three systems always agree with each other.
 *
 * Camera estimates carry ± errors, so the cup is also given as a range: the cups reached
 * by bust − underbust ± their combined error. Tape values give a single cup.
 */

const CUPS = {
  EU: ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
  UK: ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H'],
  US: ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K'],
};
const CUP_SYSTEMS = Object.keys(CUPS);

const cupIndex = (diffCm) => Math.min(Math.max(Math.floor((diffCm - 10) / 2), 0), CUPS.EU.length - 1);
const euBand = (underbustCm) => Math.round(underbustCm / 5) * 5;
const BANDS = { EU: euBand, UK: (u) => 34 + ((euBand(u) - 75) / 5) * 2, US: (u) => 34 + ((euBand(u) - 75) / 5) * 2 };

/** Value and ± error of one field in cm (the error is 0 for tape-measured values). */
function inCm(measurement, key) {
  const { values = {}, unit = 'cm', fieldStatus = {}, uncertainty = {} } = measurement;
  if (isMissing(values[key])) return null;
  const error = fieldStatus[key] === 'camera_estimate' ? Number(uncertainty[key]) || 0 : 0;
  return { value: convertValue(Number(values[key]), unit, 'cm'), error };
}

/**
 * { sizes: [{ system, band, cup, range: [low, high] }], estimated } or { reason } when no
 * size can be given, or null when bust sizing doesn't apply (no underbust recorded).
 */
export function cupSize(measurement) {
  const underbust = inCm(measurement, 'underbust');
  if (!underbust) return null;
  const bust = inCm(measurement, 'chest');
  if (!bust) return { reason: 'Add your bust (chest) measurement to see a cup size.' };
  const diff = bust.value - underbust.value;
  if (diff <= 0) return { reason: 'Your bust should be larger than your underbust. Please check both values.' };

  const error = Math.hypot(bust.error, underbust.error);
  const [low, mid, high] = [diff - error, diff, diff + error].map(cupIndex);
  const sizes = CUP_SYSTEMS.map((system) => ({
    system,
    band: BANDS[system](underbust.value),
    cup: CUPS[system][mid],
    range: [CUPS[system][low], CUPS[system][high]],
  }));
  return { sizes, estimated: error > 0 };
}

/** "34C" for a size from cupSize(), optionally with another cup from its range. */
export const formatBraSize = (size, cup = size.cup) => `${size.band}${cup}`;
