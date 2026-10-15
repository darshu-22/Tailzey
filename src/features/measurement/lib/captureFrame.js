const JPEG_QUALITY = 0.85;

/**
 * Draw the current video frame onto `canvas` and return it as a JPEG data URL.
 * `mirror` flips horizontally so the still matches the mirrored selfie preview.
 */
export function captureFrame(video, canvas, { mirror = false } = {}) {
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
