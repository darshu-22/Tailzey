/**
 * Tape measurements (cm) of the MakeHuman body, the same way as the asset build's reference
 * (backend/scripts/mannequin/measure.py) — keep the two in step.
 *
 * A girth is the convex hull of the torso's horizontal slice, like a tape that bridges hollows.
 * Slice points are joined through the mesh edges they lie on into loops; the torso is the widest
 * loop across the centre line (the arms hang apart from it in the A-pose).
 */

const DM_TO_CM = 10;

/** Convex hull of (x, z) points, counter-clockwise. */
export function convexHull(points) {
  if (points.length < 3) return [...points];
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (seq) => {
    const out = [];
    for (const q of seq) {
      while (out.length >= 2 && turn(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...half(pts), ...half([...pts].reverse())];
}

function hullPerimeter(points) {
  const hull = convexHull(points);
  if (hull.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < hull.length; i += 1) {
    const [a, b] = [hull[i], hull[(i + 1) % hull.length]];
    sum += Math.hypot(a[0] - b[0], a[1] - b[1]);
  }
  return sum;
}

/**
 * Closed loops of 3D points where the plane through `origin` with `normal` cuts the triangles
 * `tris` (flat indices). Points are joined through the mesh edges they lie on.
 */
export function slicePlane(p, tris, origin, normal) {
  const side = (v) =>
    (p[v * 3] - origin[0]) * normal[0] + (p[v * 3 + 1] - origin[1]) * normal[1] + (p[v * 3 + 2] - origin[2]) * normal[2];
  const points = new Map();
  const parent = new Map();
  const root = (k) => {
    while (parent.get(k) !== k) {
      parent.set(k, parent.get(parent.get(k)));
      k = parent.get(k);
    }
    return k;
  };
  for (let t = 0; t < tris.length; t += 3) {
    const keys = [];
    for (let e = 0; e < 3; e += 1) {
      const a = tris[t + e];
      const b = tris[t + ((e + 1) % 3)];
      const ya = side(a);
      const yb = side(b);
      if (ya * yb >= 0) continue;
      const k = Math.min(a, b) * 65536 + Math.max(a, b);
      if (!points.has(k)) {
        const s = ya / (ya - yb);
        points.set(k, [0, 1, 2].map((c) => p[a * 3 + c] + s * (p[b * 3 + c] - p[a * 3 + c])));
        parent.set(k, k);
      }
      keys.push(k);
    }
    if (keys.length === 2) parent.set(root(keys[0]), root(keys[1]));
  }
  const loops = new Map();
  for (const [k, point] of points) {
    const r = root(k);
    if (!loops.has(r)) loops.set(r, []);
    loops.get(r).push(point);
  }
  return [...loops.values()];
}

/** Closed (x, z) loops where the horizontal plane at height y cuts the triangles `tris`. */
export const sliceLoops = (p, tris, y) =>
  slicePlane(p, tris, [0, y, 0], [0, 1, 0]).map((loop) => loop.map((q) => [q[0], q[2]]));

export function girth(p, tris, y) {
  let torso = null;
  let widest = -1;
  for (const loop of sliceLoops(p, tris, y)) {
    const xs = loop.map((q) => q[0]);
    const [min, max] = [Math.min(...xs), Math.max(...xs)];
    if (min < 0 && max > 0 && max - min > widest) [torso, widest] = [loop, max - min];
  }
  return torso ? hullPerimeter(torso) * DM_TO_CM : 0;
}

export function vertex(p, i) {
  return [p[i * 3], p[i * 3 + 1], p[i * 3 + 2]];
}

export function centre(p, verts) {
  const c = [0, 0, 0];
  for (const v of verts) for (let k = 0; k < 3; k += 1) c[k] += p[v * 3 + k] / verts.length;
  return c;
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/**
 * @param trisFor (key) → triangles to slice for that girth (all body triangles, or a band).
 * @returns cm values for height, neck, chest, underbust, waist, hip, shoulderWidth, armLength, legLength.
 */
export function measureBody(p, lm, trisFor) {
  const j = Object.fromEntries(Object.entries(lm.joints).map(([name, verts]) => [name, centre(p, verts)]));
  const [right, left] = lm.shoulderTips.map((i) => vertex(p, i));
  const arm = (tip, side) => distance(tip, j[`${side}-elbow`]) + distance(j[`${side}-elbow`], j[`${side}-hand`]);
  const out = {};
  for (const [key, level] of Object.entries(lm.levels)) out[key] = girth(p, trisFor(key), p[level * 3 + 1]);
  out.neck = girth(p, trisFor('neck'), j.neck[1]);
  return {
    ...out,
    height: (p[lm.top * 3 + 1] - j.ground[1]) * DM_TO_CM,
    shoulderWidth: distance(right, left) * DM_TO_CM,
    armLength: ((arm(right, 'r') + arm(left, 'l')) / 2) * DM_TO_CM,
    legLength: (p[lm.crotch * 3 + 1] - (j['r-ankle'][1] + j['l-ankle'][1]) / 2) * DM_TO_CM,
  };
}
