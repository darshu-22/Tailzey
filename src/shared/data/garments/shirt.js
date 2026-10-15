/** shirt — default options and customisation controls. */
export const ShirtGarment = {
  id: 'shirt',
  name: 'Shirt',
  category: 'Sartorial Dressing',
  description: 'Crisp bespoke dress or casual shirt featuring structured collars and tailored cuffs.',
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
      label: 'Collar Style',
      description: 'Sartorial collar shape and spread',
      options: [
        { id: 'spread-collar', label: 'Spread Collar', subtext: 'Versatile for tie or open lapel' },
        { id: 'mandarin-band', label: 'Mandarin Band', subtext: 'Modern minimalist stand collar' },
        { id: 'button-down', label: 'Button-Down Collar', subtext: 'Soft casual sartorial roll' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve Length',
      description: 'Sleeve termination and cuff style',
      options: [
        { id: 'long-cuffed', label: 'Long Sleeve (Cuffed)', subtext: 'Bespoke single-button cuff' },
        { id: 'short-sleeve', label: 'Short Sleeve', subtext: 'Crisp turned-up casual cuff' },
      ],
    },
    garmentLength: {
      label: 'Shirt Cut & Hem',
      description: 'Tucking preference and hemline arc',
      options: [
        { id: 'standard-tuck', label: 'Classic Dress Tuck', subtext: 'Curved hem for secure tucking' },
        { id: 'untucked-casual', label: 'Untucked Hem', subtext: 'Straight bottom line for casual wear' },
      ],
    },
    fabric: {
      label: 'Fabric Composition',
      description: 'Luxury textile weave and hand feel',
      options: [
        { id: 'giza-cotton', label: 'Giza 120s 2-Ply', subtext: 'Silky smooth Egyptian cotton' },
        { id: 'italian-linen', label: 'Italian Pure Linen', subtext: 'Breathable airy natural texture' },
        { id: 'royal-oxford', label: 'Royal Oxford', subtext: 'Textured basketweave with depth' },
      ],
    },
    pattern: {
      label: 'Pattern & Embellishment',
      description: 'Surface finish and artisanal detailing',
      options: [
        { id: 'solid-lustre', label: 'Solid Lustre', subtext: 'Pure smooth dress weave' },
        { id: 'micro-houndstooth', label: 'Micro Houndstooth', subtext: 'Intricate optical micro-check' },
        { id: 'bengal-stripe', label: 'Bengal Pinstripe', subtext: 'Subtle alternating fine line' },
      ],
    },
  },
};
