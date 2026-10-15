import { useCallback, useEffect, useRef, useState } from 'react';
import { analyzeMeasurements } from '../../../services/measurementService';

/**
 * Runs `analyzeMeasurements` under an AbortController. Starting a new run,
 * cancel() or unmounting aborts the request in flight. run() resolves to the
 * analysis, or to null when it failed (see `error`) or was cancelled.
 * @returns {{ status: 'idle'|'running'|'success'|'error', error, run, cancel }}
 */
export function useMeasurementAnalysis() {
  const [state, setState] = useState({ status: 'idle', error: null });
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: 'idle', error: null });
  }, []);

  const run = useCallback(async ({ heightCm, images }) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: 'running', error: null });
    try {
      const result = await analyzeMeasurements({ heightCm, images, signal: controller.signal });
      if (controller.signal.aborted) return null;
      setState({ status: 'success', error: null });
      return result;
    } catch (error) {
      if (controller.signal.aborted) return null;
      setState({ status: 'error', error });
      return null;
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  return { ...state, run, cancel };
}
