import React from 'react';
import { Check, Save } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input';
import { useDesignEditor } from '../hooks/useDesignEditor';
import { DESIGN_NAME_MAX } from '../lib/designOptions';

const STATUS_LABELS = {
  new: 'Not saved yet',
  dirty: 'Unsaved changes',
  saving: 'Saving…',
  saved: 'Saved',
};

/**
 * Design name field plus the "Save design" action and its saved / unsaved state.
 * Server validation errors (422) are listed inline under the bar.
 * @param {object} props.saveState result of useDesignSave()
 */
export default function DesignSaveBar({ saveState }) {
  const { design, setName } = useDesignEditor();
  const { status, save, isSaving, error, fieldErrors, nameError } = saveState;
  const serverMessages = Object.entries(fieldErrors).filter(([key]) => key !== 'name');

  const handleSubmit = (e) => {
    e.preventDefault();
    save();
  };

  return (
    <form className="designer-save-bar" onSubmit={handleSubmit} aria-label="Design name and saving">
      <Input
        id="design-name"
        label="Design name"
        value={design.name}
        onChange={(e) => setName(e.target.value)}
        maxLength={DESIGN_NAME_MAX}
        error={nameError || fieldErrors.name}
        className="designer-name-field"
        autoComplete="off"
      />

      <div className="designer-save-actions">
        <span className={`designer-save-status is-${status}`} role="status">
          {status === 'saved' && <Check size={13} aria-hidden="true" />}
          {STATUS_LABELS[status]}
        </span>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          icon={Save}
          loading={isSaving}
          disabled={Boolean(nameError) || status === 'saved'}
        >
          Save design
        </Button>
      </div>

      {error && (
        <div className="designer-save-error" role="alert">
          <strong>{error}</strong>
          {serverMessages.length > 0 && (
            <ul>
              {serverMessages.map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
