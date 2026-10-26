/**
 * Colour and pattern decisions for the illustrative SVG silhouettes. These colours are
 * drawing content (fabric, stitching, buttons), not UI chrome, so they live here, not in CSS.
 * Paint servers referenced as url(#id) are declared in SilhouetteDefs.
 */
const HARDWARE = '#C9A66B'; // buttons, zari trim
export const GUIDE_STROKE = '#A39F95'; // faint dress-form guide lines

export const FILL = Object.freeze({
  primary: 'url(#fabric-primary-grad)',
  shimmer: 'url(#fabric-shimmer-grad)',
  zari: 'url(#zari-gold-grad)',
  pinstripe: 'url(#pinstripe-pattern)',
  windowpane: 'url(#windowpane-pattern)',
});

/** Stitch and outline contrast that stays legible on light and dark fabrics. */
export function silhouettePalette(color) {
  return {
    primary: color.hex,
    secondary: color.secondaryHex,
    isLight: color.isLight,
    outline: color.isLight ? '#2B2924' : 'rgba(255, 255, 255, 0.55)',
    seam: color.isLight ? '#6B665C' : 'rgba(255, 255, 255, 0.3)',
    accent: HARDWARE,
  };
}

/** Which surface overlays a pattern option switches on. */
export function patternFlags(patternId) {
  return {
    pinstripe: patternId === 'bengal-stripe' || patternId === 'fine-ribbed',
    windowpane: patternId === 'subtle-windowpane' || patternId === 'micro-houndstooth',
    zari: patternId === 'zari-accents' || patternId === 'subtle-monogram',
  };
}
