/**
 * One level of Catmull–Clark subdivision for the skin's quads, for a smooth, sculpted surface
 * (each quad becomes four). The topology is fixed, so it is analysed once per body model and
 * only positions are recomputed when the body changes shape.
 *
 * New vertices are laid out as [original vertices | edge points | face points].
 */

export function subdivisionTopology(quads, vertexCount) {
  const faceCount = quads.length / 4;
  const edgeIds = new Map();
  const edges = [];
  const edgeFaces = [];
  const faceEdges = new Uint32Array(faceCount * 4);
  for (let f = 0; f < faceCount; f += 1) {
    for (let k = 0; k < 4; k += 1) {
      const a = quads[f * 4 + k];
      const b = quads[f * 4 + ((k + 1) % 4)];
      const key = Math.min(a, b) * 65536 + Math.max(a, b);
      let e = edgeIds.get(key);
      if (e === undefined) {
        e = edges.length / 2;
        edgeIds.set(key, e);
        edges.push(a, b);
        edgeFaces.push(f, -1);
      } else {
        edgeFaces[e * 2 + 1] = f;
      }
      faceEdges[f * 4 + k] = e;
    }
  }
  const edgeCount = edges.length / 2;
  const triangles = new Uint32Array(faceCount * 4 * 6);
  for (let f = 0; f < faceCount; f += 1) {
    const v = quads.subarray(f * 4, f * 4 + 4);
    const e = [0, 1, 2, 3].map((k) => vertexCount + faceEdges[f * 4 + k]);
    const c = vertexCount + edgeCount + f;
    // Child k: corner v[k], next edge point, face point, previous edge point.
    for (let k = 0; k < 4; k += 1) {
      const quad = [v[k], e[k], c, e[(k + 3) % 4]];
      triangles.set([quad[0], quad[1], quad[2], quad[0], quad[2], quad[3]], (f * 4 + k) * 6);
    }
  }
  return { quads, vertexCount, faceCount, edges: Uint32Array.from(edges), edgeFaces: Int32Array.from(edgeFaces), triangles };
}

/** Subdivided positions for `positions` (only the first vertexCount vertices are used). */
export function subdivide(topo, positions) {
  const { quads, vertexCount: V, faceCount: F, edges, edgeFaces } = topo;
  const E = edges.length / 2;
  const out = new Float32Array((V + E + F) * 3);
  const faceBase = (V + E) * 3;
  for (let f = 0; f < F; f += 1) {
    for (let k = 0; k < 4; k += 1) {
      const v = quads[f * 4 + k] * 3;
      for (let a = 0; a < 3; a += 1) out[faceBase + f * 3 + a] += positions[v + a] / 4;
    }
  }

  // Per original vertex: sum of adjacent face points, sum of edge midpoints, valence, boundary.
  const faceSum = new Float32Array(V * 3);
  const faceN = new Uint16Array(V);
  const midSum = new Float32Array(V * 3);
  const edgeN = new Uint16Array(V);
  const boundarySum = new Float32Array(V * 3);
  const boundaryN = new Uint8Array(V);
  for (let f = 0; f < F; f += 1) {
    for (let k = 0; k < 4; k += 1) {
      const v = quads[f * 4 + k];
      for (let a = 0; a < 3; a += 1) faceSum[v * 3 + a] += out[faceBase + f * 3 + a];
      faceN[v] += 1;
    }
  }
  for (let e = 0; e < E; e += 1) {
    const [a, b] = [edges[e * 2], edges[e * 2 + 1]];
    const [f0, f1] = [edgeFaces[e * 2], edgeFaces[e * 2 + 1]];
    const at = (V + e) * 3;
    for (let k = 0; k < 3; k += 1) {
      const mid = (positions[a * 3 + k] + positions[b * 3 + k]) / 2;
      out[at + k] = f1 < 0 ? mid : (mid + (out[faceBase + f0 * 3 + k] + out[faceBase + f1 * 3 + k]) / 2) / 2;
      midSum[a * 3 + k] += mid;
      midSum[b * 3 + k] += mid;
      if (f1 < 0) {
        boundarySum[a * 3 + k] += positions[b * 3 + k];
        boundarySum[b * 3 + k] += positions[a * 3 + k];
      }
    }
    edgeN[a] += 1;
    edgeN[b] += 1;
    if (f1 < 0) {
      boundaryN[a] += 1;
      boundaryN[b] += 1;
    }
  }

  for (let v = 0; v < V; v += 1) {
    const n = edgeN[v];
    for (let k = 0; k < 3; k += 1) {
      const p = positions[v * 3 + k];
      if (!n) out[v * 3 + k] = p;
      else if (boundaryN[v] === 2) out[v * 3 + k] = (6 * p + boundarySum[v * 3 + k]) / 8;
      else if (boundaryN[v]) out[v * 3 + k] = p;
      else out[v * 3 + k] = (faceSum[v * 3 + k] / faceN[v] + (2 * midSum[v * 3 + k]) / n + (n - 3) * p) / n;
    }
  }
  return out;
}

/** Subdivided triangles whose parent quad has no hidden vertex. */
export function visibleTriangles(topo, hidden) {
  const out = [];
  const { quads, faceCount, triangles } = topo;
  for (let f = 0; f < faceCount; f += 1) {
    if (hidden[quads[f * 4]] || hidden[quads[f * 4 + 1]] || hidden[quads[f * 4 + 2]] || hidden[quads[f * 4 + 3]]) continue;
    for (let i = f * 24; i < f * 24 + 24; i += 1) out.push(triangles[i]);
  }
  return Uint32Array.from(out);
}
