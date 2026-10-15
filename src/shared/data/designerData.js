/**
 * Outfit designer catalogue: garments (one file each in ./garments), colours, styles, fits.
 * Also exported to the backend for validation by backend/scripts/export_catalog.mjs.
 */

import { GARMENTS } from './garments/index.js';

export { GARMENTS };

export const COLORS = [
  {
    id: 'white',
    name: 'Chantilly White',
    hex: '#F8F7F4',
    secondaryHex: '#EAE6DF',
    description: 'Crisp, luminescent ivory tone with warm undertones',
    isLight: true,
  },
  {
    id: 'black',
    name: 'Obsidian Black',
    hex: '#161618',
    secondaryHex: '#252528',
    description: 'Deep nocturnal carbon with matte satin sheen',
    isLight: false,
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    hex: '#162238',
    secondaryHex: '#233452',
    description: 'Regal dark sapphire with timeless oceanic depth',
    isLight: false,
  },
  {
    id: 'beige',
    name: 'Cashmere Beige',
    hex: '#D2C0A5',
    secondaryHex: '#BFAC90',
    description: 'Subtle warm neutral reflecting refined luxury earth tones',
    isLight: true,
  },
  {
    id: 'brown',
    name: 'Tuscan Brown',
    hex: '#553523',
    secondaryHex: '#6F4730',
    description: 'Rich saddle mahogany with warm burnished patina',
    isLight: false,
  },
  {
    id: 'burgundy',
    name: 'Imperial Burgundy',
    hex: '#591724',
    secondaryHex: '#782333',
    description: 'Opulent deep wine tone with distinguished presence',
    isLight: false,
  },
];

export const STYLES = [
  {
    id: 'casual',
    name: 'Casual',
    tagline: 'Effortless Leisure',
    description: 'Relaxed proportions and clean lines crafted for sophisticated everyday ease.',
  },
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Timeless Sartorial',
    description: 'Balanced historical proportions with enduring silhouettes and refined grace.',
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Architectural Minimalism',
    description: 'Contemporary geometry, clean hardware, and streamlined avant-garde tailoring.',
  },
  {
    id: 'formal',
    name: 'Formal',
    tagline: 'Black-Tie Poise',
    description: 'Sculpted evening presence, crisp angles, and distinguished ceremonial elegance.',
  },
];

export const FITS = [
  {
    id: 'regular',
    name: 'Regular',
    subtitle: 'Balanced Silhouette',
    description: 'Natural drape with standard ease through chest, waist, and limbs.',
  },
  {
    id: 'slim',
    name: 'Slim',
    subtitle: 'Tapered Tailoring',
    description: 'Contoured closely to your torso with a sharp, modern taper.',
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    subtitle: 'Architectural Ease',
    description: 'Generous room and fluid draping for a contemporary relaxed statement.',
  },
];

export const DESIGNER_STEPS = [
  { id: 1, title: 'Choose Garment', description: 'Select base silhouette' },
  { id: 2, title: 'Customize Style', description: 'Palette, fit & details' },
  { id: 3, title: 'Review Design', description: 'Inspect final atelier draft' },
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
