import React, { useEffect } from 'react';
import { FileText, Sparkles, X } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { GARMENT_CATEGORIES, FIT_PREFERENCES } from '../../../shared/data/resultsData';
import { isMissing } from '../../../shared/utils/units';
import { withAdjustment } from '../lib/studioMath';

/** Specification sheet dialog: every measurement with its ease and the chosen size and fit. */
export default function ReviewSummaryModal({ measurement, garmentId, onClose, onEdit, onContinue3D }) {
  const { values, adjustments, unit, selectedSize, selectedSizeType, fitPreference } = measurement;
  const garment = GARMENT_CATEGORIES.find((g) => g.id === garmentId);
  const fit = FIT_PREFERENCES.find((f) => f.id === fitPreference);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="results-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-review-summary-title">
      <div className="results-modal-card results-review-modal-card">
        <div className="results-modal-header">
          <div className="modal-icon-wrapper">
            <FileText size={24} className="modal-icon" />
          </div>
          <div>
            <StatusBadge variant="gold">Atelier Sizing Sheet</StatusBadge>
            <h3 id="modal-review-summary-title" className="modal-title">
              Specification Review
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close summary review">
            <X size={20} />
          </button>
        </div>

        <div className="results-modal-body">
          <div className="modal-review-overview-grid">
            <div className="modal-review-item">
              <span className="modal-review-label">Garment Silhouette:</span>
              <span className="modal-review-val highlight">{garment?.name}</span>
            </div>
            <div className="modal-review-item">
              <span className="modal-review-label">Exploratory Size:</span>
              <span className="modal-review-val highlight">
                {selectedSize} ({selectedSizeType})
              </span>
            </div>
            <div className="modal-review-item">
              <span className="modal-review-label">Fit Drape:</span>
              <span className="modal-review-val">{fit?.name}</span>
            </div>
            <div className="modal-review-item">
              <span className="modal-review-label">Active Unit:</span>
              <span className="modal-review-val">{unit === 'cm' ? 'Centimetres (cm)' : 'Inches (in)'}</span>
            </div>
          </div>

          <div className="modal-review-table-container">
            <table className="modal-review-table">
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Base Value</th>
                  <th>Tailoring Ease</th>
                  <th>Resulting Dimension</th>
                </tr>
              </thead>
              <tbody>
                {MANUAL_MEASUREMENT_FIELDS.map((field) => {
                  const base = values[field.id];
                  const adj = adjustments[field.id] || 0;
                  const missing = isMissing(base);
                  return (
                    <tr key={field.id}>
                      <td>
                        <strong>{field.label}</strong>
                      </td>
                      <td>{missing ? <span className="modal-review-missing">Not recorded</span> : `${base} ${unit}`}</td>
                      <td>{adj > 0 ? `+${adj} ${unit}` : 'No change'}</td>
                      <td>
                        {missing ? (
                          <span className="modal-review-missing">—</span>
                        ) : (
                          <strong className="modal-review-result">
                            {withAdjustment(base, adj)} {unit}
                          </strong>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="modal-review-footnote">
            Sizes are exploratory benchmarks, not a fit guarantee. Use “Save Measurements” to keep these values
            in your account.
          </p>
        </div>

        <div className="results-modal-footer">
          <Button variant="outline" size="md" onClick={onEdit}>
            Edit Measurements
          </Button>
          <Button variant="primary" size="md" icon={Sparkles} onClick={onContinue3D}>
            Launch 3D Avatar Studio
          </Button>
        </div>
      </div>
    </div>
  );
}
