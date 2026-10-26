import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentVisible } from './useDocumentVisible';

const VIDEO_CONSTRAINTS = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } };

const isSupported = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && window.isSecureContext;

const STARTING = { status: 'starting', error: null };

const stopTracks = (stream) => stream?.getTracks().forEach((track) => track.stop());

export const UNSUPPORTED_CAMERA = {
  type: 'unsupported',
  title: 'Live camera isn’t available here',
  message: 'This browser can’t open the camera (it needs a modern browser on a secure https page).',
};

function describeError(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
    case 'SecurityError':
      return {
        type: 'denied',
        title: 'Camera access is blocked',
        message:
          'Allow the camera for this site, then choose Try again. In most browsers: select the camera or lock icon in the address bar and set Camera to Allow. On iPhone: Settings › Safari › Camera › Allow.',
      };
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return { type: 'notfound', title: 'No camera found', message: 'Connect a camera, then choose Try again.' };
    case 'NotReadableError':
    case 'TrackStartError':
      return {
        type: 'busy',
        title: 'The camera is in use',
        message: 'Another app or tab is using the camera. Close it, then choose Try again.',
      };
    default:
      return { type: 'generic', title: 'The camera didn’t start', message: 'Something went wrong opening the camera. Try again.' };
  }
}

/**
 * Owns the try-on camera stream. Tracks are stopped when the camera is switched off, the
 * tab is hidden, the lens changes or the page unmounts — the camera never stays on unseen.
 * @returns {{ videoRef, status: 'off'|'paused'|'starting'|'ready'|'error', error, facingMode,
 *   mirrored, canSwitch, enabled, setEnabled, switchLens, retry }}
 */
export function useTryOnCamera() {
  const videoRef = useRef(null);
  const visible = useDocumentVisible();
  const [enabled, setEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [attempt, setAttempt] = useState(0);
  const [canSwitch, setCanSwitch] = useState(false);
  const [outcome, setOutcome] = useState(STARTING);
  const supported = isSupported();
  const active = supported && enabled && visible;

  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    let stream = null;
    const video = videoRef.current;

    navigator.mediaDevices
      .getUserMedia({ video: { ...VIDEO_CONSTRAINTS, facingMode: { ideal: facingMode } }, audio: false })
      .then(async (s) => {
        if (cancelled) return stopTracks(s);
        stream = s;
        if (video) {
          video.srcObject = s;
          await video.play().catch(() => {});
        }
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        if (cancelled) return undefined;
        setCanSwitch(devices.filter((d) => d.kind === 'videoinput').length > 1);
        setOutcome({ status: 'ready', error: null });
        return undefined;
      })
      .catch((err) => {
        if (!cancelled) setOutcome({ status: 'error', error: describeError(err) });
      });

    return () => {
      cancelled = true;
      stopTracks(stream);
      if (video) video.srcObject = null;
      setOutcome(STARTING); // the next stream reports its own outcome
    };
  }, [active, facingMode, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const switchLens = useCallback(() => setFacingMode((m) => (m === 'user' ? 'environment' : 'user')), []);

  let status;
  let error = null;
  if (!supported) {
    status = 'error';
    error = UNSUPPORTED_CAMERA;
  } else if (!enabled) {
    status = 'off';
  } else if (!visible) {
    status = 'paused';
  } else {
    ({ status, error } = outcome);
  }

  return {
    videoRef,
    status,
    error,
    facingMode,
    mirrored: facingMode === 'user',
    canSwitch,
    enabled,
    setEnabled,
    switchLens,
    retry,
  };
}
