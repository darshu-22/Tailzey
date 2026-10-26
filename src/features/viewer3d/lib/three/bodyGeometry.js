import { SphereGeometry } from 'three';
import { deformBust } from './bustDeform';
import { createProfile, loftGeometry } from './loft';

/**
 * Cross-section profiles of the mannequin, built from bodyDimensions().
 * Torso and legs are in world space; arms are in a local frame (joint at the origin,
 * hanging down −y) and are placed with a rotation about z.
 */

export function torsoProfile(d) {
  const { levels: L, axes, H, shoulderHalf } = d;
  const { chest, waist, hip, neck } = axes;
  return createProfile([
    { y: L.crotch - 0.012 * H, a: hip.a * 0.5, b: hip.b * 0.55 },
    { y: L.seat, a: hip.a * 0.94, b: hip.b * 0.95, z: -0.006 },
    { y: L.hip, a: hip.a, b: hip.b, z: -0.01 },
    { y: L.waist, a: waist.a, b: waist.b },
    { y: L.chest, a: chest.a, b: chest.b, z: 0.006 },
    { y: L.chest + 0.045 * H, a: chest.a * 0.99, b: chest.b * 0.92, z: 0.002 },
    { y: L.shoulder - 0.004 * H, a: shoulderHalf * 0.86, b: chest.b * 0.6, z: -0.006 },
    { y: L.neckBase, a: neck.a * 1.3, b: neck.b * 1.2, z: -0.008 },
    { y: L.chin - 0.015 * H, a: neck.a, b: neck.b, z: -0.004 },
    { y: L.chin + 0.03 * H, a: neck.a * 0.92, b: neck.b * 0.92, z: -0.002 },
  ]);
}

/** Top of the shoulder dome above the arm joint, in upper-arm radii. */
export const ARM_TOP = 0.6;

/** Arm in its local frame: shoulder joint at y = 0, wrist at y = −length, then a mitten hand. */
export function armProfile(d) {
  const { length: L, upperR: r } = d.arm;
  const { s } = d;
  return createProfile([
    { y: ARM_TOP * r, a: 0.35 * r, b: 0.35 * r },
    { y: 0.35 * r, a: 0.88 * r, b: 0.88 * r },
    { y: 0, a: 1.08 * r, b: 1.05 * r },
    { y: -0.25 * L, a: r, b: r * 0.95 },
    { y: -0.47 * L, a: 0.034 * s, b: 0.036 * s },
    { y: -0.62 * L, a: 0.038 * s * d.girth, b: 0.04 * s * d.girth, z: 0.004 },
    { y: -L, a: 0.022 * s, b: 0.028 * s },
    { y: -L - 0.04 * s, a: 0.02 * s, b: 0.042 * s, z: 0.004 },
    { y: -L - 0.09 * s, a: 0.018 * s, b: 0.046 * s, z: 0.006 },
    { y: -L - 0.14 * s, a: 0.014 * s, b: 0.038 * s, z: 0.006 },
    { y: -L - 0.18 * s, a: 0.007 * s, b: 0.02 * s, z: 0.004 },
  ]);
}

/** Leg for side = 1 (right, +x) or −1 (left). */
export function legProfile(d, side) {
  const { levels: L, leg, s, H } = d;
  const x = (offset) => side * (leg.x + offset);
  return createProfile([
    { y: 0.02 * H, a: leg.ankleR * 0.95, b: leg.ankleR, x: x(0.018 * s) },
    { y: L.ankle, a: leg.ankleR, b: leg.ankleR * 1.05, x: x(0.018 * s) },
    { y: L.ankle + 0.06 * s, a: leg.ankleR * 1.1, b: leg.ankleR * 1.15, x: x(0.017 * s), z: -0.004 },
    { y: L.knee - 0.1 * s, a: leg.calfR * 0.92, b: leg.calfR, x: x(0.012 * s), z: -0.01 },
    { y: L.knee, a: leg.kneeR, b: leg.kneeR, x: x(0.008 * s) },
    { y: L.knee + 0.08 * s, a: leg.thighR * 0.7, b: leg.thighR * 0.72, x: x(0.006 * s), z: 0.004 },
    { y: L.crotch - 0.06 * s, a: leg.thighR * 0.94, b: leg.thighR * 0.95, x: x(0.002 * s) },
    { y: L.crotch, a: leg.thighR, b: leg.thighR, x: x(0) },
    { y: L.crotch + 0.09 * s, a: leg.thighR * 0.7, b: leg.thighR * 0.7, x: x(-0.004 * s) },
  ]);
}

/** Every part of the body as { geometry, position?: [x,y,z], rotationZ?, scale?: [x,y,z] }. */
export function buildBodyParts(d) {
  const { H, s, levels: L, arm, leg } = d;
  const torso = loftGeometry(torsoProfile(d), { radial: d.bust ? 80 : 56, spacing: d.bust ? 0.006 : 0.01, capBottom: true, capTop: true });
  const parts = [{ geometry: d.bust ? deformBust(torso, d.bust) : torso }];

  const armGeometry = loftGeometry(armProfile(d), { radial: 32, spacing: 0.01, capBottom: true, capTop: true });
  for (const side of [1, -1]) {
    parts.push({ geometry: side === 1 ? armGeometry : armGeometry.clone(), position: [side * arm.jointX, arm.jointY, 0], rotationZ: side * arm.angle });
    parts.push({ geometry: loftGeometry(legProfile(d, side), { radial: 36, spacing: 0.01, capBottom: true, capTop: true }) });
    parts.push({
      geometry: new SphereGeometry(1, 32, 16),
      position: [side * (leg.x + 0.022 * s), 0.034 * s, 0.045 * s],
      scale: [0.045 * s, 0.034 * s, 0.13 * s],
    });
  }

  // Head: an ellipsoid from the crown down to just below the chin, so the neck blends into it.
  const headHalf = (H - L.chin) / 2 + 0.003 * H;
  parts.push({
    geometry: new SphereGeometry(1, 48, 32),
    position: [0, H - headHalf, 0.004],
    scale: [0.046 * H, headHalf, 0.056 * H],
  });
  return parts;
}
