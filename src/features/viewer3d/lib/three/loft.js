import { BufferGeometry, Float32BufferAttribute } from 'three';

/**
 * Ring-loft geometry: smooth tubes through elliptical cross-sections stacked along y.
 * A section is { y, a, b, x?, z? } — half-width a (along x), half-depth b (along z), centre (x, z).
 * Between sections the values follow a monotone cubic (Fritsch–Carlson), so the surface
 * is smooth without overshooting into bulges the measurements don't have.
 */

const KEYS = ['a', 'b', 'x', 'z'];

function monotoneTangents(xs, ys) {
  const n = xs.length;
  const d = [];
  for (let i = 0; i < n - 1; i += 1) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i += 1) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i += 1) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const alpha = m[i] / d[i];
    const beta = m[i + 1] / d[i];
    const sum = alpha * alpha + beta * beta;
    if (sum > 9) {
      const tau = 3 / Math.sqrt(sum);
      m[i] = tau * alpha * d[i];
      m[i + 1] = tau * beta * d[i];
    }
  }
  return m;
}

/** A sampler over sections: profile.sample(y) → { y, a, b, x, z }. */
export function createProfile(sections) {
  const sorted = [...sections].sort((p, q) => p.y - q.y).map((p) => ({ x: 0, z: 0, ...p }));
  const ys = sorted.map((p) => p.y);
  const tangents = Object.fromEntries(KEYS.map((k) => [k, monotoneTangents(ys, sorted.map((p) => p[k]))]));
  const yMin = ys[0];
  const yMax = ys[ys.length - 1];

  function sample(yIn) {
    const y = Math.min(yMax, Math.max(yMin, yIn));
    let i = 0;
    while (i < ys.length - 2 && y > ys[i + 1]) i += 1;
    const h = ys[i + 1] - ys[i];
    const t = h > 0 ? (y - ys[i]) / h : 0;
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    const out = { y };
    for (const k of KEYS) {
      out[k] = h00 * sorted[i][k] + h10 * h * tangents[k][i] + h01 * sorted[i + 1][k] + h11 * h * tangents[k][i + 1];
    }
    return out;
  }

  return { sample, yMin, yMax };
}

/**
 * Build the surface of `profile` between yFrom and yTo.
 * @param {object} opts radial segments, ring spacing (m), inflate (m added to a and b, or a
 *   function of y), capBottom / capTop to close the ends.
 */
export function loftGeometry(profile, opts = {}) {
  const {
    yFrom = profile.yMin,
    yTo = profile.yMax,
    radial = 40,
    spacing = 0.012,
    inflate = 0,
    capBottom = false,
    capTop = false,
  } = opts;
  const rings = Math.max(2, Math.ceil((yTo - yFrom) / spacing) + 1);
  const positions = [];
  const indices = [];

  const inflateAt = typeof inflate === 'function' ? inflate : () => inflate;
  for (let i = 0; i < rings; i += 1) {
    const r = profile.sample(yFrom + ((yTo - yFrom) * i) / (rings - 1));
    const grow = inflateAt(r.y);
    const a = Math.max(0.001, r.a + grow);
    const b = Math.max(0.001, r.b + grow);
    for (let j = 0; j < radial; j += 1) {
      const theta = (j / radial) * Math.PI * 2;
      positions.push(r.x + a * Math.cos(theta), r.y, r.z + b * Math.sin(theta));
    }
  }

  const v = (i, j) => i * radial + (j % radial);
  for (let i = 0; i < rings - 1; i += 1) {
    for (let j = 0; j < radial; j += 1) {
      indices.push(v(i, j), v(i + 1, j), v(i, j + 1));
      indices.push(v(i, j + 1), v(i + 1, j), v(i + 1, j + 1));
    }
  }

  const addCap = (ring, facingUp) => {
    const c = profile.sample(ring === 0 ? yFrom : yTo);
    const centre = positions.length / 3;
    positions.push(c.x, c.y, c.z);
    for (let j = 0; j < radial; j += 1) {
      if (facingUp) indices.push(centre, v(ring, j + 1), v(ring, j));
      else indices.push(centre, v(ring, j), v(ring, j + 1));
    }
  };
  if (capBottom) addCap(0, false);
  if (capTop) addCap(rings - 1, true);

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
