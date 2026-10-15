import { useEffect, useMemo, useRef, useState } from 'react';
import { buildMannequinMesh } from '../lib/mannequinMesh';
import { createMannequinScene, getWebGLContext, isWebGLAvailable } from '../lib/renderer';

const PREPARE_MS = 450;

/**
 * Renders the sample mannequin into a <canvas> with WebGL.
 * GPU resources are created once per mesh (garment / fit / colour) and released on
 * change or unmount; camera and display changes only re-draw.
 *
 * @param {{ garmentId, fitId, colorHex, view: { yaw, pitch, zoom, wireframe, lightingMode } }} args
 * @returns {{ canvasRef, isSupported, isPreparing, retry }}
 */
export function useWebGLMannequin({ garmentId, fitId, colorHex, view }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [isSupported, setIsSupported] = useState(isWebGLAvailable);
  const [isContextLost, setIsContextLost] = useState(false);
  const [rebuildKey, setRebuildKey] = useState(0);
  const [sizeKey, setSizeKey] = useState(0);
  const [preparedKey, setPreparedKey] = useState(null);

  const mesh = useMemo(() => buildMannequinMesh(garmentId, fitId, colorHex), [garmentId, fitId, colorHex]);
  const canRender = isSupported && !isContextLost;

  // Upload the mesh; tear it down when the mesh changes or the component unmounts.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canRender || !canvas) return undefined;
    const gl = getWebGLContext(canvas);
    if (!gl) return undefined;
    try {
      sceneRef.current = createMannequinScene(gl, mesh);
    } catch (error) {
      console.error('3D viewer: could not initialise WebGL scene', error);
      return undefined;
    }
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [mesh, canRender, rebuildKey]);

  // Draw whenever the camera, display mode, mesh or canvas size changes.
  const { yaw, pitch, zoom, wireframe, lightingMode } = view;
  useEffect(() => {
    sceneRef.current?.draw({ yaw, pitch, zoom, wireframe, lightingMode });
  }, [yaw, pitch, zoom, wireframe, lightingMode, mesh, canRender, rebuildKey, sizeKey]);

  // Redraw at the new resolution when the canvas is resized; recover from context loss.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(() => setSizeKey((k) => k + 1));
    observer.observe(canvas);
    const onLost = (e) => {
      e.preventDefault();
      setIsContextLost(true);
    };
    const onRestored = () => {
      setIsContextLost(false);
      setRebuildKey((k) => k + 1);
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    return () => {
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, []);

  // Brief "preparing" overlay whenever the garment or fit changes.
  const meshKey = `${garmentId}|${fitId}`;
  useEffect(() => {
    const timer = setTimeout(() => setPreparedKey(meshKey), PREPARE_MS);
    return () => clearTimeout(timer);
  }, [meshKey]);

  const retry = () => {
    setIsSupported(isWebGLAvailable());
    setIsContextLost(false);
    setRebuildKey((k) => k + 1);
  };

  return {
    canvasRef,
    isSupported: canRender,
    isPreparing: canRender && preparedKey !== meshKey,
    retry,
  };
}
