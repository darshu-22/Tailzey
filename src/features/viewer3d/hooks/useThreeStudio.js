import { useCallback, useEffect, useRef, useState } from 'react';
import { supportsWebGL } from '../lib/webglSupport';

/**
 * Mounts the Three.js studio into `containerRef` (Three.js is loaded on demand, so only this
 * page pays for it) and keeps it in sync with the body and garment: the fitted mannequin when
 * `mannequin` is ready (see useMannequin), otherwise the simplified figure.
 * @returns {{ status: 'loading'|'ready'|'lost'|'error'|'unsupported', setView, reset, retry }}
 */
export function useThreeStudio(containerRef, { bodyCm, spec, mannequin, autoRotate }) {
  const [supported] = useState(supportsWebGL);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const studioRef = useRef(null);

  useEffect(() => {
    if (!supported) return undefined;
    let cancelled = false;
    let studio = null;
    import('../lib/three/createStudio')
      .then(({ createStudio }) => {
        if (cancelled || !containerRef.current) return;
        studio = createStudio(containerRef.current, {
          onContextChange: (ok) => setStatus(ok ? 'ready' : 'lost'),
        });
        studioRef.current = studio;
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
      studio?.dispose();
      studioRef.current = null;
    };
  }, [supported, containerRef, attempt]);

  const { scene, looks } = mannequin;
  useEffect(() => {
    if (status !== 'ready') return;
    if (scene) studioRef.current?.setMannequin(scene, looks);
    else studioRef.current?.setFigure(bodyCm, spec);
  }, [status, bodyCm, spec, scene, looks]);

  useEffect(() => {
    if (status === 'ready') studioRef.current?.setAutoRotate(autoRotate);
  }, [status, autoRotate]);

  const setView = useCallback((name) => studioRef.current?.setView(name), []);
  const reset = useCallback(() => studioRef.current?.reset(), []);
  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return { status: supported ? status : 'unsupported', setView, reset, retry };
}
