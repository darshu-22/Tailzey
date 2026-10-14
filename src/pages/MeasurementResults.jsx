import React, { useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Home,
  Sparkles,
  Ruler,
  RotateCcw,
  Info,
  Check,
  X,
  Box,
  FileText,
} from 'lucide-react';
import MeasurementStatusBadge from '../components/results/MeasurementStatusBadge';
import UnitSelector from '../components/results/UnitSelector';
import MeasurementResultCard from '../components/results/MeasurementResultCard';
import SizeSelector from '../components/results/SizeSelector';
import FitPreferenceSelector from '../components/results/FitPreferenceSelector';
import MeasurementSummary from '../components/results/MeasurementSummary';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { MANUAL_MEASUREMENT_FIELDS } from '../data/measurementData';
import { cmToInches, inchesToCm } from '../data/resultsData';

/**
 * MeasurementResults Page Component (Phase 5)
 * Dedicated page titled "Your Measurement Studio".
 * Coordinates editable manual measurements, cm/in unit conversion,
 * user-controlled comfort ease adjustments (+1/+2), exploratory size selection,
 * fit preference, and the 3D preview hand-off modal.
 */
export default function MeasurementResults({
  measurementSession = {},
  onUpdateMeasurementSession,
  designerSession = {},
  onNavigate,
  onOpenPhaseNotice,
}) {
  // Current display unit ('cm' | 'in')
  const [unit, setUnit] = useState(measurementSession.manualUnit || 'cm');

  // Active measurement values (stored in active unit)
  const [measurements, setMeasurements] = useState(() => {
    return measurementSession.manualValues || {};
  });

  // Track original values to distinguish user edits
  const [originalValues, setOriginalValues] = useState(() => {
    return { ...(measurementSession.manualValues || {}) };
  });

  // User-selected adjustments per measurement field (+0, +1, +2)
  const [adjustments, setAdjustments] = useState({});

  // Exploratory Sizing State
  const [selectedGarmentId, setSelectedGarmentId] = useState(
    designerSession.garmentId || 'jacket'
  );
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSizeType, setSelectedSizeType] = useState('letter');

  // Fit Preference State
  const [selectedFitId, setSelectedFitId] = useState(
    designerSession.fitId || 'regular'
  );

  // 3D Preview Modal State
  const [continue3DModalOpen, setContinue3DModalOpen] = useState(false);
  const [reviewSummaryModalOpen, setReviewSummaryModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Unit conversion handler: converts displayed values accurately
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;

    const convertedMeasurements = {};
    const convertedOriginals = {};

    Object.entries(measurements).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '' && !isNaN(v)) {
        convertedMeasurements[k] = newUnit === 'in' ? cmToInches(v) : inchesToCm(v);
      } else {
        convertedMeasurements[k] = '';
      }
    });

    Object.entries(originalValues).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '' && !isNaN(v)) {
        convertedOriginals[k] = newUnit === 'in' ? cmToInches(v) : inchesToCm(v);
      } else {
        convertedOriginals[k] = '';
      }
    });

    setUnit(newUnit);
    setMeasurements(convertedMeasurements);
    setOriginalValues(convertedOriginals);

    if (onUpdateMeasurementSession) {
      onUpdateMeasurementSession({
        ...measurementSession,
        manualUnit: newUnit,
        manualValues: convertedMeasurements,
      });
    }

    showToast('Unit Converted', `Measurements converted to ${newUnit === 'cm' ? 'Centimetres' : 'Inches'}.`);
  };

  // Save individual edited measurement
  const handleSaveMeasurement = (fieldId, newValue) => {
    const updated = {
      ...measurements,
      [fieldId]: newValue,
    };
    setMeasurements(updated);

    if (onUpdateMeasurementSession) {
      onUpdateMeasurementSession({
        ...measurementSession,
        manualValues: updated,
      });
    }

    showToast('Measurement Updated', `${MANUAL_MEASUREMENT_FIELDS.find((f) => f.id === fieldId)?.label} saved.`);
  };

  // Update adjustment for an individual field
  const handleAdjustmentChange = (fieldId, adjValue) => {
    setAdjustments((prev) => ({
      ...prev,
      [fieldId]: adjValue,
    }));
  };

  // Reset all adjustments
  const handleResetAllAdjustments = () => {
    setAdjustments({});
    showToast('Adjustments Reset', 'All tailoring ease adjustments returned to +0.');
  };

  // Smooth scroll to measurement cards for editing
  const handleScrollToEdit = () => {
    const el = document.getElementById('results-cards-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('Editing Measurements', 'You can refine any measurement card directly.');
  };

  const showToast = (title, message) => {
    setFeedbackToast({ title, message });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Navigate to Design Report with updated session values
  const handleOpenReport = () => {
    if (onUpdateMeasurementSession) {
      onUpdateMeasurementSession({
        ...measurementSession,
        manualUnit: unit,
        manualValues: measurements,
        selectedSize,
        selectedSizeType,
        adjustments,
      });
    }
    if (onNavigate) onNavigate('design-report');
  };

  // Count entered values
  const enteredCount = Object.values(measurements).filter(
    (v) => v !== null && v !== undefined && v !== '' && !isNaN(v)
  ).length;

  return (
    <div className="measurement-results-page-wrapper">
      {/* Top Atelier Navigation Header */}
      <header className="results-header" role="banner">
        <div className="results-header-left">
          <a
            href="#dashboard"
            className="results-brand-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('dashboard');
            }}
            aria-label="Back to Dashboard"
          >
            <img
              src="/assets/tailzy-logo.png"
              alt="Tailzey Monogram"
              className="results-brand-logo"
            />
            <div className="results-brand-info">
              <span className="results-brand-title">TAILZEY</span>
              <span className="results-brand-subtitle">MEASUREMENT STUDIO</span>
            </div>
          </a>

          <StatusBadge variant="gold" dot className="results-phase-badge">
            Atelier Sizing
          </StatusBadge>
        </div>

        {/* Right Header Navigation Controls */}
        <div className="results-header-right">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => onNavigate && onNavigate('measurement')}
            ariaLabel="Return to Smart Measurement flow"
          >
            Smart Measurement
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={handleOpenReport}
            ariaLabel="View Design Report and PDF"
          >
            Design Report
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={LayoutDashboard}
            onClick={() => onNavigate && onNavigate('dashboard')}
            ariaLabel="Return to Dashboard"
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Home}
            onClick={() => onNavigate && onNavigate('home')}
            ariaLabel="Return to Home"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="results-main-container" id="main-content">
        {/* Page Hero Header */}
        <section className="results-hero-section" aria-label="Measurement Studio Overview">
          <div className="results-hero-text-block">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <StatusBadge variant="gold" dot>
                Studio Calibration
              </StatusBadge>
              <span className="results-hero-pill">Tailored Profile</span>
            </div>

            <h1 className="results-hero-title">
              Your <span className="text-gold-gradient">Measurement Studio</span>
            </h1>

            <p className="results-hero-subtitle">
              Review and refine your personal anatomical dimensions, configure tailoring comfort ease, and explore ready-to-wear sizing benchmarks.
            </p>
          </div>

          {/* Unit Toggle and Overall Status Badges */}
          <div className="results-hero-controls-bar">
            <MeasurementStatusBadge
              enteredCount={enteredCount}
              totalFields={MANUAL_MEASUREMENT_FIELDS.length}
              cameraCaptureCount={measurementSession.cameraCaptureCount || 0}
              isCameraCompleted={measurementSession.isCameraCompleted || false}
            />

            <UnitSelector
              activeUnit={unit}
              onUnitChange={handleUnitChange}
            />
          </div>
        </section>

        {/* 2-Column Responsive Layout: Cards & Sizing Controls (Left) + Summary Panel (Right) */}
        <div className="results-content-grid">
          {/* Main Column: Measurement Cards & Sizing Configuration */}
          <div className="results-cards-column">
            {/* Measurement Cards Section */}
            <div className="results-section-header" id="results-cards-section">
              <h2 className="results-section-heading">Anatomical Metrics</h2>
              <span className="results-section-sub">
                Edit values independently or apply optional comfort ease allowances.
              </span>
            </div>

            <div className="measurement-cards-grid">
              {MANUAL_MEASUREMENT_FIELDS.map((field) => (
                <MeasurementResultCard
                  key={field.id}
                  field={field}
                  value={measurements[field.id]}
                  originalValue={originalValues[field.id]}
                  unit={unit}
                  adjustment={adjustments[field.id] || 0}
                  onSaveMeasurement={handleSaveMeasurement}
                  onAdjustmentChange={handleAdjustmentChange}
                />
              ))}
            </div>

            <div className="results-content-divider" aria-hidden="true" />

            {/* Exploratory Size Selection Section */}
            <SizeSelector
              selectedGarmentId={selectedGarmentId}
              onGarmentChange={(gId) => setSelectedGarmentId(gId)}
              selectedSize={selectedSize}
              selectedSizeType={selectedSizeType}
              onSizeChange={(sId, type) => {
                setSelectedSize(sId);
                setSelectedSizeType(type);
              }}
              unit={unit}
            />

            <div className="results-content-divider" aria-hidden="true" />

            {/* Fit Preference Selection Section */}
            <FitPreferenceSelector
              selectedFitId={selectedFitId}
              onFitChange={(fId) => setSelectedFitId(fId)}
            />
          </div>

          {/* Right Column: Sticky Atelier Measurement Summary Panel */}
          <div className="results-summary-column">
            <MeasurementSummary
              measurements={measurements}
              adjustments={adjustments}
              unit={unit}
              selectedGarmentId={selectedGarmentId}
              selectedSize={selectedSize}
              selectedSizeType={selectedSizeType}
              selectedFitId={selectedFitId}
              cameraCaptureCount={measurementSession.cameraCaptureCount || 0}
              onEditMeasurements={handleScrollToEdit}
              onResetAdjustments={handleResetAllAdjustments}
              onReviewSummary={() => setReviewSummaryModalOpen(true)}
              onContinue3D={() => (onNavigate ? onNavigate('preview3d') : setContinue3DModalOpen(true))}
              onViewReport={handleOpenReport}
            />

            {/* Navigation Shortcuts */}
            <div className="results-shortcuts-card">
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                onClick={() => onNavigate && onNavigate('preview3d')}
                style={{ width: '100%', marginBottom: '0.5rem' }}
                ariaLabel="Launch 3D Avatar & Outfit Studio"
              >
                Launch 3D Avatar Studio
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={FileText}
                onClick={handleOpenReport}
                style={{ width: '100%', marginBottom: '0.5rem' }}
                ariaLabel="Generate Custom Outfit Design Report & PDF"
              >
                Export Design Report
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={Ruler}
                onClick={() => onNavigate && onNavigate('measurement')}
                style={{ width: '100%' }}
                ariaLabel="Return to guided camera measurement"
              >
                Guided Camera Capture Flow
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={Sparkles}
                onClick={() => onNavigate && onNavigate('designer')}
                style={{ width: '100%', marginTop: '0.5rem' }}
                ariaLabel="Open Dream Outfit Designer"
              >
                Open Dream Outfit Designer
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* PHASE 6 MODAL: Launch Interactive 3D Avatar Studio */}
      {continue3DModalOpen && (
        <div
          className="results-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-3d-title"
        >
          <div className="results-modal-card">
            <div className="results-modal-header">
              <div className="modal-icon-wrapper">
                <Box size={24} style={{ color: 'var(--color-gold)' }} />
              </div>
              <div>
                <StatusBadge variant="gold">Phase 6 Ready</StatusBadge>
                <h3 id="modal-3d-title" className="modal-title">
                  Interactive 3D Avatar & Outfit Studio
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setContinue3DModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="results-modal-body">
              <p className="modal-text">
                Your measurement metrics, tailoring ease adjustments, and exploratory size selections have been consolidated in your active session.
              </p>

              <div className="modal-notice-card" role="note">
                <Sparkles size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <div>
                  <strong>Phase 6 Interactive 3D Experience:</strong>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    Launch the <strong>Interactive 3D Avatar & Outfit Studio</strong> to inspect your bespoke garment silhouette from any angle on our 360° atelier mannequin with real-time fabric shading, zoom controls, and fit drape customization.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Your tailored selections flow directly into the 3D viewer. Values remain securely in your local React state.
              </p>
            </div>

            <div className="results-modal-footer">
              <Button
                variant="outline"
                size="md"
                onClick={() => setContinue3DModalOpen(false)}
              >
                Return to Studio
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                onClick={() => {
                  setContinue3DModalOpen(false);
                  if (onNavigate) onNavigate('preview3d');
                }}
              >
                Launch 3D Avatar Studio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW SUMMARY MODAL: Printable / inspectable Atelier Sizing Sheet Dialog */}
      {reviewSummaryModalOpen && (
        <div
          className="results-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-review-summary-title"
        >
          <div className="results-modal-card results-review-modal-card">
            <div className="results-modal-header">
              <div className="modal-icon-wrapper">
                <FileText size={24} style={{ color: 'var(--color-gold)' }} />
              </div>
              <div>
                <StatusBadge variant="gold">Atelier Sizing Sheet</StatusBadge>
                <h3 id="modal-review-summary-title" className="modal-title">
                  Specification Review
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setReviewSummaryModalOpen(false)}
                aria-label="Close summary review modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="results-modal-body">
              <p className="modal-text">
                Complete overview of your calibrated dimensions and custom tailoring configuration for this session:
              </p>

              {/* Review Overview Grid */}
              <div className="modal-review-overview-grid">
                <div className="modal-review-item">
                  <span className="modal-review-label">Garment Silhouette:</span>
                  <span className="modal-review-val highlight">{selectedGarmentId.toUpperCase()}</span>
                </div>
                <div className="modal-review-item">
                  <span className="modal-review-label">Exploratory Size:</span>
                  <span className="modal-review-val highlight">{selectedSize} ({selectedSizeType})</span>
                </div>
                <div className="modal-review-item">
                  <span className="modal-review-label">Fit Drape:</span>
                  <span className="modal-review-val">{selectedFitId.toUpperCase()}</span>
                </div>
                <div className="modal-review-item">
                  <span className="modal-review-label">Active Unit:</span>
                  <span className="modal-review-val">{unit === 'cm' ? 'Centimetres (cm)' : 'Inches (in)'}</span>
                </div>
              </div>

              {/* Measurements Quick Table */}
              <div className="modal-review-table-container">
                <table className="modal-review-table">
                  <thead>
                    <tr>
                      <th>Measurement</th>
                      <th>Base Value</th>
                      <th>Tailoring Ease</th>
                      <th>Resulting Dimension</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MANUAL_MEASUREMENT_FIELDS.map((field) => {
                      const raw = measurements[field.id];
                      const hasRaw = raw !== null && raw !== undefined && raw !== '' && !isNaN(raw);
                      const adj = adjustments[field.id] || 0;
                      const num = hasRaw ? parseFloat(raw) : null;
                      const res = num !== null ? (num + adj).toFixed(1) : null;

                      return (
                        <tr key={field.id}>
                          <td><strong>{field.label}</strong></td>
                          <td>{hasRaw ? `${num} ${unit}` : <span style={{ color: 'var(--color-text-faint)' }}>Not recorded</span>}</td>
                          <td>{adj > 0 ? `+${adj} ${unit}` : 'No change'}</td>
                          <td>
                            {hasRaw ? (
                              <strong style={{ color: 'var(--color-gold)' }}>{res} {unit}</strong>
                            ) : (
                              <span style={{ color: 'var(--color-text-faint)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Data remains exclusively in local React state for this session. No data is stored externally.
              </p>
            </div>

            <div className="results-modal-footer">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setReviewSummaryModalOpen(false);
                  handleScrollToEdit();
                }}
              >
                Edit Measurements
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                onClick={() => {
                  setReviewSummaryModalOpen(false);
                  if (onNavigate) onNavigate('preview3d');
                }}
              >
                Launch 3D Avatar Studio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <aside
          className="toast-notification results-toast"
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">
            <Check size={20} aria-hidden="true" />
          </div>
          <div className="toast-content">
            <h5 className="toast-title">{feedbackToast.title}</h5>
            <p className="toast-message">{feedbackToast.message}</p>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setFeedbackToast(null)}
            aria-label="Dismiss message"
          >
            <X size={18} />
          </button>
        </aside>
      )}
    </div>
  );
}
