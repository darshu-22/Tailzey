import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import { CATEGORY_NUMERIC_SIZES, GARMENT_CATEGORIES } from '../../../shared/data/resultsData';
import SizeOptionsGrid from './SizeOptionsGrid';
import SizeGuideTable from './SizeGuideTable';

/**
 * Exploratory ready-to-wear size picker (letter or category-specific numeric sizes).
 * These are reference benchmarks only — not a fit recommendation or guarantee.
 */
export default function SizeSelector({ garmentId, onGarmentChange, selectedSize, selectedSizeType, onSizeChange, unit }) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const numericSizes = CATEGORY_NUMERIC_SIZES[garmentId] || [];
  const hasNumericSizes = numericSizes.length > 0;

  return (
    <div className="size-selector-section" role="region" aria-label="Standard & Numeric Size Selector">
      <div className="size-selector-header">
        <div>
          <span className="size-selector-eyebrow">Ready-to-Wear Comparison</span>
          <h3 className="size-selector-title">Exploratory Size Selection</h3>
        </div>
        <button
          type="button"
          className="size-guide-toggle-btn"
          onClick={() => setShowSizeGuide((v) => !v)}
          aria-expanded={showSizeGuide}
        >
          <Ruler size={14} />
          <span>{showSizeGuide ? 'Hide Size Guide' : 'View Size Guide'}</span>
          {showSizeGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <p className="size-selector-subtext">
        Explore ready-to-wear sizing benchmarks for your chosen garment silhouette. Sizing charts vary between
        tailoring houses and styles.
      </p>

      <div className="garment-category-tabs-wrap">
        <span className="category-tabs-label">Garment Category:</span>
        <div className="garment-category-tabs" role="radiogroup" aria-label="Garment Silhouette Category">
          {GARMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={garmentId === cat.id}
              className={`garment-tab-btn ${garmentId === cat.id ? 'is-active' : ''}`}
              onClick={() => onGarmentChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {hasNumericSizes && (
        <>
          <div className="size-format-selector" role="radiogroup" aria-label="Size Format">
            <button
              type="button"
              role="radio"
              aria-checked={selectedSizeType === 'letter'}
              className={`size-format-btn ${selectedSizeType === 'letter' ? 'is-active' : ''}`}
              onClick={() => onSizeChange(selectedSizeType === 'letter' ? selectedSize : 'M', 'letter')}
            >
              Letter Sizing (S – 3XL)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedSizeType === 'numeric'}
              className={`size-format-btn ${selectedSizeType === 'numeric' ? 'is-active' : ''}`}
              onClick={() => onSizeChange((numericSizes[1] || numericSizes[0]).id, 'numeric')}
            >
              Tailored Numeric Sizing ({garmentId === 'trousers' ? 'Waist' : 'Collar / Chest'})
            </button>
          </div>
          <div className="numeric-distinction-note">
            <Info size={13} className="numeric-distinction-icon" />
            <span>
              Numeric {garmentId} sizing represents specific garment dimensions and is not universally
              equivalent to standard letter sizes.
            </span>
          </div>
        </>
      )}

      <SizeOptionsGrid
        showNumeric={hasNumericSizes && selectedSizeType === 'numeric'}
        numericSizes={numericSizes}
        selectedSize={selectedSize}
        selectedSizeType={selectedSizeType}
        unit={unit}
        onSizeChange={onSizeChange}
      />

      {showSizeGuide && <SizeGuideTable unit={unit} selectedSize={selectedSize} />}

      <div className="size-honesty-banner" role="note">
        <Info size={15} className="size-honesty-icon" aria-hidden="true" />
        <p className="size-honesty-text">
          <strong>Exploratory Selection Notice:</strong> Ready-to-wear sizes here are exploratory benchmarks you
          choose yourself, not a measured recommendation or a guaranteed fit. Size charts vary widely by garment
          type, brand and region.
        </p>
      </div>
    </div>
  );
}
