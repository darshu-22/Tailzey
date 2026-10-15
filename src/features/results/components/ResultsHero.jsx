import React from 'react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import ProfileStatusBadges from './ProfileStatusBadges';
import UnitSelector from './UnitSelector';

/** Studio title, profile status badges and the unit selector. */
export default function ResultsHero({ measurement, counts, onUnitChange }) {
  return (
    <section className="results-hero-section" aria-label="Measurement Studio Overview">
      <div className="results-hero-text-block">
        <div className="results-badge-row">
          <StatusBadge variant="gold" dot>
            Studio Calibration
          </StatusBadge>
          <span className="results-hero-pill">Tailored Profile</span>
        </div>
        <h1 className="results-hero-title">
          Your <span className="text-gold-gradient">Measurement Studio</span>
        </h1>
        <p className="results-hero-subtitle">
          Review and refine your measurements, configure tailoring comfort ease, and explore ready-to-wear sizing
          benchmarks.
        </p>
      </div>

      <div className="results-hero-controls-bar">
        <ProfileStatusBadges
          counts={counts}
          cameraCaptureCount={measurement.cameraCaptureCount}
          isCameraCompleted={measurement.isCameraCompleted}
        />
        <UnitSelector activeUnit={measurement.unit} onUnitChange={onUnitChange} />
      </div>
    </section>
  );
}
