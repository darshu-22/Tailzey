import React, { useCallback, useState } from 'react';
import { useRouter } from '../../../app/hooks';
import ResultsHeader from '../components/ResultsHeader';
import ResultsHero from '../components/ResultsHero';
import MetricsSection, { METRICS_SECTION_ID } from '../components/MetricsSection';
import SizeSelector from '../components/SizeSelector';
import FitPreferenceSelector from '../components/FitPreferenceSelector';
import ProfileSaveCard from '../components/ProfileSaveCard';
import MeasurementSummary from '../components/MeasurementSummary';
import ResultsShortcuts from '../components/ResultsShortcuts';
import ReviewSummaryModal from '../components/ReviewSummaryModal';
import { useMeasurementStudio } from '../hooks/useMeasurementStudio';
import { useProfileSave } from '../hooks/useProfileSave';

const scrollToMetrics = () => document.getElementById(METRICS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });

/**
 * Measurement studio: edit the workspace measurements, add tailoring ease, choose an
 * exploratory size and fit, and save everything to the account as a profile.
 */
export default function MeasurementResultsPage() {
  const { navigate } = useRouter();
  const studio = useMeasurementStudio();
  const profile = useProfileSave();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { measurement } = studio;

  const handleSaveValue = (key, value) => {
    studio.saveValue(key, value);
    profile.clearValueError(key);
  };
  const closeReview = useCallback(() => setIsReviewOpen(false), []);

  return (
    <div className="measurement-results-page-wrapper">
      <ResultsHeader onNavigate={navigate} />

      <main className="results-main-container" id="main-content">
        <ResultsHero measurement={measurement} counts={studio.counts} onUnitChange={studio.changeUnit} />

        <div className="results-content-grid">
          <div className="results-cards-column">
            <MetricsSection
              measurement={measurement}
              valueErrors={profile.errors.values}
              onSave={handleSaveValue}
              onAdjustmentChange={studio.setAdjustment}
            />

            <div className="results-content-divider" aria-hidden="true" />

            <SizeSelector
              garmentId={studio.garmentId}
              onGarmentChange={studio.setGarmentId}
              selectedSize={measurement.selectedSize}
              selectedSizeType={measurement.selectedSizeType}
              onSizeChange={studio.selectSize}
              unit={measurement.unit}
            />

            <div className="results-content-divider" aria-hidden="true" />

            <FitPreferenceSelector selectedFitId={measurement.fitPreference} onFitChange={studio.selectFit} />
          </div>

          <div className="results-summary-column">
            <ProfileSaveCard profile={profile} />
            <MeasurementSummary
              measurement={measurement}
              garmentId={studio.garmentId}
              estimatedCount={studio.counts.estimated}
              onEditMeasurements={scrollToMetrics}
              onResetAdjustments={studio.resetAdjustments}
              onReviewSummary={() => setIsReviewOpen(true)}
              onContinue3D={() => navigate('preview3d')}
              onViewReport={() => navigate('design-report')}
            />
            <ResultsShortcuts onNavigate={navigate} />
          </div>
        </div>
      </main>

      {isReviewOpen && (
        <ReviewSummaryModal
          measurement={measurement}
          garmentId={studio.garmentId}
          onClose={closeReview}
          onEdit={() => {
            closeReview();
            scrollToMetrics();
          }}
          onContinue3D={() => navigate('preview3d')}
        />
      )}
    </div>
  );
}
