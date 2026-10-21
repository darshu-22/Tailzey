import React from 'react';
import { Box, FileText, RotateCcw, Shirt } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { FIT_PREFERENCES, GARMENT_CATEGORIES } from '../../../shared/data/resultsData';

function cameraNote(measurement, estimated) {
  if (!measurement.isCameraCompleted) return 'No camera analysis is attached to these measurements.';
  return `${estimated} value${estimated === 1 ? '' : 's'} estimated from ${measurement.cameraCaptureCount} photos. Confirm important measurements with a tape.`;
}

/** Compact summary of the chosen size, fit and ease, with the next steps. */
export default function MeasurementSummary({ measurement, garmentId, counts, onResetAdjustments, onNavigate, onEditSize }) {
  const { adjustments, selectedSize, selectedSizeType, fitPreference } = measurement;
  const garment = GARMENT_CATEGORIES.find((g) => g.id === garmentId) || GARMENT_CATEGORIES[0];
  const fit = FIT_PREFERENCES.find((f) => f.id === fitPreference) || FIT_PREFERENCES[1];
  const adjustedCount = Object.values(adjustments).filter((a) => a > 0).length;
  const recorded = counts.entered + counts.estimated;
  const total = recorded + counts.missing;

  return (
    <aside className="card fit-summary" aria-labelledby="summary-title">
      <div className="fit-section-head">
        <h2 id="summary-title" className="fit-section-title">
          Summary
        </h2>
        <button type="button" className="fit-link" onClick={onEditSize}>
          Change size or fit
        </button>
      </div>

      <dl className="fit-summary-list">
        <div>
          <dt>Measurements</dt>
          <dd>
            {recorded} of {total} recorded
          </dd>
        </div>
        <div>
          <dt>Garment</dt>
          <dd>{garment.name}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>
            {selectedSize} <span className="fit-summary-sub">({selectedSizeType === 'numeric' ? 'numeric' : 'letter'})</span>
          </dd>
        </div>
        <div>
          <dt>Fit</dt>
          <dd>{fit.name}</dd>
        </div>
        <div>
          <dt>Ease</dt>
          <dd>{adjustedCount > 0 ? `${adjustedCount} adjusted` : 'None'}</dd>
        </div>
        <div>
          <dt>Saved</dt>
          <dd>{measurement.profileId ? 'Yes' : 'Not yet'}</dd>
        </div>
      </dl>

      <p className="fit-summary-note">{cameraNote(measurement, counts.estimated)}</p>

      <div className="fit-summary-actions">
        <Button icon={Shirt} onClick={() => onNavigate('try-on')}>
          Try it on
        </Button>
        <div className="fit-summary-pair">
          <Button variant="outline" size="sm" icon={Box} onClick={() => onNavigate('preview3d')}>
            View in 3D
          </Button>
          <Button variant="outline" size="sm" icon={FileText} onClick={() => onNavigate('design-report')}>
            Design report
          </Button>
        </div>
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onResetAdjustments} disabled={adjustedCount === 0}>
          Reset ease
        </Button>
      </div>
    </aside>
  );
}
