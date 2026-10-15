import React from 'react';
import { ShieldCheck, Camera, Edit3, Info, ArrowLeft } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import CameraConsentForm from './CameraConsentForm';
import { useHeightField } from '../hooks/useHeightField';

const PILLARS = [
  {
    icon: Camera,
    title: 'Guided Camera Sequence',
    text: 'Four guided photos (front, both sides and back) are analysed to estimate your measurements, each with an honest ± range.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    text: 'Photos are analysed in memory on our server and discarded straight away. They are never stored, logged or returned.',
  },
  {
    icon: Edit3,
    title: 'Manual Entry Option',
    text: 'Prefer a tailor’s tape? Enter your numbers directly without turning on the camera.',
  },
];

/**
 * Entry screen shown before any camera access: explains the method, collects the
 * user's height and consent for camera analysis, and offers manual entry instead.
 */
export default function MeasurementIntro({ consented, onConsentChange, onStartCamera, onStartManual, onBack }) {
  const height = useHeightField();

  const handleStartCamera = () => {
    if (height.commit()) onStartCamera();
  };

  return (
    <div className="measurement-intro-card" role="region" aria-label="Smart Measurement Introduction and Privacy">
      <div className="measurement-intro-header">
        <div className="measurement-badge-row">
          <StatusBadge variant="gold" dot>
            Guided Fit Calibration
          </StatusBadge>
          <StatusBadge variant="neutral">Camera or Tape</StatusBadge>
        </div>
        <h1 className="measurement-intro-title">
          Smart Measurement <span className="text-gold-gradient">Atelier Guidance</span>
        </h1>
        <p className="measurement-intro-subtitle">
          Estimate your measurements from a guided photo sequence, or enter tape measurements manually.
        </p>
      </div>

      <div className="measurement-pillars-grid">
        {PILLARS.map(({ icon: Icon, title, text }, i) => (
          <React.Fragment key={title}>
            {i > 0 && <div className="pillar-pillar-divider" aria-hidden="true" />}
            <div className="measurement-pillar-item">
              <div className="pillar-icon-box">
                <Icon size={20} className="pillar-icon" aria-hidden="true" />
              </div>
              <h3 className="pillar-title">{title}</h3>
              <p className="pillar-desc">{text}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="measurement-notice-box" role="note">
        <div className="notice-icon-wrap">
          <Info size={18} className="notice-icon" aria-hidden="true" />
        </div>
        <div className="notice-content">
          <h4 className="notice-title">Camera results are estimates</h4>
          <p className="notice-text">
            Each camera value comes with a ± range and a confidence level, and anything the photos cannot
            show is left blank rather than guessed. Confirm critical measurements with a tape. The camera
            <strong> only starts</strong> after you consent below and allow it in your browser.
          </p>
        </div>
      </div>

      <CameraConsentForm height={height} consented={consented} onConsentChange={onConsentChange} />

      <div className="measurement-intro-actions">
        <div className="intro-actions-primary">
          <Button
            variant="primary"
            size="lg"
            icon={Camera}
            disabled={!consented}
            onClick={handleStartCamera}
            ariaLabel="Continue with camera guidance"
          >
            Continue with Camera
          </Button>
          <Button variant="outline" size="lg" icon={Edit3} onClick={onStartManual}>
            Enter Measurements Manually
          </Button>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
