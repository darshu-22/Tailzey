import React, { useRef, useState } from 'react';
import { useThreeStudio } from '../hooks/useThreeStudio';
import StageStatus from './StageStatus';
import ViewControls from './ViewControls';

/** The 3D canvas area: Three.js scene, view controls and loading / failure states. */
export default function StudioStage({ bodyCm, spec, mannequin }) {
  const containerRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const { status, setView, reset, retry } = useThreeStudio(containerRef, { bodyCm, spec, mannequin, autoRotate });

  const pickView = (name) => {
    setAutoRotate(false);
    setView(name);
  };
  const resetView = () => {
    setAutoRotate(false);
    reset();
  };

  const description = `Approximate mannequin built from your measurements, wearing a ${spec.colorName.toLowerCase()} ${spec.garmentName.toLowerCase()} in a ${spec.fitName.toLowerCase()} fit.`;

  return (
    <section className="studio-stage" aria-label="3D preview">
      <div ref={containerRef} className="studio-canvas-host" role="img" aria-label={description} />
      <StageStatus status={status} onRetry={retry} />
      {status === 'ready' && (
        <>
          <p className="studio-stage-label">Approximate shape · not a body scan</p>
          <ViewControls
            autoRotate={autoRotate}
            onToggleRotate={() => setAutoRotate((on) => !on)}
            onView={pickView}
            onReset={resetView}
          />
        </>
      )}
    </section>
  );
}
