/**
 * Ready-to-wear size benchmarks, garment categories and fit preferences for the
 * measurement studio. These are exploratory reference charts, not fit guarantees.
 * Exported to the backend catalog (backend/scripts/export_catalog.mjs).
 */

export const STANDARD_LETTER_SIZES = [
  { id: 'S', label: 'S', name: 'Small', chestCm: '91–96', chestIn: '36–38', waistCm: '76–81', waistIn: '30–32' },
  { id: 'M', label: 'M', name: 'Medium', chestCm: '97–102', chestIn: '38–40', waistCm: '82–87', waistIn: '32–34' },
  { id: 'L', label: 'L', name: 'Large', chestCm: '103–108', chestIn: '40–42', waistCm: '88–93', waistIn: '34–36' },
  { id: 'XL', label: 'XL', name: 'Extra Large', chestCm: '109–114', chestIn: '43–45', waistCm: '94–99', waistIn: '37–39' },
  { id: '2XL', label: '2XL', name: 'Double Extra Large', chestCm: '115–120', chestIn: '45–47', waistCm: '100–105', waistIn: '39–41' },
  { id: '3XL', label: '3XL', name: 'Triple Extra Large', chestCm: '121–126', chestIn: '48–50', waistCm: '106–111', waistIn: '42–44' },
];

export const CATEGORY_NUMERIC_SIZES = {
  jacket: [
    { id: '36R', label: '36R', subtext: 'Chest 36" Regular' },
    { id: '38R', label: '38R', subtext: 'Chest 38" Regular' },
    { id: '40R', label: '40R', subtext: 'Chest 40" Regular' },
    { id: '42R', label: '42R', subtext: 'Chest 42" Regular' },
    { id: '44R', label: '44R', subtext: 'Chest 44" Regular' },
    { id: '46R', label: '46R', subtext: 'Chest 46" Regular' },
  ],
  shirt: [
    { id: '15.0', label: '15.0', subtext: 'Collar 15" / 38 cm' },
    { id: '15.5', label: '15.5', subtext: 'Collar 15.5" / 39 cm' },
    { id: '16.0', label: '16.0', subtext: 'Collar 16" / 41 cm' },
    { id: '16.5', label: '16.5', subtext: 'Collar 16.5" / 42 cm' },
    { id: '17.0', label: '17.0', subtext: 'Collar 17" / 43 cm' },
    { id: '17.5', label: '17.5', subtext: 'Collar 17.5" / 44 cm' },
  ],
  trousers: [
    { id: '30', label: '30', subtext: 'Waist 30" / 76 cm' },
    { id: '32', label: '32', subtext: 'Waist 32" / 81 cm' },
    { id: '34', label: '34', subtext: 'Waist 34" / 86 cm' },
    { id: '36', label: '36', subtext: 'Waist 36" / 91 cm' },
    { id: '38', label: '38', subtext: 'Waist 38" / 96 cm' },
    { id: '40', label: '40', subtext: 'Waist 40" / 101 cm' },
    { id: '42', label: '42', subtext: 'Waist 42" / 106 cm' },
  ],
  ethnic: [
    { id: '38', label: '38', subtext: 'Chest 38" / 96 cm' },
    { id: '40', label: '40', subtext: 'Chest 40" / 101 cm' },
    { id: '42', label: '42', subtext: 'Chest 42" / 106 cm' },
    { id: '44', label: '44', subtext: 'Chest 44" / 112 cm' },
    { id: '46', label: '46', subtext: 'Chest 46" / 117 cm' },
  ],
  't-shirt': [],
};

export const GARMENT_CATEGORIES = [
  { id: 'jacket', name: 'Jacket / Blazer' },
  { id: 'shirt', name: 'Shirt' },
  { id: 'trousers', name: 'Trousers' },
  { id: 'ethnic', name: 'Ethnic Wear' },
  { id: 't-shirt', name: 'T-Shirt' },
];

export const FIT_PREFERENCES = [
  {
    id: 'slim',
    name: 'Slim Fit',
    subtext: 'Closer contour with minimal ease allowance',
    description: 'Sculpted close to your body lines for a sharp, tapered presence.',
  },
  {
    id: 'regular',
    name: 'Regular Fit',
    subtext: 'Balanced sartorial ease for natural comfort',
    description: 'Traditional tailored proportion with sufficient room for comfortable everyday motion.',
  },
  {
    id: 'relaxed',
    name: 'Relaxed Fit',
    subtext: 'Generous ease for casual, fluid drape',
    description: 'Contemporary architectural silhouette with deliberate drape and extra breathing room.',
  },
];
