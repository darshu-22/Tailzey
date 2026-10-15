import React from 'react';
import { AlertCircle, CheckCircle2, Sparkles, X } from 'lucide-react';

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Sparkles };

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" aria-live="polite" role="status">
      {toasts.map(({ id, title, message, variant }) => {
        const Icon = ICONS[variant] || Sparkles;
        return (
          <aside key={id} className={`toast-notification toast-${variant}`}>
            <div className="toast-icon">
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="toast-content">
              <h5 className="toast-title">{title}</h5>
              {message && <p className="toast-message">{message}</p>}
            </div>
            <button type="button" className="toast-close-btn" onClick={() => onDismiss(id)} aria-label="Dismiss message">
              <X size={18} />
            </button>
          </aside>
        );
      })}
    </div>
  );
}
