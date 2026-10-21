import React from 'react';
import { Camera, CameraOff, Download, Scissors, SwitchCamera } from 'lucide-react';
import Button from '../../../shared/ui/Button';

/** Camera controls under the live view (Camera and Flip are icon-only on phones). */
export default function StageToolbar({ camera, trimToBody, onTrimChange, onSnapshot, snapshotReady }) {
  return (
    <div className="tryon-toolbar" role="toolbar" aria-label="Camera controls">
      <Button
        variant="secondary"
        size="sm"
        className="tryon-toggle tryon-tool-iconic"
        icon={camera.enabled ? Camera : CameraOff}
        aria-pressed={camera.enabled}
        onClick={() => camera.setEnabled(!camera.enabled)}
      >
        Camera
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="tryon-tool-iconic"
        icon={SwitchCamera}
        onClick={camera.switchLens}
        disabled={!camera.canSwitch || camera.status !== 'ready'}
        ariaLabel={camera.facingMode === 'user' ? 'Switch to the back camera' : 'Switch to the front camera'}
      >
        Flip
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="tryon-toggle"
        icon={Scissors}
        aria-pressed={trimToBody}
        onClick={() => onTrimChange(!trimToBody)}
        title="Keep the garment inside your body outline"
      >
        Trim to body
      </Button>
      <Button size="sm" icon={Download} onClick={onSnapshot} disabled={!snapshotReady} className="tryon-snapshot">
        Snapshot
      </Button>
    </div>
  );
}
