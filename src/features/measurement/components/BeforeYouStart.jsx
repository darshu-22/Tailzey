import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useWorkspace } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';
import UnitToggle from '../../../shared/measurements/UnitToggle';
import BustToggle from '../../../shared/measurements/BustToggle';
import MeasurementFieldInput from './MeasurementFieldInput';
import SetupChecklist from './SetupChecklist';
import { useHeightField } from '../hooks/useHeightField';

/**
 * Step 1: barefoot height (it sets the scale for every photo), consent to in-memory
 * server analysis, and a short setup checklist. The camera only starts after this.
 */
export default function BeforeYouStart({ consented, onConsentChange, onStart }) {
  const height = useHeightField();
  const { measurement, setIncludeBust } = useWorkspace();
  const [consentError, setConsentError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const heightOk = height.commit();
    if (!consented) setConsentError('Please agree to the photo analysis to use the camera.');
    if (heightOk && consented) onStart();
  };

  const handleConsent = (checked) => {
    onConsentChange(checked);
    if (checked) setConsentError(null);
  };

  return (
    <div className="before-grid">
      <form className="card measure-card before-form" onSubmit={handleSubmit} noValidate aria-labelledby="before-title">
        <div className="measure-card-head">
          <h2 id="before-title" className="measure-card-title">
            Your height
          </h2>
          <UnitToggle unit={height.unit} onChange={height.changeUnit} label="Height unit" />
        </div>
        <p className="measure-card-text">
          Photos can’t show absolute size, so your barefoot height sets the scale for every other measurement.
        </p>

        <MeasurementFieldInput
          field={height.field}
          value={height.draft}
          unit={height.unit}
          error={height.error}
          required
          onChange={height.change}
        />

        <BustToggle checked={measurement.includeBust} onChange={setIncludeBust} />

        <div className="consent-block">
          <label className="consent-label">
            <input
              type="checkbox"
              className="consent-checkbox"
              checked={consented}
              onChange={(e) => handleConsent(e.target.checked)}
              aria-invalid={Boolean(consentError)}
              aria-describedby={consentError ? 'consent-error' : undefined}
            />
            <span>
              I agree that my photos are sent securely to Tailzey and analysed in memory to estimate my
              measurements. They are never stored, logged or returned.
            </span>
          </label>
          {consentError && (
            <p id="consent-error" className="form-error-text" role="alert">
              {consentError}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" icon={Camera} className="before-submit">
          Start the camera
        </Button>
      </form>

      <SetupChecklist />
    </div>
  );
}
