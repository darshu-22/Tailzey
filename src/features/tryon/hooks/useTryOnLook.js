import { useCallback, useMemo, useState } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { getColorById, getFitById, getGarmentById } from '../../../shared/data/designerData';
import { defaultCustomOptions, garmentSpec } from '../lib/garmentSpec';

const fromDesign = (design) => ({
  garmentId: design.garmentId,
  colorId: design.colorId,
  fitId: design.fitId,
  customOptions: { ...design.customOptions },
});

const sameOptions = (a, b) => JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});

/**
 * What the try-on is showing. It starts from the workspace design but is a separate preview
 * selection: browsing here never changes the design until the user chooses "Apply".
 */
export function useTryOnLook() {
  const { design, updateDesign } = useWorkspace();
  const [selection, setSelection] = useState(() => fromDesign(design));
  const [trimToBody, setTrimToBody] = useState(true);

  const garment = getGarmentById(selection.garmentId);
  const color = getColorById(selection.colorId);
  const fit = getFitById(selection.fitId);

  const look = useMemo(
    () => ({ spec: garmentSpec(garment.id, selection.customOptions, fit.id), color, trimToBody }),
    [garment.id, selection.customOptions, fit.id, color, trimToBody]
  );

  const chooseGarment = useCallback(
    (garmentId) =>
      setSelection((s) => {
        if (s.garmentId === garmentId) return s;
        // Switching garment resets its options — or restores the design's own, for its garment.
        const customOptions =
          garmentId === design.garmentId ? { ...design.customOptions } : defaultCustomOptions(garmentId);
        return { ...s, garmentId, customOptions };
      }),
    [design.garmentId, design.customOptions]
  );
  const chooseColor = useCallback((colorId) => setSelection((s) => ({ ...s, colorId })), []);
  const chooseFit = useCallback((fitId) => setSelection((s) => ({ ...s, fitId })), []);
  const loadFromDesign = useCallback(() => setSelection(fromDesign(design)), [design]);
  const applyToDesign = useCallback(() => {
    const customOptions =
      selection.garmentId === design.garmentId ? selection.customOptions : defaultCustomOptions(selection.garmentId);
    updateDesign({ ...selection, customOptions });
  }, [selection, design.garmentId, updateDesign]);

  const matchesDesign =
    selection.garmentId === design.garmentId &&
    selection.colorId === design.colorId &&
    selection.fitId === design.fitId &&
    sameOptions(selection.customOptions, design.customOptions);

  return {
    garment,
    color,
    fit,
    look,
    trimToBody,
    setTrimToBody,
    matchesDesign,
    designSummary: `${getGarmentById(design.garmentId).name} · ${getColorById(design.colorId).name} · ${getFitById(design.fitId).name}`,
    chooseGarment,
    chooseColor,
    chooseFit,
    loadFromDesign,
    applyToDesign,
  };
}
