import React, { useEffect, useId, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../../../shared/ui/Button';

/**
 * Modal confirmation built on the native <dialog> (focus trap, Escape, top layer for free).
 * Controlled via `open`; Escape / backdrop click / Cancel call `onCancel` unless `pending`.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  pending = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault(); // keep the dialog controlled by `open`
    if (!pending) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
      onClick={(event) => event.target === dialogRef.current && handleCancel(event)}
    >
      <div className="confirm-dialog-body">
        <div className="confirm-dialog-icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </div>
        <h2 id={titleId} className="confirm-dialog-title">
          {title}
        </h2>
        <p id={messageId} className="confirm-dialog-message">
          {message}
        </p>
        <div className="confirm-dialog-actions">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
