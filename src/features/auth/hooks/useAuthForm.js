import { useCallback, useState } from 'react';
import { ApiError, getErrorMessage } from '../../../core/api/ApiError';

/**
 * Form state for the auth pages: values, inline field errors (client or server),
 * a form-level error message, and a pending flag while the request is in flight.
 */
export function useAuthForm({ initialValues, validate, submit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setFormError('');

    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setPending(true);
    try {
      await submit(values);
    } catch (err) {
      const fieldErrors = err instanceof ApiError ? err.fieldErrors || {} : {};
      const knownFields = Object.keys(fieldErrors).filter((key) => key in initialValues);
      if (knownFields.length > 0) {
        setErrors(Object.fromEntries(knownFields.map((key) => [key, fieldErrors[key]])));
      } else {
        setFormError(getErrorMessage(err));
      }
    } finally {
      setPending(false);
    }
  };

  return { values, errors, formError, pending, setField, handleSubmit };
}
