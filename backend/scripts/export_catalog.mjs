/**
 * Exports the frontend's catalog + measurement rules to backend/app/data/catalog.json.
 * The frontend data modules stay the single source of truth; re-run this whenever
 * src/shared/data/designerData.js, measurementData.js or resultsData.js change:
 *
 *   node backend/scripts/export_catalog.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GARMENTS, COLORS, STYLES, FITS } from '../../src/shared/data/designerData.js';
import { MANUAL_MEASUREMENT_FIELDS } from '../../src/shared/data/measurementData.js';
import {
  STANDARD_LETTER_SIZES,
  CATEGORY_NUMERIC_SIZES,
  FIT_PREFERENCES,
} from '../../src/shared/data/resultsData.js';

const here = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(here, '../app/data/catalog.json');

const catalog = {
  garments: GARMENTS.map((g) => ({
    id: g.id,
    name: g.name,
    defaultOptions: g.defaultOptions,
    customControls: Object.fromEntries(
      Object.entries(g.customControls || {}).map(([key, control]) => [
        key,
        { label: control.label, options: control.options.map((o) => o.id) },
      ])
    ),
  })),
  colors: COLORS.map((c) => c.id),
  styles: STYLES.map((s) => s.id),
  fits: FITS.map((f) => f.id),
  fitPreferences: FIT_PREFERENCES.map((f) => f.id),
  letterSizes: STANDARD_LETTER_SIZES.map((s) => s.id),
  numericSizes: Object.fromEntries(
    Object.entries(CATEGORY_NUMERIC_SIZES).map(([k, sizes]) => [k, sizes.map((s) => s.id)])
  ),
  measurementFields: MANUAL_MEASUREMENT_FIELDS.map((f) => ({
    id: f.id,
    label: f.label,
    minCm: f.minCm,
    maxCm: f.maxCm,
    minIn: f.minIn,
    maxIn: f.maxIn,
  })),
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Wrote ${outFile}`);
