import { getColorById, getFitById, getGarmentById } from '../../../shared/data/designerData';
import { defaultCustomOptions } from '../../../shared/garments/options';

/**
 * What the 3D garment shell looks like for a workspace design: colour, ease over the body,
 * hem level and sleeve length. Pure data — geometry is built from it in lib/three.
 */

/** Ease between body and fabric, in cm, per fit; some garments add their own layer. */
const FIT_EASE_CM = { slim: 0.6, regular: 1.4, relaxed: 2.6 };
const GARMENT_EASE_CM = { jacket: 1.0, ethnic: 0.5 };
const HEM_FLARE = { slim: 0.03, regular: 0.06, relaxed: 0.1 };

/** Sleeve end as a fraction of arm length (0 = sleeveless). */
const SLEEVES = {
  'short-sleeve': 0.3,
  'long-sleeve': 0.97,
  'long-cuffed': 0.98,
  'standard-tailored': 0.96,
  'turnback-cuff': 0.95,
  'full-straight': 0.98,
  'cuffed-heritage': 0.97,
};

/** Hem level of tops: a body landmark plus an offset as a fraction of height. */
const HEMS = {
  standard: { at: 'hip', offset: -0.035 },
  'relaxed-longline': { at: 'hip', offset: -0.065 },
  'standard-tuck': { at: 'hip', offset: -0.06 },
  'untucked-casual': { at: 'hip', offset: -0.035 },
  'tailored-waist': { at: 'waist', offset: -0.045 },
  'standard-hip': { at: 'crotch', offset: -0.005 },
  'extended-longline': { at: 'knee', offset: 0.09 },
  'knee-kurta': { at: 'knee', offset: 0 },
  'below-knee-sherwani': { at: 'knee', offset: -0.05 },
  'short-bandi': { at: 'waist', offset: -0.05 },
};
const DEFAULT_HEM = { at: 'hip', offset: -0.035 };

/** Trouser hem above (+) or below (−) the ankle, as a fraction of height. */
const TROUSER_BREAK = { 'ankle-no-break': 0.025, 'slight-break': 0, 'medium-break': -0.012 };
const TROUSER_INSEAM = { 'cropped-inseam': 0.02, 'regular-inseam': 0, 'extended-inseam': -0.006 };


export function garmentSpec(design) {
  const garment = getGarmentById(design.garmentId);
  const color = getColorById(design.colorId);
  const fit = getFitById(design.fitId);
  const options = { ...garment.defaultOptions, ...(design.customOptions || {}) };
  const easeCm = (FIT_EASE_CM[fit.id] ?? 1.4) + (GARMENT_EASE_CM[garment.id] ?? 0);

  const base = {
    garmentId: garment.id,
    garmentName: garment.name,
    colorHex: color.hex,
    colorName: color.name,
    fitName: fit.name,
    ease: easeCm / 100,
    flare: HEM_FLARE[fit.id] ?? 0.06,
  };

  if (garment.id === 'trousers') {
    const hemOffset = (TROUSER_BREAK[options.sleeveLength] ?? 0) + (TROUSER_INSEAM[options.garmentLength] ?? 0);
    return { ...base, kind: 'trousers', hem: { at: 'ankle', offset: hemOffset } };
  }

  const sleeveless = options.garmentLength === 'short-bandi';
  return {
    ...base,
    kind: 'top',
    hem: HEMS[options.garmentLength] || DEFAULT_HEM,
    sleeve: sleeveless ? 0 : SLEEVES[options.sleeveLength] ?? 0.97,
    collar: garment.id === 'shirt' || garment.id === 'ethnic',
  };
}

export { defaultCustomOptions };
