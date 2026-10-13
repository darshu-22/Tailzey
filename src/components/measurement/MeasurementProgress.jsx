import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Info,
  ShieldCheck,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { CAPTURE_STEPS } from '../../data/measurementData';

/**
 * MeasurementProgress Component
 * Polished processing screen displaying illustrative stages.
 * Transparently labeled as a frontend demonstration without fabricating AI computation.
 */
export default function MeasurementProgress({
  capturedImages = {},
  skippedSteps = {},
  onContinueToResults,
  onRetakeSession,
}) {
  const [activeStage, setActiveStage] = useState(1);

  // Advance illustrative stages smoothly for realistic aesthetic
  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStage(2), 1000);
    const timer2 = setTimeout(() => setActiveStage(3), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stages = [
    {
      id: 1,
      name: 'Reviewing captured views',
      desc: 'Validating that local frames were recorded across requested angles',
      done: activeStage > 1,
    },
    {
      id: 2,
      name: 'Preparing measurement session',
      desc: 'Packaging local silhouette data for the atelier review sheet',
      done: activeStage > 2,
    },
    {
      id: 3,
      name: 'Awaiting measurement analysis',
      desc: 'Atelier ready for calibration review in upcoming phases',
      done: activeStage >= 3,
    },
  ];

  const capturedCount = Object.keys(capturedImages).length;
  const skippedCount = Object.keys(skippedSteps).length;

  return (
    <div className="measurement-progress-card" role="region" aria-label="Processing Progress">
      {/* Header */}
      <div className="progress-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <StatusBadge variant="gold" dot>
            Atelier Processing Session
          </StatusBadge>
          <StatusBadge variant="neutral">
            Frontend Simulation
          </StatusBadge>
        </div>
        <h2 className="progress-title">
          Processing <span className="text-gold-gradient">Capture Sequence</span>
        </h2>
        <p className="progress-subtitle">
          Consolidating your 6-pose body capture session in local memory.
        </p>
      </div>

      {/* Captured Views Visual Strip */}
      <div className="progress-thumbs-preview">
        <span className="progress-thumbs-label">Captured Session Frames ({capturedCount} views)</span>
        <div className="progress-thumbs-grid">
          {CAPTURE_STEPS.map((step) => {
            const img = capturedImages[step.key];
            const isSkipped = skippedSteps[step.key];
            return (
              <div key={step.key} className="progress-mini-thumb">
                {img ? (
                  <img src={img} alt={step.shortName} className="progress-mini-img" />
                ) : (
                  <div className={`progress-mini-empty ${isSkipped ? 'is-skipped' : ''}`}>
                    <span>{isSkipped ? 'Skipped' : 'Empty'}</span>
                  </div>
                )}
                <span className="progress-mini-name">{step.shortName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Illustrative Stages List */}
      <div className="progress-stages-list">
        {stages.map((stage) => {
          const isCurrent = activeStage === stage.id;
          const isCompleted = stage.done;

          return (
            <div
              key={stage.id}
              className={`progress-stage-item ${isCompleted ? 'is-completed' : ''} ${
                isCurrent ? 'is-current' : ''
              }`}
            >
              <div className="stage-icon-wrap" aria-hidden="true">
                {isCompleted ? (
                  <CheckCircle2 size={20} className="stage-icon-done" />
                ) : isCurrent ? (
                  <div className="stage-spinner" />
                ) : (
                  <Clock size={18} className="stage-icon-pending" />
                )}
              </div>
              <div className="stage-content">
                <h4 className="stage-name">{stage.name}</h4>
                <p className="stage-desc">{stage.desc}</p>
              </div>
              <span className="stage-badge">
                {isCompleted ? 'Complete' : isCurrent ? 'Processing...' : 'Awaiting'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Honest Prototype Notice */}
      <div className="progress-transparency-box" role="note">
        <Info size={18} className="transparency-icon" aria-hidden="true" />
        <div className="transparency-content">
          <h4 className="transparency-title">Frontend Prototype Demonstration</h4>
          <p className="transparency-text">
            Actual AI geometric body reconstruction, contour estimation, and circumference measurement calculation will be integrated in upcoming phases. No fabricated measurement figures have been generated.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="progress-actions-bar">
        <Button
          variant="outline"
          size="md"
          icon={RotateCcw}
          onClick={onRetakeSession}
          ariaLabel="Retake camera capture sequence"
        >
          Retake Poses
        </Button>

        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onContinueToResults}
          ariaLabel="Continue to measurement results preview"
        >
          Continue to Results Preview
        </Button>
      </div>
    </div>
  );
}
