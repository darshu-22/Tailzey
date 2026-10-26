import { centre, convexHull, slicePlane, sliceLoops } from './measureBody';

/**
 * Ethnic wear on the realistic mannequin. No open-source kurta exists, so one is cut from the
 * fitted body itself (decimetres):
 * - body: a ring per horizontal slice from the hem to the armpits, following the convex hull of
 *   the slice (so it bridges the bust and back like cloth), with ease, flaring into a skirt below
 *   the hips;
 * - sleeves: tubes along each arm (shoulder → elbow → wrist), sized from the arm's own skin;
 * - neck: a yoke from the armpits to the neck, and a band (mandarin) collar.
 * Returns { positions, triangles } for the cloth physics and the renderer.
 */

const SEGMENTS = 48;
const SLEEVE_SEGMENTS = 24;
const STEP_DM = 0.15;
const EASE_DM = 0.18;
const SLEEVE_EASE_DM = 0.12;
const FLARE = 0.22;
const COLLAR_DM = 0.32;
const SLEEVE_INSET_DM = 0.25;

/** The convex hull of a slice, with points added along its edges so rays can sample it. */
function denseHull(points) {
  const hull = convexHull(points);
  const out = [];
  hull.forEach((p, i) => {
    const q = hull[(i + 1) % hull.length];
    const steps = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 0.04));
    for (let s = 0; s < steps; s += 1) out.push([p[0] + ((q[0] - p[0]) * s) / steps, p[1] + ((q[1] - p[1]) * s) / steps]);
  });
  return out;
}

/** Distance from the centre to the hull along `angle` (0 when the ray finds nothing). */
function hullAt(points, angle, cx, cz) {
  let best = 0;
  const [dx, dz] = [Math.cos(angle), Math.sin(angle)];
  for (const [x, z] of points) {
    const along = (x - cx) * dx + (z - cz) * dz;
    const across = Math.abs((x - cx) * dz - (z - cz) * dx);
    if (across < 0.12 && along > best) best = along;
  }
  return best;
}

/** A ring of `n` points around (cx, y, cz) with radius(angle). */
const ring = (n, cx, y, cz, radius) =>
  Array.from({ length: n }, (_, j) => {
    const a = (j / n) * Math.PI * 2;
    const r = radius(a);
    return [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
  });

function stitch(rings, closed, out, flip = false) {
  const base = out.points.length;
  rings.forEach((r) => out.points.push(...r));
  const n = rings[0].length;
  for (let i = 0; i < rings.length - 1; i += 1) {
    for (let j = 0; j < (closed ? n : n - 1); j += 1) {
      const [a, b] = [base + i * n + j, base + i * n + ((j + 1) % n)];
      const [c, d] = [a + n, b + n];
      if (flip) out.triangles.push(a, b, c, b, d, c);
      else out.triangles.push(a, c, b, b, c, d);
    }
  }
}

/** Radii per angle for each slice from `from` to `to`, smoothed vertically. */
function torsoRings(skin, tris, from, to, cx, cz, armX, ease) {
  const levels = [];
  for (let y = from; y <= to + 1e-6; y += STEP_DM) levels.push(y);
  let previous = null;
  const radii = levels.reverse().map((y) => {
    const loops = sliceLoops(skin, tris, y).filter((l) => Math.abs(l.reduce((s, p) => s + p[0], 0) / l.length) < armX);
    const hull = denseHull(loops.flat());
    const r = Array.from({ length: SEGMENTS }, (_, j) => hullAt(hull, (j / SEGMENTS) * Math.PI * 2, cx, cz) || previous?.[j] || 0.5);
    previous = r;
    return r;
  });
  const smoothRadii = radii.map((r, i) => r.map((v, j) => (v * 2 + (radii[i - 1]?.[j] ?? v) + (radii[i + 1]?.[j] ?? v)) / 4));
  // The skirt flares from the hips (55% of the way down from the armpits) to the hem.
  const hipY = to - (to - from) * 0.55;
  return levels.map((y, i) => {
    const flare = y < hipY ? 1 + FLARE * ((hipY - y) / (hipY - from)) : 1;
    return ring(SEGMENTS, cx, y, cz, (a) => (smoothRadii[i][Math.round((a / (Math.PI * 2)) * SEGMENTS) % SEGMENTS] + ease) * flare);
  }).reverse();
}

/** Arm radius at `c`: the cross-section perpendicular to `axis`, the loop that surrounds `c`. */
function armRadius(skin, tris, c, axis) {
  let best = null;
  for (const loop of slicePlane(skin, tris, c, axis)) {
    const m = [0, 1, 2].map((k) => loop.reduce((s, q) => s + q[k], 0) / loop.length);
    const d = Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2]);
    if (!best || d < best.d) best = { d, loop };
  }
  if (!best || best.d > 0.4) return 0.35;
  return Math.max(...best.loop.map((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2])));
}

function sleeveRings(skin, tris, path, length) {
  const stations = [];
  const segs = path.slice(1).map((p, i) => ({ a: path[i], b: p, len: Math.hypot(...p.map((v, k) => v - path[i][k])) }));
  const total = segs.reduce((s, g) => s + g.len, 0) * length;
  for (let s = 0, at = 0, i = 0; s <= total + 1e-6 && i < segs.length; s += STEP_DM) {
    while (i < segs.length - 1 && s > at + segs[i].len) [at, i] = [at + segs[i].len, i + 1];
    const { a, b, len } = segs[i];
    const axis = b.map((v, k) => (v - a[k]) / len);
    const c = a.map((v, k) => v + axis[k] * (s - at));
    stations.push({ c, axis, r: armRadius(skin, tris, c, axis) });
  }
  // A tapering sleeve: radii smoothed along the arm and kept within 1.3× the sleeve's median, so
  // the armpit's skin doesn't balloon the top of the sleeve.
  const median = [...stations.map((st) => st.r)].sort((x, y) => x - y)[Math.floor(stations.length / 2)];
  const raw = stations.map((st) => Math.min(st.r, median * 1.3));
  return stations.map(({ c, axis }, i) => {
    const near = raw.slice(Math.max(0, i - 2), i + 3);
    const r = near.reduce((x, y) => x + y, 0) / near.length;
    const u = Math.abs(axis[2]) < 0.9 ? [axis[1], -axis[0], 0] : [0, axis[2], -axis[1]];
    const un = Math.hypot(...u);
    const e1 = u.map((v) => v / un);
    const e2 = [axis[1] * e1[2] - axis[2] * e1[1], axis[2] * e1[0] - axis[0] * e1[2], axis[0] * e1[1] - axis[1] * e1[0]];
    return Array.from({ length: SLEEVE_SEGMENTS }, (_, j) => {
      const t = (j / SLEEVE_SEGMENTS) * Math.PI * 2;
      return c.map((v, k) => v + (Math.cos(t) * e1[k] + Math.sin(t) * e2[k]) * (r + SLEEVE_EASE_DM));
    });
  });
}

/**
 * @param skin body positions (dm); tris skin triangles; lm landmarks;
 * @param options { hemY, sleeve (0 = sleeveless, else fraction of arm length), easeDm (fit) }.
 */
export function kurtaMesh(skin, count, tris, lm, { hemY, sleeve, easeDm = 0 }) {
  const joint = (name) => centre(skin, lm.joints[name]);
  const tips = lm.shoulderTips.map((i) => [skin[i * 3], skin[i * 3 + 1], skin[i * 3 + 2]]);
  const neck = joint('neck');
  const armX = Math.abs(tips[0][0]) * 0.8;
  const armpitY = Math.min(tips[0][1], tips[1][1]) - 0.55;
  const out = { points: [], triangles: [] };

  const body = torsoRings(skin, tris, hemY, armpitY, neck[0], neck[2], armX, EASE_DM + easeDm);
  const collarLoop = sliceLoops(skin, tris, neck[1]).flat();
  const collar = [0, 0.5, 1].map((t) =>
    ring(SEGMENTS, neck[0], neck[1] + COLLAR_DM * t, neck[2], (a) => hullAt(collarLoop, a, neck[0], neck[2]) + 0.1 - 0.02 * t)
  );
  const top = body[body.length - 1];
  const yoke = [1, 2, 3, 4, 5, 6].map((i) => top.map((p, j) => p.map((v, k) => v + (collar[0][j][k] - v) * (i / 7))));
  stitch([...body, ...yoke, ...collar], true, out);

  if (sleeve > 0) {
    for (const [side, tip] of [['r', tips[0]], ['l', tips[1]]]) {
      // Start a little down the arm, so the sleeve's top edge tucks under the yoke at the shoulder.
      const elbow = joint(`${side}-elbow`);
      const toElbow = elbow.map((v, k) => v - tip[k]);
      const reach = Math.hypot(...toElbow);
      const start = tip.map((v, k) => v + (toElbow[k] / reach) * SLEEVE_INSET_DM);
      const path = [start, elbow, joint(`${side}-hand`)];
      stitch(sleeveRings(skin, tris, path, sleeve), true, out, true);
    }
  }
  return { positions: Float32Array.from(out.points.flat()), triangles: Uint32Array.from(out.triangles) };
}
