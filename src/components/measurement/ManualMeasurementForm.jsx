import React, { useState } from 'react';
import {
  Ruler,
  Camera,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RotateCcw,
  Info,
  Check,
} from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { MANUAL_MEASUREMENT_FIELDS } from '../../data/measurementData';

/**
 * ManualMeasurementForm Component
 * Provides structured entry for candidate body measurements with unit conversion (cm/in),
 * positive numerical validation, and field-level error reporting.
 */
export default function ManualMeasurementForm({
  initialValues = {},
  initialUnit = 'cm',
  onSubmit,
  onSwitchToCamera,
  onBack,
  className = '',
}) {
  const [unit, setUnit] = useState(initialUnit);
  const [values, setValues] = useState(() => {
    const defaults = {};
    MANUAL_MEASUREMENT_FIELDS.forEach((f) => {
      defaults[f.id] = initialValues[f.id] || '';
    });
    return defaults;
  });
  const [errors, setErrors] = useState({});

  // Handle unit change and convert any entered values smoothly
  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;

    const converted = {};
    Object.entries(values).forEach(([k, v]) => {
      if (!v || isNaN(v)) {
        converted[k] = '';
      } else {
        const num = parseFloat(v);
        if (newUnit === 'in') {
          // cm -> in
          converted[k] = (num / 2.54).toFixed(1);
        } else {
          // in -> cm
          converted[k] = Math.round(num * 2.54).toString();
        }
      }
    });

    setUnit(newUnit);
    setValues(converted);
    setErrors({});
  };

  const handleInputChange = (fieldId, val) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: val,
    }));

    // Clear error for field on change
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateField = (field, rawVal) => {
    if (!rawVal || rawVal.trim() === '') {
      return null; // optional or empty
    }

    const num = parseFloat(rawVal);
    if (isNaN(num) || num <= 0) {
      return `${field.label} must be a positive number.`;
    }

    const min = unit === 'cm' ? field.minCm : field.minIn;
    const max = unit === 'cm' ? field.maxCm : field.maxIn;

    if (num < min || num > max) {
      return `Expected value between ${min} and ${max} ${unit}.`;
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasAtLeastOne = false;

    MANUAL_MEASUREMENT_FIELDS.forEach((field) => {
      const val = values[field.id];
      if (val && val.trim() !== '') {
        hasAtLeastOne = true;
        const err = validateField(field, val);
        if (err) newErrors[field.id] = err;
      }
    });

    if (!hasAtLeastOne) {
      newErrors['form'] = 'Please enter at least one measurement before submitting for review.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values, unit);
  };

  const handleClearAll = () => {
    const cleared = {};
    MANUAL_MEASUREMENT_FIELDS.forEach((f) => {
      cleared[f.id] = '';
    });
    setValues(cleared);
    setErrors({});
  };

  // Group fields by category for clean visual hierarchy
  const categories = ['Stature', 'Upper Body', 'Torso', 'Lower Body'];

  return (
    <form
      className={`manual-measurement-form ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Manual Measurement Form"
    >
      {/* Header */}
      <div className="manual-form-header">
        <div className="manual-header-titles">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <StatusBadge variant="gold" dot>
              Manual Entry
            </StatusBadge>
            <StatusBadge variant="neutral">
              Tape Measurement
            </StatusBadge>
          </div>
          <h2 className="manual-form-title">
            Enter Your Tailored <span className="text-gold-gradient">Proportions</span>
          </h2>
          <p className="manual-form-subtitle">
            Provide your body measurements using a flexible tailor's tape. All values remain strictly in component memory.
          </p>
        </div>

        {/* Unit Selector Toggle */}
        <div className="unit-toggle-container" role="radiogroup" aria-label="Measurement Unit">
          <button
            type="button"
            role="radio"
            aria-checked={unit === 'cm'}
            className={`unit-toggle-btn ${unit === 'cm' ? 'is-active' : ''}`}
            onClick={() => handleUnitToggle('cm')}
          >
            Centimetres (cm)
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={unit === 'in'}
            className={`unit-toggle-btn ${unit === 'in' ? 'is-active' : ''}`}
            onClick={() => handleUnitToggle('in')}
          >
            Inches (in)
          </button>
        </div>
      </div>

      {/* Global Form Error if empty */}
      {errors['form'] && (
        <div className="form-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{errors['form']}</span>
        </div>
      )}

      {/* Field Groups */}
      <div className="manual-categories-container">
        {categories.map((category) => {
          const categoryFields = MANUAL_MEASUREMENT_FIELDS.filter(
            (f) => f.category === category
          );

          return (
            <div key={category} className="measurement-category-block">
              <h3 className="category-block-title">{category}</h3>

              <div className="measurement-inputs-grid">
                {categoryFields.map((field) => {
                  const errorMsg = errors[field.id];

                  return (
                    <div
                      key={field.id}
                      className={`measurement-field-card ${errorMsg ? 'has-error' : ''}`}
                    >
                      <label htmlFor={`field-${field.id}`} className="field-label">
                        {field.label}
                      </label>
                      <span className="field-desc">{field.description}</span>

                      <div className="field-input-wrap">
                        <input
                          id={`field-${field.id}`}
                          type="number"
                          step="0.1"
                          min="0"
                          value={values[field.id]}
                          placeholder={field.placeholder}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="measurement-number-input"
                          aria-invalid={Boolean(errorMsg)}
                          aria-describedby={errorMsg ? `error-${field.id}` : undefined}
                        />
                        <span className="field-unit-badge">{unit}</span>
                      </div>

                      {errorMsg && (
                        <p id={`error-${field.id}`} className="field-error-text" role="alert">
                          <AlertCircle size={13} />
                          <span>{errorMsg}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Guidance Notice */}
      <div className="manual-guidance-box" role="note">
        <Info size={16} className="guidance-icon" aria-hidden="true" />
        <p className="guidance-text">
          <strong>Tip for Tape Accuracy:</strong> Keep the measuring tape snug but not tight against the body. Stand naturally without holding your breath or pulling in your stomach.
        </p>
      </div>

      {/* Form Action Footer */}
      <div className="manual-form-actions">
        <div className="form-actions-left">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={onBack}
            ariaLabel="Return to previous screen"
          >
            Back
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleClearAll}
            ariaLabel="Clear all entered measurements"
          >
            Clear Fields
          </Button>

          {onSwitchToCamera && (
            <Button
              variant="outline"
              size="sm"
              icon={Camera}
              onClick={onSwitchToCamera}
              ariaLabel="Switch back to camera capture flow"
            >
              Use Camera Guidance
            </Button>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          ariaLabel="Submit entered measurements for review"
        >
          Review Measurements
        </Button>
      </div>
    </form>
  );
}
