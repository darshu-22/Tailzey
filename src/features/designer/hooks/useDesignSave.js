import { useState } from 'react';
import { useToast, useWorkspace } from '../../../app/hooks';
import { ApiError, getErrorMessage } from '../../../core/api/ApiError';
import { validateDesignName } from '../lib/designOptions';

/**
 * Save the workspace design to the backend, exposing saving / saved / unsaved state
 * and any validation errors (422 `fieldErrors`, e.g. "colorId", "customOptions.neckline").
 * @returns {{ status: 'new'|'dirty'|'saving'|'saved', save, isSaving, error, fieldErrors, nameError }}
 */
export function useDesignSave() {
  const { design, designStatus, saveDesign } = useWorkspace();
  const { notify } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [failure, setFailure] = useState(null); // { message, fieldErrors }

  const nameError = validateDesignName(design.name);
  const status = isSaving ? 'saving' : designStatus;

  const save = async () => {
    if (isSaving || nameError) return;
    setIsSaving(true);
    setFailure(null);
    try {
      const record = await saveDesign();
      notify({ title: 'Design saved', message: `“${record.name}” is stored in your account.`, variant: 'success' });
    } catch (error) {
      const message = getErrorMessage(error);
      setFailure({ message, fieldErrors: error instanceof ApiError ? error.fieldErrors || {} : {} });
      notify({ title: 'Could not save design', message, variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    status,
    save,
    isSaving,
    error: failure?.message ?? null,
    fieldErrors: failure?.fieldErrors ?? {},
    nameError,
  };
}
