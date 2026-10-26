import { add, dist, mid, norm, perp, scale, sub } from './geometry';

/** MediaPipe BlazePose landmark indices used by the try-on. */
const LANDMARK = {
  left: { shoulder: 11, elbow: 13, wrist: 15, index: 19, hip: 23, knee: 25, ankle: 27 },
  right: { shoulder: 12, elbow: 14, wrist: 16, index: 20, hip: 24, knee: 26, ankle: 28 },
};

/** Landmarks below this (smoothed) visibility are treated as not seen; their parts are hidden. */
export const MIN_VISIBILITY = 0.5;

function buildSide(points, key, sign) {
  const ids = LANDMARK[key];
  const side = { key, sign };
  Object.entries(ids).forEach(([name, index]) => {
    side[name] = points[index];
  });
  side.seen = (name) => (side[name]?.v ?? 0) >= MIN_VISIBILITY;
  return side;
}

/**
 * Body frame in canvas pixels derived from smoothed landmarks.
 * `across` points from the person's left landmarks to their right landmarks; `up` from hips to shoulders.
 */
export function buildBody(points) {
  const left = buildSide(points, 'left', -1);
  const right = buildSide(points, 'right', 1);
  const shoulderMid = mid(left.shoulder, right.shoulder);
  const hipMid = mid(left.hip, right.hip);
  const torso = Math.max(dist(shoulderMid, hipMid), 1);
  const up = norm(sub(shoulderMid, hipMid), { x: 0, y: -1 });
  // Shoulder and hip lines together give a steadier sideways axis than either alone.
  const across = norm(add(sub(right.shoulder, left.shoulder), sub(right.hip, left.hip)), perp(up));
  return {
    sides: [left, right],
    shoulderMid,
    hipMid,
    torso,
    up,
    down: scale(up, -1),
    across,
    shoulderSpan: dist(left.shoulder, right.shoulder),
    hipSpan: dist(left.hip, right.hip),
  };
}

const bothSeen = (body, name) => body.sides.every((s) => s.seen(name));

export const GUIDANCE = {
  loading: 'Loading body tracking…',
  no_person: 'Step into the frame, about 2 metres from the camera.',
  upper_body: 'Step back so your upper body is visible, from your head down to your hips.',
  whole_body: 'Step back so your whole body is visible, from head to feet.',
  ankles: 'Step back a little more to see the full trouser length.',
  tracking: 'Looking good. Move and turn to see the fit.',
};

/**
 * Can the chosen garment be drawn for this body?
 * @returns {{ code: keyof GUIDANCE, drawable: boolean }}
 */
export function assessBody(body, garmentKind) {
  if (!body) return { code: 'no_person', drawable: false };
  if (!bothSeen(body, 'shoulder') || !bothSeen(body, 'hip')) {
    return { code: garmentKind === 'bottom' ? 'whole_body' : 'upper_body', drawable: false };
  }
  if (garmentKind === 'bottom') {
    if (!bothSeen(body, 'knee')) return { code: 'whole_body', drawable: true };
    if (!bothSeen(body, 'ankle')) return { code: 'ankles', drawable: true };
  }
  return { code: 'tracking', drawable: true };
}
