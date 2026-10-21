/** Tiny 2D vector helpers for points `{ x, y }` in canvas pixels. */

export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a, k) => ({ x: a.x * k, y: a.y * k });
export const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
export const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
export const len = (a) => Math.hypot(a.x, a.y);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Unit vector; `fallback` when the input is (almost) zero length. */
export function norm(a, fallback = { x: 1, y: 0 }) {
  const l = len(a);
  return l < 1e-6 ? fallback : { x: a.x / l, y: a.y / l };
}

/** Perpendicular (rotated +90° in screen space). */
export const perp = (a) => ({ x: -a.y, y: a.x });

/** Point `p` moved by `k` along unit direction `dir`. */
export const along = (p, dir, k) => ({ x: p.x + dir.x * k, y: p.y + dir.y * k });

/** Trace a closed polygon into a Path2D. */
export function polygonPath(points) {
  const path = new Path2D();
  points.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.y) : path.lineTo(p.x, p.y)));
  path.closePath();
  return path;
}

/**
 * Outline of a tapered tube following a polyline (an arm or a leg).
 * @param {Array<{x,y}>} spine   centre points, root first
 * @param {number[]} halfWidths  half width at each spine point
 * @returns {{ left: Array<{x,y}>, right: Array<{x,y}>, outline: Array<{x,y}> }}
 */
export function tube(spine, halfWidths) {
  const left = [];
  const right = [];
  spine.forEach((p, i) => {
    const prev = spine[Math.max(0, i - 1)];
    const next = spine[Math.min(spine.length - 1, i + 1)];
    const n = perp(norm(sub(next, prev)));
    left.push(along(p, n, halfWidths[i]));
    right.push(along(p, n, -halfWidths[i]));
  });
  return { left, right, outline: [...left, ...right.reverse()] };
}
