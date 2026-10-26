import { proceduralRenderer } from './proceduralRenderer';

/**
 * Try-on renderers.
 *
 * interface TryOnRenderer {
 *   id: string;
 *   label: string;
 *   live: boolean;               // true → called every tracked frame from requestAnimationFrame
 *   render(ctx, frame, look): void;
 *     // ctx   2D context of the overlay canvas (video-frame pixel size, unmirrored)
 *     // frame { body, silhouette, width, height } from lib/bodyFrame + lib/silhouetteMask
 *     // look  { spec, color } from lib/garmentSpec + the colour catalogue
 * }
 *
 * Future: photo-realistic generative try-on (e.g. Google Virtual Try-On, FASHN, Kolors).
 * Those models need a GPU server and a paid API key, so they must never be called from
 * the browser. They would plug in here as a non-live renderer (`live: false`) with an
 * async `renderStill(snapshotBlob, look)` that sends ONE still — only after the user
 * explicitly opts in — to a Tailzey backend endpoint that proxies the provider and keeps
 * the key server-side, then shows the returned image. Nothing like that exists yet; the
 * live try-on is fully on-device and makes no network calls.
 */
export const RENDERERS = { [proceduralRenderer.id]: proceduralRenderer };

export const DEFAULT_RENDERER = proceduralRenderer;
