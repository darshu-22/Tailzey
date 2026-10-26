import { loadMannequinBinary, loadMannequinManifest } from '../../../../services/mannequinAssets';
import { createBodyModel } from './bodyModel';
import { buildMannequin } from './buildMannequin';
import { fitBody } from './fitBody';
import { readGarment } from './garmentModel';

/**
 * Load, fit, dress and drape the mannequin for one request. Runs in the mannequin worker (or on
 * the main thread where workers aren't available). Bodies, garments and the last fit are cached,
 * so changing only the outfit doesn't refit the body.
 */

const bodies = new Map();
const garments = new Map();
let lastFit = { key: null, fit: null };

const once = (cache, key, load) => {
  if (!cache.has(key)) {
    const pending = load();
    pending.catch(() => cache.delete(key));
    cache.set(key, pending);
  }
  return cache.get(key);
};

const loadBody = (sex) =>
  once(bodies, sex, async () => {
    const manifest = await loadMannequinManifest();
    const { files } = manifest.body;
    const [common, own] = await Promise.all([loadMannequinBinary(files.common.file), loadMannequinBinary(files[sex].file)]);
    return createBodyModel(manifest, common, own, sex);
  });

const loadGarment = (id) =>
  once(garments, id, async () => {
    const entry = (await loadMannequinManifest()).garments[id];
    return readGarment(entry, await loadMannequinBinary(entry.file));
  });

/** Typed arrays in a scene, for transferring it out of the worker without copying. */
export function sceneBuffers(scene) {
  const all = [scene.body, ...scene.garments].flatMap((m) => [m.positions, m.normals, m.uv, m.index]);
  return all.filter(Boolean).map((a) => a.buffer);
}

/**
 * @param request { sex, bodyCm, outfit } with outfit from outfitPlan() (colours are ignored).
 * @returns buildMannequin() output.
 */
export async function computeMannequin({ sex, bodyCm, outfit }) {
  const [model, worn] = await Promise.all([
    loadBody(sex),
    Promise.all(outfit.map((item) => (item.id ? loadGarment(item.id) : null))),
  ]);
  const key = JSON.stringify([sex, bodyCm]);
  if (lastFit.key !== key) lastFit = { key, fit: fitBody(model, bodyCm) };
  return buildMannequin(model, lastFit.fit, outfit.map((item, i) => ({ ...item, garment: worn[i] })));
}
