import React, { useState } from 'react';
import { useRouter } from '../../../app/hooks';
import SegmentedControl from '../../../shared/ui/SegmentedControl';
import FitHeader from '../components/FitHeader';
import MetricsSection from '../components/MetricsSection';
import SizeSelector from '../components/SizeSelector';
import FitPreferenceSelector from '../components/FitPreferenceSelector';
import MeasurementSummary from '../components/MeasurementSummary';
import { useMeasurementStudio } from '../hooks/useMeasurementStudio';
import { useProfileSave } from '../hooks/useProfileSave';

function tabOptions(errorCount) {
  return [
    { value: 'measurements', label: errorCount ? `Measurements · ${errorCount} to fix` : 'Measurements' },
    { value: 'size', label: 'Size & fit' },
  ];
}

/**
 * Fit & Size: edit the workspace measurements, add ease, choose an exploratory size and a
 * fit, and save everything to the account as a measurement profile. On laptops and up the
 * page is exactly one viewport tall; the active tab's panel scrolls on its own if needed.
 */
export default function MeasurementResultsPage() {
  const { navigate } = useRouter();
  const studio = useMeasurementStudio();
  const profile = useProfileSave();
  const [tab, setTab] = useState('measurements');
  const { measurement } = studio;
  const errorCount = Object.values(profile.errors.values).filter(Boolean).length;

  const handleSaveValue = (key, value) => {
    studio.saveValue(key, value);
    profile.clearValueError(key);
  };

  return (
    <div className="page fit-page">
      <FitHeader profile={profile} unit={measurement.unit} onUnitChange={studio.changeUnit} />

      <div className="fit-layout">
        <div className="fit-main">
          <SegmentedControl label="Show" options={tabOptions(errorCount)} value={tab} onChange={setTab} className="fit-tabs" />

          {tab === 'measurements' ? (
            <MetricsSection
              measurement={measurement}
              counts={studio.counts}
              valueErrors={profile.errors.values}
              onSave={handleSaveValue}
              onAdjustmentChange={studio.setAdjustment}
              onMeasure={() => navigate('measurement')}
            />
          ) : (
            <div className="card fit-panel fit-choices">
              <SizeSelector
                garmentId={studio.garmentId}
                onGarmentChange={studio.setGarmentId}
                selectedSize={measurement.selectedSize}
                selectedSizeType={measurement.selectedSizeType}
                onSizeChange={studio.selectSize}
                unit={measurement.unit}
              />
              <FitPreferenceSelector selectedFitId={measurement.fitPreference} onFitChange={studio.selectFit} />
            </div>
          )}
        </div>

        <MeasurementSummary
          measurement={measurement}
          garmentId={studio.garmentId}
          counts={studio.counts}
          onResetAdjustments={studio.resetAdjustments}
          onNavigate={navigate}
          onEditSize={() => setTab('size')}
        />
      </div>
    </div>
  );
}
