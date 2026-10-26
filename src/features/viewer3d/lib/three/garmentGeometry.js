import { ARM_TOP, armProfile, legProfile, torsoProfile } from './bodyGeometry';
import { deformBust } from './bustDeform';
import { createProfile, loftGeometry } from './loft';

/**
 * Garment shells: the body's own cross-sections inflated by the fit's ease, cut at the
 * garment's hem / sleeve length. Long tops flare below the hip instead of following the legs.
 * Returns parts in the same shape as buildBodyParts().
 */

const levelY = (d, { at, offset }) => d.levels[at] + offset * d.H;

/** The body's bust, carried over to a top's shell (fabric bridges the cleavage and drapes). */
const withBust = (d, geometry) => (d.bust ? deformBust(geometry, d.bust, { drape: true }) : geometry);

function topTorso(d, spec, hemY) {
  const { levels: L, H } = d;
  const body = torsoProfile(d);
  const radial = d.bust ? 80 : 56;
  if (hemY >= L.seat) return withBust(d, loftGeometry(body, { yFrom: hemY, yTo: L.neckBase, inflate: spec.ease, radial }));

  // Below the seat the shell hangs from the hip as a gentle A-line rather than hugging the legs.
  const keys = [L.hip, L.waist, L.chest, L.chest + 0.045 * H, L.shoulder - 0.004 * H, L.neckBase];
  const hip = body.sample(L.hip);
  const flare = spec.flare + 0.5 * ((L.seat - hemY) / H);
  const skirt = [
    { y: hemY, a: hip.a * (1 + flare), b: hip.b * (1 + flare * 0.8), z: hip.z },
    { y: (hemY + L.hip) / 2, a: hip.a * (1 + flare * 0.5), b: hip.b * (1 + flare * 0.4), z: hip.z },
  ];
  const profile = createProfile([...skirt, ...keys.map((y) => body.sample(y))]);
  return withBust(d, loftGeometry(profile, { inflate: spec.ease, radial }));
}

function sleeveGeometry(d, spec) {
  const { arm } = d;
  const top = ARM_TOP * arm.upperR;
  // Full ease down the arm, easing off over the shoulder dome so sleeves don't look padded.
  const inflate = (y) => (y <= 0 ? spec.ease + 0.003 : (spec.ease + 0.003) * (1 - 0.7 * (y / top)));
  return loftGeometry(armProfile(d), { yFrom: -spec.sleeve * arm.length, yTo: top, inflate, radial: 32, capTop: true });
}

function topParts(d, spec) {
  const { levels: L, H, arm, axes } = d;
  const parts = [{ geometry: topTorso(d, spec, levelY(d, spec.hem)) }];

  if (spec.sleeve > 0) {
    const sleeve = sleeveGeometry(d, spec);
    for (const side of [1, -1]) {
      parts.push({
        geometry: side === 1 ? sleeve : sleeve.clone(),
        position: [side * arm.jointX, arm.jointY, 0],
        rotationZ: side * arm.angle,
      });
    }
  }

  if (spec.collar) {
    // Band collar: rises from inside the neckline and narrows towards the neck.
    const { a, b } = axes.neck;
    const collar = createProfile([
      { y: L.neckBase - 0.006 * H, a: a * 1.3 + spec.ease, b: b * 1.2 + spec.ease, z: -0.008 },
      { y: L.neckBase + 0.028 * H, a: a * 1.1 + 0.006, b: b * 1.1 + 0.006, z: -0.006 },
    ]);
    parts.push({ geometry: loftGeometry(collar, { radial: 48, spacing: 0.006 }) });
  }
  return parts;
}

function trouserLeg(d, spec, side, hemY) {
  const { levels: L, leg, s } = d;
  const body = legProfile(d, side);
  const kneeA = Math.max(leg.kneeR + 0.02 * s, leg.thighR * 0.72);
  const hemA = kneeA * (0.87 + spec.flare * 2);
  const at = (y, a) => ({ y, a, b: a, x: body.sample(y).x });
  const profile = createProfile([
    at(hemY, hemA),
    at(L.knee, kneeA),
    at(L.knee + 0.08 * s, leg.thighR * 0.82),
    at(L.crotch, Math.min(leg.thighR, d.axes.hip.a * 0.95 - leg.x)),
    at(L.crotch + 0.08 * s, leg.thighR * 0.7),
  ]);
  return loftGeometry(profile, { inflate: spec.ease, radial: 40 });
}

function trouserParts(d, spec) {
  const { levels: L, H, axes } = d;
  const hemY = levelY(d, spec.hem);
  const waistY = L.waist - 0.01 * H;
  const body = torsoProfile(d);
  const { hip } = axes;

  // Seat of the trousers: follows the body from waist to hip, then rounds off below the crotch.
  const pelvis = createProfile([
    { y: L.crotch - 0.02 * H, a: hip.a * 0.55, b: hip.b * 0.6, z: -0.004 },
    { y: L.crotch, a: hip.a * 0.97, b: hip.b * 0.96, z: -0.008 },
    body.sample(L.hip),
    body.sample(waistY),
  ]);
  const band = body.sample(waistY);
  const waistband = createProfile([
    { ...band, y: waistY - 0.012 * H },
    { ...band, y: waistY + 0.004 * H },
  ]);

  return [
    { geometry: loftGeometry(pelvis, { inflate: spec.ease, radial: 56, capBottom: true }) },
    { geometry: loftGeometry(waistband, { inflate: spec.ease + 0.004, radial: 56, spacing: 0.006 }) },
    { geometry: trouserLeg(d, spec, 1, hemY) },
    { geometry: trouserLeg(d, spec, -1, hemY) },
  ];
}

export function buildGarmentParts(d, spec) {
  return spec.kind === 'trousers' ? trouserParts(d, spec) : topParts(d, spec);
}
