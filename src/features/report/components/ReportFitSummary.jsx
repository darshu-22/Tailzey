import React from 'react';
import { Info } from 'lucide-react';
import { FIT_PREFERENCES, STANDARD_LETTER_SIZES } from '../../../shared/data/resultsData';
import { getFitById } from '../../../shared/data/designerData';

function Row({ label, children, sub }) {
  return (
    <div className="report-spec-row">
      <span className="report-spec-label">{label}</span>
      <span className="report-spec-value">
        {children}
        {sub && <span className="report-spec-value-sub">{sub}</span>}
      </span>
    </div>
  );
}

/** Section 3: fit drape profile, ease allowances and the exploratory size benchmark. */
export default function ReportFitSummary({ fitId, measurement, adjustedCount }) {
  const designFit = getFitById(fitId);
  const fit = FIT_PREFERENCES.find((f) => f.id === fitId) || {
    name: `${designFit.name} Fit`,
    subtext: designFit.subtitle,
    description: designFit.description,
  };
  const { selectedSize, selectedSizeType, unit } = measurement;
  const benchmark = STANDARD_LETTER_SIZES.find((s) => s.id === selectedSize);
  const range = (cm, inches) => (unit === 'in' ? `${inches}"` : `${cm} cm`);

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
        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Fit Drape Architecture</h3>
          <Row label="Fit Drape Category" sub={fit.subtext}>
            <strong>{fit.name}</strong>
          </Row>
          <Row label="Drape Characteristics">
            <span className="report-spec-description">{fit.description}</span>
          </Row>
          <Row
            label="Active Tailoring Ease"
            sub={adjustedCount > 0 ? 'Comfort margins you set in the measurement studio' : 'No ease adjustments added'}
          >
            <strong>{adjustedCount > 0 ? `${adjustedCount} Custom Allowances` : 'Standard Ease (+0)'}</strong>
          </Row>
        </div>

        <div className="report-spec-card">
          <h3 className="report-spec-card-title">Exploratory Sizing Classification</h3>
          <Row
            label="Selected Size"
            sub={`Type: ${selectedSizeType === 'numeric' ? 'Category Numeric' : 'Standard Letter'}`}
          >
            <strong className="report-size-value">{selectedSize}</strong>
          </Row>
          {benchmark ? (
            <>
              <Row label="Benchmark Chest" sub="Standard ready-to-wear guide">
                <strong>{range(benchmark.chestCm, benchmark.chestIn)}</strong>
              </Row>
              <Row label="Benchmark Waist" sub="Standard ready-to-wear guide">
                <strong>{range(benchmark.waistCm, benchmark.waistIn)}</strong>
              </Row>
            </>
          ) : (
            <Row label="Numeric Specification" sub="Tailored category standard">
              <strong>{selectedSize} Standard Cut</strong>
            </Row>
          )}
        </div>
      </div>

      <div className="report-disclaimer-box" role="note">
        <div className="report-note-heading">
          <Info size={14} aria-hidden="true" />
          <strong>Fit & sizing disclaimer</strong>
        </div>
        <span>
          Size benchmarks and ease allowances in this report are for design planning only. They are{' '}
          <strong>not</strong> a guaranteed pattern or finished-garment fit; a bespoke garment still needs a
          physical fitting and a tailor&apos;s verification.
        </span>
      </div>
    </section>
  );
}
