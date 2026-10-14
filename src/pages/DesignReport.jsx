import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  ArrowLeft,
  LayoutDashboard,
  Check,
  AlertCircle,
  Sparkles,
  Palette,
  Ruler,
  Info,
  ShieldCheck,
} from 'lucide-react';
import ReportHeader from '../components/report/ReportHeader';
import ReportOutfitSpec from '../components/report/ReportOutfitSpec';
import ReportMeasurementSheet from '../components/report/ReportMeasurementSheet';
import ReportFitSummary from '../components/report/ReportFitSummary';
import ReportPreviewSection from '../components/report/ReportPreviewSection';
import { getGarmentById, getColorById, getFitById } from '../data/designerData';
import { MANUAL_MEASUREMENT_FIELDS } from '../data/measurementData';

/**
 * DesignReport Page Component (Phase 7)
 * Dedicated Custom Outfit Design Report page.
 * Unifies outfit selections, anatomical measurement sheets, fit preferences,
 * and sample preview visuals into an haute couture client dossier.
 *
 * Provides client-side print and "Save as PDF" workflows via native browser printing
 * with dedicated ink-friendly multi-page CSS styling.
 */
export default function DesignReport({
  designerSession = {},
  measurementSession = {},
  onNavigate,
  onOpenPhaseNotice,
}) {
  // Toast notification feedback state
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Generate a stable in-memory report reference for this session
  const reportId = useMemo(() => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TLZ-REP-${randomHex}`;
  }, []);

  // Format human-readable generation date
  const generationDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Extract core state values safely
  const garmentId = designerSession?.garmentId || 'jacket';
  const colorId = designerSession?.colorId || 'black';
  const fitId = designerSession?.fitId || 'regular';
  const selectedSize = measurementSession?.selectedSize || 'M';
  const selectedSizeType = measurementSession?.selectedSizeType || 'letter';
  const unit = measurementSession?.manualUnit || 'cm';
  const manualValues = measurementSession?.manualValues || {};
  const adjustments = measurementSession?.adjustments || {};

  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const fit = getFitById(fitId);

  // Count recorded anatomical metrics
  const recordedCount = Object.values(manualValues).filter(
    (v) => v !== null && v !== undefined && v !== '' && !isNaN(v)
  ).length;

  // Print / Save as PDF handler
  const handlePrint = () => {
    try {
      showToast(
        'Print / Save as PDF Initiated',
        'In the print dialog, choose "Save as PDF" or your printer destination.'
      );
      // Small timeout to allow toast to render before modal print dialog halts execution
      setTimeout(() => {
        window.print();
      }, 300);
    } catch (err) {
      showToast(
        'Print Action Unavailable',
        'Could not trigger browser print dialog. Please use your browser menu (File > Print).'
      );
    }
  };

  const showToast = (title, message) => {
    setFeedbackToast({ title, message });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 5000);
  };

  return (
    <div className="report-page-wrapper">
      {/* 1. Header with Screen-Only Nav & Formal Print Letterhead */}
      <ReportHeader
        reportId={reportId}
        generationDate={generationDate}
        onPrint={handlePrint}
        onNavigate={onNavigate}
        onBack={() => onNavigate && onNavigate('dashboard')}
      />

      {/* 2. Main Printable Document Container */}
      <main className="report-document-container" id="report-printable-area">
        <article className="report-document-sheet" aria-label="Atelier Design Dossier">
          {/* Quick Highlights Summary Strip */}
          <div className="report-highlights-grid" aria-label="Key Design Metrics">
            <div className="report-highlight-card">
              <span className="report-highlight-label">Silhouette</span>
              <span className="report-highlight-val highlight-gold">{garment.name}</span>
            </div>

            <div className="report-highlight-card">
              <span className="report-highlight-label">Fabric Color</span>
              <span className="report-highlight-val">
                <span
                  className="report-color-dot"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                {color.name}
              </span>
            </div>

            <div className="report-highlight-card">
              <span className="report-highlight-label">Fit Drape</span>
              <span className="report-highlight-val">{fit.name}</span>
            </div>

            <div className="report-highlight-card">
              <span className="report-highlight-label">Size Benchmark</span>
              <span className="report-highlight-val highlight-gold">{selectedSize}</span>
            </div>

            <div className="report-highlight-card">
              <span className="report-highlight-label">Unit Scale</span>
              <span className="report-highlight-val">{unit.toUpperCase()}</span>
            </div>

            <div className="report-highlight-card">
              <span className="report-highlight-label">Metrics Calibrated</span>
              <span className="report-highlight-val">
                {recordedCount > 0 ? `${recordedCount} of 8` : 'Uncalibrated'}
              </span>
            </div>
          </div>

          {/* Report Sections Stack */}
          <div className="report-sections-stack">
            {/* Section 1: Garment Specification & Craftsmanship */}
            <ReportOutfitSpec
              designerSession={designerSession}
              selectedSize={selectedSize}
              selectedSizeType={selectedSizeType}
              unit={unit}
            />

            {/* Section 2: Anatomical Measurement Sheet */}
            <ReportMeasurementSheet
              measurementSession={measurementSession}
              unit={unit}
              adjustments={adjustments}
            />

            {/* Section 3: Fit Drape & Sizing Benchmark */}
            <ReportFitSummary
              fitId={fitId}
              selectedSize={selectedSize}
              selectedSizeType={selectedSizeType}
              unit={unit}
              adjustments={adjustments}
            />

            {/* Section 4: Visual Atelier Preview */}
            <ReportPreviewSection
              designerSession={designerSession}
              onOpen3DStudio={() => onNavigate && onNavigate('preview3d')}
            />

            {/* Atelier Certification & Confidentiality Block */}
            <footer className="report-atelier-seal-block" role="contentinfo">
              <div className="report-seal-signature">
                <span className="report-seal-signature-line">
                  TAILZEY ATELIER COUTURE
                </span>
                <span className="report-seal-signature-sub">
                  Digital Client Dossier • Reference #{reportId} • Generated {generationDate}
                </span>
              </div>

              <div className="report-watermark-tag">
                Client Session Draft • In-Memory Architecture
              </div>
            </footer>
          </div>
        </article>
      </main>

      {/* Floating Action / Feedback Toast */}
      {feedbackToast && (
        <aside
          className="report-feedback-toast no-print"
          role="status"
          aria-live="polite"
        >
          <div style={{ color: 'var(--color-gold)', flexShrink: 0 }}>
            <Check size={20} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
              {feedbackToast.title}
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {feedbackToast.message}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="toast-close-btn"
            aria-label="Dismiss feedback notice"
          >
            ×
          </button>
        </aside>
      )}
    </div>
  );
}
