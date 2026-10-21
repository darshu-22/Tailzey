import React from 'react';
import SegmentedControl from '../../../shared/ui/SegmentedControl';

const PRESETS = [0, 1, 2];

/**
 * Optional ease (+0 / +1 / +2 in the current unit) for one measurement. The body
 * measurement itself never changes; ease is stored separately. After a unit change a
 * converted ease (e.g. +0.4 in) is shown as its own option.
 */
export default function AdjustmentControl({ field, adjustment = 0, unit, onAdjustmentChange }) {
  const amounts = PRESETS.includes(adjustment) ? PRESETS : [...PRESETS, adjustment];
  const options = amounts.map((amount) => ({ value: amount, label: amount === 0 ? 'None' : `+${amount}` }));

  return (
    <SegmentedControl
      label={`Ease in ${unit} for ${field.label}`}
      options={options}
      value={adjustment}
      onChange={(amount) => onAdjustmentChange(field.id, amount)}
      className="metric-ease"
    />
  );
}
