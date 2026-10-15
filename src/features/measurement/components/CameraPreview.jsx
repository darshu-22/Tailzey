import React, { useRef, useState } from 'react';
import { Camera, CameraOff, Edit3, SwitchCamera } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import PoseAlignmentOverlay from './PoseAlignmentOverlay';
import CameraStatusOverlay from './CameraStatusOverlay';
import { useCameraStream } from '../hooks/useCameraStream';
import { captureFrame } from '../lib/captureFrame';

const FLASH_MS = 250;

/**
 * Live viewfinder with pose guides and a shutter. The camera stream lives only while
 * this component is mounted and not paused; captured stills go to `onCaptureFrame`.
 */
export default function CameraPreview({ activeStep, onCaptureFrame, onSwitchToManual }) {
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isFlashing, setIsFlashing] = useState(false);
  const { videoRef, status, error, paused, pause, resume, retry } = useCameraStream({ facingMode });

  const isLive = status === 'ready' && !paused;
  const mirrored = facingMode === 'user';

  const handleCapture = () => {
    if (!isLive || !videoRef.current || !canvasRef.current) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), FLASH_MS);
    onCaptureFrame(captureFrame(videoRef.current, canvasRef.current, { mirror: mirrored }));
  };

  return (
    <div className="camera-preview-container" role="region" aria-label="Live Camera Viewfinder">
      <canvas ref={canvasRef} className="camera-capture-canvas" aria-hidden="true" />

      <div className="camera-viewfinder">
        <div className={`camera-shutter-flash ${isFlashing ? 'is-flashing' : ''}`} aria-hidden="true" />

        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`camera-video-element ${mirrored ? 'is-mirrored' : ''}`}
          hidden={!isLive}
        />

        {isLive && <PoseAlignmentOverlay silhouetteType={activeStep.silhouetteType} />}

        <CameraStatusOverlay
          status={status}
          error={error}
          paused={paused}
          onResume={resume}
          onRetry={retry}
          onSwitchToManual={onSwitchToManual}
        />

        {isLive && (
          <div className="viewfinder-badge">
            <span className="viewfinder-recording-dot" aria-hidden="true" />
            <span>LIVE PREVIEW · NOTHING IS RECORDED</span>
          </div>
        )}
      </div>

      <div className="camera-controls-bar">
        <div className="camera-controls-left">
          <button
            type="button"
            className="camera-ctrl-btn"
            onClick={paused ? resume : pause}
            aria-label={paused ? 'Resume camera stream' : 'Pause camera stream'}
          >
            {paused ? <Camera size={18} /> : <CameraOff size={18} />}
            <span>{paused ? 'Resume' : 'Pause Camera'}</span>
          </button>
          <button
            type="button"
            className="camera-ctrl-btn"
            onClick={() => setFacingMode((m) => (m === 'user' ? 'environment' : 'user'))}
            disabled={!isLive}
            aria-label="Switch between front and back camera"
          >
            <SwitchCamera size={18} />
            <span>Switch Lens</span>
          </button>
        </div>

        <div className="camera-capture-trigger-wrap">
          <button
            type="button"
            className="camera-shutter-btn"
            onClick={handleCapture}
            disabled={!isLive}
            aria-label={`Capture still photo for ${activeStep.name}`}
          >
            <div className="shutter-inner-ring" />
            <div className="shutter-core-circle" />
          </button>
          <span className="shutter-label">Capture Still</span>
        </div>

        <div className="camera-controls-right">
          <Button variant="ghost" size="sm" icon={Edit3} onClick={onSwitchToManual}>
            Manual Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
