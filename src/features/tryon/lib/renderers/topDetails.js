import { along, dist, lerp, polygonPath } from '../geometry';
import { detailColor, dots, shade, strokeLine } from './fabric';

/** Neckline depth below the neck base, in torso lengths. */
export const NECKLINE_DEPTH = {
  crew: 0.1,
  henley: 0.1,
  v: 0.32,
  collar: 0.12,
  band: 0.05,
  wrap: 0.08,
  keyhole: 0.07,
  lapel: 0.5,
  peak: 0.5,
};

const SHIRT_UNDER_LAPELS = 'rgb(244, 242, 236)'; // the shirt seen inside a jacket's V
const ZARI = 'rgba(196, 160, 92, 0.9)'; // metallic thread border on ethnic wear

/** Evenly spaced points from `a` to `b` (inclusive of neither end). */
const spaced = (a, b, count) => Array.from({ length: count }, (_, i) => lerp(a, b, (i + 1) / (count + 1)));

function necklineCurve(g) {
  const control = lerp(g.neckCenter, g.dip, 2);
  const [l, r] = g.sides;
  return Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const a = lerp(l.neck, control, t);
    return lerp(a, lerp(control, r.neck, t), t);
  });
}

function drawCollar(ctx, g, color, lw) {
  g.sides.forEach((s) => {
    const tip = along(along(g.neckCenter, g.down, 0.15 * g.T), s.out, 0.05 * g.S);
    const outer = along(along(s.neck, s.out, 0.06 * g.S), g.down, 0.04 * g.T);
    const path = polygonPath([s.neck, outer, tip, g.dip]);
    ctx.fillStyle = shade(color.hex, color.isLight ? -0.04 : 0.08);
    ctx.fill(path);
    ctx.strokeStyle = detailColor(color);
    ctx.lineWidth = lw;
    ctx.stroke(path);
  });
}

function drawLapels(ctx, g, color, lw, peak) {
  const [l, r] = g.sides;
  ctx.fillStyle = SHIRT_UNDER_LAPELS;
  ctx.fill(polygonPath([l.neck, r.neck, g.dip]));
  g.sides.forEach((s) => {
    const tipBase = along(along(s.neck, s.out, 0.1 * g.S), g.down, 0.12 * g.T);
    const tip = peak ? along(along(tipBase, g.up, 0.06 * g.T), s.out, 0.04 * g.S) : tipBase;
    const notch = along(along(s.neck, s.out, 0.05 * g.S), g.down, 0.16 * g.T);
    const belly = along(along(g.dip, s.out, 0.17 * g.S), g.up, 0.14 * g.T);
    const path = polygonPath([s.neck, tip, notch, belly, g.dip]);
    ctx.fillStyle = shade(color.hex, color.isLight ? -0.08 : 0.06);
    ctx.fill(path);
    ctx.strokeStyle = detailColor(color);
    ctx.lineWidth = lw;
    ctx.stroke(path);
  });
}

function drawJacketFront(ctx, g, color, lw) {
  const stroke = detailColor(color);
  strokeLine(ctx, [g.dip, g.hem], stroke, lw);
  dots(ctx, spaced(g.dip, along(g.dip, g.down, 0.4 * g.T), 2), lw * 2.2, stroke);
  g.sides.forEach((s) => {
    const pocket = along(along(g.hem, g.up, 0.12 * g.T), s.out, 0.28 * g.S);
    strokeLine(ctx, [along(pocket, s.out, -0.1 * g.S), along(pocket, s.out, 0.1 * g.S)], stroke, lw);
  });
}

/** Collars, plackets, lapels and borders drawn on top of the body panel. */
export function drawTopDetails(ctx, g, spec, color, lw) {
  const stroke = detailColor(color);
  const rib = shade(color.hex, color.isLight ? -0.12 : 0.12);
  const [l, r] = g.sides;

  switch (spec.neckline) {
    case 'crew':
    case 'henley':
      strokeLine(ctx, necklineCurve(g), rib, 0.022 * g.T);
      break;
    case 'v':
      strokeLine(ctx, [l.neck, g.dip, r.neck], rib, 0.02 * g.T);
      break;
    case 'collar':
      drawCollar(ctx, g, color, lw);
      break;
    case 'band':
      strokeLine(ctx, necklineCurve(g), rib, 0.04 * g.T);
      break;
    case 'lapel':
    case 'peak':
      drawLapels(ctx, g, color, lw, spec.neckline === 'peak');
      break;
    case 'wrap':
      strokeLine(ctx, necklineCurve(g), rib, 0.02 * g.T);
      strokeLine(ctx, [r.neck, lerp(g.neckCenter, l.waist, 0.55), l.waist], stroke, lw * 1.5);
      break;
    default:
      strokeLine(ctx, necklineCurve(g), rib, 0.02 * g.T);
  }

  if (spec.neckline === 'henley' || spec.neckline === 'keyhole') {
    const end = along(g.dip, g.down, (spec.neckline === 'henley' ? 0.16 : 0.24) * g.T);
    strokeLine(ctx, [g.dip, end], stroke, lw);
    dots(ctx, spaced(g.dip, end, 3), lw * 1.6, stroke);
  }
  if (spec.front === 'buttons') {
    strokeLine(ctx, [g.dip, g.hem], stroke, lw);
    const count = Math.max(3, Math.round((dist(g.dip, g.hem) / g.T) * 6));
    dots(ctx, spaced(g.dip, g.hem, count), lw * 1.6, stroke);
  }
  if (spec.front === 'jacket') drawJacketFront(ctx, g, color, lw);
  if (spec.slits) {
    g.sides.forEach((s) => strokeLine(ctx, [s.hem, along(s.hem, g.up, 0.25 * g.T)], stroke, lw));
  }
  if (spec.border) {
    strokeLine(ctx, [l.hem, along(g.hem, g.down, 0.015 * g.T), r.hem], ZARI, 0.03 * g.T);
    strokeLine(ctx, necklineCurve(g), ZARI, 0.015 * g.T);
  }
}
