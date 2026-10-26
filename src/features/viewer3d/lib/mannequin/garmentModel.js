import { readArray } from './binaryPack';

/**
 * A MakeHuman garment or accessory (CC0), fitted to whatever body the morphs produced: each
 * vertex is Σ wᵢ·body[refᵢ] + offset ⊙ scale, where scale per axis is the body's own span between
 * two reference vertices over the span the garment was modelled on. Positions in decimetres.
 */

export function readGarment(entry, buffer) {
  const a = entry.arrays;
  const vertex = readArray(buffer, a.vertex); // render vertex → garment vertex (split at UV seams)
  const index = readArray(buffer, a.index); // render triangles
  return {
    refs: readArray(buffer, a.refs),
    weights: readArray(buffer, a.weights),
    offsets: readArray(buffer, a.offsets),
    vertex,
    uv: readArray(buffer, a.uv),
    index,
    triangles: Uint32Array.from(index, (r) => vertex[r]), // the same triangles, by garment vertex
    hide: readArray(buffer, a.hide), // skin vertices the garment covers
    scale: entry.scale,
  };
}

function axisScale(body, spec, axis) {
  if (!spec) return 1;
  const [a, b, den] = spec;
  return Math.abs(body[a * 3 + axis] - body[b * 3 + axis]) / den;
}

/** Smooth normals of `positions` over `triangles` (both indexed by the same vertices). */
export function vertexNormals(positions, triangles) {
  const n = new Float32Array(positions.length);
  for (let t = 0; t < triangles.length; t += 3) {
    const [a, b, c] = [triangles[t] * 3, triangles[t + 1] * 3, triangles[t + 2] * 3];
    const e1 = [0, 1, 2].map((k) => positions[b + k] - positions[a + k]);
    const e2 = [0, 1, 2].map((k) => positions[c + k] - positions[a + k]);
    const face = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    for (const v of [a, b, c]) for (let k = 0; k < 3; k += 1) n[v + k] += face[k];
  }
  for (let v = 0; v < n.length; v += 3) {
    const len = Math.hypot(n[v], n[v + 1], n[v + 2]) || 1;
    for (let k = 0; k < 3; k += 1) n[v + k] /= len;
  }
  return n;
}

/** Garment vertex positions (dm) on `body`; `easeDm` pushes the fabric out along its normals. */
export function fitGarment(garment, body, easeDm = 0) {
  const { refs, weights, offsets } = garment;
  const scale = ['x', 'y', 'z'].map((axis, i) => axisScale(body, garment.scale[axis], i));
  const count = weights.length / 3;
  const out = new Float32Array(count * 3);
  for (let v = 0; v < count; v += 1) {
    for (let axis = 0; axis < 3; axis += 1) {
      let value = offsets[v * 3 + axis] * scale[axis];
      for (let k = 0; k < 3; k += 1) value += weights[v * 3 + k] * body[refs[v * 3 + k] * 3 + axis];
      out[v * 3 + axis] = value;
    }
  }
  if (easeDm) {
    const normals = vertexNormals(out, garment.triangles);
    for (let i = 0; i < out.length; i += 1) out[i] += normals[i] * easeDm;
  }
  return out;
}
