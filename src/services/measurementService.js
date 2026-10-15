import { http } from '../core/api/httpClient';
import { ANALYSIS_TIMEOUT_MS } from '../core/config/env';

/** Views the backend measures from. Three-quarter views add nothing, so they're never uploaded. */
export const ANALYZED_VIEWS = ['front', 'back', 'left-side', 'right-side'];

async function dataUrlToBlob(dataUrl) {
  return (await fetch(dataUrl)).blob();
}

/**
 * Upload captured photos for camera-based measurement estimation.
 * @param {{ heightCm: number, images: Record<string, string>, signal?: AbortSignal }} args
 *   images maps capture-step keys to JPEG data URLs.
 * @returns analysis: { unit:'cm', measurements, views, warnings, model, processingMs, disclaimer }
 */
export async function analyzeMeasurements({ heightCm, images, signal }) {
  const form = new FormData();
  form.append('heightCm', String(heightCm));
  form.append('consent', 'true');
  for (const key of ANALYZED_VIEWS) {
    if (images[key]) form.append(key, await dataUrlToBlob(images[key]), `${key}.jpg`);
  }
  const response = await http.upload('/measurements/analyze', form, { signal, timeoutMs: ANALYSIS_TIMEOUT_MS });
  return response.data;
}
