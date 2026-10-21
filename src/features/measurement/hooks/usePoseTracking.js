import { useEffect, useRef, useState } from 'react';
import { loadPoseDetector } from '../../../shared/vision/poseDetector';
import { POSE_HINTS, assessPose, poseMotion } from '../lib/poseReadiness';

const DETECT_EVERY_MS = 100; // ~10 checks per second is plenty for posture
const STILL_MOTION = 0.006; // mean landmark movement per check (normalised units)
const STILL_FOR_MS = 700;

const INITIAL = { status: 'loading', code: 'no_person', hint: POSE_HINTS.no_person, ready: false };
const UNAVAILABLE = {
  status: 'unavailable',
  code: 'unavailable',
  hint: 'Hands-free capture is not available on this device. Use the shutter button instead.',
  ready: false,
};

/**
 * Watches the live video locally (nothing is uploaded) and reports whether the user is in
 * the right pose for this view and holding still.
 * @returns {{ status: 'loading'|'tracking'|'unavailable', code: string, hint: string, ready: boolean }}
 */
export function usePoseTracking({ videoRef, enabled, kind }) {
  const [state, setState] = useState(INITIAL);
  const kindRef = useRef(kind);

  useEffect(() => {
    kindRef.current = kind;
  }, [kind]);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    let frame = 0;
    let lastRun = 0;
    let previous = null;
    let stillSince = 0;
    const publish = (next) =>
      setState((s) => (s.status === next.status && s.code === next.code && s.ready === next.ready ? s : next));

    loadPoseDetector()
      .then((detector) => {
        const loop = (now) => {
          if (cancelled) return;
          frame = requestAnimationFrame(loop);
          const video = videoRef.current;
          if (!video || video.readyState < 2 || now - lastRun < DETECT_EVERY_MS) return;
          lastRun = now;
          const poses = detector.detectForVideo(video, now).landmarks;
          const aspect = video.videoWidth / video.videoHeight || 16 / 9;
          const assessment = assessPose(poses, kindRef.current, aspect);

          stillSince = poseMotion(previous, poses[0]) < STILL_MOTION ? stillSince || now : 0;
          previous = poses[0] ?? null;
          const still = stillSince > 0 && now - stillSince >= STILL_FOR_MS;
          publish(
            assessment.ready && !still
              ? { status: 'tracking', code: 'hold', hint: 'Hold still.', ready: false }
              : { status: 'tracking', code: assessment.code, hint: assessment.hint, ready: assessment.ready }
          );
        };
        if (!cancelled) frame = requestAnimationFrame(loop);
      })
      .catch(() => !cancelled && publish(UNAVAILABLE));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [enabled, videoRef]);

  return state;
}
