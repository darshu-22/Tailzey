import { useCallback, useMemo } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { getGarmentById } from '../../../shared/data/designerData';
import { defaultCustomOptions, garmentDefaults, resolveCustomOptions } from '../../../shared/garments/options';

/**
 * Read/write access to the workspace design (the single source of truth).
 * Changing garment resets custom options to that garment's defaults (shared/garments/options),
 * exactly as the 3D studio and try-on do, so saved designs stay valid.
 */
export function useDesignEditor() {
  const { design, updateDesign } = useWorkspace();

  const garment = getGarmentById(design.garmentId);
  const options = useMemo(
    () => resolveCustomOptions(design.garmentId, design.customOptions),
    [design.garmentId, design.customOptions]
  );

  const selectGarment = useCallback(
    (garmentId) => {
      if (garmentId === design.garmentId) return;
      updateDesign({ garmentId, customOptions: defaultCustomOptions(garmentId) });
    },
    [design.garmentId, updateDesign]
  );

  const setOption = useCallback(
    (key, value) => updateDesign({ customOptions: { ...options, [key]: value } }),
    [options, updateDesign]
  );

  const resetToDefaults = useCallback(
    () => updateDesign(garmentDefaults(design.garmentId)),
    [design.garmentId, updateDesign]
  );

  return {
    design,
    garment,
    options,
    selectGarment,
    setOption,
    resetToDefaults,
    setName: (name) => updateDesign({ name }),
    setColor: (colorId) => updateDesign({ colorId }),
    setStyle: (styleId) => updateDesign({ styleId }),
    setFit: (fitId) => updateDesign({ fitId }),
  };
}
