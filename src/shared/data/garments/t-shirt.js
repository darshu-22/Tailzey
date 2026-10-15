/** t-shirt — default options and customisation controls. */
export const TShirtGarment = {
  id: 't-shirt',
  name: 'T-Shirt',
  category: 'Essential Silhouette',
  description: 'Refined everyday staple with tailored drape, clean hem, and premium cotton feel.',
  iconName: 'Shirt',
  defaultOptions: {
    color: 'white',
    style: 'casual',
    fit: 'regular',
    neckline: 'crew-neck',
    sleeveLength: 'short-sleeve',
    garmentLength: 'standard',
    fabric: 'supima-cotton',
    pattern: 'solid-minimal',
  },
  customControls: {
    neckline: {
      label: 'Neckline Style',
      description: 'Collar opening and neckline contour',
      options: [
        { id: 'crew-neck', label: 'Crew Neck', subtext: 'Timeless tailored rounded rib' },
        { id: 'v-neck', label: 'V-Neck', subtext: 'Subtle contemporary taper' },
        { id: 'henley', label: 'Henley Placket', subtext: 'Three-button pearl closure' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve Length',
      description: 'Bicep cut and sleeve proportion',
      options: [
        { id: 'short-sleeve', label: 'Short Sleeve', subtext: 'Tailored mid-bicep drape' },
        { id: 'long-sleeve', label: 'Long Sleeve', subtext: 'Extended arm with fitted cuff' },
      ],
    },
    garmentLength: {
      label: 'Garment Length',
      description: 'Torso length and bottom hemline',
      options: [
        { id: 'standard', label: 'Standard Length', subtext: 'Rests naturally at mid-hip' },
        { id: 'relaxed-longline', label: 'Longline Hem', subtext: 'Slightly extended curved drop' },
      ],
    },
    fabric: {
      label: 'Fabric Composition',
      description: 'Luxury textile weave and hand feel',
      options: [
        { id: 'supima-cotton', label: 'Supima Cotton', subtext: 'Extra-long staple softness' },
        { id: 'mercerized-jersey', label: 'Mercerized Jersey', subtext: 'Lustrous high-density knit' },
        { id: 'bamboo-modal', label: 'Bamboo Modal Blend', subtext: 'Silky breathable drape' },
      ],
    },
    pattern: {
      label: 'Pattern & Embellishment',
      description: 'Surface finish and artisanal detailing',
      options: [
        { id: 'solid-minimal', label: 'Solid Minimal', subtext: 'Clean monochromatic purity' },
        { id: 'subtle-monogram', label: 'Atelier Monogram', subtext: 'Discreet chest embroidery' },
        { id: 'fine-ribbed', label: 'Fine Ribbed Knit', subtext: 'Micro-linear tactile texture' },
      ],
    },
  },
};
