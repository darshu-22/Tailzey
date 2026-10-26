import { Info } from 'lucide-react';

const MESSAGES = {
  dirty: 'This design has changes that are not saved to your account yet.',
  new: 'This design is not saved to your account yet.',
};

/** Screen-only reminder to save the design; hidden when it is already saved. */
export default function ReportSaveNotice({ status, onEdit }) {
  const message = MESSAGES[status];
  if (!message) return null;

  return (
    <div className="report-notice no-print" role="note">
      <Info size={16} aria-hidden="true" />
      <p>
        {message}{' '}
        <button type="button" className="report-link" onClick={onEdit}>
          Save it in the designer
        </button>
      </p>
    </div>
  );
}
