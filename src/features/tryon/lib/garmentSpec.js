import { getGarmentById } from '../../../shared/data/designerData';
import { defaultCustomOptions } from '../../../shared/garments/options';

/** Extra width per side, as a fraction of shoulder span, for each fit. */
const FIT_EASE = { slim: 0.03, regular: 0.08, relaxed: 0.15 };


const pick = (value, table, fallback) => table[value] ?? fallback;

/**
 * Drawing recipe per garment. `hemDrop` is how far the hem sits below the hip joints in
 * torso lengths; `hemTo` anchors it to the knees instead.
 */
const RECIPES = {
  't-shirt': (o) => ({
    kind: 'top',
    neckline: pick(o.neckline, { 'v-neck': 'v', henley: 'henley' }, 'crew'),
    sleeve: o.sleeveLength === 'long-sleeve' ? 'long' : 'short',
    hemDrop: o.garmentLength === 'relaxed-longline' ? 0.22 : 0.1,
    flare: 0,
    front: 'none',
    baseEase: 0.02,
  }),
  shirt: (o) => ({
    kind: 'top',
    neckline: o.neckline === 'mandarin-band' ? 'band' : 'collar',
    sleeve: o.sleeveLength === 'short-sleeve' ? 'short' : 'long',
    cuff: o.sleeveLength !== 'short-sleeve',
    hemDrop: o.garmentLength === 'untucked-casual' ? 0.16 : 0.1,
    flare: 0,
    front: 'buttons',
    baseEase: 0.02,
  }),
  jacket: (o) => ({
    kind: 'top',
    neckline: pick(o.neckline, { 'peak-lapel': 'peak', 'mandarin-stand': 'band' }, 'lapel'),
    sleeve: 'long',
    cuff: o.sleeveLength === 'turnback-cuff',
    hemDrop: pick(o.garmentLength, { 'tailored-waist': 0, 'extended-longline': 0.55 }, 0.2),
    flare: o.garmentLength === 'extended-longline' ? 0.06 : 0.02,
    front: 'jacket',
    baseEase: 0.06,
  }),
  ethnic: (o) => ({
    kind: 'top',
    neckline: pick(o.neckline, { 'angrakha-wrap': 'wrap', 'kurta-placket': 'keyhole' }, 'band'),
    sleeve: 'long',
    cuff: o.sleeveLength === 'cuffed-heritage',
    hemTo: pick(o.garmentLength, { 'knee-kurta': 'knee', 'below-knee-sherwani': 'belowKnee' }, null),
    hemDrop: 0.06,
    flare: o.garmentLength === 'short-bandi' ? 0 : 0.12,
    front: o.neckline === 'royal-bandhgala' ? 'buttons' : 'none',
    border: o.pattern === 'zari-accents',
    slits: o.garmentLength !== 'short-bandi',
    baseEase: 0.04,
  }),
  trousers: (o) => ({
    kind: 'bottom',
    pleats: pick(o.neckline, { 'single-pleat': 1, 'double-pleats': 2 }, 0),
    breakDrop: pick(o.sleeveLength, { 'ankle-no-break': -0.05, 'medium-break': 0.05 }, 0),
    ankleTaper: pick(o.garmentLength, { 'cropped-inseam': 0.85, 'extended-inseam': 1.08 }, 1),
    baseEase: 0.02,
  }),
};

/**
 * Turn a design (garment + options + fit) into the geometry recipe the renderer draws.
 * @returns {object} recipe with `kind: 'top'|'bottom'` and `ease` (fraction of shoulder span)
 */
export function garmentSpec(garmentId, customOptions, fitId) {
  const garment = getGarmentById(garmentId);
  const options = { ...defaultCustomOptions(garment.id), ...customOptions };
  const recipe = (RECIPES[garment.id] ?? RECIPES['t-shirt'])(options);
  return { ...recipe, ease: recipe.baseEase + (FIT_EASE[fitId] ?? FIT_EASE.regular) };
}

export { defaultCustomOptions };
