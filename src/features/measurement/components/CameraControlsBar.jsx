import React from 'react';
import { Camera, CameraOff, Hand, SwitchCamera, Volume2, VolumeX } from 'lucide-react';

function ControlButton({ icon: Icon, label, pressed, disabled, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      className={`cam-btn ${pressed ? 'is-on' : ''}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="cam-btn-label">{label}</span>
    </button>
  );
}

/** Viewfinder controls: pause, lens, manual shutter, hands-free and voice toggles. */
export default function CameraControlsBar({
  isLive,
  paused,
  stepName,
  handsFree,
  voiceOn,
  voiceSupported,
  onTogglePause,
  onSwitchLens,
  onToggleHandsFree,
  onToggleVoice,
  onCapture,
}) {
  return (
    <div className="cam-controls">
      <div className="cam-controls-group">
        <ControlButton
          icon={paused ? Camera : CameraOff}
          label={paused ? 'Resume' : 'Pause'}
          ariaLabel={paused ? 'Resume camera' : 'Pause camera'}
          onClick={onTogglePause}
        />
        <ControlButton icon={SwitchCamera} label="Flip" ariaLabel="Switch camera" disabled={!isLive} onClick={onSwitchLens} />
      </div>

      <div className="cam-shutter-wrap">
        <button
          type="button"
          className="cam-shutter"
          onClick={onCapture}
          disabled={!isLive}
          aria-label={`Take photo: ${stepName}`}
        >
          <span className="cam-shutter-core" aria-hidden="true" />
        </button>
        <span className="cam-shutter-label" aria-hidden="true">
          {handsFree ? 'Take now' : 'Take photo'}
        </span>
      </div>

      <div className="cam-controls-group">
        <ControlButton icon={Hand} label="Hands-free" pressed={handsFree} onClick={onToggleHandsFree} />
        {voiceSupported && (
          <ControlButton
            icon={voiceOn ? Volume2 : VolumeX}
            label="Voice"
            pressed={voiceOn}
            disabled={!handsFree}
            onClick={onToggleVoice}
          />
        )}
      </div>
    </div>
  );
}
