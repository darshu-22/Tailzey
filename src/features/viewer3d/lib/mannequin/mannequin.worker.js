import { computeMannequin, sceneBuffers } from './computeMannequin';

/**
 * Web Worker: fitting, subdivision and cloth physics take a few hundred milliseconds, so they run
 * here and the page stays responsive. Replies { id, scene } or { id, error }.
 */
self.onmessage = async ({ data: { id, request } }) => {
  try {
    const scene = await computeMannequin(request);
    self.postMessage({ id, scene }, sceneBuffers(scene));
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
};
