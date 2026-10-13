import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  LayoutDashboard,
  Home,
  RotateCcw,
  Check,
  X,
  Ruler,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import DesignerStepper from '../components/designer/DesignerStepper';
import GarmentCard from '../components/designer/GarmentCard';
import ColorSwatches from '../components/designer/ColorSwatches';
import StyleSelector from '../components/designer/StyleSelector';
import FitSelector from '../components/designer/FitSelector';
import CustomOptionGroup from '../components/designer/CustomOptionGroup';
import GarmentPreview from '../components/designer/GarmentPreview';
import DesignSummary from '../components/designer/DesignSummary';
import DesignReview from '../components/designer/DesignReview';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import {
  GARMENTS,
  getGarmentById,
  getColorById,
  getStyleById,
  getFitById,
} from '../data/designerData';

/**
 * Designer Page Component (Phase 3)
 * Full interactive Dream Outfit Designer studio experience.
 * Coordinates 3-step workflow, real-time styling updates, live visual preview,
 * design summary, and atelier review sheet.
 */
export default function Designer({
  designerSession = {},
  onUpdateDesignerSession,
  onNavigate,
  onOpenPhaseNotice,
}) {
  // 1 = Choose Garment, 2 = Customize Style, 3 = Review Design
  const [currentStep, setCurrentStep] = useState(1);

  // Active Garment State (default: jacket)
  const [selectedGarmentId, setSelectedGarmentId] = useState(
    designerSession.garmentId || 'jacket'
  );

  // Core Customization State
  const initialGarment = getGarmentById(designerSession.garmentId || 'jacket');
  const [selectedColorId, setSelectedColorId] = useState(
    designerSession.colorId || initialGarment.defaultOptions.color
  );
  const [selectedStyleId, setSelectedStyleId] = useState(initialGarment.defaultOptions.style);
  const [selectedFitId, setSelectedFitId] = useState(
    designerSession.fitId || initialGarment.defaultOptions.fit
  );

  // Category-specific attributes
  const [customOptions, setCustomOptions] = useState({
    neckline: initialGarment.defaultOptions.neckline,
    sleeveLength: initialGarment.defaultOptions.sleeveLength,
    garmentLength: initialGarment.defaultOptions.garmentLength,
    fabric: initialGarment.defaultOptions.fabric,
    pattern: initialGarment.defaultOptions.pattern,
  });

  // Draft Save & Phase Notice Modal states
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [saveFeedbackToast, setSaveFeedbackToast] = useState(null);
  const [continueModalOpen, setContinueModalOpen] = useState(false);

  // Current Garment Definition
  const currentGarment = getGarmentById(selectedGarmentId);

  // Switch garment and reset options to its defaults
  const handleSelectGarment = (garmentId) => {
    setSelectedGarmentId(garmentId);
    const newGarment = getGarmentById(garmentId);
    setSelectedColorId(newGarment.defaultOptions.color);
    setSelectedStyleId(newGarment.defaultOptions.style);
    setSelectedFitId(newGarment.defaultOptions.fit);
    setCustomOptions({
      neckline: newGarment.defaultOptions.neckline,
      sleeveLength: newGarment.defaultOptions.sleeveLength,
      garmentLength: newGarment.defaultOptions.garmentLength,
      fabric: newGarment.defaultOptions.fabric,
      pattern: newGarment.defaultOptions.pattern,
    });
    setIsDraftSaved(false);

    if (onUpdateDesignerSession) {
      onUpdateDesignerSession({
        ...designerSession,
        garmentId,
        colorId: newGarment.defaultOptions.color,
        fitId: newGarment.defaultOptions.fit,
      });
    }
  };

  // Update specific category control
  const handleCustomOptionChange = (key, value) => {
    setCustomOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsDraftSaved(false);
  };

  // Reset to initial defaults for current garment
  const handleResetDesign = () => {
    const g = getGarmentById(selectedGarmentId);
    setSelectedColorId(g.defaultOptions.color);
    setSelectedStyleId(g.defaultOptions.style);
    setSelectedFitId(g.defaultOptions.fit);
    setCustomOptions({
      neckline: g.defaultOptions.neckline,
      sleeveLength: g.defaultOptions.sleeveLength,
      garmentLength: g.defaultOptions.garmentLength,
      fabric: g.defaultOptions.fabric,
      pattern: g.defaultOptions.pattern,
    });
    setIsDraftSaved(false);
    showToast('Design Reset', 'Selections returned to initial atelier defaults.');
  };

  // Save draft in active session
  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    showToast('Draft Saved in Session', 'Your custom configuration is stored in this browser session.');
  };

  const showToast = (title, message) => {
    setSaveFeedbackToast({ title, message });
    setTimeout(() => {
      setSaveFeedbackToast(null);
    }, 4000);
  };

  return (
    <div className="designer-page-wrapper">
      {/* Top Atelier Navigation Header */}
      <header className="designer-header" role="banner">
        <div className="designer-header-left">
          <a
            href="#dashboard"
            className="designer-brand-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('dashboard');
            }}
            aria-label="Back to Dashboard"
          >
            <img
              src="/assets/tailzy-logo.png"
              alt="Tailzey Monogram"
              className="designer-brand-logo"
            />
            <div className="designer-brand-info">
              <span className="designer-brand-title">TAILZEY</span>
              <span className="designer-brand-subtitle">DREAM OUTFIT STUDIO</span>
            </div>
          </a>

          <StatusBadge variant="gold" dot className="designer-phase-badge">
            Phase 3 Studio
          </StatusBadge>
        </div>

        {/* Center Progress Stepper on Desktop */}
        <div className="designer-header-center">
          <DesignerStepper
            currentStep={currentStep}
            onStepChange={(stepId) => setCurrentStep(stepId)}
          />
        </div>

        {/* Right Navigation Actions */}
        <div className="designer-header-right">
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
            ariaLabel="Return to Website Home"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Mobile Stepper Bar */}
      <div className="designer-mobile-stepper-bar">
        <DesignerStepper
          currentStep={currentStep}
          onStepChange={(stepId) => setCurrentStep(stepId)}
        />
      </div>

      {/* Main Designer Workspace */}
      <main className="designer-main-container" id="designer-workspace">
        {/* STEP 1: CHOOSE GARMENT */}
        {currentStep === 1 && (
          <section className="designer-step-section" aria-label="Step 1: Choose Garment">
            <div className="designer-step-intro">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <StatusBadge variant="gold" dot>
                  Step 1 of 3
                </StatusBadge>
                <span className="step-intro-pill">Silhouette Selection</span>
              </div>
              <h1 className="designer-step-heading">
                Choose Your Primary <span className="text-gold-gradient">Garment Silhouette</span>
              </h1>
              <p className="designer-step-description">
                Select the base bespoke piece you wish to personalize. Each silhouette features tailored proportions and artisanal options.
              </p>
            </div>

            {/* Garments Grid */}
            <div
              className="garments-grid"
              role="radiogroup"
              aria-label="Selectable garment categories"
            >
              {GARMENTS.map((garment) => (
                <GarmentCard
                  key={garment.id}
                  garment={garment}
                  isSelected={selectedGarmentId === garment.id}
                  onSelect={handleSelectGarment}
                />
              ))}
            </div>

            {/* Step 1 Actions Footer */}
            <div className="step-action-bar">
              <div className="step-action-info">
                <span className="step-action-selected-text">
                  Selected: <strong>{currentGarment.name}</strong> ({currentGarment.category})
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => setCurrentStep(2)}
                ariaLabel="Proceed to Customize Style"
              >
                Proceed to Customize Style
              </Button>
            </div>
          </section>
        )}

        {/* STEP 2: CUSTOMIZE STYLE */}
        {currentStep === 2 && (
          <section className="designer-step-section" aria-label="Step 2: Customize Style">
            <div className="designer-step-intro">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <StatusBadge variant="gold" dot>
                  Step 2 of 3
                </StatusBadge>
                <span className="step-intro-pill">{currentGarment.name} Customization</span>
              </div>
              <h1 className="designer-step-heading">
                Sculpt Your <span className="text-gold-gradient">{currentGarment.name}</span>
              </h1>
              <p className="designer-step-description">
                Refine palette tones, style mood, tailored fit profile, and category craftsmanship details in real time.
              </p>
            </div>

            {/* 3-Column / 2-Column Responsive Workspace */}
            <div className="designer-workspace-layout">
              {/* Left Column: Customization Controls Panel */}
              <div className="customization-controls-panel">
                <div className="panel-title-bar">
                  <h2 className="panel-title">Craftsmanship Controls</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={RotateCcw}
                    onClick={handleResetDesign}
                    ariaLabel="Reset Design Options"
                  >
                    Reset
                  </Button>
                </div>

                {/* 1. Color Swatches */}
                <ColorSwatches
                  selectedColorId={selectedColorId}
                  onColorChange={(colorId) => {
                    setSelectedColorId(colorId);
                    setIsDraftSaved(false);
                  }}
                />

                <div className="panel-divider" aria-hidden="true" />

                {/* 2. Style Aesthetic Mood */}
                <StyleSelector
                  selectedStyleId={selectedStyleId}
                  onStyleChange={(styleId) => {
                    setSelectedStyleId(styleId);
                    setIsDraftSaved(false);
                  }}
                />

                <div className="panel-divider" aria-hidden="true" />

                {/* 3. Fit Profile */}
                <FitSelector
                  selectedFitId={selectedFitId}
                  onFitChange={(fitId) => {
                    setSelectedFitId(fitId);
                    setIsDraftSaved(false);
                    if (onUpdateDesignerSession) {
                      onUpdateDesignerSession({
                        ...designerSession,
                        garmentId: selectedGarmentId,
                        fitId,
                      });
                    }
                  }}
                />

                <div className="panel-divider" aria-hidden="true" />

                {/* 4. Category-Specific Craftsmanship Controls */}
                <div className="category-attributes-container">
                  <h3 className="category-attributes-heading">
                    {currentGarment.name} Tailoring Details
                  </h3>

                  {Object.entries(currentGarment.customControls || {}).map(
                    ([key, config]) => (
                      <CustomOptionGroup
                        key={key}
                        controlKey={key}
                        controlConfig={config}
                        selectedValue={customOptions[key]}
                        onChange={handleCustomOptionChange}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Center Column: Live Visual Outfit Preview */}
              <div className="workspace-preview-panel">
                <GarmentPreview
                  garmentId={selectedGarmentId}
                  colorId={selectedColorId}
                  styleId={selectedStyleId}
                  fitId={selectedFitId}
                  options={customOptions}
                />
              </div>

              {/* Right Column: Live Design Summary & Step Actions */}
              <div className="workspace-summary-panel">
                <DesignSummary
                  garmentId={selectedGarmentId}
                  colorId={selectedColorId}
                  styleId={selectedStyleId}
                  fitId={selectedFitId}
                  options={customOptions}
                  onReset={handleResetDesign}
                  onReview={() => setCurrentStep(3)}
                />

                {/* Back to Step 1 Button */}
                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={() => setCurrentStep(1)}
                  style={{ width: '100%', marginTop: '1rem' }}
                  ariaLabel="Back to Garment Selection"
                >
                  Change Silhouette ({currentGarment.name})
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: REVIEW DESIGN */}
        {currentStep === 3 && (
          <section className="designer-step-section" aria-label="Step 3: Review Design">
            <DesignReview
              garmentId={selectedGarmentId}
              colorId={selectedColorId}
              styleId={selectedStyleId}
              fitId={selectedFitId}
              options={customOptions}
              onEditDesign={() => setCurrentStep(2)}
              onContinue={() => setContinueModalOpen(true)}
              onReset={handleResetDesign}
              onSaveDraft={handleSaveDraft}
              isDraftSaved={isDraftSaved}
            />

            {/* Back to Customize Bar */}
            <div className="review-bottom-nav">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={() => setCurrentStep(2)}
                ariaLabel="Return to Customization Controls"
              >
                Back to Customization
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={LayoutDashboard}
                onClick={() => onNavigate && onNavigate('dashboard')}
                ariaLabel="Exit to Dashboard"
              >
                Back to Dashboard
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* CONTINUATION MODAL: Explains Next Phase (Smart Measurement) Transparently */}
      {continueModalOpen && (
        <div
          className="designer-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-continue-title"
        >
          <div className="designer-modal-card">
            <div className="designer-modal-header">
              <div className="designer-modal-icon-wrap">
                <Sparkles size={24} style={{ color: 'var(--color-gold)' }} />
              </div>
              <div>
                <StatusBadge variant="gold">Phase 4 Ready</StatusBadge>
                <h3 id="modal-continue-title" className="designer-modal-title">
                  Next Step: Smart Measurement Calibration
                </h3>
              </div>
              <button
                type="button"
                className="designer-modal-close-btn"
                onClick={() => setContinueModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="designer-modal-body">
              <p className="designer-modal-text">
                You have sculpted your bespoke <strong>{currentGarment.name}</strong> in{' '}
                <strong>{getColorById(selectedColorId).name}</strong>!
              </p>

              <div className="designer-modal-notice-box">
                <Info size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <div>
                  <strong>Phase 4 Studio Experience:</strong>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    Your design specification is ready. You can now launch the <strong>Smart Body Measurement Calibration</strong> experience to calibrate your tailored silhouette through 6 guided camera poses or manual tape entry.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Your design configuration remains active in this browser session. You can return to refine your choices at any time.
              </p>
            </div>

            <div className="designer-modal-footer">
              <Button
                variant="outline"
                size="md"
                onClick={() => setContinueModalOpen(false)}
              >
                Return to Review
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={Ruler}
                onClick={() => {
                  setContinueModalOpen(false);
                  if (onNavigate) onNavigate('measurement');
                }}
              >
                Launch Smart Measurement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Session Feedback Toast */}
      {saveFeedbackToast && (
        <aside
          className="toast-notification designer-toast"
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">
            <Check size={20} aria-hidden="true" />
          </div>
          <div className="toast-content">
            <h5 className="toast-title">{saveFeedbackToast.title}</h5>
            <p className="toast-message">{saveFeedbackToast.message}</p>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setSaveFeedbackToast(null)}
            aria-label="Dismiss message"
          >
            <X size={18} />
          </button>
        </aside>
      )}
    </div>
  );
}
