import { useCallback, useState } from 'react';
import { useToast, useWorkspace } from '../../../app/hooks';
import { ApiError, getErrorMessage } from '../../../core/api/ApiError';
import { splitProfileFieldErrors } from '../lib/profileErrors';

const NO_ERRORS = { profileName: null, values: {}, other: [] };

/**
 * Save the measurement workspace as a profile on the backend (create, or update the
 * linked profile). Validation errors are mapped back to the name and value fields.
 */
export function useProfileSave() {
  const { measurement, updateMeasurement, saveProfile } = useWorkspace();
  const { notify } = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(NO_ERRORS);
  const [formError, setFormError] = useState(null);

  const setProfileName = useCallback(
    (profileName) => {
      updateMeasurement({ profileName });
      setErrors((e) => ({ ...e, profileName: null }));
    },
    [updateMeasurement]
  );

  const save = useCallback(async () => {
    if (!measurement.profileName.trim()) {
      setErrors({ ...NO_ERRORS, profileName: 'Please give these measurements a name.' });
      return;
    }
    setSaving(true);
    setErrors(NO_ERRORS);
    setFormError(null);
    try {
      const record = await saveProfile();
      notify({ variant: 'success', title: 'Measurements saved', message: `“${record.profileName}” is saved to your account.` });
    } catch (error) {
      const split = error instanceof ApiError ? splitProfileFieldErrors(error.fieldErrors) : NO_ERRORS;
      setErrors(split);
      setFormError(getErrorMessage(error));
      notify({ variant: 'error', title: 'Could not save measurements', message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }, [measurement.profileName, saveProfile, notify]);

  /** Forget a value's server error once the user edits it. */
  const clearValueError = useCallback(
    (key) => setErrors((e) => (e.values[key] ? { ...e, values: { ...e.values, [key]: undefined } } : e)),
    []
  );

  return {
    profileName: measurement.profileName,
    isSaved: Boolean(measurement.profileId),
    saving,
    errors,
    formError,
    setProfileName,
    save,
    clearValueError,
  };
}
