import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../../core/api/ApiError';

const PAGE_SIZE = 20;

/**
 * Loads the first page of a saved-record collection (designs or measurement profiles)
 * from `service.list`. In-flight requests are aborted on unmount / reload.
 *
 * Returns { items, total, status: 'loading'|'ready'|'error', error, retry, refresh }.
 * `retry` shows the loading state again; `refresh` reloads quietly in the background.
 */
export function useSavedRecords(service) {
  const [state, setState] = useState({ status: 'loading', items: [], total: 0, error: '' });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    service
      .list({ limit: PAGE_SIZE, offset: 0 }, { signal: controller.signal })
      .then(({ data, meta }) => {
        setState({ status: 'ready', items: data, total: meta?.total ?? data.length, error: '' });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({ ...prev, status: 'error', error: getErrorMessage(err) }));
      });
    return () => controller.abort();
  }, [service, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading', error: '' }));
    setVersion((v) => v + 1);
  }, []);

  return { ...state, retry, refresh };
}
