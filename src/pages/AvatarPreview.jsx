import React, { useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Home,
  Palette,
  Sliders,
  Sparkles,
  RotateCcw,
  Info,
  Check,
  X,
  FileText,
} from 'lucide-react';
import ModelViewer3D from '../components/viewer3d/ModelViewer3D';
import OutfitSummaryPanel from '../components/viewer3d/OutfitSummaryPanel';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';

/**
 * AvatarPreview Page Component (Phase 6)
 * Dedicated workspace: "Interactive 3D Avatar & Outfit Studio".
 * Integrates procedural 3D mannequin, Blinn-Phong lighting, camera orbit controls,
 * real-time design state synchronization, size & fit benchmarks, and sample disclaimers.
 */
export default function AvatarPreview({
  designerSession = {},
  onUpdateDesignerSession,
  measurementSession = {},
  onUpdateMeasurementSession,
  onNavigate,
  onOpenPhaseNotice,
}) {
  // Active Garment & Styling State (synchronized with session)
  const [garmentId, setGarmentId] = useState(designerSession.garmentId || 'jacket');
  const [colorId, setColorId] = useState(designerSession.colorId || 'black');
  const [fitId, setFitId] = useState(designerSession.fitId || 'regular');
  const [styleId, setStyleId] = useState(designerSession.styleId || 'classic');

  // Exploratory Size from Phase 5 (default: M)
  const selectedSize = measurementSession.selectedSize || 'M';
  const selectedSizeType = measurementSession.selectedSizeType || 'letter';
  const unit = measurementSession.manualUnit || 'cm';

  // Handle live garment change in 3D studio
  const handleGarmentChange = (newGarmentId) => {
    setGarmentId(newGarmentId);
    if (onUpdateDesignerSession) {
      onUpdateDesignerSession({
        ...designerSession,
        garmentId: newGarmentId,
      });
    }
  };

  // Handle live color swatch change in 3D studio
  const handleColorChange = (newColorId) => {
    setColorId(newColorId);
    if (onUpdateDesignerSession) {
      onUpdateDesignerSession({
        ...designerSession,
        colorId: newColorId,
      });
    }
  };

  // Handle live fit change in 3D studio
  const handleFitChange = (newFitId) => {
    setFitId(newFitId);
    if (onUpdateDesignerSession) {
      onUpdateDesignerSession({
        ...designerSession,
        fitId: newFitId,
      });
    }
  };

  return (
    <div className="avatar-studio-page">
      {/* Top Atelier Studio Header */}
      <header className="studio-header" role="banner">
        <div className="studio-header-left">
          <a
            href="#dashboard"
            className="studio-brand-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('dashboard');
            }}
            aria-label="Back to Dashboard"
          >
            <img
              src="/assets/tailzy-logo.png"
              alt="Tailzey Monogram"
              className="studio-brand-logo"
            />
            <div className="studio-brand-info">
              <span className="studio-brand-title">TAILZEY</span>
              <span className="studio-brand-subtitle">3D OUTFIT STUDIO</span>
            </div>
          </a>

          <StatusBadge variant="gold" dot className="studio-header-badge">
            Phase 6 Interactive 3D
          </StatusBadge>
        </div>

        {/* Right Navigation Controls */}
        <div className="studio-header-right">
          <Button
            variant="ghost"
            size="sm"
            icon={Palette}
            onClick={() => onNavigate && onNavigate('designer')}
            ariaLabel="Return to Dream Outfit Designer"
          >
            Designer
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={Sliders}
            onClick={() => onNavigate && onNavigate('results')}
            ariaLabel="Return to Measurement Studio"
          >
            Measurements
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => onNavigate && onNavigate('design-report')}
            ariaLabel="Generate and export custom design report"
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
            ariaLabel="Return to Website Home"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="avatar-studio-main" id="studio-viewport">
        {/* Hero Section Header */}
        <section className="avatar-studio-hero" aria-label="3D Studio Overview">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <StatusBadge variant="gold" dot>
              Interactive 3D Stage
            </StatusBadge>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Atelier Visualization
            </span>
          </div>

          <h1 className="studio-hero-title">
            Interactive <span className="text-gold-gradient">3D Avatar & Outfit Studio</span>
          </h1>

          <p className="studio-hero-desc">
            Inspect your bespoke garment silhouette from any angle on our 360° interactive atelier mannequin. Orbit, zoom, examine tailored contours, and test fabric tones in real time.
          </p>
        </section>

        {/* 2-Column Responsive Layout: 3D Stage (Left) + Outfit Summary Panel (Right) */}
        <div className="viewer3d-layout-grid">
          {/* Main 3D Canvas Stage */}
          <ModelViewer3D
            garmentId={garmentId}
            colorId={colorId}
            fitId={fitId}
            styleId={styleId}
            options={designerSession.customOptions || {}}
            unit={unit}
          />

          {/* Right Column: Specification & Control Panel */}
          <OutfitSummaryPanel
            garmentId={garmentId}
            onGarmentChange={handleGarmentChange}
            colorId={colorId}
            onColorChange={handleColorChange}
            fitId={fitId}
            onFitChange={handleFitChange}
            styleId={styleId}
            selectedSize={selectedSize}
            selectedSizeType={selectedSizeType}
            measurementSession={measurementSession}
            unit={unit}
            onNavigate={onNavigate}
          />
        </div>
      </main>
    </div>
  );
}
