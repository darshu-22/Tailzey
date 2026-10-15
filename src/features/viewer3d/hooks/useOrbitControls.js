import { useCallback, useEffect, useRef, useState } from 'react';

const TAU = Math.PI * 2;
const DEFAULT_VIEW = { yaw: 0.4, pitch: 0.08, zoom: 2.8 };
const PITCH_RANGE = [-0.45, 0.75];
const ZOOM_RANGE = [1.6, 4.2];
const TURNTABLE_SPEED = 0.45; // radians per second

const clamp = (value, [min, max]) => Math.min(max, Math.max(min, value));

/** Yaw normalised to [0, 2π) — used to highlight the matching preset angle. */
export const normalizeYaw = (yaw) => ((yaw % TAU) + TAU) % TAU;

/**
 * Orbit camera state with pointer drag, wheel / keyboard zoom, preset angles and a
 * turntable mode. Attach `containerRef` to the focusable stage and spread
 * `pointerHandlers` on the canvas wrapper.
 */
export function useOrbitControls() {
  const [camera, setCamera] = useState(DEFAULT_VIEW);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const containerRef = useRef(null);
  const dragStart = useRef(null);

  const rotateBy = useCallback((dYaw, dPitch = 0) => {
    setCamera((c) => ({ ...c, yaw: c.yaw + dYaw, pitch: clamp(c.pitch + dPitch, PITCH_RANGE) }));
  }, []);
  const zoomBy = useCallback((delta) => {
    setCamera((c) => ({ ...c, zoom: clamp(c.zoom + delta, ZOOM_RANGE) }));
  }, []);
  const setAngle = useCallback((yaw, pitch = 0.06) => {
    setIsAutoRotating(false);
    setCamera((c) => ({ ...c, yaw, pitch }));
  }, []);
  const resetView = useCallback(() => {
    setIsAutoRotating(false);
    setCamera(DEFAULT_VIEW);
  }, []);

  // Turntable: advance yaw every animation frame while enabled and not dragging.
  useEffect(() => {
    if (!isAutoRotating || isDragging) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      const delta = (now - last) / 1000;
      last = now;
      setCamera((c) => ({ ...c, yaw: (c.yaw + delta * TURNTABLE_SPEED) % TAU }));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isAutoRotating, isDragging]);

  // Wheel zoom needs a non-passive listener so the page does not scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      zoomBy(e.deltaY * 0.0025);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  const pointerHandlers = {
    onPointerDown: (e) => {
      setIsDragging(true);
      setIsAutoRotating(false);
      dragStart.current = { x: e.clientX, y: e.clientY, yaw: camera.yaw, pitch: camera.pitch };
    },
    onPointerMove: (e) => {
      const start = dragStart.current;
      if (!isDragging || !start) return;
      setCamera((c) => ({
        ...c,
        yaw: start.yaw + (e.clientX - start.x) * 0.008,
        pitch: clamp(start.pitch + (e.clientY - start.y) * 0.006, PITCH_RANGE),
      }));
    },
    onPointerUp: () => setIsDragging(false),
    onPointerLeave: () => setIsDragging(false),
  };

  const KEY_ACTIONS = {
    ArrowLeft: () => rotateBy(-0.12),
    ArrowRight: () => rotateBy(0.12),
    ArrowUp: () => rotateBy(0, 0.08),
    ArrowDown: () => rotateBy(0, -0.08),
    '+': () => zoomBy(-0.25),
    '=': () => zoomBy(-0.25),
    '-': () => zoomBy(0.25),
    _: () => zoomBy(0.25),
    r: resetView,
    R: resetView,
  };

  const onKeyDown = (e) => {
    const action = KEY_ACTIONS[e.key];
    if (!action) return;
    e.preventDefault();
    if (e.key.startsWith('Arrow')) setIsAutoRotating(false);
    action();
  };

  return {
    camera,
    isDragging,
    isAutoRotating,
    toggleAutoRotate: () => setIsAutoRotating((v) => !v),
    zoomIn: () => zoomBy(-0.35),
    zoomOut: () => zoomBy(0.35),
    canZoomIn: camera.zoom > ZOOM_RANGE[0] + 0.1,
    canZoomOut: camera.zoom < ZOOM_RANGE[1] - 0.1,
    setAngle,
    resetView,
    containerRef,
    pointerHandlers,
    onKeyDown,
  };
}
