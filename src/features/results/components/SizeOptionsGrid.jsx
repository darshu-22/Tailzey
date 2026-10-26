import React from 'react';
import { STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';

function SizeChoice({ name, label, checked, onSelect, children }) {
  return (
    <label className="choice-card size-choice">
      <input type="radio" className="choice-input" name={name} checked={checked} onChange={onSelect} />
      <span className="choice-body">
        <span className="size-choice-label">{label}</span>
        {children}
      </span>
    </label>
  );
}

/** Letter sizes (with chest/waist ranges) or the garment's numeric sizes, as radio cards. */
export default function SizeOptionsGrid({ showNumeric, numericSizes, selectedSize, selectedSizeType, unit, onSizeChange }) {
  const name = showNumeric ? 'size-numeric' : 'size-letter';

  return (
    <fieldset className="choice-fieldset">
      <legend className="sr-only">{showNumeric ? 'Numeric size' : 'Letter size'}</legend>
      <div className="choice-grid size-grid">
        {showNumeric
          ? numericSizes.map((size) => (
              <SizeChoice
                key={size.id}
                name={name}
                label={size.label}
                checked={selectedSize === size.id && selectedSizeType === 'numeric'}
                onSelect={() => onSizeChange(size.id, 'numeric')}
              >
                <span className="choice-meta">{size.subtext}</span>
              </SizeChoice>
            ))
          : STANDARD_LETTER_SIZES.map((size) => (
              <SizeChoice
                key={size.id}
                name={name}
                label={size.label}
                checked={selectedSize === size.id && selectedSizeType === 'letter'}
                onSelect={() => onSizeChange(size.id, 'letter')}
              >
                <span className="choice-meta">
                  Chest {unit === 'cm' ? size.chestCm : size.chestIn} {unit}
                </span>
                <span className="choice-meta">
                  Waist {unit === 'cm' ? size.waistCm : size.waistIn} {unit}
                </span>
              </SizeChoice>
            ))}
      </div>
    </fieldset>
  );
}
