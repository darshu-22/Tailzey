/**
 * Outfit designer catalogue: garments (one file each in ./garments), colours, styles and fits.
 * Also exported to the backend for validation by backend/scripts/export_catalog.mjs.
 */

import { GARMENTS } from './garments/index.js';

export { GARMENTS };

export const COLORS = [
  {
    id: 'white',
    name: 'White',
    hex: '#F8F7F4',
    secondaryHex: '#EAE6DF',
    description: 'Soft off-white',
    isLight: true,
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#161618',
    secondaryHex: '#252528',
    description: 'Deep black',
    isLight: false,
  },
  {
    id: 'navy',
    name: 'Navy',
    hex: '#162238',
    secondaryHex: '#233452',
    description: 'Dark blue',
    isLight: false,
  },
  {
    id: 'beige',
    name: 'Beige',
    hex: '#D2C0A5',
    secondaryHex: '#BFAC90',
    description: 'Light warm neutral',
    isLight: true,
  },
  {
    id: 'brown',
    name: 'Brown',
    hex: '#553523',
    secondaryHex: '#6F4730',
    description: 'Dark warm brown',
    isLight: false,
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    hex: '#591724',
    secondaryHex: '#782333',
    description: 'Deep wine red',
    isLight: false,
  },
];

export const STYLES = [
  {
    id: 'casual',
    name: 'Casual',
    tagline: 'Everyday wear',
    description: 'Easy, comfortable pieces for everyday wear.',
  },
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Traditional cut',
    description: 'Traditional proportions that suit most occasions.',
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Clean, minimal lines',
    description: 'Clean lines and a sharper, current shape.',
  },
  {
    id: 'formal',
    name: 'Formal',
    tagline: 'Events and occasions',
    description: 'Sharp, structured pieces for events and occasions.',
  },
];

export const FITS = [
  {
    id: 'regular',
    name: 'Regular',
    subtitle: 'Standard room',
    description: 'Standard room through the chest, waist and arms.',
  },
  {
    id: 'slim',
    name: 'Slim',
    subtitle: 'Close to the body',
    description: 'Close to the body with a tapered shape.',
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    subtitle: 'Extra room',
    description: 'Extra room for a loose, comfortable fit.',
  },
];

/**
 * Helper to fetch a garment by id
 */
export function getGarmentById(id) {
  return GARMENTS.find((g) => g.id === id) || GARMENTS[0];
}

/**
 * Helper to fetch a color by id
 */
export function getColorById(id) {
  return COLORS.find((c) => c.id === id) || COLORS[0];
}

/**
 * Helper to fetch a style by id
 */
export function getStyleById(id) {
  return STYLES.find((s) => s.id === id) || STYLES[0];
}

/**
 * Helper to fetch a fit by id
 */
export function getFitById(id) {
  return FITS.find((f) => f.id === id) || FITS[0];
}
