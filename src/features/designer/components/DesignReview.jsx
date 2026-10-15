import React from 'react';
import { BookmarkCheck, Check, Edit3, FileText, Ruler } from 'lucide-react';
import StatusBadge from '../../../shared/ui/StatusBadge';
import Button from '../../../shared/ui/Button';
import { useDesignEditor } from '../hooks/useDesignEditor';
import GarmentPreview from './GarmentPreview';
import DesignSpecSheet from './review/DesignSpecSheet';

/**
 * Step 3: full review of the design with save, edit and next-step actions.
 * @param {object} props.saveState result of useDesignSave()
 */
export default function DesignReview({ saveState, onEditDesign, onContinue, onViewReport }) {
  const { garment } = useDesignEditor();
  const { status, save, isSaving, nameError } = saveState;
  const isSaved = status === 'saved';

  return (
    <div className="design-review-wrapper">
      <div className="review-hero-header">
        <div className="review-title-group">
          <div className="review-badge-row">
            <StatusBadge variant="gold" dot>
              Atelier Review
            </StatusBadge>
          </div>
          <h2 className="review-main-title">
            Your Bespoke <span className="text-gold-gradient">{garment.name}</span> Specification
          </h2>
          <p className="review-sub-title">
            Review your design, save it to your account, then continue to measurements.
          </p>
        </div>
      </div>

      <div className="review-layout-grid">
        <div className="review-preview-col">
          <div className="review-preview-frame">
            <GarmentPreview />
          </div>
        </div>

        <div className="review-specs-col">
          <DesignSpecSheet saveStatus={status}>
            <div className="review-actions-bar">
              <Button variant="primary" size="lg" icon={Ruler} onClick={onContinue} className="review-continue-btn">
                Continue to Measurement
              </Button>

              <div className="review-secondary-actions">
                <Button variant="outline" size="md" icon={Edit3} onClick={onEditDesign}>
                  Edit Design
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={isSaved ? Check : BookmarkCheck}
                  onClick={save}
                  loading={isSaving}
                  disabled={Boolean(nameError) || isSaved}
                  title={nameError || undefined}
                >
                  {isSaved ? 'Saved' : 'Save design'}
                </Button>
                <Button variant="outline" size="md" icon={FileText} onClick={onViewReport}>
                  Design Report
                </Button>
              </div>
            </div>
          </DesignSpecSheet>
        </div>
      </div>
    </div>
  );
}
