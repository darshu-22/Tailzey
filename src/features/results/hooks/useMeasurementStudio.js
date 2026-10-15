import { useCallback, useMemo, useState } from 'react';
import { useToast, useWorkspace } from '../../../app/hooks';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { FIELDS_BY_ID } from '../../../shared/measurements/measurementFields';
import { categoryForGarment, countSources } from '../lib/studioMath';

/**
 * Measurement studio state. The workspace measurement is the single source of truth:
 * values, unit, adjustments, size and fit are read from it and written through its
 * actions. Only the size-chart category being browsed is local.
 */
export function useMeasurementStudio() {
  const { measurement, design, setValue, setUnit, updateMeasurement } = useWorkspace();
  const { notify } = useToast();
  const [garmentId, setGarmentId] = useState(() => categoryForGarment(design.garmentId));

  const counts = useMemo(
    () => countSources(MANUAL_MEASUREMENT_FIELDS, measurement.values, measurement.fieldStatus),
    [measurement.values, measurement.fieldStatus]
  );

  const changeUnit = useCallback(
    (unit) => {
      if (unit === measurement.unit) return;
      setUnit(unit);
      notify({ title: 'Unit changed', message: `Showing measurements in ${unit === 'cm' ? 'centimetres' : 'inches'}.` });
    },
    [measurement.unit, setUnit, notify]
  );

  const saveValue = useCallback(
    (key, value) => {
      setValue(key, value);
      notify({ variant: 'success', title: 'Measurement updated', message: `${FIELDS_BY_ID[key]?.label} set to ${value} ${measurement.unit}.` });
    },
    [setValue, notify, measurement.unit]
  );

  const setAdjustment = useCallback(
    (key, amount) => {
      const { [key]: _previous, ...rest } = measurement.adjustments;
      updateMeasurement({ adjustments: amount ? { ...rest, [key]: amount } : rest });
    },
    [measurement.adjustments, updateMeasurement]
  );

  const resetAdjustments = useCallback(() => {
    updateMeasurement({ adjustments: {} });
    notify({ title: 'Adjustments reset', message: 'All tailoring ease adjustments are back to +0.' });
  }, [updateMeasurement, notify]);

  const selectSize = useCallback(
    (selectedSize, selectedSizeType) => updateMeasurement({ selectedSize, selectedSizeType }),
    [updateMeasurement]
  );

  const selectFit = useCallback((fitPreference) => updateMeasurement({ fitPreference }), [updateMeasurement]);

  return {
    measurement,
    counts,
    garmentId,
    setGarmentId,
    changeUnit,
    saveValue,
    setAdjustment,
    resetAdjustments,
    selectSize,
    selectFit,
  };
}
