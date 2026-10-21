import { useSyncExternalStore } from 'react';

const subscribe = (onChange) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};
const getSnapshot = () => document.visibilityState !== 'hidden';
const getServerSnapshot = () => true;

/** True while the tab is visible; the camera and tracking pause while it is hidden. */
export function useDocumentVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
