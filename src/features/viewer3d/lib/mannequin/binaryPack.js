/**
 * Reads the mannequin's binary packs (see backend/scripts/mannequin/pack.py): typed arrays laid
 * end to end, described by a table of { type, offset, length, scale? }. Quantised arrays
 * (with a scale) come back as Float32Array values.
 */

const TYPES = { Int16: Int16Array, Uint16: Uint16Array, Uint32: Uint32Array, Float32: Float32Array };

export function readArray(buffer, entry) {
  const raw = new TYPES[entry.type](buffer, entry.offset, entry.length);
  if (entry.scale === undefined) return raw;
  const out = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw[i] * entry.scale;
  return out;
}

/** A sparse morph: absolute vertex indices (stored as ascending gaps) and xyz deltas. */
export function readSparse(buffer, table, name) {
  const gaps = readArray(buffer, table[`${name}.index`]);
  const index = new Uint32Array(gaps.length);
  let at = 0;
  for (let i = 0; i < gaps.length; i += 1) {
    at += gaps[i];
    index[i] = at;
  }
  return { index, delta: readArray(buffer, table[`${name}.delta`]) };
}
