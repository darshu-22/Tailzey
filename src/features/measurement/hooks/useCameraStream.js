import { useCallback, useEffect, useRef, useState } from 'react';

const VIDEO_CONSTRAINTS = { width: { ideal: 1280 }, height: { ideal: 720 } };

const UNSUPPORTED = {
  type: 'unsupported',
  title: 'Camera Unavailable',
  message: 'This browser does not support camera capture. Please use manual measurement entry.',
};

const isSupported = () => typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

function stopTracks(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

function describeCameraError(err) {
  if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
    return {
      type: 'denied',
      title: 'Camera Permission Denied',
      message: 'Camera permission was denied. Allow camera access in your browser site settings, or enter measurements manually.',
    };
  }
  if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
    return {
      type: 'notfound',
      title: 'Camera Not Detected',
      message: 'No camera was found on this device. Please use manual measurement entry.',
    };
  }
  return {
    type: 'generic',
    title: 'Camera Unavailable',
    message: `The camera could not be started (${err?.message || 'unknown error'}). Try again or switch to manual entry.`,
  };
}

/**
 * Owns a getUserMedia stream bound to `videoRef`. Every track is stopped when the
 * stream is paused, the facing mode changes, or the component unmounts (including
 * route changes), so the camera never stays on behind the user's back.
 * @returns {{ videoRef, status: 'idle'|'starting'|'ready'|'error', error, paused, pause, resume, retry }}
 */
export function useCameraStream({ facingMode }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Outcome of the most recent request, tagged with the request it belongs to.
  const [outcome, setOutcome] = useState({ key: null, status: 'starting', error: null });
  const supported = isSupported();
  const requestKey = `${facingMode}:${attempt}`;

  useEffect(() => {
    if (paused || !supported) return undefined;
    let cancelled = false;
    let stream = null;
    const video = videoRef.current;

    navigator.mediaDevices
      .getUserMedia({ video: { ...VIDEO_CONSTRAINTS, facingMode }, audio: false })
      .then(async (s) => {
        if (cancelled) {
          stopTracks(s);
          return;
        }
        stream = s;
        if (video) {
          video.srcObject = s;
          await video.play().catch(() => {});
        }
        if (!cancelled) setOutcome({ key: requestKey, status: 'ready', error: null });
      })
      .catch((err) => {
        if (!cancelled) setOutcome({ key: requestKey, status: 'error', error: describeCameraError(err) });
      });

    return () => {
      cancelled = true;
      stopTracks(stream);
      if (video) video.srcObject = null;
    };
  }, [paused, supported, facingMode, requestKey]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => {
    setPaused(false);
    setAttempt((n) => n + 1);
  }, []);

  let status = 'starting';
  let error = null;
  if (!supported) {
    status = 'error';
    error = UNSUPPORTED;
  } else if (paused) {
    status = 'idle';
  } else if (outcome.key === requestKey) {
    ({ status, error } = outcome);
  }

  return { videoRef, status, error, paused, pause, resume, retry };
}
