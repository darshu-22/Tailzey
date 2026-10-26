import { useEffect, useMemo, useState } from 'react';
import { loadMannequinManifest, mannequinAssetUrl } from '../../../services/mannequinAssets';
import { outfitPlan } from '../lib/mannequin/garmentCatalog';

let worker = null;
let nextId = 0;
const pending = new Map();

/** Run computeMannequin in the shared worker (or on this thread where workers aren't available). */
function requestScene(request) {
  if (typeof Worker === 'undefined') {
    return import('../lib/mannequin/computeMannequin').then(({ computeMannequin }) => computeMannequin(request));
  }
  if (!worker) {
    worker = new Worker(new URL('../lib/mannequin/mannequin.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error));
      else resolve(data.scene);
    };
  }
  const id = (nextId += 1);
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, request });
  });
}

/** How each worn item is drawn: its textures and render mode from the manifest, and its colour. */
function looksFor(manifest, outfit, colours) {
  return outfit.map((item) => {
    const entry = manifest.garments[item.id] ?? { mode: 'plain' }; // the kurta is cut, not loaded
    return {
      key: item.id ?? 'kurta',
      mode: entry.mode,
      texture: entry.texture ? mannequinAssetUrl(entry.texture) : null,
      normalMap: entry.normalMap ? mannequinAssetUrl(entry.normalMap) : null,
      fabricLuminance: entry.fabricLuminance ?? 1,
      colorHex: colours.get(item.id ?? 'kurta') ?? null,
      front: item.front,
    };
  });
}

const shapeOf = (sex, bodyCm, outfit) => JSON.stringify([sex, bodyCm, outfit.map(({ colorHex: _c, ...item }) => item)]);

/**
 * The realistic mannequin (MakeHuman, CC0) for the studio, fitted to `bodyCm` and dressed for the
 * design, with cloth physics. Geometry is rebuilt only when the body or the outfit's shape
 * changes; a colour change only updates `looks`. While a new shape is computed the previous one
 * stays on screen. Before the first scene, or if the assets fail ('error'), the caller shows the
 * simplified figure.
 */
export function useMannequin({ sex, bodyCm, spec }) {
  const outfit = useMemo(() => outfitPlan(spec, sex), [spec, sex]);
  const shape = shapeOf(sex, bodyCm, outfit);
  const [state, setState] = useState({ shape: null, outfit: null, scene: null, error: false });
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadMannequinManifest().then(
      (value) => !cancelled && setManifest(value),
      () => !cancelled && setState((s) => ({ ...s, error: true }))
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const [requestSex, requestBody, requestOutfit] = JSON.parse(shape);
    requestScene({ sex: requestSex, bodyCm: requestBody, outfit: requestOutfit }).then(
      (scene) => !cancelled && setState({ shape, outfit: requestOutfit, scene, error: false }),
      () => !cancelled && setState((s) => ({ ...s, error: true }))
    );
    return () => {
      cancelled = true;
    };
  }, [shape]);

  // The scene's own outfit, always in the design's current colours.
  const current = state.shape === shape;
  const shown = current ? outfit : state.outfit;
  const looks = useMemo(() => {
    if (!manifest || !shown) return null;
    return looksFor(manifest, shown, new Map(outfit.map((item) => [item.id ?? 'kurta', item.colorHex])));
  }, [manifest, shown, outfit]);

  if (state.error) return { status: 'error', scene: null };
  if (!state.scene || !looks) return { status: 'loading', scene: null };
  return { status: 'ready', scene: state.scene, looks, updating: !current };
}
