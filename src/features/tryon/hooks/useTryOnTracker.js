import { useEffect, useRef, useState } from 'react';
import { loadSegmentingPoseDetector } from '../../../shared/vision/poseDetector';
import { assessBody, buildBody } from '../lib/bodyFrame';
import { createFpsMeter } from '../lib/fpsMeter';
import { createPoseSmoother } from '../lib/poseSmoother';
import { DEFAULT_RENDERER } from '../lib/renderers';
import { createSilhouetteMask } from '../lib/silhouetteMask';

const MIN_FRAME_MS = 1000 / 30 - 4; // ~30 fps cap (slack for rAF jitter); slower devices just run slower
const HOLD_MS = 250; // keep the last body briefly when a single frame misses the person
const PUBLISH_MS = 400; // React state updates (hint, fps) at a calm rate, not every frame

const IDLE = { status: 'idle', code: 'loading', fps: 0 };
const LOADING = { status: 'loading', code: 'loading', fps: 0 };
const UNAVAILABLE = { status: 'unavailable', code: 'unavailable', fps: 0 };

/**
 * Runs pose tracking on the live video and paints the garment onto `canvasRef` every
 * frame. Everything happens on the device; frames are never stored or sent anywhere.
 * `look` ({ spec, color, trimToBody }) may change at any time without restarting tracking.
 * @returns {{ status: 'idle'|'loading'|'tracking'|'unavailable', code: string, fps: number }}
 */
export function useTryOnTracker({ videoRef, canvasRef, active, look }) {
  const [state, setState] = useState(LOADING);
  const lookRef = useRef(look);

  useEffect(() => {
    lookRef.current = look;
  }, [look]);

  useEffect(() => {
    if (!active) return undefined;
    const canvasEl = canvasRef.current;
    let cancelled = false;
    let frame = 0;
    const smoother = createPoseSmoother();
    const silhouette = createSilhouetteMask();
    const meter = createFpsMeter();
    let lastRun = 0;
    let lastTs = 0;
    let lastVideoTime = -1;
    let lastBody = null;
    let lastSeenAt = 0;
    let lastPublish = 0;
    const publish = (next) =>
      setState((s) => (s.status === next.status && s.code === next.code && s.fps === next.fps ? s : next));

    const track = (detector, video, now) => {
      const current = lookRef.current;
      let landmarks = null;
      lastTs = Math.max(Math.round(now), lastTs + 1); // VIDEO mode needs increasing timestamps
      detector.detectForVideo(video, lastTs, (result) => {
        landmarks = result.landmarks?.[0] ?? null;
        const mask = result.segmentationMasks?.[0];
        // Masks are only valid inside this callback, so copy now (or drop).
        if (landmarks && mask && current.trimToBody) silhouette.update(mask);
        else silhouette.invalidate();
      });
      if (landmarks) {
        lastBody = buildBody(smoother.smooth(landmarks, video.videoWidth, video.videoHeight, now / 1000));
        lastSeenAt = now;
      } else if (now - lastSeenAt > HOLD_MS) {
        lastBody = null;
        smoother.reset();
      }
      return { body: lastBody, current };
    };

    loadSegmentingPoseDetector()
      .then((detector) => {
        const step = (now) => {
          if (cancelled) return;
          frame = requestAnimationFrame(step);
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas || video.readyState < 2 || !video.videoWidth) return;
          if (now - lastRun < MIN_FRAME_MS || video.currentTime === lastVideoTime) return;
          lastRun = now;
          lastVideoTime = video.currentTime;
          const width = video.videoWidth;
          const height = video.videoHeight;
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          try {
            const { body, current } = track(detector, video, now);
            const assessment = assessBody(body, current.spec.kind);
            DEFAULT_RENDERER.render(
              canvas.getContext('2d'),
              { body: assessment.drawable ? body : null, silhouette: current.trimToBody ? silhouette : null, width, height },
              current
            );
            meter.tick(now);
            if (now - lastPublish >= PUBLISH_MS) {
              lastPublish = now;
              publish({ status: 'tracking', code: assessment.code, fps: meter.fps() });
            }
          } catch {
            cancelled = true; // e.g. the GPU context was lost — stop rather than spin
            cancelAnimationFrame(frame);
            publish(UNAVAILABLE);
          }
        };
        if (!cancelled) frame = requestAnimationFrame(step);
      })
      .catch(() => !cancelled && publish(UNAVAILABLE));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      canvasEl?.getContext('2d')?.clearRect(0, 0, canvasEl.width, canvasEl.height);
      setState((s) => (s.status === 'unavailable' ? s : LOADING));
    };
  }, [active, videoRef, canvasRef]);

  return active ? state : { ...IDLE, status: state.status === 'unavailable' ? 'unavailable' : 'idle' };
}
