/** trousers — default options and customisation controls. */
export const TrousersGarment = {
  id: 'trousers',
  name: 'Trousers',
  category: 'Bottoms',
  description: 'Tailored trousers with your choice of pleats, hem and length.',
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
      label: 'Pleats',
      description: 'Pleats at the front of the waist',
      options: [
        { id: 'flat-front', label: 'Flat front', subtext: 'No pleats' },
        { id: 'single-pleat', label: 'Single pleat', subtext: 'One pleat on each side' },
        { id: 'double-pleats', label: 'Double pleats', subtext: 'Two pleats on each side' },
      ],
    },
    sleeveLength: {
      label: 'Hem break',
      description: 'How the hem meets the shoe',
      options: [
        { id: 'ankle-no-break', label: 'No break', subtext: 'Ends just above the shoe' },
        { id: 'slight-break', label: 'Slight break', subtext: 'Small fold at the front' },
        { id: 'medium-break', label: 'Medium break', subtext: 'Fuller fold over the shoe' },
      ],
    },
    garmentLength: {
      label: 'Length',
      description: 'Inside leg length',
      options: [
        { id: 'cropped-inseam', label: 'Ankle length', subtext: 'Shorter, shows the ankle' },
        { id: 'regular-inseam', label: 'Standard', subtext: 'Regular leg length' },
        { id: 'extended-inseam', label: 'Long', subtext: 'Extra length in the leg' },
      ],
    },
    fabric: {
      label: 'Fabric',
      description: 'What the garment is made of',
      options: [
        { id: 'wool-gabardine', label: 'Wool gabardine', subtext: 'Smooth wool that holds a crease' },
        { id: 'stretch-chino', label: 'Stretch chino', subtext: 'Cotton with some stretch' },
        { id: 'tropical-wool', label: 'Tropical wool', subtext: 'Light and crease-resistant' },
      ],
    },
    pattern: {
      label: 'Finish',
      description: 'Pattern or waist detail',
      options: [
        { id: 'solid-obsidian', label: 'Solid', subtext: 'Plain, single colour' },
        { id: 'side-adjusters', label: 'Side adjusters', subtext: 'Metal waist buckles, no belt' },
        { id: 'micro-houndstooth', label: 'Micro-check', subtext: 'Small check in similar tones' },
      ],
    },
  },
};
