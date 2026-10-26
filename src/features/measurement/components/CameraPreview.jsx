import React, { useCallback, useRef, useState } from 'react';
import PoseAlignmentOverlay from './PoseAlignmentOverlay';
import CameraStatusOverlay from './CameraStatusOverlay';
import CameraControlsBar from './CameraControlsBar';
import AutoCaptureOverlay from './AutoCaptureOverlay';
import { useCameraStream } from '../hooks/useCameraStream';
import { usePoseTracking } from '../hooks/usePoseTracking';
import { useAutoCapture } from '../hooks/useAutoCapture';
import { captureFrame } from '../lib/captureFrame';

const FLASH_MS = 250;
const voiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Live viewfinder with pose guides and a shutter. In hands-free mode the pose is checked
 * locally in the browser and the photo is taken automatically once the user is in position.
 * The camera stream lives only while this component is mounted and not paused.
 */
export default function CameraPreview({
  activeStep,
  hasPhoto,
  handsFree,
  voiceOn,
  onToggleHandsFree,
  onToggleVoice,
  onCaptureFrame,
  onSwitchToManual,
}) {
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isFlashing, setIsFlashing] = useState(false);
  const { videoRef, status, error, paused, pause, resume, retry } = useCameraStream({ facingMode });

  const isLive = status === 'ready' && !paused;
  const mirrored = facingMode === 'user';
  const autoOn = handsFree && isLive;
  const kind = activeStep.silhouetteType; // 'front' | 'side' | 'back'

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), FLASH_MS);
    onCaptureFrame(captureFrame(videoRef.current, canvasRef.current, { mirror: mirrored }));
  }, [videoRef, mirrored, onCaptureFrame]);

  const tracking = usePoseTracking({ videoRef, enabled: autoOn, kind });
  const autoView = useAutoCapture({
    enabled: autoOn,
    voiceOn: voiceOn && voiceSupported,
    tracking,
    step: activeStep,
    hasPhoto,
    onCapture: handleCapture,
  });

  return (
    <section className="capture-stage" aria-label="Camera">
      <canvas ref={canvasRef} className="viewfinder-canvas" aria-hidden="true" />

      <div className="viewfinder">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`viewfinder-video ${mirrored ? 'is-mirrored' : ''}`}
          hidden={!isLive}
        />

        {isLive && <PoseAlignmentOverlay silhouetteType={kind} />}
        {autoOn && <AutoCaptureOverlay tracking={tracking} view={autoView} step={activeStep} />}

        {isLive && (
          <p className="viewfinder-badge">
            <span className="viewfinder-dot" aria-hidden="true" />
            Live preview · nothing is recorded
          </p>
        )}

        <CameraStatusOverlay
          status={status}
          error={error}
          paused={paused}
          onResume={resume}
          onRetry={retry}
          onSwitchToManual={onSwitchToManual}
        />

        <div className={`viewfinder-flash ${isFlashing ? 'is-flashing' : ''}`} aria-hidden="true" />
      </div>

      <CameraControlsBar
        isLive={isLive}
        paused={paused}
        stepName={activeStep.name}
        handsFree={handsFree}
        voiceOn={voiceOn}
        voiceSupported={voiceSupported}
        onTogglePause={paused ? resume : pause}
        onSwitchLens={() => setFacingMode((m) => (m === 'user' ? 'environment' : 'user'))}
        onToggleHandsFree={onToggleHandsFree}
        onToggleVoice={onToggleVoice}
        onCapture={handleCapture}
      />
    </section>
  );
}
