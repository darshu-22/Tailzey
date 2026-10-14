import React from 'react';
import { ShieldCheck, Info, Sliders } from 'lucide-react';
import { FIT_PREFERENCES, STANDARD_LETTER_SIZES } from '../../data/resultsData';
import { getFitById } from '../../data/designerData';

/**
 * ReportFitSummary Component (Phase 7)
 * Renders Section 3 of the Design Report:
 * Fit Drape preference analysis, exploratory size benchmark comparison,
 * and clear bespoke disclaimer.
 */
export default function ReportFitSummary({
  fitId = 'regular',
  selectedSize = 'M',
  selectedSizeType = 'letter',
  unit = 'cm',
  adjustments = {},
}) {
  const fitData =
    FIT_PREFERENCES.find((f) => f.id === fitId) || {
      id: fitId,
      name: `${fitId.charAt(0).toUpperCase() + fitId.slice(1)} Fit`,
      subtext: 'Tailored drape profile',
      description: 'Balanced sartorial ease tailored to silhouette lines.',
    };

  const designerFit = getFitById(fitId);

  // Sizing chart benchmark lookup for letter sizes
  const letterBenchmark = STANDARD_LETTER_SIZES.find((s) => s.id === selectedSize);

  // Total adjustments count
  const adjustedCount = Object.values(adjustments).filter((v) => v > 0).length;

  return (
    <section className="report-section" aria-labelledby="section-fit-summary-title">
      <div className="report-section-header">
        <div className="report-section-title-wrap">
          <span className="report-section-num">03.</span>
          <h2 id="section-fit-summary-title" className="report-section-title">
            Fit Drape & Sizing Benchmark
          </h2>
        </div>
        <span className="report-section-subtitle">Comfort Ease & Readiness</span>
      </div>

      <div className="report-fit-grid">
        {/* Card 1: Fit Drape & Comfort Ease Profile */}
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Fit Drape Architecture</h3>

          <div className="report-spec-row">
            <span className="report-spec-label">Fit Drape Category</span>
            <span className="report-spec-value">
              <strong>{fitData.name}</strong>
              <span className="report-spec-value-sub">{fitData.subtext}</span>
            </span>
          </div>

          <div className="report-spec-row">
            <span className="report-spec-label">Drape Characteristics</span>
            <span className="report-spec-value" style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {fitData.description || designerFit.description}
            </span>
          </div>

          <div className="report-spec-row">
            <span className="report-spec-label">Active Tailoring Ease</span>
            <span className="report-spec-value">
              <strong>
                {adjustedCount > 0 ? `${adjustedCount} Custom Allowances` : 'Standard Ease (+0)'}
              </strong>
              <span className="report-spec-value-sub">
                {adjustedCount > 0
                  ? 'Refined comfort margins applied by user'
                  : 'Zero additional ease adjustments added'}
              </span>
            </span>
          </div>
        </div>

        {/* Card 2: Exploratory Sizing Benchmark */}
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Exploratory Sizing Classification</h3>

          <div className="report-spec-row">
            <span className="report-spec-label">Selected Size</span>
            <span className="report-spec-value">
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>
                {selectedSize}
              </strong>
              <span className="report-spec-value-sub">
                Type: {selectedSizeType === 'numeric' ? 'Category Numeric' : 'Standard Letter'}
              </span>
            </span>
          </div>

          {letterBenchmark && (
            <>
              <div className="report-spec-row">
                <span className="report-spec-label">Benchmark Chest</span>
                <span className="report-spec-value">
                  <strong>
                    {unit === 'in' ? `${letterBenchmark.chestIn}"` : `${letterBenchmark.chestCm} cm`}
                  </strong>
                  <span className="report-spec-value-sub">Standard ready-to-wear guide</span>
                </span>
              </div>

              <div className="report-spec-row">
                <span className="report-spec-label">Benchmark Waist</span>
                <span className="report-spec-value">
                  <strong>
                    {unit === 'in' ? `${letterBenchmark.waistIn}"` : `${letterBenchmark.waistCm} cm`}
                  </strong>
                  <span className="report-spec-value-sub">Standard ready-to-wear guide</span>
                </span>
              </div>
            </>
          )}

          {!letterBenchmark && (
            <div className="report-spec-row">
              <span className="report-spec-label">Numeric Specification</span>
              <span className="report-spec-value">
                <strong>{selectedSize} Standard Cut</strong>
                <span className="report-spec-value-sub">Tailored category standard</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Sizing Disclaimer Box */}
      <div className="report-disclaimer-box" role="note">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <Info size={14} style={{ color: 'var(--color-gold)' }} aria-hidden="true" />
          <strong style={{ color: 'var(--color-text-primary)' }}>
            Sartorial Fit & Sizing Disclaimer:
          </strong>
        </div>
        <span>
          Exploratory size benchmarks and comfort ease allowances provided in this dossier are for preliminary design planning and reference only. They do <strong>not</strong> constitute guaranteed master-tailor pattern cutting, surgical anatomical fit predictions, or finished garment delivery guarantees. Final bespoke execution requires physical basted fittings and manual craftsman verification.
        </span>
      </div>
    </section>
  );
}
