import { readArray, readSparse } from './binaryPack';

/**
 * The MakeHuman body (CC0): base mesh plus sparse morph targets, in decimetres (y up, facing +z).
 * Parameters follow MakeHuman's sliders: weight / height / cup in 0…1 (0.5 = average, blending
 * the min or max target either side), muscle in 0.5…1 (average → maximum tone, blended with
 * weight), and tape-measure modifiers in −1…1 (decrease / increase). Ideal proportions are on.
 */

/** Tape-measure parameter → the MakeHuman modifier(s) it drives. */
export const MEASURE_PARAMS = {
  neck: ['neck-circ'],
  bust: ['bust-circ'],
  underbust: ['underbust-circ'],
  waist: ['waist-circ'],
  hips: ['hips-circ'],
  shoulder: ['shoulder-dist'],
  arm: ['upperarm-length', 'lowerarm-length'],
  leg: ['upperleg-height', 'lowerleg-height'],
};

const either = (v) => (v < 0.5 ? [1 - 2 * v, 0] : [0, 2 * v - 1]); // [min, max] target weights
const signed = (v) => (v < 0 ? [-v, 0] : [0, v]); // [decr, incr] target weights

/** Morph target name → weight for a sex and a parameter set. */
export function morphWeights(sex, params) {
  const out = { [sex]: 1, [`${sex}-idealproportions`]: 1 };
  const blend = (prefix, value) => {
    const [min, max] = either(value);
    out[`${sex}-min${prefix}`] = min;
    out[`${sex}-max${prefix}`] = max;
  };
  const [wMin, wMax] = either(params.weight);
  const tone = Math.min(Math.max((params.muscle - 0.5) / 0.5, 0), 1);
  for (const [w, share] of [['min', wMin], ['average', 1 - wMin - wMax], ['max', wMax]]) {
    out[`${sex}-${w}weight`] = share * (1 - tone);
    out[`${sex}-maxmuscle-${w}weight`] = share * tone;
  }
  blend('height', params.height);
  if (sex === 'female') blend('cup', params.cup);
  for (const [key, modifiers] of Object.entries(MEASURE_PARAMS)) {
    const [decr, incr] = signed(params[key]);
    for (const m of modifiers) {
      out[`${m}-decr`] = decr;
      out[`${m}-incr`] = incr;
    }
  }
  return out;
}

function readMorphs(file, buffer, into) {
  for (const key of Object.keys(file.arrays)) {
    if (key.endsWith('.index')) {
      const name = key.slice(0, -'.index'.length);
      into[name] = readSparse(buffer, file.arrays, name);
    }
  }
}

export function createBodyModel(manifest, commonBuffer, sexBuffer, sex) {
  const { files, landmarks, bodyVertexCount } = manifest.body;
  const morphs = {};
  readMorphs(files.common, commonBuffer, morphs);
  readMorphs(files[sex], sexBuffer, morphs);
  const quads = readArray(commonBuffer, files.common.arrays.quads);
  const index = new Uint32Array((quads.length / 4) * 6);
  for (let f = 0; f < quads.length / 4; f += 1) {
    const [a, b, c, d] = quads.subarray(f * 4, f * 4 + 4);
    index.set([a, b, c, a, c, d], f * 6);
  }
  return {
    sex,
    base: readArray(commonBuffer, files.common.arrays.position),
    quads,
    index, // triangles, for measuring
    morphs,
    landmarks,
    bodyVertexCount,
  };
}

/**
 * A copy of the model restricted to `vertices` (sorted indices): composing it only updates
 * those vertices, which is all the fitter needs to measure.
 */
export function restrictModel(model, vertices) {
  const keep = new Uint8Array(model.base.length / 3);
  for (const v of vertices) keep[v] = 1;
  const morphs = {};
  for (const [name, { index, delta }] of Object.entries(model.morphs)) {
    const rows = [];
    for (let i = 0; i < index.length; i += 1) if (keep[index[i]]) rows.push(i);
    morphs[name] = {
      index: Uint32Array.from(rows, (i) => index[i]),
      delta: Float32Array.from(rows.flatMap((i) => [delta[i * 3], delta[i * 3 + 1], delta[i * 3 + 2]])),
    };
  }
  return { ...model, morphs, subset: Uint32Array.from(vertices) };
}

/** Body positions (dm) for morph weights, written into `out`. */
export function composeBody(model, weights, out = new Float32Array(model.base.length)) {
  if (model.subset) {
    for (const v of model.subset) out.set(model.base.subarray(v * 3, v * 3 + 3), v * 3);
  } else {
    out.set(model.base);
  }
  for (const [name, w] of Object.entries(weights)) {
    const morph = w && model.morphs[name];
    if (!morph) continue;
    const { index, delta } = morph;
    for (let i = 0; i < index.length; i += 1) {
      const v = index[i] * 3;
      out[v] += w * delta[i * 3];
      out[v + 1] += w * delta[i * 3 + 1];
      out[v + 2] += w * delta[i * 3 + 2];
    }
  }
  return out;
}
