import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  AlertCircle,
  Video,
  Edit3,
  SwitchCamera,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button';

/**
 * Alignment SVG Overlay for the active pose
 */
function PoseAlignmentOverlay({ silhouetteType = 'front' }) {
  return (
    <div className="camera-alignment-overlay" aria-hidden="true">
      <svg
        viewBox="0 0 360 480"
        className="camera-alignment-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Framing Corner Accents */}
        <path d="M 30 50 L 30 30 L 50 30" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 330 50 L 330 30 L 310 30" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 30 430 L 30 450 L 50 450" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 330 430 L 330 450 L 310 450" stroke="#D9B47A" strokeWidth="2.5" fill="none" />

        {/* Vertical Center Caliper */}
        <line x1="180" y1="30" x2="180" y2="450" stroke="rgba(217, 180, 122, 0.3)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Head Eyeline Guide */}
        <line x1="140" y1="105" x2="220" y2="105" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Shoulder Line Guide */}
        <line x1="110" y1="160" x2="250" y2="160" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Hip Line Guide */}
        <line x1="120" y1="270" x2="240" y2="270" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Floor Line */}
        <line x1="80" y1="440" x2="280" y2="440" stroke="rgba(217, 180, 122, 0.6)" strokeWidth="1.5" />

        {/* Dynamic Pose Outline */}
        {silhouetteType === 'front' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Head */}
            <ellipse cx="180" cy="95" rx="26" ry="34" />
            {/* Neck */}
            <path d="M 170 128 L 170 148 M 190 128 L 190 148" />
            {/* Torso & Limbs */}
            <path d="M 170 148 L 126 165 L 105 285 M 190 148 L 234 165 L 255 285" />
            <path d="M 135 170 L 142 260 L 132 290 L 140 435 M 225 170 L 218 260 L 228 290 L 220 435" />
          </g>
        )}

        {silhouetteType === 'side' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Profile Head */}
            <circle cx="180" cy="95" r="30" />
            <path d="M 175 125 L 175 152" />
            {/* Spine & Silhouette */}
            <path d="M 175 152 Q 165 220 178 280 L 172 435" />
            <path d="M 180 152 Q 196 200 184 280 L 188 435" />
            {/* Arm Profile */}
            <line x1="178" y1="165" x2="178" y2="280" strokeDasharray="3 3" />
          </g>
        )}

        {silhouetteType === 'three-quarter' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Angled Head */}
            <ellipse cx="180" cy="95" rx="28" ry="34" />
            {/* Angled Shoulders */}
            <path d="M 138 160 L 170 145 M 190 145 L 228 168" />
            {/* Torso Profile Angle */}
            <path d="M 144 168 L 148 270 L 142 435 M 222 172 L 214 270 L 210 435" />
            <line x1="178" y1="145" x2="178" y2="275" strokeDasharray="2 3" />
          </g>
        )}

        {silhouetteType === 'back' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Head back */}
            <ellipse cx="180" cy="95" rx="26" ry="32" />
            {/* Back shoulders */}
            <path d="M 124 162 Q 180 152 236 162" />
            <path d="M 124 162 L 102 280 M 236 162 L 258 280" />
            <path d="M 136 170 L 140 265 L 132 290 L 140 435 M 224 170 L 220 265 L 228 290 L 220 435" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * CameraPreview Component
 * Manages live user media streaming, local canvas capture, permission handling,
 * and reliable hardware cleanup.
 */
export default function CameraPreview({
  activeStep,
  onCaptureFrame,
  onSwitchToManual,
  isCameraActive = true,
  setIsCameraActive,
  className = '',
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [streamReady, setStreamReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isShutterActive, setIsShutterActive] = useState(false);

  // Initialize or stop camera based on isCameraActive & facingMode
  useEffect(() => {
    let isCancelled = false;

    const stopMediaTracks = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStreamReady(false);
    };

    const startMediaStream = async () => {
      setCameraError(null);
      stopMediaTracks();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError({
          type: 'unsupported',
          message: 'Your browser environment does not support media stream capture. Please proceed with manual measurement entry.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (!isCancelled) {
              videoRef.current.play().catch(() => {});
              setStreamReady(true);
            }
          };
        }
      } catch (err) {
        if (isCancelled) return;
        console.error('Camera access error:', err);

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError({
            type: 'denied',
            message: 'Camera permission was denied. You can grant access in your browser site settings or enter measurements manually.',
          });
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError({
            type: 'notfound',
            message: 'No active camera hardware was detected on your device. Please use manual measurement entry.',
          });
        } else {
          setCameraError({
            type: 'generic',
            message: `Camera stream could not be started (${err.message || 'Error'}). Please try again or switch to manual entry.`,
          });
        }
      }
    };

    if (isCameraActive) {
      startMediaStream();
    } else {
      stopMediaTracks();
    }

    return () => {
      isCancelled = true;
      stopMediaTracks();
    };
  }, [isCameraActive, facingMode]);

  // Capture frame explicitly on user command
  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current || !streamReady) return;

    // Trigger visual flash
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 250);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // Mirror horizontally if user-facing camera
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    // Grab temporary base64 JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCaptureFrame(dataUrl);
  };

  const toggleCameraActive = () => {
    if (setIsCameraActive) {
      setIsCameraActive(!isCameraActive);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className={`camera-preview-container ${className}`.trim()} role="region" aria-label="Live Camera Viewfinder">
      {/* Offscreen Canvas for Frame Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

      {/* Main Viewfinder Frame */}
      <div className="camera-viewfinder">
        {/* Shutter Flash Animation */}
        <div className={`camera-shutter-flash ${isShutterActive ? 'is-flashing' : ''}`} aria-hidden="true" />

        {/* Video Stream Element */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`camera-video-element ${facingMode === 'user' ? 'is-mirrored' : ''}`}
          style={{ display: streamReady && !cameraError ? 'block' : 'none' }}
        />

        {/* Pose Alignment Overlay */}
        {streamReady && !cameraError && (
          <PoseAlignmentOverlay silhouetteType={activeStep.silhouetteType} />
        )}

        {/* Camera Loading State */}
        {isCameraActive && !streamReady && !cameraError && (
          <div className="camera-state-overlay" role="status">
            <div className="camera-loading-spinner" aria-hidden="true" />
            <p className="camera-state-text">Initializing camera hardware...</p>
            <span className="camera-state-sub">Prompting browser for local video permission</span>
          </div>
        )}

        {/* Camera Stopped State */}
        {!isCameraActive && !cameraError && (
          <div className="camera-state-overlay" role="status">
            <CameraOff size={36} style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }} />
            <p className="camera-state-text">Camera Preview Paused</p>
            <Button
              variant="primary"
              size="sm"
              icon={Camera}
              onClick={toggleCameraActive}
              style={{ marginTop: '0.75rem' }}
            >
              Resume Camera
            </Button>
          </div>
        )}

        {/* Camera Error Fallback State */}
        {cameraError && (
          <div className="camera-error-overlay" role="alert">
            <AlertCircle size={36} className="camera-error-icon" />
            <h3 className="camera-error-title">
              {cameraError.type === 'denied'
                ? 'Camera Permission Denied'
                : cameraError.type === 'notfound'
                ? 'Camera Not Detected'
                : 'Camera Unavailable'}
            </h3>
            <p className="camera-error-msg">{cameraError.message}</p>

            <div className="camera-error-actions">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => setFacingMode((prev) => prev)}
              >
                Retry Camera
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={Edit3}
                onClick={onSwitchToManual}
              >
                Switch to Manual Entry
              </Button>
            </div>
          </div>
        )}

        {/* Active View Finder Badge */}
        {streamReady && !cameraError && (
          <div className="viewfinder-badge">
            <span className="viewfinder-recording-dot" aria-hidden="true" />
            <span>LIVE ATELIER PREVIEW</span>
          </div>
        )}
      </div>

      {/* Viewfinder Controls Bar */}
      <div className="camera-controls-bar">
        <div className="camera-controls-left">
          <button
            type="button"
            className="camera-ctrl-btn"
            onClick={toggleCameraActive}
            aria-label={isCameraActive ? 'Pause camera stream' : 'Resume camera stream'}
            title={isCameraActive ? 'Pause Camera' : 'Resume Camera'}
          >
            {isCameraActive ? <CameraOff size={18} /> : <Camera size={18} />}
            <span>{isCameraActive ? 'Pause Camera' : 'Resume'}</span>
          </button>

          <button
            type="button"
            className="camera-ctrl-btn"
            onClick={toggleFacingMode}
            disabled={!streamReady}
            aria-label="Switch between front and back camera"
            title="Switch Camera Lens"
          >
            <SwitchCamera size={18} />
            <span>Switch Lens</span>
          </button>
        </div>

        {/* Prominent Primary Capture Action */}
        <div className="camera-capture-trigger-wrap">
          <button
            type="button"
            className="camera-shutter-btn"
            onClick={handleCaptureClick}
            disabled={!streamReady || !isCameraActive}
            aria-label={`Capture still photo for ${activeStep.name}`}
            title={`Capture ${activeStep.name}`}
          >
            <div className="shutter-inner-ring" />
            <div className="shutter-core-circle" />
          </button>
          <span className="shutter-label">Capture Still</span>
        </div>

        <div className="camera-controls-right">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit3}
            onClick={onSwitchToManual}
            ariaLabel="Switch to manual measurement entry"
          >
            Manual Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
