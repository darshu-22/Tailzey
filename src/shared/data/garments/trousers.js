/** trousers — default options and customisation controls. */
export const TrousersGarment = {
  id: 'trousers',
  name: 'Trousers',
  category: 'Sartorial Lower',
  description: 'Impeccably draped tailored trousers with customizable rise, pleat, and hem break.',
  iconName: 'Ruler',
  defaultOptions: {
    color: 'black',
    style: 'classic',
    fit: 'slim',
    neckline: 'flat-front',
    sleeveLength: 'slight-break',
    garmentLength: 'regular-inseam',
    fabric: 'wool-gabardine',
    pattern: 'solid-obsidian',
  },
  customControls: {
    neckline: {
      label: 'Waistband & Pleats',
      description: 'Front rise structure and pleat fold',
      options: [
        { id: 'flat-front', label: 'Flat Front', subtext: 'Streamlined contemporary waist' },
        { id: 'single-pleat', label: 'Single Pleat', subtext: 'Subtle ease through hip and thigh' },
        { id: 'double-pleats', label: 'Double Forward Pleats', subtext: 'Classic draped fullness' },
      ],
    },
    sleeveLength: {
      label: 'Hem Break (Shoe Resting)',
      description: 'Where trouser hem touches footwear',
      options: [
        { id: 'ankle-no-break', label: 'No Break (Cropped)', subtext: 'Clean clearance above shoe collar' },
        { id: 'slight-break', label: 'Slight Break', subtext: 'Gentle ripple at the front crease' },
        { id: 'medium-break', label: 'Medium Break', subtext: 'Traditional generous fall over vamp' },
      ],
    },
    garmentLength: {
      label: 'Inseam Proportion',
      description: 'Length ratio for your leg silhouette',
      options: [
        { id: 'cropped-inseam', label: 'Ankle Taper Inseam', subtext: 'Showcases luxury footwear' },
        { id: 'regular-inseam', label: 'Standard Inseam', subtext: 'Classic tailored proportion' },
        { id: 'extended-inseam', label: 'Extended Inseam', subtext: 'Full draping silhouette' },
      ],
    },
    fabric: {
      label: 'Fabric Composition',
      description: 'Luxury textile weave and hand feel',
      options: [
        { id: 'wool-gabardine', label: 'Wool Gabardine', subtext: 'Fluid drape with crease recovery' },
        { id: 'stretch-chino', label: 'Stretch Pima Chino', subtext: 'Polished casual structure' },
        { id: 'tropical-wool', label: 'Tropical High-Twist', subtext: 'Breathable wrinkle-resistant weave' },
      ],
    },
    pattern: {
      label: 'Pattern & Hardware',
      description: 'Finishing accents and adjusters',
      options: [
        { id: 'solid-obsidian', label: 'Solid Uniform Matte', subtext: 'Seamless formal depth' },
        { id: 'side-adjusters', label: 'Sartorial Side Adjusters', subtext: 'Polished metal buckle hardware' },
        { id: 'micro-houndstooth', label: 'Micro-Check Weave', subtext: 'Textured optical tonal depth' },
      ],
    },
  },
};
