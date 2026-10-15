import { useCallback, useState } from 'react';

/**
 * State for a single confirmation dialog.
 * `confirm({ title, message, confirmLabel, onConfirm })` opens it; the dialog stays open
 * (with a pending spinner) until `onConfirm` settles. `onConfirm` should handle its own errors.
 */
export function useConfirmDialog() {
  const [request, setRequest] = useState(null);
  const [pending, setPending] = useState(false);

  const confirm = useCallback((next) => setRequest(next), []);
  const cancel = useCallback(() => {
    if (!pending) setRequest(null);
  }, [pending]);

  const accept = useCallback(async () => {
    if (!request) return;
    setPending(true);
    try {
      await request.onConfirm();
    } finally {
      setPending(false);
      setRequest(null);
    }
  }, [request]);

  return {
    confirm,
    dialogProps: {
      open: request !== null,
      title: request?.title,
      message: request?.message,
      confirmLabel: request?.confirmLabel,
      pending,
      onConfirm: accept,
      onCancel: cancel,
    },
  };
}
