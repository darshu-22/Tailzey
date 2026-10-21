/**
 * Save the current camera frame with the garment overlay as a PNG — entirely client-side.
 * The image goes straight to the user's downloads; nothing is uploaded or kept in memory.
 */
export async function downloadSnapshot(video, overlay, { mirrored, fileName = 'tailzey-try-on.png' }) {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) throw new Error('The camera is not ready yet.');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (mirrored) {
    // Match what the user sees on screen (a mirror image).
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, width, height);
  if (overlay?.width) ctx.drawImage(overlay, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  canvas.width = canvas.height = 0; // release the pixel buffer
  if (!blob) throw new Error('Your browser could not create the image.');

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
