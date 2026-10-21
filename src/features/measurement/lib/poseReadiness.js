/**
 * Decides, from live pose landmarks, whether the user is ready for an automatic photo.
 * The rules mirror the backend photo checks (backend/app/cv/quality.py) with a little extra
 * margin, so a photo taken automatically should also pass the server's checks.
 * Landmarks are MediaPipe's normalised coordinates (0..1, y pointing down).
 */
const P = {
  NOSE: 0, SH_L: 11, SH_R: 12, WR_L: 15, WR_R: 16, HIP_L: 23, HIP_R: 24,
  KNEE_L: 25, KNEE_R: 26, ANK_L: 27, ANK_R: 28, HEEL_L: 29, HEEL_R: 30, TOE_L: 31, TOE_R: 32,
};
const VISIBLE = 0.5;
const MARGIN = 0.02;

export const POSE_HINTS = {
  no_person: 'Step into the frame so your whole body is visible.',
  multiple: 'Make sure only you are in the frame.',
  not_full_body: 'Step back so your head and feet are both in the frame.',
  too_far: 'Come a little closer to the camera.',
  off_center: 'Move to the centre of the frame.',
  face_camera: 'Face the camera directly.',
  turn_side: 'Turn sideways so your side faces the camera.',
  knees: 'Stand up straight with your knees unbent.',
  arms_raised: 'Lower your arms to your sides.',
  arms_out: 'Hold your arms slightly away from your body.',
  feet: 'Stand with your feet hip-width apart.',
  ready: 'Perfect. Hold still.',
};

const verdict = (code) => ({ ready: code === 'ready', code, hint: POSE_HINTS[code] });
const seen = (lm, ...idx) => idx.every((i) => (lm[i]?.visibility ?? 0) >= VISIBLE);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function kneeAngle(lm, hip, knee, ankle, aspect) {
  const v1 = [(lm[hip].x - lm[knee].x) * aspect, lm[hip].y - lm[knee].y];
  const v2 = [(lm[ankle].x - lm[knee].x) * aspect, lm[ankle].y - lm[knee].y];
  const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2) + 1e-9);
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

function framing(lm) {
  const feetY = Math.max(...[P.ANK_L, P.ANK_R, P.HEEL_L, P.HEEL_R, P.TOE_L, P.TOE_R].map((i) => lm[i].y));
  const nose = lm[P.NOSE];
  const headTop = nose.y - (feetY - nose.y) * 0.12; // crown sits ~11% of stature above the nose
  const xs = lm.map((p) => p.x);
  return { feetY, headTop, stature: feetY - headTop, minX: Math.min(...xs), maxX: Math.max(...xs) };
}

/**
 * @param poses  array of landmark arrays (one per detected person)
 * @param kind   'front' | 'back' | 'side'
 * @param aspect video width / height (normalised x and y have different scales)
 * @returns {{ ready: boolean, code: string, hint: string }}
 */
export function assessPose(poses, kind, aspect) {
  if (!poses?.length) return verdict('no_person');
  if (poses.length > 1) return verdict('multiple');
  const lm = poses[0];
  if (!seen(lm, P.NOSE) || !(seen(lm, P.SH_L, P.HIP_L) || seen(lm, P.SH_R, P.HIP_R))) return verdict('no_person');

  const f = framing(lm);
  if (f.headTop < MARGIN || f.feetY > 1 - MARGIN || f.minX < MARGIN || f.maxX > 1 - MARGIN) return verdict('not_full_body');
  if (f.stature < 0.5) return verdict('too_far');
  const center = mid(lm[P.HIP_L], lm[P.HIP_R]).x;
  if (center < 0.25 || center > 0.75) return verdict('off_center');

  // Shoulder span relative to height: ~0.2 facing the camera, ~0.05 in profile.
  const span = (Math.abs(lm[P.SH_L].x - lm[P.SH_R].x) * aspect) / f.stature;
  if (kind === 'side' && span > 0.08) return verdict('turn_side');
  if (kind !== 'side' && span < 0.12) return verdict('face_camera');

  for (const [hip, knee, ankle] of [[P.HIP_L, P.KNEE_L, P.ANK_L], [P.HIP_R, P.KNEE_R, P.ANK_R]]) {
    if (seen(lm, hip, knee, ankle) && kneeAngle(lm, hip, knee, ankle, aspect) < 165) return verdict('knees');
  }
  if (kind === 'side') return verdict('ready');

  const shY = mid(lm[P.SH_L], lm[P.SH_R]).y;
  const hipY = mid(lm[P.HIP_L], lm[P.HIP_R]).y;
  const hipHalf = Math.abs(lm[P.HIP_L].x - lm[P.HIP_R].x) / 2;
  for (const wrist of [P.WR_L, P.WR_R]) {
    if (!seen(lm, wrist)) continue;
    if (lm[wrist].y < shY + 0.6 * (hipY - shY)) return verdict('arms_raised');
    if (Math.abs(lm[wrist].x - center) < hipHalf * 1.35) return verdict('arms_out');
  }
  if (seen(lm, P.ANK_L, P.ANK_R)) {
    const feet = (Math.abs(lm[P.ANK_L].x - lm[P.ANK_R].x) * aspect) / f.stature;
    if (feet < 0.05 || feet > 0.18) return verdict('feet');
  }
  return verdict('ready');
}

const TRACKED = [P.NOSE, P.SH_L, P.SH_R, P.HIP_L, P.HIP_R, P.ANK_L, P.ANK_R];

/** Mean movement of key landmarks between two frames (normalised units). */
export function poseMotion(prev, next) {
  if (!prev || !next) return Infinity;
  const total = TRACKED.reduce((sum, i) => sum + Math.hypot(next[i].x - prev[i].x, next[i].y - prev[i].y), 0);
  return total / TRACKED.length;
}
