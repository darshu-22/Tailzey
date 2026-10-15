import React from 'react';
import { Camera, ArrowRight, ArrowLeft, AlertCircle, RotateCcw, Info } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { MANUAL_MEASUREMENT_FIELDS, MEASUREMENT_CATEGORIES } from '../../../shared/data/measurementData';
import { formatUncertainty } from '../../../shared/measurements/estimates';
import { useManualMeasurementForm } from '../hooks/useManualMeasurementForm';
import MeasurementFieldInput from './MeasurementFieldInput';
import UnitToggle from './UnitToggle';

/**
 * Tape-measurement entry, grouped by body area. Values are validated against each
 * field's range in the chosen unit and written to the shared measurement workspace.
 */
export default function ManualMeasurementForm({ onSubmitted, onSwitchToCamera, onBack }) {
  const form = useManualMeasurementForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.submit()) onSubmitted();
  };

  const cameraNote = (id) =>
    form.fieldStatus[id] === 'camera_estimate'
      ? `Camera estimate ${formatUncertainty(form.uncertainty[id], form.unit) ?? ''}`.trim()
      : null;

  return (
    <form className="manual-measurement-form" onSubmit={handleSubmit} noValidate aria-label="Manual Measurement Form">
      <div className="manual-form-header">
        <div className="manual-header-titles">
          <div className="measurement-badge-row">
            <StatusBadge variant="gold" dot>
              Manual Entry
            </StatusBadge>
            <StatusBadge variant="neutral">Tape Measurement</StatusBadge>
          </div>
          <h2 className="manual-form-title">
            Enter Your Tailored <span className="text-gold-gradient">Proportions</span>
          </h2>
          <p className="manual-form-subtitle">
            Measure with a flexible tailor’s tape. Leave a field empty if you have not measured it — nothing is
            filled in for you.
          </p>
        </div>
        <UnitToggle unit={form.unit} onChange={form.changeUnit} />
      </div>

      {form.errors.form && (
        <div className="form-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{form.errors.form}</span>
        </div>
      )}

      <div className="manual-categories-container">
        {MEASUREMENT_CATEGORIES.map((category) => (
          <div key={category} className="measurement-category-block">
            <h3 className="category-block-title">{category}</h3>
            <div className="measurement-inputs-grid">
              {MANUAL_MEASUREMENT_FIELDS.filter((f) => f.category === category).map((field) => (
                <MeasurementFieldInput
                  key={field.id}
                  field={field}
                  value={form.drafts[field.id]}
                  unit={form.unit}
                  error={form.errors[field.id]}
                  note={cameraNote(field.id)}
                  onChange={(raw) => form.changeField(field.id, raw)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="manual-guidance-box" role="note">
        <Info size={16} className="guidance-icon" aria-hidden="true" />
        <p className="guidance-text">
          <strong>Tip for Tape Accuracy:</strong> Keep the tape snug but not tight against the body. Stand
          naturally without holding your breath or pulling in your stomach.
        </p>
      </div>

      <div className="manual-form-actions">
        <div className="form-actions-left">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={form.clearAll}>
            Clear Fields
          </Button>
          <Button variant="outline" size="sm" icon={Camera} onClick={onSwitchToCamera}>
            Use Camera Guidance
          </Button>
        </div>
        <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
          Review Measurements
        </Button>
      </div>
    </form>
  );
}
