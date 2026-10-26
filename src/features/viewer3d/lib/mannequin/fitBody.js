import { BODY_FIELDS } from '../bodyProfile';
import { MEASURE_PARAMS, composeBody, morphWeights, restrictModel } from './bodyModel';
import { centre, measureBody } from './measureBody';

/**
 * Fit the MakeHuman sliders to a person's measurements: bounded Levenberg–Marquardt on
 * (scaled mannequin measurement − target) / tolerance, with a gentle pull towards average for
 * every slider so unmeasured parts stay typical. The body is then scaled to the exact height.
 *
 * Arm and inseam follow the person's proportion rather than raw centimetres: MakeHuman's
 * joints don't sit exactly where a tailor's tape starts, so a person with typical arms gets the
 * mannequin's typical arms.
 */

const SLIDERS = [
  { key: 'weight', min: 0, max: 1, prior: 0.5, sd: 0.35 },
  // An athletic, toned build like a tailor's display form; the fit may relax it.
  { key: 'muscle', min: 0.5, max: 1, prior: 0.75, sd: 0.15 },
  { key: 'height', min: 0, max: 1, prior: 0.5, sd: 0.5 },
  { key: 'cup', min: 0, max: 1, prior: 0.5, sd: 0.5 },
  ...Object.keys(MEASURE_PARAMS).map((key) => ({ key, min: -1, max: 1, prior: 0, sd: 0.6 })),
];
/** How closely (cm) each measurement should be matched. */
const TOLERANCE = { neck: 1.5, chest: 1, underbust: 1, waist: 1, hip: 1, shoulderWidth: 1.5, armLength: 2.5, legLength: 1.5 };
const RELATIVE = ['armLength', 'legLength'];
const NATURAL_HEIGHT_CM = 6; // prefer a mannequin whose own height is close, so scaling stays small
const BAND_DM = 2;
const ITERATIONS = 12;
const STEP = 0.02;

const typicalRatio = Object.fromEntries(BODY_FIELDS.filter((f) => f.ratio).map((f) => [f.id, f.ratio]));

function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c += 1) {
    let pivot = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(M[r][c]) > Math.abs(M[pivot][c])) pivot = r;
    [M[c], M[pivot]] = [M[pivot], M[c]];
    for (let r = c + 1; r < n; r += 1) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k += 1) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k += 1) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

/** Triangles near each girth level, and every vertex the measurements touch. */
function measuringSubset(model) {
  const p = composeBody(model, { [model.sex]: 1 });
  const { landmarks: lm, index } = model;
  const levels = { ...Object.fromEntries(Object.entries(lm.levels).map(([k, v]) => [k, p[v * 3 + 1]])) };
  levels.neck = centre(p, lm.joints.neck)[1];
  const bands = {};
  const vertices = new Set([lm.top, lm.crotch, ...lm.shoulderTips, ...Object.values(lm.joints).flat()]);
  for (const [key, y] of Object.entries(levels)) {
    const tris = [];
    for (let t = 0; t < index.length; t += 3) {
      if (Math.abs(p[index[t] * 3 + 1] - y) < BAND_DM) tris.push(index[t], index[t + 1], index[t + 2]);
    }
    tris.forEach((v) => vertices.add(v));
    bands[key] = Uint32Array.from(tris);
  }
  return { bands, vertices: [...vertices].sort((a, b) => a - b) };
}

/**
 * @param targets cm values by workspace field id (height required; others optional).
 * @returns {{ params, weights, scale, measured }} measured = the fitted mannequin's cm values.
 */
export function fitBody(model, targets) {
  const sliders = SLIDERS.filter((s) => s.key !== 'cup' || model.sex === 'female');
  const { bands, vertices } = measuringSubset(model);
  const small = restrictModel(model, vertices);
  const work = new Float32Array(model.base.length);
  const measureAt = (x) => {
    const params = Object.fromEntries(SLIDERS.map((s) => [s.key, s.prior]));
    sliders.forEach((s, i) => (params[s.key] = x[i]));
    composeBody(small, morphWeights(model.sex, params), work);
    return { params, m: measureBody(work, model.landmarks, (key) => bands[key]) };
  };

  const base = measureAt(sliders.map((s) => s.prior)).m;
  const proportion = Object.fromEntries(RELATIVE.map((k) => [k, base[k] / base.height / typicalRatio[k]]));
  const goal = { ...targets };
  for (const key of RELATIVE) if (Number.isFinite(goal[key])) goal[key] *= proportion[key];
  const keys = Object.keys(TOLERANCE).filter((k) => Number.isFinite(goal[k]));
  const residuals = (x) => {
    const { m } = measureAt(x);
    const s = targets.height / m.height;
    return [
      ...keys.map((k) => (s * m[k] - goal[k]) / TOLERANCE[k]),
      (m.height - targets.height) / NATURAL_HEIGHT_CM,
      ...sliders.map((sl, i) => (x[i] - sl.prior) / sl.sd),
    ];
  };
  const cost = (r) => r.reduce((sum, v) => sum + v * v, 0);

  let x = sliders.map((s) => s.prior);
  let r = residuals(x);
  let lambda = 1e-2;
  for (let it = 0; it < ITERATIONS; it += 1) {
    const J = sliders.map((_, i) => {
      const xi = [...x];
      xi[i] += STEP;
      return residuals(xi).map((v, k) => (v - r[k]) / STEP);
    });
    const JtJ = sliders.map((_, a) => sliders.map((__, b) => J[a].reduce((s, v, k) => s + v * J[b][k], 0)));
    const Jtr = J.map((col) => col.reduce((s, v, k) => s + v * r[k], 0));
    const step = solve(JtJ.map((row, a) => row.map((v, b) => v + (a === b ? lambda * (1 + v) : 0))), Jtr.map((v) => -v));
    const next = x.map((v, i) => Math.min(sliders[i].max, Math.max(sliders[i].min, v + step[i])));
    const rNext = residuals(next);
    if (cost(rNext) < cost(r)) {
      [x, r, lambda] = [next, rNext, lambda / 3];
    } else {
      lambda *= 4;
    }
  }

  const { params, m } = measureAt(x);
  const scale = targets.height / m.height;
  const measured = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, (v * scale) / (proportion[k] ?? 1)]));
  return { params, weights: morphWeights(model.sex, params), scale, measured };
}
