/** jacket — default options and customisation controls. */
export const JacketGarment = {
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
};
