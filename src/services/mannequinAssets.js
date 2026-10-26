import { MANNEQUIN_ASSETS_PATH } from '../core/config/env';

/**
 * Static 3D studio assets (the CC0 MakeHuman mannequin and garments), not the API.
 * Each file is fetched once per session and shared; a failed fetch is forgotten so a retry
 * can try again.
 */

const cache = new Map();

/** Public URL of an asset file listed in the manifest. */
export const mannequinAssetUrl = (file) => `${MANNEQUIN_ASSETS_PATH}/${file}`;

function fetchOnce(file, read) {
  if (!cache.has(file)) {
    const request = fetch(mannequinAssetUrl(file)).then((response) => {
      if (!response.ok) throw new Error(`Could not load ${file} (${response.status})`);
      return read(response);
    });
    request.catch(() => cache.delete(file));
    cache.set(file, request);
  }
  return cache.get(file);
}

export const loadMannequinManifest = () => fetchOnce('manifest.json', (r) => r.json());

export const loadMannequinBinary = (file) => fetchOnce(file, (r) => r.arrayBuffer());
