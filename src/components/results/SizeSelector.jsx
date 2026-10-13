import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Ruler,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  STANDARD_LETTER_SIZES,
  CATEGORY_NUMERIC_SIZES,
  GARMENT_CATEGORIES,
} from '../../data/resultsData';

/**
 * SizeSelector Component
 * Provides visual exploratory standard letter and category-tailored numeric size selections.
 * Clearly discloses that size charts differ across brands and countries without universal mapping.
 */
export default function SizeSelector({
  selectedGarmentId = 'jacket',
  onGarmentChange,
  selectedSize = 'M',
  selectedSizeType = 'letter', // 'letter' | 'numeric'
  onSizeChange,
  unit = 'cm',
  className = '',
}) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const numericSizes = CATEGORY_NUMERIC_SIZES[selectedGarmentId] || [];
  const hasNumericSizes = numericSizes.length > 0;

  return (
    <div
      className={`size-selector-section ${className}`.trim()}
      role="region"
      aria-label="Standard & Numeric Size Selector"
    >
      <div className="size-selector-header">
        <div>
          <span className="size-selector-eyebrow">Ready-to-Wear Comparison</span>
          <h3 className="size-selector-title">Exploratory Size Selection</h3>
        </div>

        {/* Toggle Size Guide Button */}
        <button
          type="button"
          className="size-guide-toggle-btn"
          onClick={() => setShowSizeGuide(!showSizeGuide)}
          aria-expanded={showSizeGuide}
        >
          <Ruler size={14} />
          <span>{showSizeGuide ? 'Hide Size Guide' : 'View Size Guide'}</span>
          {showSizeGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <p className="size-selector-subtext">
        Explore ready-to-wear sizing benchmarks for your chosen garment silhouette. Sizing charts vary between tailoring houses and styles.
      </p>

      {/* Garment Silhouette Category Tabs */}
      <div className="garment-category-tabs-wrap">
        <span className="category-tabs-label">Garment Category:</span>
        <div className="garment-category-tabs" role="radiogroup" aria-label="Garment Silhouette Category">
          {GARMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={selectedGarmentId === cat.id}
              className={`garment-tab-btn ${selectedGarmentId === cat.id ? 'is-active' : ''}`}
              onClick={() => onGarmentChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizing Format Selector (Letter vs Numeric) */}
      {hasNumericSizes && (
        <div className="size-format-selector" role="radiogroup" aria-label="Size Format">
          <button
            type="button"
            role="radio"
            aria-checked={selectedSizeType === 'letter'}
            className={`size-format-btn ${selectedSizeType === 'letter' ? 'is-active' : ''}`}
            onClick={() => onSizeChange(selectedSize || 'M', 'letter')}
          >
            Letter Sizing (S – 3XL)
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={selectedSizeType === 'numeric'}
            className={`size-format-btn ${selectedSizeType === 'numeric' ? 'is-active' : ''}`}
            onClick={() => onSizeChange(numericSizes[1]?.id || numericSizes[0]?.id, 'numeric')}
          >
            Tailored Numeric Sizing ({selectedGarmentId === 'trousers' ? 'Waist' : 'Collar / Chest'})
          </button>
        </div>
      )}

      {/* Numeric Distinction Note */}
      {hasNumericSizes && (
        <div className="numeric-distinction-note">
          <Info size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
          <span>
            Numeric {selectedGarmentId} sizing represents specific garment dimensions and is not universally equivalent to standard letter sizes.
          </span>
        </div>
      )}

      {/* Size Options Grid */}
      <div className="size-cards-grid" role="radiogroup" aria-label="Available Exploratory Sizes">
        {selectedSizeType === 'letter' || !hasNumericSizes ? (
          STANDARD_LETTER_SIZES.map((size) => {
            const isSelected = selectedSize === size.id && selectedSizeType === 'letter';
            const chestVal = unit === 'cm' ? size.chestCm : size.chestIn;
            const waistVal = unit === 'cm' ? size.waistCm : size.waistIn;

            return (
              <button
                key={size.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`size-card-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSizeChange(size.id, 'letter')}
              >
                <div className="size-card-top">
                  <span className="size-letter-badge">{size.label}</span>
                  {isSelected && <Check size={14} className="size-check-icon" />}
                </div>
                <span className="size-name-label">{size.name}</span>
                <span className="size-bench-sub">Chest: {chestVal} {unit}</span>
                <span className="size-bench-sub">Waist: {waistVal} {unit}</span>
              </button>
            );
          })
        ) : (
          numericSizes.map((numSize) => {
            const isSelected = selectedSize === numSize.id && selectedSizeType === 'numeric';

            return (
              <button
                key={numSize.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`size-card-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSizeChange(numSize.id, 'numeric')}
              >
                <div className="size-card-top">
                  <span className="size-letter-badge">{numSize.label}</span>
                  {isSelected && <Check size={14} className="size-check-icon" />}
                </div>
                <span className="size-name-label">{numSize.subtext}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Collapsible Size Guide Table */}
      {showSizeGuide && (
        <div className="size-guide-drawer" role="region" aria-label="Exploratory Size Guide Benchmarks">
          <h4 className="size-guide-title">Ready-to-Wear Benchmark Table ({unit.toUpperCase()})</h4>
          <div className="size-guide-table-wrap">
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Name</th>
                  <th scope="col">Chest Range ({unit})</th>
                  <th scope="col">Waist Range ({unit})</th>
                </tr>
              </thead>
              <tbody>
                {STANDARD_LETTER_SIZES.map((row) => (
                  <tr key={row.id} className={selectedSize === row.id ? 'is-highlighted-row' : ''}>
                    <td><strong>{row.label}</strong></td>
                    <td>{row.name}</td>
                    <td>{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                    <td>{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="size-guide-footer-note">
            * Benchmark ranges are illustrative industry standards. Bespoke Tailzey garments are crafted from individual anatomical metrics rather than generic off-the-rack size bands.
          </p>
        </div>
      )}

      {/* Honesty Disclosure Banner */}
      <div className="size-honesty-banner" role="note">
        <Info size={15} className="size-honesty-icon" aria-hidden="true" />
        <p className="size-honesty-text">
          <strong>Exploratory Selection Notice:</strong> Ready-to-wear size assignments are exploratory styling choices and not confirmed AI determinations. Size charts vary widely by garment type, brand, and regional tradition.
        </p>
      </div>
    </div>
  );
}
