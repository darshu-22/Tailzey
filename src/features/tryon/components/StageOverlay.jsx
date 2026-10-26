import React from 'react';
import { Box, Camera, RefreshCw } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { GUIDANCE } from '../lib/bodyFrame';

function StageMessage({ title, children, actions, alert = false }) {
  return (
    <div className="tryon-message" role={alert ? 'alert' : undefined}>
      <h2 className="tryon-message-title">{title}</h2>
      <p className="tryon-message-text">{children}</p>
      {actions && <div className="tryon-message-actions">{actions}</div>}
    </div>
  );
}

/** Status and guidance drawn over the camera view: errors, loading and pose hints. */
export default function StageOverlay({ camera, tracker, onOpenStudio }) {
  const studio = (
    <Button variant="outline" size="sm" icon={Box} onClick={onOpenStudio}>
      Open the 3D studio
    </Button>
  );

  if (camera.status === 'error') {
    const canRetry = camera.error.type !== 'unsupported';
    return (
      <StageMessage
        alert
        title={camera.error.title}
        actions={
          <>
            {canRetry && (
              <Button size="sm" icon={RefreshCw} onClick={camera.retry}>
                Try again
              </Button>
            )}
            {studio}
          </>
        }
      >
        {camera.error.message} {!canRetry && 'You can still preview your outfit in the 3D studio.'}
      </StageMessage>
    );
  }
  if (camera.status === 'off') {
    return (
      <StageMessage
        title="Camera is off"
        actions={
          <Button size="sm" icon={Camera} onClick={() => camera.setEnabled(true)}>
            Turn camera on
          </Button>
        }
      >
        Turn the camera on to see the garment on you.
      </StageMessage>
    );
  }
  if (tracker.status === 'unavailable') {
    return (
      <StageMessage alert title="Live try-on isn’t supported here" actions={studio}>
        This browser or device can’t run body tracking. Try a recent Chrome, Edge or Safari, or preview the
        outfit on the 3D studio’s sample mannequin.
      </StageMessage>
    );
  }

  let hint = GUIDANCE.loading;
  if (camera.status === 'paused') hint = 'Paused while this tab is in the background.';
  else if (camera.status === 'starting') hint = 'Starting the camera…';
  else if (tracker.status === 'tracking') hint = GUIDANCE[tracker.code] ?? GUIDANCE.tracking;
  const busy = camera.status === 'starting' || tracker.status === 'loading';

  return (
    <>
      {tracker.status === 'tracking' && tracker.fps > 0 && (
        <span className="tryon-fps" aria-hidden="true">
          {tracker.fps} fps
        </span>
      )}
      <p className={`tryon-hint ${tracker.code === 'tracking' ? 'is-good' : ''}`.trim()} role="status" aria-live="polite">
        {busy && <span className="loading-spinner tryon-hint-spinner" aria-hidden="true" />}
        {hint}
      </p>
    </>
  );
}
