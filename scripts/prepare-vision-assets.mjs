/**
 * Self-hosts the in-browser pose-detection runtime used for hands-free capture:
 *   - copies the MediaPipe Tasks WASM files from node_modules into public/mediapipe/wasm
 *   - downloads the lightweight pose model into public/mediapipe (once)
 * Runs automatically before `npm run dev` and `npm run build`. Output is git-ignored.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const wasmSrc = resolve(root, 'node_modules/@mediapipe/tasks-vision/wasm');
const outDir = resolve(root, 'public/mediapipe');
const wasmOut = resolve(outDir, 'wasm');
const modelOut = resolve(outDir, 'pose_landmarker_lite.task');
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

mkdirSync(wasmOut, { recursive: true });
for (const file of readdirSync(wasmSrc)) copyFileSync(resolve(wasmSrc, file), resolve(wasmOut, file));

if (!existsSync(modelOut)) {
  try {
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tmp = `${modelOut}.part`;
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
    renameSync(tmp, modelOut);
    console.log('Downloaded pose model for hands-free capture.');
  } catch (err) {
    // Hands-free capture degrades gracefully; manual capture still works.
    console.warn(`Could not download the pose model (${err.message}). Hands-free capture will be unavailable.`);
  }
}
