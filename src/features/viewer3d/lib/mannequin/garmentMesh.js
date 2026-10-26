import { drape, uniqueEdges } from './drape';
import { fitGarment, vertexNormals } from './garmentModel';
import { kurtaMesh } from './kurtaMesh';

/**
 * One worn item as render arrays: fit it to the body (or, for the kurta, cut it from the body),
 * let the cloth settle with physics, then convert to world metres. Textured items are split at
 * UV seams for rendering; normals are computed before the split so seams don't show as creases.
 */

const toWorld = (p, origin, k) => {
  const out = new Float32Array(p.length);
  for (let i = 0; i < p.length; i += 3) for (let a = 0; a < 3; a += 1) out[i + a] = (p[i + a] - origin[a]) * k;
  return out;
};

/**
 * @param item { garment, easeDm, physics, smooth, kurta? } from the outfit (kurta: resolved options).
 * @param skin { positions, normals, count, triangles, landmarks, origin, k } of the fitted body (dm).
 * @param under fabrics ({ positions, normals }, dm) of layers already draped underneath.
 * @returns {{ render: { positions, normals, uv, index }, fabric: { positions, normals }, toFabric }}
 *   render in world metres; fabric in decimetres per garment vertex, for finding what it covers;
 *   toFabric maps render vertices to fabric vertices (null when they are the same).
 */
export function garmentMesh(item, skin, under = []) {
  const { garment, easeDm, physics, smooth = 0, kurta } = item;
  let positions;
  let triangles;
  if (kurta) ({ positions, triangles } = kurtaMesh(skin.positions, skin.count, skin.triangles, skin.landmarks, kurta));
  else [positions, triangles] = [fitGarment(garment, skin.positions, easeDm), garment.triangles];
  if (physics) {
    const colliders = [
      { points: skin.positions, normals: skin.normals, count: skin.count },
      ...under.map((f) => ({ points: f.positions, normals: f.normals, count: f.positions.length / 3 })),
    ];
    drape(positions, uniqueEdges(triangles), colliders, smooth);
  }

  const normals = vertexNormals(positions, triangles);
  const fabric = { positions, normals };
  const world = toWorld(positions, skin.origin, skin.k);
  if (kurta) return { render: { positions: world, normals, uv: null, index: triangles }, fabric, toFabric: null };

  const n = garment.vertex.length;
  const renderPositions = new Float32Array(n * 3);
  const renderNormals = new Float32Array(n * 3);
  for (let r = 0; r < n; r += 1) {
    const g = garment.vertex[r] * 3;
    renderPositions.set(world.subarray(g, g + 3), r * 3);
    renderNormals.set(normals.subarray(g, g + 3), r * 3);
  }
  return {
    render: { positions: renderPositions, normals: renderNormals, uv: garment.uv.slice(), index: garment.index.slice() },
    fabric,
    toFabric: garment.vertex,
  };
}
