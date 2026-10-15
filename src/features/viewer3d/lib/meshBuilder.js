/**
 * Minimal procedural mesh builder: accumulates flat-shaded quads and tapered
 * cylinders into vertex/normal/colour/index arrays ready for WebGL buffers.
 */

/** '#RRGGBB' or '#RGB' → [r, g, b] in 0..1. */
export function hexToRgb(hex) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
  const num = parseInt(clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export function createMeshBuilder() {
  const vertices = [];
  const normals = [];
  const colors = [];
  const indices = [];

  /** Two triangles with a shared face normal: (v1 - v0) × (v2 - v0). */
  function addQuad(v0, v1, v2, v3, rgb) {
    const start = vertices.length / 3;
    const ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2];
    const bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;

    for (const v of [v0, v1, v2, v3]) {
      vertices.push(v[0], v[1], v[2]);
      normals.push(nx, ny, nz);
      colors.push(rgb[0], rgb[1], rgb[2]);
    }
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  }

  /** Open tapered cylinder between two heights, optionally offset on x / z. */
  function addCylinder(yBottom, yTop, rBottom, rTop, segments, rgb, xOffset = 0, zOffset = 0) {
    const ring = (y, r) =>
      Array.from({ length: segments + 1 }, (_, i) => {
        const theta = (i / segments) * Math.PI * 2;
        return [xOffset + Math.cos(theta) * r, y, zOffset + Math.sin(theta) * r];
      });
    const bottom = ring(yBottom, rBottom);
    const top = ring(yTop, rTop);
    for (let i = 0; i < segments; i++) {
      addQuad(bottom[i], bottom[i + 1], top[i + 1], top[i], rgb);
    }
  }

  function build() {
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices),
    };
  }

  return { addQuad, addCylinder, build };
}
