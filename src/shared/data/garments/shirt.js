/** shirt — default options and customisation controls. */
export const ShirtGarment = {
  id: 'shirt',
  name: 'Shirt',
  category: 'Tops',
  description: 'A button-up shirt with a collar, for work or casual wear.',
  iconName: 'Sparkles',
  defaultOptions: {
    color: 'white',
    style: 'classic',
    fit: 'slim',
    neckline: 'spread-collar',
    sleeveLength: 'long-cuffed',
    garmentLength: 'standard-tuck',
    fabric: 'giza-cotton',
    pattern: 'solid-lustre',
  },
  customControls: {
    neckline: {
      label: 'Collar',
      description: 'Shape of the collar',
      options: [
        { id: 'spread-collar', label: 'Spread collar', subtext: 'Works with or without a tie' },
        { id: 'mandarin-band', label: 'Mandarin collar', subtext: 'Short stand collar, no tie' },
        { id: 'button-down', label: 'Button-down collar', subtext: 'Collar points button down' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve length',
      description: 'Long or short sleeves',
      options: [
        { id: 'long-cuffed', label: 'Long sleeve', subtext: 'Single-button cuff' },
        { id: 'short-sleeve', label: 'Short sleeve', subtext: 'Ends above the elbow' },
      ],
    },
    garmentLength: {
      label: 'Hem',
      description: 'Worn tucked in or left out',
      options: [
        { id: 'standard-tuck', label: 'Tucked', subtext: 'Curved hem that stays tucked' },
        { id: 'untucked-casual', label: 'Untucked', subtext: 'Straight hem, worn out' },
      ],
    },
    fabric: {
      label: 'Fabric',
      description: 'What the garment is made of',
      options: [
        { id: 'giza-cotton', label: 'Egyptian cotton', subtext: 'Smooth, fine cotton' },
        { id: 'italian-linen', label: 'Linen', subtext: 'Light and breathable' },
        { id: 'royal-oxford', label: 'Oxford cotton', subtext: 'Thicker, textured weave' },
      ],
    },
    pattern: {
      label: 'Pattern',
      description: 'Pattern or surface detail',
      options: [
        { id: 'solid-lustre', label: 'Solid', subtext: 'Plain, single colour' },
        { id: 'micro-houndstooth', label: 'Houndstooth', subtext: 'Small broken check' },
        { id: 'bengal-stripe', label: 'Bengal stripe', subtext: 'Narrow, even stripes' },
      ],
    },
  },
};
