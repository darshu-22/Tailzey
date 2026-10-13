import React, { useState } from 'react';
import {
  ShieldCheck,
  Camera,
  Edit3,
  Lock,
  Eye,
  Info,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

/**
 * MeasurementIntro Component
 * Welcome and privacy screen displayed BEFORE any camera activation.
 * Requires explicit user consent before proceeding with camera guidance,
 * and highlights the manual measurement alternative.
 */
export default function MeasurementIntro({
  onStartCamera,
  onStartManual,
  onBack,
}) {
  const [hasConsented, setHasConsented] = useState(false);

  return (
    <div className="measurement-intro-card" role="region" aria-label="Smart Measurement Introduction and Privacy">
      {/* Top Header Badge & Title */}
      <div className="measurement-intro-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <StatusBadge variant="gold" dot>
            Phase 4 Guided Calibration
          </StatusBadge>
          <StatusBadge variant="neutral">
            Frontend Only
          </StatusBadge>
        </div>

        <h1 className="measurement-intro-title">
          Smart Measurement <span className="text-gold-gradient">Atelier Guidance</span>
        </h1>
        <p className="measurement-intro-subtitle">
          Calibrate your personal tailored fit through a guided body-capture sequence or enter your measurements manually.
        </p>
      </div>

      {/* Core Informational Pillars Grid */}
      <div className="measurement-pillars-grid">
        <div className="measurement-pillar-item">
          <div className="pillar-icon-box">
            <Camera size={20} className="pillar-icon" aria-hidden="true" />
          </div>
          <h3 className="pillar-title">Guided Camera Sequence</h3>
          <p className="pillar-desc">
            Step-by-step on-screen alignment guides you through 6 poses to preview your silhouette angles.
          </p>
        </div>

        <div className="pillar-pillar-divider" aria-hidden="true" />

        <div className="measurement-pillar-item">
          <div className="pillar-icon-box">
            <ShieldCheck size={20} className="pillar-icon" aria-hidden="true" />
          </div>
          <h3 className="pillar-title">Local & Privacy-First</h3>
          <p className="pillar-desc">
            Camera streams run locally in your browser. No photos are uploaded, stored in the cloud, or sent to a server.
          </p>
        </div>

        <div className="pillar-pillar-divider" aria-hidden="true" />

        <div className="measurement-pillar-item">
          <div className="pillar-icon-box">
            <Edit3 size={20} className="pillar-icon" aria-hidden="true" />
          </div>
          <h3 className="pillar-title">Manual Entry Option</h3>
          <p className="pillar-desc">
            Prefer taking your own tape measurements? Enter your numbers directly without activating the camera.
          </p>
        </div>
      </div>

      {/* Important Transparency Notice */}
      <div className="measurement-notice-box" role="note">
        <div className="notice-icon-wrap">
          <Info size={18} style={{ color: 'var(--color-gold)' }} aria-hidden="true" />
        </div>
        <div className="notice-content">
          <h4 className="notice-title">Important Prototype Notice</h4>
          <p className="notice-text">
            Camera-based measurements are experimental visual estimates and require review. Camera access will <strong>only begin</strong> after you explicitly confirm consent below and grant your browser permission. Captured frames remain in temporary component memory during this session and are discarded upon exit.
          </p>
        </div>
      </div>

      {/* Explicit User Consent Checkbox */}
      <div className="measurement-consent-box">
        <label className="measurement-consent-label">
          <input
            type="checkbox"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
            className="measurement-consent-checkbox"
            aria-describedby="consent-description"
          />
          <span className="measurement-consent-text">
            I understand that the camera is used only for temporary, local in-browser pose alignment, and I agree to proceed with the camera capture experience.
          </span>
        </label>
        <span id="consent-description" className="sr-only">
          Checking this box enables the Continue with Camera button.
        </span>
      </div>

      {/* Navigation Actions */}
      <div className="measurement-intro-actions">
        <div className="intro-actions-primary">
          <Button
            variant="primary"
            size="lg"
            icon={Camera}
            disabled={!hasConsented}
            onClick={onStartCamera}
            ariaLabel="Continue with camera guidance"
          >
            Continue with Camera
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={Edit3}
            onClick={onStartManual}
            ariaLabel="Switch to manual measurement entry"
          >
            Enter Measurements Manually
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={onBack}
          ariaLabel="Return to previous screen"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
