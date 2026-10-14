import React, { useState } from 'react';
import {
  Edit3,
  ArrowRight,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  ShieldCheck,
  Share2,
  FileText,
} from 'lucide-react';
import GarmentPreview from './GarmentPreview';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import {
  getGarmentById,
  getColorById,
  getStyleById,
  getFitById,
} from '../../data/designerData';

/**
 * DesignReview Component
 * Full Atelier Review screen showcasing comprehensive garment specs,
 * visual preview, edit controls, and honest next-phase continuation guidance.
 */
export default function DesignReview({
  garmentId,
  colorId,
  styleId,
  fitId,
  options = {},
  onEditDesign,
  onContinue,
  onReset,
  onSaveDraft,
  onViewReport,
  isDraftSaved = false,
  className = '',
}) {
  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const style = getStyleById(styleId);
  const fit = getFitById(fitId);

  const getCustomOption = (key) => {
    const control = garment.customControls?.[key];
    if (!control) return null;
    const selectedVal = options[key];
    const opt = control.options.find((o) => o.id === selectedVal);
    return {
      label: control.label,
      valLabel: opt ? opt.label : selectedVal,
      subtext: opt ? opt.subtext : '',
    };
  };

  return (
    <div className={`design-review-wrapper ${className}`.trim()}>
      <div className="review-hero-header">
        <div className="review-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <StatusBadge variant="gold" dot>
              Atelier Review
            </StatusBadge>
            <StatusBadge variant="neutral">
              Frontend Prototype
            </StatusBadge>
          </div>
          <h2 className="review-main-title">
            Your Bespoke <span className="text-gold-gradient">{garment.name}</span> Specification
          </h2>
          <p className="review-sub-title">
            Review your tailored design specifications before proceeding to measurement calibration.
          </p>
        </div>
      </div>

      <div className="review-layout-grid">
        {/* Left Column: Visual Garment Preview Card */}
        <div className="review-preview-col">
          <div className="review-preview-frame">
            <GarmentPreview
              garmentId={garmentId}
              colorId={colorId}
              styleId={styleId}
              fitId={fitId}
              options={options}
            />
          </div>
        </div>

        {/* Right Column: Atelier Specification Sheet */}
        <div className="review-specs-col">
          <div className="review-spec-sheet-card">
            <div className="spec-sheet-header">
              <div>
                <span className="spec-sheet-badge">HAUTE COUTURE DRAFT</span>
                <h3 className="spec-sheet-title">Atelier Specification Sheet</h3>
              </div>
              <span className="spec-sheet-id">ID: TZ-{garment.id.toUpperCase()}-01</span>
            </div>

            {/* Spec Sections */}
            <div className="spec-sheet-sections">
              {/* Section 1: Silhouette & Foundation */}
              <div className="spec-block">
                <h4 className="spec-block-title">1. Silhouette & Style</h4>
                <div className="spec-block-grid">
                  <div className="spec-item">
                    <span className="spec-item-label">Garment Category</span>
                    <span className="spec-item-val highlight">{garment.name}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-item-label">Aesthetic Mood</span>
                    <span className="spec-item-val">{style.name} ({style.tagline})</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-item-label">Fit Profile</span>
                    <span className="spec-item-val">{fit.name} — {fit.subtitle}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Palette & Material */}
              <div className="spec-block">
                <h4 className="spec-block-title">2. Color & Textile</h4>
                <div className="spec-block-grid">
                  <div className="spec-item">
                    <span className="spec-item-label">Palette Tone</span>
                    <div className="spec-color-inline">
                      <span
                        className="spec-color-dot"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span className="spec-item-val">{color.name}</span>
                    </div>
                  </div>
                  {getCustomOption('fabric') && (
                    <div className="spec-item">
                      <span className="spec-item-label">Fabric Preference</span>
                      <span className="spec-item-val">{getCustomOption('fabric').valLabel}</span>
                      <span className="spec-item-sub">{getCustomOption('fabric').subtext}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Tailoring Craftsmanship */}
              <div className="spec-block">
                <h4 className="spec-block-title">3. Tailoring Craftsmanship</h4>
                <div className="spec-block-grid">
                  {Object.keys(garment.customControls || {}).map((key) => {
                    if (key === 'fabric') return null; // already displayed in section 2
                    const opt = getCustomOption(key);
                    if (!opt) return null;

                    return (
                      <div key={key} className="spec-item">
                        <span className="spec-item-label">{opt.label}</span>
                        <span className="spec-item-val">{opt.valLabel}</span>
                        {opt.subtext && <span className="spec-item-sub">{opt.subtext}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Session State Note */}
              <div className="spec-storage-note">
                <Info size={15} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span>
                  <strong>Frontend Session Draft:</strong> Specifications are retained in your active browser session. Cloud profile sync will be enabled in upcoming releases.
                </span>
              </div>
            </div>

            {/* Review Action Buttons */}
            <div className="review-actions-bar">
              <Button
                variant="primary"
                size="lg"
                icon={Sparkles}
                onClick={onContinue}
                className="review-continue-btn"
                ariaLabel="Continue to Smart Measurement Calibration"
              >
                Continue to Measurement
              </Button>

              <div className="review-secondary-actions">
                <Button
                  variant="outline"
                  size="md"
                  icon={Edit3}
                  onClick={onEditDesign}
                  ariaLabel="Edit Design Selections"
                >
                  Edit Design
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  icon={isDraftSaved ? Check : BookmarkCheck}
                  onClick={onSaveDraft}
                  ariaLabel="Save Draft in Current Session"
                >
                  {isDraftSaved ? 'Draft Saved' : 'Save Draft'}
                </Button>

                {onViewReport && (
                  <Button
                    variant="outline"
                    size="md"
                    icon={FileText}
                    onClick={onViewReport}
                    ariaLabel="Generate Custom Outfit Design Report"
                  >
                    Design Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
