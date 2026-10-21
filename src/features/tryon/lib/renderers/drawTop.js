import { along, lerp, mid, norm, polygonPath, scale, sub, tube } from '../geometry';
import { fillFabric, shade } from './fabric';
import { drawTopDetails, NECKLINE_DEPTH } from './topDetails';

/** Where the hem sits: anchored to the knees for kurtas/sherwanis, else below the hips. */
function hemCenter(body, spec) {
  const [l, r] = body.sides;
  const kneesSeen = l.seen('knee') && r.seen('knee');
  if (spec.hemTo === 'knee') {
    return kneesSeen ? mid(l.knee, r.knee) : along(body.hipMid, body.down, 1.0 * body.torso);
  }
  if (spec.hemTo === 'belowKnee') {
    if (kneesSeen && l.seen('ankle') && r.seen('ankle')) {
      return lerp(mid(l.knee, r.knee), mid(l.ankle, r.ankle), 0.35);
    }
    return along(body.hipMid, body.down, 1.35 * body.torso);
  }
  return along(body.hipMid, body.down, spec.hemDrop * body.torso);
}

/** Key points of a top's body panel, scaled from the shoulders and hips. */
export function topGeometry(body, spec) {
  const { torso: T, shoulderSpan: S, up, down, across, shoulderMid, hipMid } = body;
  const ease = spec.ease * S;
  const neckCenter = along(shoulderMid, up, 0.06 * T);
  const neckHalf = Math.max(0.17 * S, 0.07 * T);
  const hipHalf = Math.max(body.hipSpan * 0.9, S * 0.4, 0.17 * T);
  const waistHalf = (0.55 * S + hipHalf) * 0.47;
  const hem = hemCenter(body, spec);
  const longHem = spec.hemTo || spec.hemDrop > 0.3;
  const hemHalf = hipHalf + ease + (longHem ? spec.flare * T : spec.flare * T * 0.5);

  const sides = body.sides.map((side) => {
    const out = scale(across, side.sign);
    return {
      out,
      neck: along(neckCenter, out, neckHalf),
      shoulder: along(along(side.shoulder, out, 0.07 * S + ease * 0.3), up, 0.03 * T),
      armpit: along(along(side.shoulder, down, 0.3 * T), out, 0.05 * S + ease),
      waist: along(lerp(shoulderMid, hipMid, 0.7), out, waistHalf + ease),
      hip: along(hipMid, out, hipHalf + ease),
      hem: along(hem, out, hemHalf),
    };
  });
  const dip = along(neckCenter, down, (NECKLINE_DEPTH[spec.neckline] ?? 0.1) * T);
  return { T, S, ease, up, down, neckCenter, neckHalf, dip, hem, sides };
}

function bodyPath(g, spec) {
  const [l, r] = g.sides;
  const path = new Path2D();
  path.moveTo(l.neck.x, l.neck.y);
  path.lineTo(l.shoulder.x, l.shoulder.y);
  path.lineTo(l.armpit.x, l.armpit.y);
  path.quadraticCurveTo(l.waist.x, l.waist.y, l.hip.x, l.hip.y);
  path.lineTo(l.hem.x, l.hem.y);
  const hemCurve = along(g.hem, g.down, 0.03 * g.T);
  path.quadraticCurveTo(hemCurve.x, hemCurve.y, r.hem.x, r.hem.y);
  path.lineTo(r.hip.x, r.hip.y);
  path.quadraticCurveTo(r.waist.x, r.waist.y, r.armpit.x, r.armpit.y);
  path.lineTo(r.shoulder.x, r.shoulder.y);
  path.lineTo(r.neck.x, r.neck.y);
  if (['v', 'lapel', 'peak'].includes(spec.neckline)) {
    path.lineTo(g.dip.x, g.dip.y);
  } else {
    // Quadratic control twice as deep as the dip so the curve's lowest point lands on it.
    const control = lerp(g.neckCenter, g.dip, 2);
    path.quadraticCurveTo(control.x, control.y, l.neck.x, l.neck.y);
  }
  path.closePath();
  return path;
}

/** Sleeve centre line and half widths; null when the elbow isn't visible. */
function sleeveTube(side, body, spec, ease) {
  if (!side.seen('elbow')) return null;
  const T = body.torso;
  const root = along(side.shoulder, norm(sub(side.elbow, side.shoulder)), 0.03 * T);
  const w = [0.11 * T + ease * 0.3, 0.075 * T + ease * 0.2, 0.058 * T + ease * 0.12];
  if (spec.sleeve === 'short') {
    return tube([root, lerp(root, side.elbow, 0.55)], [w[0], (w[0] + w[1]) / 2]);
  }
  if (!side.seen('wrist')) return tube([root, side.elbow], [w[0], w[1]]);
  return tube([root, side.elbow, side.wrist], w);
}

/** Erase bare forearms and hands from the body panel so arms read as in front of the torso. */
function cutArms(ctx, body, spec) {
  const T = body.torso;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  body.sides.forEach((side) => {
    if (!side.seen('elbow') || !side.seen('wrist')) return;
    const hand = side.seen('index') ? side.index : along(side.wrist, norm(sub(side.wrist, side.elbow)), 0.08 * T);
    ctx.beginPath();
    if (spec.sleeve === 'short') {
      const start = lerp(side.shoulder, side.elbow, 0.55);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(side.elbow.x, side.elbow.y);
      ctx.lineTo(side.wrist.x, side.wrist.y);
    } else {
      ctx.moveTo(side.wrist.x, side.wrist.y);
    }
    ctx.lineTo(hand.x, hand.y);
    ctx.lineWidth = 0.13 * T;
    ctx.stroke();
  });
  ctx.restore();
}

function drawSleeve(ctx, t, color, spec, lineWidth, T) {
  const path = polygonPath(t.outline);
  const last = t.left.length - 1;
  fillFabric(
    ctx,
    path,
    color,
    { from: t.left[0], to: t.right[0] },
    { from: mid(t.left[0], t.right[0]), to: mid(t.left[last], t.right[last]) },
    { tone: -0.04, lineWidth }
  );
  if (spec.cuff && spec.sleeve === 'long' && last >= 2) {
    const dir = norm(sub(t.left[last - 1], t.left[last]));
    const a = along(t.left[last], dir, 0.06 * T);
    const b = along(t.right[last], dir, 0.06 * T);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = shade(color.hex, color.isLight ? -0.2 : 0.18);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/** Draw a top (t-shirt, shirt, jacket, kurta) onto the body. */
export function drawTop(ctx, body, spec, color) {
  const g = topGeometry(body, spec);
  const lineWidth = Math.max(1.2, g.T * 0.006);
  const [l, r] = g.sides;
  fillFabric(
    ctx,
    bodyPath(g, spec),
    color,
    { from: l.waist, to: r.waist },
    { from: g.neckCenter, to: g.hem },
    { lineWidth }
  );
  drawTopDetails(ctx, g, spec, color, lineWidth);
  cutArms(ctx, body, spec);
  body.sides.forEach((side) => {
    const t = sleeveTube(side, body, spec, g.ease);
    if (t) drawSleeve(ctx, t, color, spec, lineWidth, g.T);
  });
}
