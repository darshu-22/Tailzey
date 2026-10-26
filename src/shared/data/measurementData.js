/**
 * Smart measurement definitions: the guided camera views the backend analyses,
 * the posture it checks for, and the measurement fields with their valid ranges.
 * MANUAL_MEASUREMENT_FIELDS is exported to the backend catalog (backend/scripts/export_catalog.mjs).
 * Fields with `optIn: 'bust'` only appear once the user turns on bust & cup sizing.
 */

/**
 * The four views `POST /measurements/analyze` uses. Front (or back) sets widths and lengths;
 * a side view adds body depth, which circumferences need. Three-quarter views add nothing.
 * `requirement` is shown to the user so they know which photos matter.
 */
export const CAPTURE_STEPS = [
  {
    id: 1,
    key: 'front',
    name: 'Front view',
    shortName: 'Front',
    requirement: 'Required (or a back view)',
    instruction: 'Face the camera. Hold your arms slightly out and stand with your feet hip-width apart.',
    tips: [
      'Keep your knees straight and your feet hip-width apart',
      'Hold your arms slightly away from your sides, not raised',
      'Keep your whole body, head to feet, in the frame',
    ],
    silhouetteType: 'front',
  },
  {
    id: 2,
    key: 'left-side',
    name: 'Left side',
    shortName: 'Left',
    requirement: 'Needed for neck, chest, waist and hip',
    instruction: 'Turn a quarter turn so your left side faces the camera.',
    tips: [
      'Turn a full 90°; a half turn is not read as a profile',
      'Stand tall without arching your back',
      'Keep your whole body, head to feet, in the frame',
    ],
    silhouetteType: 'side',
  },
  {
    id: 3,
    key: 'right-side',
    name: 'Right side',
    shortName: 'Right',
    requirement: 'Optional, improves confidence',
    instruction: 'Turn around so your right side faces the camera.',
    tips: [
      'Keep equal weight on both feet',
      'Keep your chin level and look straight ahead',
      'Don’t lean towards or away from the camera',
    ],
    silhouetteType: 'side',
  },
  {
    id: 4,
    key: 'back',
    name: 'Back view',
    shortName: 'Back',
    requirement: 'Optional, improves confidence',
    instruction: 'Turn your back to the camera and stand as you did for the front photo.',
    tips: [
      'Hold your arms slightly away from your sides, not raised',
      'Keep your knees straight and your feet hip-width apart',
      'Keep your head up so your neckline is visible',
    ],
    silhouetteType: 'back',
  },
];

/** Display order of the field categories below. */
export const MEASUREMENT_CATEGORIES = ['Stature', 'Upper Body', 'Torso', 'Lower Body'];

export const MANUAL_MEASUREMENT_FIELDS = [
  {
    id: 'height',
    label: 'Total Height',
    description: 'Barefoot vertical stature from crown to floor',
    placeholder: 'e.g., 178',
    minCm: 90,
    maxCm: 250,
    minIn: 35,
    maxIn: 98,
    category: 'Stature',
  },
  {
    id: 'neck',
    label: 'Neck Circumference',
    description: 'Measured around the base of the neck where collar rests',
    placeholder: 'e.g., 39',
    minCm: 25,
    maxCm: 60,
    minIn: 10,
    maxIn: 24,
    category: 'Upper Body',
  },
  {
    id: 'shoulderWidth',
    label: 'Shoulder Width',
    description: 'Distance across upper back from shoulder bone tip to tip',
    placeholder: 'e.g., 45',
    minCm: 30,
    maxCm: 70,
    minIn: 12,
    maxIn: 28,
    category: 'Upper Body',
  },
  {
    id: 'chest',
    label: 'Chest / Bust Circumference',
    description: 'Around the fullest point of chest, tape parallel to floor',
    placeholder: 'e.g., 102',
    minCm: 50,
    maxCm: 180,
    minIn: 20,
    maxIn: 71,
    category: 'Torso',
  },
  {
    id: 'underbust',
    label: 'Underbust (Band)',
    description: 'Snug around the ribcage, directly under the bust, tape level',
    placeholder: 'e.g., 76',
    minCm: 50,
    maxCm: 160,
    minIn: 20,
    maxIn: 63,
    category: 'Torso',
    optIn: 'bust',
  },
  {
    id: 'waist',
    label: 'Waist Circumference',
    description: 'Around natural waistline, typically above the navel',
    placeholder: 'e.g., 84',
    minCm: 45,
    maxCm: 160,
    minIn: 18,
    maxIn: 63,
    category: 'Torso',
  },
  {
    id: 'hip',
    label: 'Hip Circumference',
    description: 'Around the widest point of hips and buttocks',
    placeholder: 'e.g., 98',
    minCm: 55,
    maxCm: 180,
    minIn: 22,
    maxIn: 71,
    category: 'Lower Body',
  },
  {
    id: 'armLength',
    label: 'Arm Length (Sleeve)',
    description: 'From shoulder bone point down along arm to wrist bone',
    placeholder: 'e.g., 64',
    minCm: 35,
    maxCm: 95,
    minIn: 14,
    maxIn: 38,
    category: 'Upper Body',
  },
  {
    id: 'legLength',
    label: 'Inseam / Leg Length',
    description: 'From inner crotch down the leg to the bottom of the ankle',
    placeholder: 'e.g., 81',
    minCm: 40,
    maxCm: 110,
    minIn: 16,
    maxIn: 44,
    category: 'Lower Body',
  },
];
