import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './ToastContext';
import ToastViewport from './ToastViewport';

const AUTO_DISMISS_MS = 5000;

/** App-wide notifications: notify({ title, message, variant }). */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    ({ title, message = '', variant = 'info', durationMs = AUTO_DISMISS_MS }) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, title, message, variant }]);
      if (durationMs) setTimeout(() => dismiss(id), durationMs);
      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
