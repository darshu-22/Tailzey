import { along, dist, lerp, norm, polygonPath, sub, tube } from '../geometry';
import { detailColor, fillFabric, shade, strokeLine } from './fabric';

/**
 * Leg centre line from the hip joint down. Hidden landmarks shorten the leg instead of
 * guessing: no knee → upper thigh only; no ankle → stops just below the knee.
 */
function legSpine(side, body, spec) {
  const T = body.torso;
  const root = along(side.hip, body.up, 0.06 * T);
  if (!side.seen('knee')) return [root, along(side.hip, body.down, 0.35 * T)];
  if (!side.seen('ankle')) {
    return [root, side.knee, along(side.knee, norm(sub(side.knee, side.hip)), 0.15 * dist(side.hip, side.knee))];
  }
  const shin = norm(sub(side.ankle, side.knee));
  return [root, side.knee, along(side.ankle, shin, spec.breakDrop * T)];
}

function drawLeg(ctx, side, body, spec, color, widths, lw) {
  const spine = legSpine(side, body, spec);
  const half = [widths.thigh, widths.knee, widths.ankle].slice(0, spine.length);
  if (spine.length === 2) half[1] = (widths.thigh + widths.knee) / 2;
  const t = tube(spine, half);
  const last = spine.length - 1;
  fillFabric(
    ctx,
    polygonPath(t.outline),
    color,
    { from: t.left[0], to: t.right[0] },
    { from: spine[0], to: spine[last] },
    { lineWidth: lw }
  );
  // Pressed front crease down the centre of the leg.
  const crease = color.isLight ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)';
  strokeLine(ctx, [lerp(spine[0], spine[1], 0.25), ...spine.slice(1)], crease, lw);
}

/** Draw trousers: seat + waistband anchored at the hips, legs following hip → knee → ankle. */
export function drawTrousers(ctx, body, spec, color) {
  const { torso: T, shoulderSpan: S, up, down, across, hipMid } = body;
  const ease = spec.ease * S;
  const lw = Math.max(1.2, T * 0.006);
  const waistHalf = Math.max(body.hipSpan * 0.95, S * 0.4, 0.16 * T) + ease * 0.5;
  const thigh = 0.5 * waistHalf + ease * 0.5;
  const widths = { thigh, knee: thigh * 0.7, ankle: thigh * 0.6 * spec.ankleTaper };

  const waistCenter = along(hipMid, up, 0.14 * T);
  const crotch = along(hipMid, down, 0.16 * T);
  const [l, r] = body.sides.map((side) => ({
    waist: along(waistCenter, across, side.sign * waistHalf * 0.95),
    hip: along(hipMid, across, side.sign * (waistHalf + ease * 0.3)),
  }));
  const seat = polygonPath([l.waist, r.waist, r.hip, along(crotch, across, 0.3 * thigh), crotch, along(crotch, across, -0.3 * thigh), l.hip]);

  body.sides.forEach((side) => drawLeg(ctx, side, body, spec, color, widths, lw));
  fillFabric(ctx, seat, color, { from: l.hip, to: r.hip }, { from: waistCenter, to: crotch }, { lineWidth: lw });

  // Waistband, fly and pleats.
  const bandBottom = [along(l.waist, down, 0.06 * T), along(r.waist, down, 0.06 * T)];
  ctx.fillStyle = shade(color.hex, color.isLight ? -0.1 : 0.08);
  ctx.fill(polygonPath([l.waist, r.waist, bandBottom[1], bandBottom[0]]));
  const stroke = detailColor(color);
  strokeLine(ctx, [along(waistCenter, down, 0.06 * T), along(crotch, up, 0.05 * T)], stroke, lw);
  for (let i = 1; i <= spec.pleats; i += 1) {
    [l, r].forEach((s) => {
      const top = lerp(bandBottom[s === l ? 0 : 1], along(waistCenter, down, 0.06 * T), 0.3 + i * 0.15);
      strokeLine(ctx, [top, along(top, down, 0.14 * T)], stroke, lw);
    });
  }
  // Belt loops.
  [0.2, 0.8].forEach((t) => {
    const top = lerp(l.waist, r.waist, t);
    strokeLine(ctx, [top, along(top, down, 0.06 * T)], stroke, lw * 1.5);
  });
}
