/** ethnic — default options and customisation controls. */
export const EthnicGarment = {
  id: 'ethnic',
  name: 'Ethnic Wear',
  category: 'Traditional',
  description: 'Traditional Indian wear: a kurta, sherwani or bandi jacket.',
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
      label: 'Neckline',
      description: 'Collar and front opening',
      options: [
        { id: 'royal-bandhgala', label: 'Bandhgala', subtext: 'High, closed mandarin collar' },
        { id: 'angrakha-wrap', label: 'Angrakha wrap', subtext: 'Diagonal wrap-over front' },
        { id: 'kurta-placket', label: 'Kurta placket', subtext: 'Buttoned opening at the centre' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve',
      description: 'Sleeve shape at the wrist',
      options: [
        { id: 'full-straight', label: 'Straight sleeve', subtext: 'Full length, straight to wrist' },
        { id: 'cuffed-heritage', label: 'Cuffed sleeve', subtext: 'Fitted cuff with a button' },
      ],
    },
    garmentLength: {
      label: 'Length',
      description: 'Garment type and hem length',
      options: [
        { id: 'knee-kurta', label: 'Knee-length kurta', subtext: 'Ends at the knee' },
        { id: 'below-knee-sherwani', label: 'Sherwani', subtext: 'Long coat, below the knee' },
        { id: 'short-bandi', label: 'Bandi jacket', subtext: 'Short waistcoat, worn layered' },
      ],
    },
    fabric: {
      label: 'Fabric',
      description: 'What the garment is made of',
      options: [
        { id: 'raw-silk', label: 'Matka raw silk', subtext: 'Textured silk with slight sheen' },
        { id: 'opulent-brocade', label: 'Chanderi brocade', subtext: 'Silk woven with gold thread' },
        { id: 'fine-khadi', label: 'Khadi', subtext: 'Light handwoven cotton' },
      ],
    },
    pattern: {
      label: 'Embellishment',
      description: 'Embroidery or borders',
      options: [
        { id: 'zari-accents', label: 'Zari borders', subtext: 'Gold thread borders' },
        { id: 'resham-embroidery', label: 'Resham embroidery', subtext: 'Same-colour floral silk embroidery' },
        { id: 'minimal-solid-silk', label: 'Plain', subtext: 'No embellishment' },
      ],
    },
  },
};
