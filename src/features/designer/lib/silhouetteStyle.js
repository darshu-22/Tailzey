/**
 * Colour and pattern decisions for the illustrative SVG silhouettes.
 * Paint servers referenced as url(#id) are declared in SilhouetteDefs.
 */
const ACCENT_GOLD = '#D9B47A';

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
    outline: color.isLight ? '#2B2520' : 'rgba(217, 180, 122, 0.7)',
    seam: color.isLight ? '#5C4A38' : 'rgba(217, 180, 122, 0.4)',
    accent: ACCENT_GOLD,
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
