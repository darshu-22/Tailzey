/**
 * Nearest-point lookups on a uniform grid. Searches widen ring by ring (up to `maxRings` cells)
 * until a candidate is found, so points deep inside a fuller body still find their skin.
 */

const CELL = 0.25; // dm
const cellOf = (v) => Math.floor(v / CELL) + 512;
const keyOf = (cx, cy, cz) => (cx * 1024 + cy) * 1024 + cz;

export function buildGrid(points, count) {
  const grid = new Map();
  for (let v = 0; v < count; v += 1) {
    const key = keyOf(cellOf(points[v * 3]), cellOf(points[v * 3 + 1]), cellOf(points[v * 3 + 2]));
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(v);
  }
  return grid;
}

/** Index of the point in `grid` (over `points`) nearest to (x, y, z), or −1. */
export function nearestIn(grid, points, x, y, z, maxRings) {
  const [cx, cy, cz] = [cellOf(x), cellOf(y), cellOf(z)];
  let best = -1;
  let bestD = Infinity;
  for (let r = 1; r <= maxRings && best < 0; r += 1) {
    for (let dx = -r; dx <= r; dx += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dz = -r; dz <= r; dz += 1) {
          for (const v of grid.get(keyOf(cx + dx, cy + dy, cz + dz)) ?? []) {
            const d = (points[v * 3] - x) ** 2 + (points[v * 3 + 1] - y) ** 2 + (points[v * 3 + 2] - z) ** 2;
            if (d < bestD) [bestD, best] = [d, v];
          }
        }
      }
    }
  }
  return best;
}

/** For every query point, the nearest of the first `count` target points (−1 when none is near). */
export function nearestPoints(queries, targets, count, maxRings = 1) {
  const grid = buildGrid(targets, count);
  const out = new Int32Array(queries.length / 3);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = nearestIn(grid, targets, queries[i * 3], queries[i * 3 + 1], queries[i * 3 + 2], maxRings);
  }
  return out;
}
