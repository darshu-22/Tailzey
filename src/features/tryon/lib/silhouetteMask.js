/**
 * Person-segmentation mask as a canvas alpha layer. Used to trim the drawn garment to the
 * body outline (grown a little for the chosen fit), so it never floats over the background.
 * Mask data is copied out of MediaPipe each frame and only ever lives in memory.
 */

const smoothstep = (lo, hi, x) => {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

// Lookup table: confidence 0..1 (in 256 steps) → alpha byte, with a soft edge.
const ALPHA = Uint8ClampedArray.from({ length: 256 }, (_, i) => Math.round(255 * smoothstep(0.25, 0.6, i / 255)));

function makeCanvas() {
  return document.createElement('canvas');
}

export function createSilhouetteMask() {
  const raw = makeCanvas();
  const grown = makeCanvas();
  const rawCtx = raw.getContext('2d');
  const grownCtx = grown.getContext('2d');
  let image = null;
  let fresh = false;

  return {
    /** Copy an MPMask (valid only inside the detector callback) into the alpha layer. */
    update(mpMask) {
      const step = mpMask.width > 720 ? 2 : 1; // half resolution is plenty for HD frames
      const w = Math.floor(mpMask.width / step);
      const h = Math.floor(mpMask.height / step);
      if (raw.width !== w || raw.height !== h) {
        raw.width = grown.width = w;
        raw.height = grown.height = h;
        image = rawCtx.createImageData(w, h);
      }
      const data = mpMask.getAsFloat32Array();
      const px = image.data;
      for (let y = 0; y < h; y += 1) {
        const row = y * step * mpMask.width;
        for (let x = 0; x < w; x += 1) {
          px[(y * w + x) * 4 + 3] = ALPHA[Math.round(data[row + x * step] * 255)];
        }
      }
      rawCtx.putImageData(image, 0, 0);
      fresh = true;
    },

    /** Mark the mask stale (no person / no mask this frame). */
    invalidate() {
      fresh = false;
    },

    /**
     * Keep only the parts of `ctx`'s drawing that lie within the silhouette grown by
     * `growPx` canvas pixels. No-op when there is no fresh mask.
     */
    trim(ctx, width, height, growPx) {
      if (!fresh || !raw.width) return;
      const r = Math.max(1, (growPx * raw.width) / width);
      grownCtx.clearRect(0, 0, grown.width, grown.height);
      // Cheap dilation: union of the mask shifted around a circle.
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2;
        grownCtx.drawImage(raw, Math.cos(a) * r, Math.sin(a) * r);
      }
      grownCtx.drawImage(raw, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(grown, 0, 0, width, height);
      ctx.restore();
    },
  };
}
