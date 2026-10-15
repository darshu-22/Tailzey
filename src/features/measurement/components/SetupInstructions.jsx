import React from 'react';
import { Sun, Smartphone, Maximize2, Layers, Shirt, UserCheck, Info, ArrowLeft, Camera, Edit3 } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import StudioFramingDiagram from './StudioFramingDiagram';

/** Each item matches a check the analysis performs on every photo. */
const SETUP_ITEMS = [
  {
    icon: Sun,
    title: 'Even, Bright Lighting',
    desc: 'Light the room from the front. Avoid strong shadows and bright windows behind you so your outline is clear.',
  },
  {
    icon: Smartphone,
    title: 'Steady Camera at Waist Height',
    desc: 'Rest your device on a shelf, table or tripod at about waist height. Do not hold it in your hand.',
  },
  {
    icon: Maximize2,
    title: 'Whole Body in Frame',
    desc: 'Step back 2–3 metres (6–9 ft) until everything from the top of your head to your feet is visible. Photos with the head or feet cut off cannot be used.',
  },
  {
    icon: Layers,
    title: 'Plain Background, Only You',
    desc: 'Stand in front of a plain wall with nobody else in the frame, so your silhouette separates cleanly.',
  },
  {
    icon: Shirt,
    title: 'Fitted Clothing',
    desc: 'Wear fitted clothes (athletic or base layers). Loose clothing hides your outline and inflates circumferences.',
  },
  {
    icon: UserCheck,
    title: 'Upright A-Pose',
    desc: 'Stand upright with knees straight, feet hip-width apart, and arms about 15° away from your body — not raised.',
  },
];

/** Environment and posture checklist shown before the camera starts. */
export default function SetupInstructions({ onProceed, onManual, onBack }) {
  return (
    <div className="setup-instructions-card" role="region" aria-label="Environment Setup Instructions">
      <div className="setup-header">
        <div className="measurement-badge-row">
          <StatusBadge variant="gold" dot>
            Preparation Checklist
          </StatusBadge>
          <span className="setup-header-pill">Atelier Calibration</span>
        </div>
        <h2 className="setup-title">
          Positioning & <span className="text-gold-gradient">Environment Setup</span>
        </h2>
        <p className="setup-subtitle">
          Prepare your space for four photos: front, left side, right side and back. A front (or back) photo
          is required; a side photo is needed for neck, chest, waist and hip.
        </p>
      </div>

      <StudioFramingDiagram />

      <div className="setup-grid">
        {SETUP_ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="setup-item-card">
            <div className="setup-item-icon-wrap">
              <Icon size={18} className="setup-item-icon" aria-hidden="true" />
            </div>
            <div className="setup-item-content">
              <h3 className="setup-item-title">{title}</h3>
              <p className="setup-item-desc">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="setup-disclaimer-box" role="note">
        <Info size={16} className="setup-disclaimer-icon" aria-hidden="true" />
        <p className="setup-disclaimer-text">
          <strong>Guidance Note:</strong> Good setup improves accuracy but camera estimates are never
          tape-exact — expect roughly ±2 cm for lengths and ±3 cm for circumferences. You can review and
          correct every value afterwards.
        </p>
      </div>

      <div className="setup-actions-bar">
        <div className="setup-actions-left">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <Button variant="outline" size="md" icon={Edit3} onClick={onManual}>
            Manual Entry Instead
          </Button>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={Camera}
          onClick={onProceed}
          ariaLabel="Request camera access and begin guided capture"
        >
          Proceed to Camera Capture
        </Button>
      </div>
    </div>
  );
}
