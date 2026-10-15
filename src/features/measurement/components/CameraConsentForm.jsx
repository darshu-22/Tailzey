import React from 'react';
import MeasurementFieldInput from './MeasurementFieldInput';
import UnitToggle from './UnitToggle';

/**
 * What camera analysis needs before any photo is taken: the user's barefoot height
 * (it sets the scale) and explicit consent to server-side, in-memory analysis.
 */
export default function CameraConsentForm({ height, consented, onConsentChange }) {
  return (
    <div className="camera-consent-form">
      <div className="intro-height-block">
        <div className="intro-height-header">
          <h3 className="intro-height-title">Your barefoot height</h3>
          <UnitToggle unit={height.unit} onChange={height.changeUnit} label="Height unit" />
        </div>
        <p className="intro-height-text">
          Photos cannot show absolute size, so your height sets the scale for every other
          measurement. Measure it barefoot for the best accuracy.
        </p>
        <MeasurementFieldInput
          field={height.field}
          value={height.draft}
          unit={height.unit}
          error={height.error}
          required
          onChange={height.change}
        />
      </div>

      <div className="measurement-consent-box">
        <label className="measurement-consent-label">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="measurement-consent-checkbox"
            aria-describedby="consent-description"
          />
          <span className="measurement-consent-text">
            I agree that the photos I take here are sent securely to the Tailzey server and analysed
            in memory to estimate my measurements. They are never stored, logged or returned, and are
            discarded as soon as the analysis finishes.
          </span>
        </label>
        <span id="consent-description" className="sr-only">
          Checking this box enables the Continue with Camera button.
        </span>
      </div>
    </div>
  );
}
