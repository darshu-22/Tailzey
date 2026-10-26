import React from 'react';
import { CheckCircle2, Loader2, RotateCw, ScanLine } from 'lucide-react';

function message({ tracking, view, step }) {
  if (tracking.status === 'loading') return { tone: 'info', icon: Loader2, text: 'Starting hands-free capture…' };
  if (tracking.status === 'unavailable') return { tone: 'warn', icon: ScanLine, text: tracking.hint };
  if (view.phase === 'turning') return { tone: 'info', icon: RotateCw, text: step.instruction };
  if (view.phase === 'captured') return { tone: 'ok', icon: CheckCircle2, text: 'Photo taken.' };
  if (view.phase === 'countdown') return { tone: 'ok', icon: ScanLine, text: 'Hold still…' };
  const ok = tracking.code === 'hold' || tracking.ready;
  return { tone: ok ? 'ok' : 'warn', icon: ScanLine, text: tracking.hint };
}

/** Big, glanceable guidance over the viewfinder, readable from 2–3 metres away. */
export default function AutoCaptureOverlay({ tracking, view, step }) {
  const { tone, icon: Icon, text } = message({ tracking, view, step });
  return (
    <>
      {view.phase === 'countdown' && (
        <div className="auto-countdown" aria-hidden="true">
          {view.count}
        </div>
      )}
      <div className={`auto-banner is-${tone}`} role="status" aria-live="polite">
        <Icon size={28} className={tracking.status === 'loading' ? 'is-spinning' : ''} aria-hidden="true" />
        <span>{text}</span>
      </div>
    </>
  );
}
