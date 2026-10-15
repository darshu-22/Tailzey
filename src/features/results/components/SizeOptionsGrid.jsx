import React from 'react';
import { Check } from 'lucide-react';
import { STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';

function SizeCard({ label, selected, onSelect, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`size-card-btn ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
    >
      <div className="size-card-top">
        <span className="size-letter-badge">{label}</span>
        {selected && <Check size={14} className="size-check-icon" />}
      </div>
      {children}
    </button>
  );
}

/** Letter-size cards (with chest/waist benchmarks) or the category's numeric sizes. */
export default function SizeOptionsGrid({ showNumeric, numericSizes, selectedSize, selectedSizeType, unit, onSizeChange }) {
  return (
    <div className="size-cards-grid" role="radiogroup" aria-label="Available Exploratory Sizes">
      {showNumeric
        ? numericSizes.map((size) => (
            <SizeCard
              key={size.id}
              label={size.label}
              selected={selectedSize === size.id && selectedSizeType === 'numeric'}
              onSelect={() => onSizeChange(size.id, 'numeric')}
            >
              <span className="size-name-label">{size.subtext}</span>
            </SizeCard>
          ))
        : STANDARD_LETTER_SIZES.map((size) => (
            <SizeCard
              key={size.id}
              label={size.label}
              selected={selectedSize === size.id && selectedSizeType === 'letter'}
              onSelect={() => onSizeChange(size.id, 'letter')}
            >
              <span className="size-name-label">{size.name}</span>
              <span className="size-bench-sub">
                Chest: {unit === 'cm' ? size.chestCm : size.chestIn} {unit}
              </span>
              <span className="size-bench-sub">
                Waist: {unit === 'cm' ? size.waistCm : size.waistIn} {unit}
              </span>
            </SizeCard>
          ))}
    </div>
  );
}
