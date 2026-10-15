import { useCallback, useState } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { convertValue } from '../../../shared/utils/units';
import { toInputValue, validateFieldInput } from '../../../shared/measurements/measurementFields';

const mapFields = (fn) => Object.fromEntries(MANUAL_MEASUREMENT_FIELDS.map((f) => [f.id, fn(f)]));

/**
 * Draft state for the manual tape-measurement form. Drafts start from the workspace
 * values; submit() validates every field in the current unit and writes only the
 * fields that changed, so untouched camera estimates keep their status.
 */
export function useManualMeasurementForm() {
  const { measurement, setValue, setUnit } = useWorkspace();
  const { unit, values } = measurement;
  const [drafts, setDrafts] = useState(() => mapFields((f) => toInputValue(values[f.id])));
  const [errors, setErrors] = useState({});

  const changeField = useCallback((id, raw) => {
    setDrafts((d) => ({ ...d, [id]: raw }));
    setErrors(({ [id]: _cleared, form: _form, ...rest }) => rest);
  }, []);

  const changeUnit = useCallback(
    (next) => {
      if (next === unit) return;
      setDrafts((d) => mapFields((f) => toInputValue(convertValue(d[f.id], unit, next))));
      setErrors({});
      setUnit(next);
    },
    [unit, setUnit]
  );

  const clearAll = useCallback(() => {
    setDrafts(mapFields(() => ''));
    setErrors({});
  }, []);

  /** Validate and save. Returns true when the values were stored. */
  const submit = useCallback(() => {
    const nextErrors = {};
    for (const field of MANUAL_MEASUREMENT_FIELDS) {
      const message = validateFieldInput(field, drafts[field.id], unit);
      if (message) nextErrors[field.id] = message;
    }
    if (MANUAL_MEASUREMENT_FIELDS.every((f) => !String(drafts[f.id]).trim())) {
      nextErrors.form = 'Please enter at least one measurement before continuing.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return false;

    for (const field of MANUAL_MEASUREMENT_FIELDS) {
      const text = String(drafts[field.id]).trim();
      const next = text ? Number(text) : null;
      if (next !== (values[field.id] ?? null)) setValue(field.id, next);
    }
    return true;
  }, [drafts, unit, values, setValue]);

  return {
    unit,
    drafts,
    errors,
    fieldStatus: measurement.fieldStatus,
    uncertainty: measurement.uncertainty,
    changeField,
    changeUnit,
    clearAll,
    submit,
  };
}
