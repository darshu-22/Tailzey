/**
 * Tailzey Dream Outfit Designer — Data Specifications & Atelier Configuration
 * Defines supported garment categories, color swatches, styles, fits,
 * and category-tailored craftsmanship attributes.
 */

export const GARMENTS = [
  {
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
  },
  {
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
  },
  {
    id: 'jacket',
    name: 'Jacket',
    category: 'Outerwear & Tailoring',
    description: 'Structured blazer with sculpted shoulder lines, statement lapels, and poise.',
    iconName: 'Shield',
    defaultOptions: {
      color: 'navy',
      style: 'formal',
      fit: 'slim',
      neckline: 'notched-lapel',
      sleeveLength: 'standard-tailored',
      garmentLength: 'standard-hip',
      fabric: 'merino-wool',
      pattern: 'solid-matte',
    },
    customControls: {
      neckline: {
        label: 'Lapel Architecture',
        description: 'Chest gorge and lapel profile',
        options: [
          { id: 'notched-lapel', label: 'Notched Lapel', subtext: 'Versatile tailored elegance' },
          { id: 'peak-lapel', label: 'Peak Lapel', subtext: 'Broad upward dramatic flair' },
          { id: 'mandarin-stand', label: 'Stand Collar', subtext: 'Contemporary military-inspired band' },
        ],
      },
      sleeveLength: {
        label: 'Sleeve Architecture',
        description: 'Cuff structure and buttoning',
        options: [
          { id: 'standard-tailored', label: 'Tailored Sleeve', subtext: 'Four kissing horn buttons' },
          { id: 'turnback-cuff', label: 'Sartorial Gauntlet Cuff', subtext: 'Subtle heritage turnback detail' },
        ],
      },
      garmentLength: {
        label: 'Jacket Silhouette Length',
        description: 'Proportion and vertical drape',
        options: [
          { id: 'tailored-waist', label: 'Cropped Waist', subtext: 'Modern high-stance proportion' },
          { id: 'standard-hip', label: 'Standard Hip', subtext: 'Balanced classical blazer drop' },
          { id: 'extended-longline', label: 'Extended Longline', subtext: 'Dramatic car-coat silhouette' },
        ],
      },
      fabric: {
        label: 'Fabric Composition',
        description: 'Luxury textile weave and hand feel',
        options: [
          { id: 'merino-wool', label: 'Super 130s Merino', subtext: 'All-season refined drape' },
          { id: 'silk-linen', label: 'Silk-Linen Blend', subtext: 'Tactile summer slub texture' },
          { id: 'evening-velvet', label: 'Black-Tie Velvet', subtext: 'Rich opulent nocturnal luster' },
        ],
      },
      pattern: {
        label: 'Pattern & Embellishment',
        description: 'Surface finish and artisanal detailing',
        options: [
          { id: 'solid-matte', label: 'Solid Matte', subtext: 'Understated depth of tone' },
          { id: 'subtle-windowpane', label: 'Subtle Windowpane', subtext: 'Refined geometric grid line' },
          { id: 'pick-stitch', label: 'Hand Pick-Stitching', subtext: 'Bespoke edge thread craftsmanship' },
        ],
      },
    },
  },
  {
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
  },
  {
    id: 'ethnic',
    name: 'Ethnic Wear',
    category: 'Regal Heritage Couture',
    description: 'Imperial Indian silhouette featuring handcrafted collar, regal drape, and heritage accents.',
    iconName: 'Sparkles',
    defaultOptions: {
      color: 'burgundy',
      style: 'formal',
      fit: 'regular',
      neckline: 'royal-bandhgala',
      sleeveLength: 'full-straight',
      garmentLength: 'below-knee-sherwani',
      fabric: 'raw-silk',
      pattern: 'zari-accents',
    },
    customControls: {
      neckline: {
        label: 'Neckline & Collar',
        description: 'Imperial collar structure and closure',
        options: [
          { id: 'royal-bandhgala', label: 'Royal Bandhgala', subtext: 'High structured mandarin closure' },
          { id: 'angrakha-wrap', label: 'Angrakha Wrap', subtext: 'Overlapping diagonal imperial placket' },
          { id: 'kurta-placket', label: 'Kurta Keyhole Placket', subtext: 'Centered ornamental button placket' },
        ],
      },
      sleeveLength: {
        label: 'Sleeve Architecture',
        description: 'Forearm and wrist silhouette',
        options: [
          { id: 'full-straight', label: 'Full Sleeve Straight', subtext: 'Traditional churidar pairing' },
          { id: 'cuffed-heritage', label: 'Tailored Heritage Cuff', subtext: 'Contoured wrist with button accent' },
        ],
      },
      garmentLength: {
        label: 'Silhouette Stance',
        description: 'Hemline drop and overall grandeur',
        options: [
          { id: 'knee-kurta', label: 'Knee-Length Kurta', subtext: 'Modern regal daytime balance' },
          { id: 'below-knee-sherwani', label: 'Ceremonial Sherwani', subtext: 'Imperial below-knee flowing length' },
          { id: 'short-bandi', label: 'Short Bandi Jacket', subtext: 'Waist-length layered waistcoat' },
        ],
      },
      fabric: {
        label: 'Fabric Composition',
        description: 'Luxury textile weave and hand feel',
        options: [
          { id: 'raw-silk', label: 'Matka Raw Silk', subtext: 'Organic slub texture with royal sheen' },
          { id: 'opulent-brocade', label: 'Chanderi Brocade', subtext: 'Gold-woven heritage artisan silk' },
          { id: 'fine-khadi', label: 'Fine Khadi Handloom', subtext: 'Lightweight artisanal natural cotton' },
        ],
      },
      pattern: {
        label: 'Ornamentation & Accents',
        description: 'Surface embellishment and borderwork',
        options: [
          { id: 'zari-accents', label: 'Handcrafted Zari Borders', subtext: 'Fine metallic gold thread accent' },
          { id: 'resham-embroidery', label: 'Resham Threadwork', subtext: 'Tone-on-tone botanical motif' },
          { id: 'minimal-solid-silk', label: 'Minimalist Pure Silk', subtext: 'Pure unadorned royal drape' },
        ],
      },
    },
  },
];

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
