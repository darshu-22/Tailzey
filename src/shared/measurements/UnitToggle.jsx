import React from 'react';
import SegmentedControl from '../ui/SegmentedControl';

const UNIT_OPTIONS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
];

/** Centimetres / inches switch. Converting values is the caller's job (see shared/utils/units.js). */
export default function UnitToggle({ unit, onChange, label = 'Measurement unit', showLabel = false }) {
  return (
    <SegmentedControl
      label={label}
      options={UNIT_OPTIONS}
      value={unit}
      onChange={onChange}
      showLabel={showLabel}
      className="unit-toggle"
    />
  );
}
