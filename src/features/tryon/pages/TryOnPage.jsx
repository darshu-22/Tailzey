import React, { useCallback, useRef } from 'react';
import { useRouter, useToast } from '../../../app/hooks';
import StageToolbar from '../components/StageToolbar';
import TryOnPanel from '../components/TryOnPanel';
import TryOnStage from '../components/TryOnStage';
import { useTryOnCamera } from '../hooks/useTryOnCamera';
import { useTryOnLook } from '../hooks/useTryOnLook';
import { useTryOnTracker } from '../hooks/useTryOnTracker';
import { downloadSnapshot } from '../lib/snapshot';

/**
 * Live AR try-on: the front camera as a mirror with the chosen garment drawn onto the body
 * in real time. Tracking and drawing run on the device; no frame is uploaded or stored.
 */
export default function TryOnPage() {
  const { navigate } = useRouter();
  const { notify } = useToast();
  const { videoRef, ...camera } = useTryOnCamera();
  const canvasRef = useRef(null);
  const lookState = useTryOnLook();
  const tracker = useTryOnTracker({
    videoRef,
    canvasRef,
    active: camera.status === 'ready',
    look: lookState.look,
  });
  const { garment, color, fit } = lookState;

  const openStudio = useCallback(() => navigate('preview3d'), [navigate]);

  const takeSnapshot = useCallback(async () => {
    try {
      await downloadSnapshot(videoRef.current, canvasRef.current, {
        mirrored: camera.mirrored,
        fileName: `tailzey-try-on-${garment.id}-${color.id}.png`,
      });
    } catch (err) {
      notify({ title: 'Snapshot not saved', message: err.message, variant: 'error' });
    }
  }, [videoRef, camera.mirrored, garment.id, color.id, notify]);

  const apply = useCallback(() => {
    lookState.applyToDesign();
    notify({
      title: 'Design updated',
      message: `${garment.name} in ${color.name}, ${fit.name.toLowerCase()} fit. Save it from the designer to keep it.`,
      variant: 'info',
    });
  }, [lookState, garment.name, color.name, fit.name, notify]);

  return (
    <section className="page-tool tryon" aria-label="Virtual try-on">
      <div className="tryon-layout">
        <div className="tryon-stage-column">
          <TryOnStage videoRef={videoRef} canvasRef={canvasRef} camera={camera} tracker={tracker} onOpenStudio={openStudio} />
          <StageToolbar
            camera={camera}
            trimToBody={lookState.trimToBody}
            onTrimChange={lookState.setTrimToBody}
            onSnapshot={takeSnapshot}
            snapshotReady={camera.status === 'ready'}
          />
        </div>
        <TryOnPanel lookState={lookState} onApply={apply} onOpenStudio={openStudio} />
      </div>
    </section>
  );
}
