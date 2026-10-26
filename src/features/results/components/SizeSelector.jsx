import React from 'react';
import { Info } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import SegmentedControl from '../../../shared/ui/SegmentedControl';
import { CATEGORY_NUMERIC_SIZES, GARMENT_CATEGORIES } from '../../../shared/data/resultsData';
import SizeOptionsGrid from './SizeOptionsGrid';
import SizeGuideTable from './SizeGuideTable';

const GARMENT_OPTIONS = GARMENT_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));

/**
 * Exploratory ready-to-wear size picker (letter or garment-specific numeric sizes).
 * These are reference charts only, not a fit recommendation or guarantee.
 */
export default function SizeSelector({ garmentId, onGarmentChange, selectedSize, selectedSizeType, onSizeChange, unit }) {
  const numericSizes = CATEGORY_NUMERIC_SIZES[garmentId] || [];
  const hasNumericSizes = numericSizes.length > 0;
  const numericLabel = garmentId === 'trousers' ? 'Numeric (waist)' : garmentId === 'shirt' ? 'Numeric (collar)' : 'Numeric (chest)';

  const changeFormat = (format) => {
    if (format === 'letter') onSizeChange(selectedSizeType === 'letter' ? selectedSize : 'M', 'letter');
    else onSizeChange((numericSizes[1] || numericSizes[0]).id, 'numeric');
  };

  return (
    <section className="fit-section" aria-labelledby="size-title">
      <div className="fit-section-head">
        <h2 id="size-title" className="fit-section-title">
          Size
        </h2>
        <StatusBadge variant="neutral">Exploratory guidance</StatusBadge>
      </div>
      <p className="fit-section-text">
        Pick the ready-to-wear size you’d normally buy, as a reference. Size charts vary by brand and region.
      </p>

      <div className="fit-controls">
        <SegmentedControl label="Garment" options={GARMENT_OPTIONS} value={garmentId} onChange={onGarmentChange} showLabel />
        {hasNumericSizes && (
          <SegmentedControl
            label="Size type"
            options={[
              { value: 'letter', label: 'Letter (S–3XL)' },
              { value: 'numeric', label: numericLabel },
            ]}
            value={selectedSizeType}
            onChange={changeFormat}
            showLabel
          />
        )}
      </div>

      <SizeOptionsGrid
        showNumeric={hasNumericSizes && selectedSizeType === 'numeric'}
        numericSizes={numericSizes}
        selectedSize={selectedSize}
        selectedSizeType={selectedSizeType}
        unit={unit}
        onSizeChange={onSizeChange}
      />

      <SizeGuideTable unit={unit} selectedSize={selectedSize} />

      <p className="fit-note">
        <Info size={16} aria-hidden="true" />
        <span>
          This is a size you choose, not a measured recommendation or a guaranteed fit. Tailzey garments are made from
          your own measurements.
        </span>
      </p>
    </section>
  );
}
