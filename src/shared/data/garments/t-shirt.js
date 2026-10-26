/** t-shirt — default options and customisation controls. */
export const TShirtGarment = {
  id: 't-shirt',
  name: 'T-Shirt',
  category: 'Tops',
  description: 'A simple knit top for everyday wear.',
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
      label: 'Neckline',
      description: 'Shape of the neck opening',
      options: [
        { id: 'crew-neck', label: 'Crew neck', subtext: 'Round neckline' },
        { id: 'v-neck', label: 'V-neck', subtext: 'V-shaped neckline' },
        { id: 'henley', label: 'Henley', subtext: 'Round neck with three buttons' },
      ],
    },
    sleeveLength: {
      label: 'Sleeve length',
      description: 'Short or long sleeves',
      options: [
        { id: 'short-sleeve', label: 'Short sleeve', subtext: 'Ends at the upper arm' },
        { id: 'long-sleeve', label: 'Long sleeve', subtext: 'Full length to the wrist' },
      ],
    },
    garmentLength: {
      label: 'Length',
      description: 'Where the hem sits',
      options: [
        { id: 'standard', label: 'Standard', subtext: 'Ends at mid-hip' },
        { id: 'relaxed-longline', label: 'Longline', subtext: 'A little longer, curved hem' },
      ],
    },
    fabric: {
      label: 'Fabric',
      description: 'What the garment is made of',
      options: [
        { id: 'supima-cotton', label: 'Supima cotton', subtext: 'Soft long-staple cotton' },
        { id: 'mercerized-jersey', label: 'Mercerised jersey', subtext: 'Smooth knit with slight sheen' },
        { id: 'bamboo-modal', label: 'Bamboo modal blend', subtext: 'Soft and breathable' },
      ],
    },
    pattern: {
      label: 'Pattern',
      description: 'Pattern or surface detail',
      options: [
        { id: 'solid-minimal', label: 'Solid', subtext: 'Plain, single colour' },
        { id: 'subtle-monogram', label: 'Monogram', subtext: 'Small embroidered initials on chest' },
        { id: 'fine-ribbed', label: 'Ribbed knit', subtext: 'Fine raised lines' },
      ],
    },
  },
};
