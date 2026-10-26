import { composeBody } from './bodyModel';
import { coveredBy, hideCoveredSkin } from './coveredSkin';
import { uniqueEdges } from './drape';
import { garmentMesh } from './garmentMesh';
import { vertexNormals } from './garmentModel';
import { centre } from './measureBody';
import { subdivide, subdivisionTopology, visibleTriangles } from './subdivide';

/**
 * Render-ready arrays (metres, feet on y = 0) for the fitted body and everything worn.
 * The skin is subdivided once for a smooth, sculpted surface. Skin any item covers is left
 * out, so it never pokes through; so are the faces of the bottoms the top covers.
 */

/** A kurta's options in body terms: the hem height (dm) from its length option, and the sleeve. */
function resolveKurta({ hem, sleeve }, easeDm, body, lm) {
  const joint = (name) => centre(body, lm.joints[name]);
  const ground = joint('ground')[1];
  const heightDm = body[lm.top * 3 + 1] - ground;
  const levels = {
    knee: (joint('r-knee')[1] + joint('l-knee')[1]) / 2,
    waist: body[lm.levels.waist * 3 + 1],
    hip: body[lm.levels.hip * 3 + 1],
  };
  const at = levels[hem.at] ?? body[lm.crotch * 3 + 1];
  return { hemY: Math.max(at + hem.offset * heightDm, ground + 0.15 * heightDm), sleeve, easeDm };
}

/** The inner mesh without the faces the outer fabric covers entirely. */
function coverInner(inner, outer) {
  const { positions } = inner.fabric;
  const covered = coveredBy(positions, positions.length / 3, outer.fabric);
  const at = (r) => covered[inner.toFabric ? inner.toFabric[r] : r];
  const { index } = inner.render;
  const kept = [];
  for (let t = 0; t < index.length; t += 3) {
    if (!(at(index[t]) && at(index[t + 1]) && at(index[t + 2]))) kept.push(index[t], index[t + 1], index[t + 2]);
  }
  return { ...inner.render, index: Uint32Array.from(kept) };
}

/**
 * @param model from createBodyModel(); fit from fitBody();
 *   outfit: [{ garment (readGarment(), null for the kurta), easeDm, layer, physics, smooth, kurta? }]
 *   (see outfitPlan).
 * @returns {{ height, body: { positions, index }, garments: [{ positions, normals, uv, index }] }}
 */
export function buildMannequin(model, fit, outfit) {
  const count = model.bodyVertexCount;
  const body = composeBody(model, fit.weights);
  const origin = centre(body, model.landmarks.joints.ground);
  const k = fit.scale / 10; // decimetres → metres, at the person's height
  const normals = vertexNormals(body.subarray(0, count * 3), model.index);
  const skin = { positions: body, normals, count, triangles: model.index, landmarks: model.landmarks, origin, k };

  // Drape bottoms first, so a top settles over them rather than through them.
  const meshes = new Array(outfit.length);
  const bottoms = [];
  const order = outfit.map((_, i) => i).sort((a, b) => (outfit[b].layer === 'bottom') - (outfit[a].layer === 'bottom'));
  for (const i of order) {
    const item = outfit[i].kurta ? { ...outfit[i], kurta: resolveKurta(outfit[i].kurta, outfit[i].easeDm, body, model.landmarks) } : outfit[i];
    meshes[i] = garmentMesh(item, skin, item.layer === 'top' ? bottoms : []);
    if (item.layer === 'bottom') bottoms.push(meshes[i].fabric);
  }
  model.skinEdges ??= uniqueEdges(model.index);
  const hidden = new Uint8Array(count);
  for (const { garment } of outfit) for (const v of garment?.hide ?? []) hidden[v] = 1;
  outfit.forEach(({ layer }, i) => {
    if (layer !== 'eyes') hideCoveredSkin(hidden, body, count, meshes[i].fabric, model.skinEdges);
  });

  const top = meshes[outfit.findIndex((item) => item.layer === 'top')];
  const garments = meshes.map((m, i) => (top && outfit[i].layer === 'bottom' ? coverInner(m, top) : m.render));

  model.topology ??= subdivisionTopology(model.quads, count);
  const smooth = subdivide(model.topology, body);
  for (let i = 0; i < smooth.length; i += 3) for (let a = 0; a < 3; a += 1) smooth[i + a] = (smooth[i + a] - origin[a]) * k;
  return {
    height: fit.measured.height / 100,
    body: { positions: smooth, index: visibleTriangles(model.topology, hidden) },
    garments,
  };
}
