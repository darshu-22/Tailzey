/**
 * Cloth relaxation by position-based dynamics, run after a garment is fitted to a body whose
 * shape differs from the one it was modelled on (a fuller bust, a smaller waist…):
 * - collision: fabric is pushed out to at least THICKNESS above the skin, and above any layer
 *   already draped underneath (a top over trousers), along the normal of the nearest point, so
 *   neither skin nor an inner layer pokes through;
 * - stretch: every fabric edge is pulled back towards its fitted length, so pushed-out fabric
 *   spreads smoothly over the bulge instead of tenting at single vertices;
 * - smoothing (optional, Taubin λ/μ so the garment doesn't shrink): fabric relaxes towards its
 *   neighbours, so it bridges hollows (under the bust, the small of the back) like real cloth
 *   instead of shrink-wrapping them;
 * - gravity: free fabric (not resting on skin) settles slightly, so hems hang.
 * Units are decimetres; positions are updated in place.
 */

import { nearestPoints } from './nearest';

const THICKNESS = 0.035; // 3.5 mm of fabric clearance
const ITERATIONS = 16;
const STIFFNESS = 0.85;
const GRAVITY = 0.004; // dm per iteration, for fabric not touching skin
const REFRESH = 4; // re-find the nearest collider points every few iterations, as the cloth moves

/** Unique edges of `triangles` (garment-vertex indices). */
export function uniqueEdges(triangles) {
  const seen = new Set();
  const out = [];
  for (let t = 0; t < triangles.length; t += 3) {
    for (let k = 0; k < 3; k += 1) {
      const a = triangles[t + k];
      const b = triangles[t + ((k + 1) % 3)];
      const key = Math.min(a, b) * 65536 + Math.max(a, b);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a, b);
      }
    }
  }
  return Uint32Array.from(out);
}

function collide(positions, { nearest, points: skin, normals }, touching) {
  for (let i = 0; i < nearest.length; i += 1) {
    const v = nearest[i];
    if (v < 0) continue;
    const [p, s] = [i * 3, v * 3];
    const gap =
      (positions[p] - skin[s]) * normals[s] + (positions[p + 1] - skin[s + 1]) * normals[s + 1] + (positions[p + 2] - skin[s + 2]) * normals[s + 2];
    touching[i] = gap < THICKNESS * 2 ? 1 : 0;
    if (gap < THICKNESS) for (let k = 0; k < 3; k += 1) positions[p + k] += (THICKNESS - gap) * normals[s + k];
    else if (!touching[i]) positions[p + 1] -= GRAVITY;
  }
}

function stretch(positions, edges, rest) {
  for (let e = 0; e < rest.length; e += 1) {
    const [a, b] = [edges[e * 2] * 3, edges[e * 2 + 1] * 3];
    const d = [positions[b] - positions[a], positions[b + 1] - positions[a + 1], positions[b + 2] - positions[a + 2]];
    const len = Math.hypot(d[0], d[1], d[2]) || 1e-9;
    const shift = ((len - rest[e]) / len) * 0.5 * STIFFNESS;
    for (let k = 0; k < 3; k += 1) {
      positions[a + k] += d[k] * shift;
      positions[b + k] -= d[k] * shift;
    }
  }
}

function smoothen(positions, edges, amount) {
  const sum = new Float32Array(positions.length);
  const count = new Uint16Array(positions.length / 3);
  for (let e = 0; e < edges.length; e += 2) {
    const [a, b] = [edges[e], edges[e + 1]];
    for (let k = 0; k < 3; k += 1) {
      sum[a * 3 + k] += positions[b * 3 + k];
      sum[b * 3 + k] += positions[a * 3 + k];
    }
    count[a] += 1;
    count[b] += 1;
  }
  for (let v = 0; v < count.length; v += 1) {
    if (!count[v]) continue;
    for (let k = 0; k < 3; k += 1) positions[v * 3 + k] += amount * (sum[v * 3 + k] / count[v] - positions[v * 3 + k]);
  }
}

/**
 * @param colliders [{ points, normals, count }]: the skin first, then layers draped underneath.
 * @param smooth 0…0.5: how strongly fabric bridges hollows (0 keeps every modelled detail).
 */
export function drape(positions, edges, colliders, smooth = 0) {
  const surfaces = colliders.map((c) => ({ ...c, nearest: null }));
  const refresh = () => {
    for (const s of surfaces) s.nearest = nearestPoints(positions, s.points, s.count, 3);
  };
  const rest = new Float32Array(edges.length / 2);
  for (let e = 0; e < rest.length; e += 1) {
    const [a, b] = [edges[e * 2] * 3, edges[e * 2 + 1] * 3];
    rest[e] = Math.hypot(positions[a] - positions[b], positions[a + 1] - positions[b + 1], positions[a + 2] - positions[b + 2]);
  }
  const touching = new Uint8Array(positions.length / 3);
  for (let it = 0; it < ITERATIONS; it += 1) {
    if (it % REFRESH === 0) refresh();
    if (smooth) smoothen(positions, edges, it % 2 ? -1.06 * smooth : smooth);
    for (const surface of surfaces) collide(positions, surface, touching);
    stretch(positions, edges, rest);
  }
  refresh();
  for (const surface of surfaces) collide(positions, surface, touching);
  return positions;
}
