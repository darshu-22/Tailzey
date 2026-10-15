import { createMeshBuilder, hexToRgb } from './meshBuilder';

/**
 * Procedural sample mannequin dressed in a simplified garment shape.
 * Proportions are fixed (a standard dress form); only the garment type, fit ease and
 * fabric colour change. It is an illustration, not a model of the user's body.
 */

const WOOD = [0.18, 0.13, 0.1];
const BRASS = [0.85, 0.7, 0.48];
const STEEL = [0.45, 0.4, 0.35];
const PEARL = [0.95, 0.95, 0.92];

const FIT_WAIST_EASE = { slim: 0.88, regular: 1.0, relaxed: 1.15 };

/** Symmetric pair of sleeve/leg segments at ±x. */
function pair(add, x, segments) {
  for (const sign of [-1, 1]) {
    for (const [yb, yt, rb, rt, rgb] of segments) add(yb, yt, rb, rt, 14, rgb, sign * x);
  }
}

const GARMENT_PARTS = {
  trousers(add, fabric, ease) {
    add(0.9, 1.32, 0.62, 0.38, 18, WOOD); // upper torso
    add(0.4, 0.9, 0.54 * ease, 0.62, 18, WOOD);
    add(0.25, 0.45, 0.56 * ease, 0.54 * ease, 20, fabric); // waistband
    add(-0.15, 0.25, 0.62 * ease, 0.56 * ease, 20, fabric); // rise
    for (const x of [-0.26, 0.26]) {
      add(-1.15, -0.15, 0.28, 0.32, 16, fabric, x);
      add(-2.15, -1.15, 0.23, 0.28, 16, fabric, x);
      add(-2.22, -2.15, 0.24, 0.23, 16, fabric, x); // hem
    }
  },
  ethnic(add, fabric, ease) {
    add(1.32, 1.48, 0.28, 0.26, 18, BRASS); // bandhgala collar
    add(0.9, 1.32, 0.76, 0.42, 20, fabric);
    add(0.35, 0.9, 0.64 * ease, 0.76, 20, fabric);
    add(-0.4, 0.35, 0.74, 0.64 * ease, 20, fabric);
    add(-1.25, -0.4, 0.82, 0.74, 20, fabric); // below-knee drop
    add(-1.32, -1.25, 0.83, 0.82, 20, BRASS); // embroidered hem
    pair(add, 0.82, [
      [0.45, 1.15, 0.22, 0.26, fabric],
      [-0.25, 0.45, 0.18, 0.22, fabric],
      [-0.32, -0.25, 0.19, 0.18, BRASS],
    ]);
  },
  shirt(add, fabric, ease) {
    add(1.28, 1.42, 0.32, 0.25, 18, fabric); // collar
    add(0.85, 1.28, 0.72, 0.38, 20, fabric);
    add(0.3, 0.85, 0.58 * ease, 0.72, 20, fabric);
    add(-0.15, 0.3, 0.62 * ease, 0.58 * ease, 20, fabric);
    pair(add, 0.78, [
      [0.4, 1.12, 0.21, 0.25, fabric],
      [-0.35, 0.4, 0.17, 0.21, fabric],
      [-0.42, -0.35, 0.18, 0.17, PEARL],
    ]);
    add(-0.45, -0.15, 0.42, 0.58, 16, WOOD);
  },
  't-shirt'(add, fabric, ease) {
    add(1.24, 1.34, 0.31, 0.25, 18, fabric); // ribbed collar
    add(0.85, 1.24, 0.7, 0.38, 20, fabric);
    add(0.25, 0.85, 0.57 * ease, 0.7, 20, fabric);
    add(-0.2, 0.25, 0.6 * ease, 0.57 * ease, 20, fabric);
    pair(add, 0.76, [[0.7, 1.12, 0.24, 0.26, fabric]]);
    add(-0.5, -0.2, 0.4, 0.56, 16, WOOD);
  },
  jacket(add, fabric, ease) {
    add(1.26, 1.4, 0.34, 0.26, 18, fabric); // collar / lapels
    add(0.85, 1.26, 0.78, 0.42, 22, fabric); // padded shoulders
    add(0.25, 0.85, 0.62 * ease, 0.78, 22, fabric);
    add(-0.35, 0.25, 0.68 * ease, 0.62 * ease, 22, fabric);
    pair(add, 0.84, [
      [0.4, 1.18, 0.23, 0.27, fabric],
      [-0.38, 0.4, 0.19, 0.23, fabric],
    ]);
    add(-0.6, -0.35, 0.42, 0.62, 16, WOOD);
  },
};

/** @returns {{ vertices, normals, colors, indices }} typed arrays for WebGL. */
export function buildMannequinMesh(garmentId, fitId, fabricHex) {
  const { addCylinder: add, build } = createMeshBuilder();
  const fabric = hexToRgb(fabricHex);
  const ease = FIT_WAIST_EASE[fitId] ?? 1.0;

  // Pedestal, stand rod, neck and finial (shared by every garment).
  add(-2.4, -2.32, 0.9, 0.85, 24, WOOD);
  add(-2.32, -2.28, 0.85, 0.4, 24, BRASS);
  add(-2.28, -0.6, 0.05, 0.05, 12, STEEL);
  add(1.68, 1.82, 0.16, 0.04, 16, BRASS);
  add(1.52, 1.68, 0.22, 0.16, 16, BRASS);
  add(1.32, 1.52, 0.26, 0.22, 16, WOOD);

  (GARMENT_PARTS[garmentId] || GARMENT_PARTS.jacket)(add, fabric, ease);
  return build();
}
