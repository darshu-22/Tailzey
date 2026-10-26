/**
 * What the realistic mannequin wears for a design: the CC0 MakeHuman garment standing in for the
 * designer garment, a neutral base layer so the mannequin is always dressed (suits include their
 * own bottoms), and hair, shoes and eyes. Ethnic wear has no open-source model: its kurta is cut
 * from the fitted body (see kurtaMesh.js) and worn with neutral trousers.
 */

export const MANNEQUINS = [
  { value: 'female', label: 'Women’s' },
  { value: 'male', label: 'Men’s' },
];

const MAIN = {
  't-shirt': { female: 'tshirt', male: 'tshirt' },
  shirt: { female: 'polo', male: 'polo' },
  jacket: { female: 'suit-female', male: 'suit-male' },
  trousers: { female: 'trousers', male: 'trousers' },
  ethnic: { female: null, male: null },
};
/** A top hides the part of the bottoms above its hem. */
const LAYERS = { tshirt: 'top', polo: 'top', trousers: 'bottom' };
/** How much the cloth bridges hollows (see drape.js); detailed garments (suits, polo) keep 0. */
const SMOOTH = { tshirt: 0.3 };
const CHARCOAL = '#5f5b57';
const SLATE = '#7d8a96';
const SOCKS = '#2a2725'; // the shoes' socks, dark so they read as hosiery under a skirt

function baseLayer(garmentId) {
  if (garmentId === 'trousers') return { id: 'tshirt', colorHex: SLATE, front: true };
  if (garmentId === 'jacket') return null;
  return { id: 'trousers', colorHex: CHARCOAL, front: false };
}

/**
 * @param spec garmentSpec() of the design.
 * @returns [{ id (null for the kurta), layer, easeDm, physics, smooth, kurta?, colorHex (null = as
 *   modelled), front }]
 */
export function outfitPlan(spec, sex) {
  const id = MAIN[spec.garmentId][sex];
  const main = { id, layer: LAYERS[id] ?? 'full', easeDm: spec.fitEase * 10, physics: true, colorHex: spec.colorHex };
  main.smooth = SMOOTH[id] ?? 0;
  if (spec.garmentId === 'ethnic') Object.assign(main, { layer: 'top', smooth: 0.1, kurta: { hem: spec.hem, sleeve: spec.sleeve } });
  const base = baseLayer(spec.garmentId);
  main.front = !base?.front;
  return [
    main,
    ...(base ? [{ ...base, layer: LAYERS[base.id], easeDm: 0, physics: true, smooth: SMOOTH[base.id] ?? 0 }] : []),
    { id: `hair-${sex}`, layer: 'hair', easeDm: 0, physics: true, colorHex: null, front: false },
    { id: 'shoes', layer: 'feet', easeDm: 0, physics: false, colorHex: SOCKS, front: false },
    { id: 'eyes', layer: 'eyes', easeDm: 0, physics: false, colorHex: null, front: false },
  ];
}
