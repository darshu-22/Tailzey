import React from 'react';
import StageOverlay from './StageOverlay';

/**
 * Live camera view with the garment canvas laid exactly over it. Both layers share the
 * frame's pixel size and object-fit, and are mirrored together for the front camera.
 */
export default function TryOnStage({ videoRef, canvasRef, camera, tracker, onOpenStudio }) {
  const live = camera.status === 'ready' || camera.status === 'starting';
  return (
    <div className="tryon-stage">
      <div className={`tryon-media ${camera.mirrored ? 'is-mirrored' : ''} ${live ? '' : 'is-hidden'}`.trim()}>
        <video
          ref={videoRef}
          className="tryon-video"
          playsInline
          muted
          autoPlay
          aria-label="Live camera view with the garment drawn on you"
        />
        <canvas ref={canvasRef} className="tryon-canvas" aria-hidden="true" />
      </div>
      <StageOverlay camera={camera} tracker={tracker} onOpenStudio={onOpenStudio} />
    </div>
  );
}
