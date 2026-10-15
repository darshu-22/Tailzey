import { useCallback, useState } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { convertValue } from '../../../shared/utils/units';
import { FIELDS_BY_ID, toInputValue, validateFieldInput } from '../../../shared/measurements/measurementFields';

const HEIGHT = FIELDS_BY_ID.height;

/**
 * Barefoot height input for camera analysis (it sets the photo scale, so it is required).
 * The draft lives here; commit() validates it in the workspace unit and stores it.
 */
export function useHeightField() {
  const { measurement, setValue, setUnit } = useWorkspace();
  const { unit } = measurement;
  const [draft, setDraft] = useState(() => toInputValue(measurement.values.height));
  const [error, setError] = useState(null);

  const change = useCallback((raw) => {
    setDraft(raw);
    setError(null);
  }, []);

  const changeUnit = useCallback(
    (next) => {
      if (next === unit) return;
      setDraft((d) => toInputValue(convertValue(d, unit, next)));
      setError(null);
      setUnit(next);
    },
    [unit, setUnit]
  );

  /** Validate and store the height. Returns true when it is valid. */
  const commit = useCallback(() => {
    const message = validateFieldInput(HEIGHT, draft, unit, { required: true });
    setError(message);
    if (message) return false;
    setValue('height', Number(draft));
    return true;
  }, [draft, unit, setValue]);

  return { field: HEIGHT, draft, error, unit, change, changeUnit, commit };
}
