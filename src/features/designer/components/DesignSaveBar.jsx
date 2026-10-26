import { Check } from 'lucide-react';
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

/** Field errors shown inline next to their control rather than in this bar. */
const isInlineField = (key) => key === 'name' || key.endsWith('Id') || key.startsWith('customOptions.');

/**
 * Design name plus "Save" and its saved / unsaved state, in two compact rows (label + status,
 * then input + button). Sticky at the bottom of the viewport on phones, of the panel on desktop.
 * Server errors without a matching control are listed here.
 * @param {object} props.saveState result of useDesignSave()
 */
export default function DesignSaveBar({ saveState }) {
  const { design, setName } = useDesignEditor();
  const { status, save, isSaving, error, fieldErrors, nameError } = saveState;
  const otherMessages = Object.entries(fieldErrors).filter(([key]) => !isInlineField(key));

  const handleSubmit = (e) => {
    e.preventDefault();
    save();
  };

  return (
    <form className="designer-savebar" onSubmit={handleSubmit} aria-label="Save design">
      <div className="designer-savebar-row">
        <Input
          id="design-name"
          label="Design name"
          value={design.name}
          onChange={(e) => setName(e.target.value)}
          maxLength={DESIGN_NAME_MAX}
          error={nameError || fieldErrors.name}
          className="designer-savebar-name"
          autoComplete="off"
        />
        <p className={`designer-save-status is-${status}`} role="status">
          {status === 'saved' && <Check size={14} aria-hidden="true" />}
          {STATUS_LABELS[status]}
        </p>
        <Button type="submit" variant="primary" loading={isSaving} disabled={Boolean(nameError) || status === 'saved'}>
          {status === 'saved' ? 'Saved' : 'Save'}
        </Button>
      </div>

      {error && (
        <div className="designer-save-error" role="alert">
          <strong>{error}</strong>
          {otherMessages.length > 0 && (
            <ul>
              {otherMessages.map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
