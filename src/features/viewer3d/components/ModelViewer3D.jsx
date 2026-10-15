import React, { useState } from 'react';
import { Move } from 'lucide-react';
import { getColorById, getGarmentById } from '../../../shared/data/designerData';
import { useOrbitControls } from '../hooks/useOrbitControls';
import { useWebGLMannequin } from '../hooks/useWebGLMannequin';
import ViewerToolbar from './ViewerToolbar';
import ViewerAngleControls from './ViewerAngleControls';
import { ViewerFallback, ViewerPreparingOverlay } from './ViewerStatusOverlay';

/**
 * Interactive WebGL stage showing the design on a standard sample mannequin.
 * Orbit with drag / arrow keys, zoom with wheel / +/-, R resets the view.
 */
export default function ModelViewer3D({ garmentId, colorId, fitId, className = '' }) {
  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState('atelier');
  const { containerRef, pointerHandlers, onKeyDown, camera, isDragging, isAutoRotating, toggleAutoRotate, ...controls } =
    useOrbitControls();

  const { canvasRef, isSupported, isPreparing, retry } = useWebGLMannequin({
    garmentId,
    fitId,
    colorHex: color.hex,
    view: { ...camera, wireframe: isWireframe, lightingMode },
  });

  return (
    <div
      ref={containerRef}
      className={`viewer3d-stage-card ${className}`.trim()}
      role="region"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="3D sample mannequin. Use arrow keys to rotate, plus or minus to zoom, and R to reset the view."
    >
      <ViewerToolbar
        caption={`${garment.name} • ${color.name}`}
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe((v) => !v)}
        isAutoRotating={isAutoRotating}
        onToggleAutoRotate={toggleAutoRotate}
        lightingMode={lightingMode}
        onToggleLighting={() => setLightingMode((m) => (m === 'atelier' ? 'dramatic' : 'atelier'))}
      />

      {!isDragging && (
        <div className="viewer-drag-hint">
          <Move size={12} className="viewer-drag-hint-icon" aria-hidden="true" />
          <span>Click & drag or swipe to rotate 360° • Scroll to zoom</span>
        </div>
      )}

      <div className={`viewer3d-canvas-wrap ${isDragging ? 'is-dragging' : ''}`} {...pointerHandlers}>
        <canvas ref={canvasRef} className="viewer3d-canvas" />
      </div>

      <ViewerAngleControls yaw={camera.yaw} {...controls} />

      {isPreparing && <ViewerPreparingOverlay garmentName={garment.name} colorName={color.name} />}
      {!isSupported && <ViewerFallback onRetry={retry} />}
    </div>
  );
}
