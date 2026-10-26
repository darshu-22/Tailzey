import { nearestPoints } from './nearest';

/**
 * What a draped garment covers on this body. The asset build lists the skin each garment covers
 * on MakeHuman's average body; a fuller body can bulge past that list, and an inner layer (the
 * trousers under a tee) can show through the outer one. So after the drape, a point counts as
 * covered when the nearest fabric vertex is close, the point is on the fabric's inner side (or
 * pokes through it by less than POKE_DM, between coarse fabric vertices), and it sits right under
 * it rather than beside it (like the throat just above a collar).
 */

const REACH_DM = 0.3;
const LATERAL_DM = 0.08;
const POKE_DM = 0.05;

/** Uint8Array over the first `count` points: 1 where `fabric` ({ positions, normals }, dm) covers it. */
export function coveredBy(points, count, fabric) {
  const out = new Uint8Array(count);
  const { positions: f, normals: n } = fabric;
  const nearest = nearestPoints(points.subarray(0, count * 3), f, f.length / 3);
  for (let v = 0; v < count; v += 1) {
    const g = nearest[v];
    if (g < 0) continue;
    const d = [0, 1, 2].map((k) => points[v * 3 + k] - f[g * 3 + k]);
    const along = d[0] * n[g * 3] + d[1] * n[g * 3 + 1] + d[2] * n[g * 3 + 2];
    const dist2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
    if (along < POKE_DM && dist2 < REACH_DM ** 2 && dist2 - along ** 2 < LATERAL_DM ** 2) out[v] = 1;
  }
  return out;
}

/**
 * Hide skin covered by `fabric`, eroded by one ring along `edges` (vertex pairs) so skin at a
 * sleeve or neck opening stays drawn instead of opening a hole there.
 */
export function hideCoveredSkin(hidden, skin, count, fabric, edges) {
  const covered = coveredBy(skin, count, fabric);
  const exposed = new Uint8Array(count);
  for (let e = 0; e < edges.length; e += 2) {
    const [a, b] = [edges[e], edges[e + 1]];
    if (!covered[b] && !hidden[b]) exposed[a] = 1;
    if (!covered[a] && !hidden[a]) exposed[b] = 1;
  }
  for (let v = 0; v < count; v += 1) if (covered[v] && !exposed[v]) hidden[v] = 1;
}
