import { FIELDS_BY_ID } from '../../../shared/measurements/measurementFields';

/**
 * Split an ApiError's fieldErrors ({"profileName": ..., "values.chest": ...}) into
 * the profile name error, per-measurement errors, and anything else.
 */
export function splitProfileFieldErrors(fieldErrors = {}) {
  const result = { profileName: null, values: {}, other: [] };
  for (const [path, message] of Object.entries(fieldErrors)) {
    const [root, key] = path.split('.');
    if (root === 'profileName') result.profileName = message;
    else if ((root === 'values' || root === 'adjustments') && key in FIELDS_BY_ID) {
      result.values[key] = message;
    } else {
      result.other.push(`${path}: ${message}`);
    }
  }
  return result;
}
