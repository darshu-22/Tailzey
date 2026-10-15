/** ethnic — default options and customisation controls. */
export const EthnicGarment = {
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
};
