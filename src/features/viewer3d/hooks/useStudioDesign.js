import { useCallback, useMemo } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { defaultCustomOptions, garmentSpec } from '../lib/garmentSpec';

/**
 * The workspace design as the 3D studio sees it, plus quick edits written straight back
 * to the workspace. A garment switch resets custom options exactly like the designer does.
 */
export function useStudioDesign() {
  const { design, updateDesign } = useWorkspace();
  const spec = useMemo(() => garmentSpec(design), [design]);

  const selectGarment = useCallback(
    (garmentId) => {
      if (garmentId === design.garmentId) return;
      updateDesign({ garmentId, customOptions: defaultCustomOptions(garmentId) });
    },
    [design.garmentId, updateDesign]
  );
  const setColor = useCallback((colorId) => updateDesign({ colorId }), [updateDesign]);
  const setFit = useCallback((fitId) => updateDesign({ fitId }), [updateDesign]);

  return { design, spec, selectGarment, setColor, setFit };
}
