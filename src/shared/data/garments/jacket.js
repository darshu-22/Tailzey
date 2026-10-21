/** jacket — default options and customisation controls. */
export const JacketGarment = {
  id: 'jacket',
  name: 'Jacket',
  category: 'Outerwear',
  description: 'A tailored blazer with structured shoulders and lapels.',
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
      label: 'Lapel',
      description: 'Shape of the front collar',
      options: [
        { id: 'notched-lapel', label: 'Notched lapel', subtext: 'The everyday, versatile choice' },
        { id: 'peak-lapel', label: 'Peak lapel', subtext: 'Pointed upward, more formal' },
        { id: 'mandarin-stand', label: 'Stand collar', subtext: 'Short upright band, no lapel' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve cuff',
      description: 'Finish at the end of the sleeve',
      options: [
        { id: 'standard-tailored', label: 'Plain cuff', subtext: 'Four buttons at the wrist' },
        { id: 'turnback-cuff', label: 'Turn-back cuff', subtext: 'Cuff folded back at the wrist' },
      ],
    },
    garmentLength: {
      label: 'Length',
      description: 'Where the jacket ends',
      options: [
        { id: 'tailored-waist', label: 'Cropped', subtext: 'Ends at the waist' },
        { id: 'standard-hip', label: 'Standard', subtext: 'Ends at the hip' },
        { id: 'extended-longline', label: 'Longline', subtext: 'Ends at mid-thigh' },
      ],
    },
    fabric: {
      label: 'Fabric',
      description: 'What the garment is made of',
      options: [
        { id: 'merino-wool', label: 'Merino wool', subtext: 'Fine wool for all seasons' },
        { id: 'silk-linen', label: 'Silk-linen blend', subtext: 'Light, for warm weather' },
        { id: 'evening-velvet', label: 'Velvet', subtext: 'Soft pile, for evening wear' },
      ],
    },
    pattern: {
      label: 'Pattern',
      description: 'Pattern or surface detail',
      options: [
        { id: 'solid-matte', label: 'Solid', subtext: 'Plain, single colour' },
        { id: 'subtle-windowpane', label: 'Windowpane check', subtext: 'Thin lines in a wide grid' },
        { id: 'pick-stitch', label: 'Pick stitching', subtext: 'Visible stitching along the edges' },
      ],
    },
  },
};
