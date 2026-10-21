/**
 * Fabric look for procedurally drawn garments: a flat colour, darker side bands (the cloth
 * turning away from the camera), a soft vertical light falloff and a thin seam outline.
 * Garment colours are content (from the catalogue), not UI theme colours.
 */

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

/** Mix a hex colour towards black (amount < 0) or white (amount > 0). */
export function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const mix = (c) => Math.round(c + (target - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** Stroke colour for seams, plackets and collars that stays visible on light and dark cloth. */
export const detailColor = (color) => (color.isLight ? 'rgba(40, 32, 24, 0.35)' : 'rgba(255, 255, 255, 0.24)');

/**
 * Fill `path` as fabric.
 * @param {{ from, to }} acrossAxis points on the two side edges (for side shading)
 * @param {{ from, to }} lengthAxis points at the top and bottom (for light falloff)
 */
export function fillFabric(ctx, path, color, acrossAxis, lengthAxis, { tone = 0, lineWidth = 1 } = {}) {
  const base = tone ? shade(color.hex, tone) : color.hex;
  const edge = color.isLight ? 'rgba(70, 55, 40, 0.24)' : 'rgba(0, 0, 0, 0.38)';
  const highlight = color.isLight ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.07)';

  ctx.fillStyle = base;
  ctx.fill(path);

  ctx.save();
  ctx.clip(path);
  const side = ctx.createLinearGradient(acrossAxis.from.x, acrossAxis.from.y, acrossAxis.to.x, acrossAxis.to.y);
  side.addColorStop(0, edge);
  side.addColorStop(0.2, 'rgba(0, 0, 0, 0)');
  side.addColorStop(0.45, highlight);
  side.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
  side.addColorStop(1, edge);
  ctx.fillStyle = side;
  ctx.fill(path);

  const fall = ctx.createLinearGradient(lengthAxis.from.x, lengthAxis.from.y, lengthAxis.to.x, lengthAxis.to.y);
  fall.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
  fall.addColorStop(1, 'rgba(0, 0, 0, 0.16)');
  ctx.fillStyle = fall;
  ctx.fill(path);
  ctx.restore();

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = shade(color.hex, color.isLight ? -0.25 : -0.45);
  ctx.stroke(path);
}

/** Stroke an open polyline. */
export function strokeLine(ctx, points, style, width) {
  if (points.length < 2) return;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/** Small filled circles (buttons) at the given points. */
export function dots(ctx, points, radius, style) {
  ctx.fillStyle = style;
  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}
