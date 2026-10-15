import React, { useState } from 'react';
import { useRouter, useWorkspace } from '../../../app/hooks';
import { convertValue, isMissing } from '../../../shared/utils/units';
import MeasurementHeader from '../components/MeasurementHeader';
import MeasurementIntro from '../components/MeasurementIntro';
import SetupInstructions from '../components/SetupInstructions';
import CaptureScreen from '../components/CaptureScreen';
import MeasurementProgress from '../components/MeasurementProgress';
import ManualMeasurementForm from '../components/ManualMeasurementForm';
import MeasurementReview from '../components/MeasurementReview';
import { useCaptureSession } from '../hooks/useCaptureSession';
import { useMeasurementAnalysis } from '../hooks/useMeasurementAnalysis';

/**
 * Smart measurement flow: intro (height + consent) → setup → guided capture →
 * server analysis → review, with manual tape entry available at every step.
 * Results go into the shared measurement workspace; photos never leave this page's
 * memory except for the analysis request, and are dropped when the page unmounts.
 */
export default function SmartMeasurementPage() {
  const { navigate } = useRouter();
  const { measurement, applyCameraAnalysis, updateMeasurement } = useWorkspace();
  const [screen, setScreen] = useState('intro'); // intro | setup | capture | analysing | manual | review
  const [consented, setConsented] = useState(false);
  const session = useCaptureSession();
  const analysis = useMeasurementAnalysis();

  const hasHeight = !isMissing(measurement.values.height);

  const startAnalysis = async () => {
    if (!consented || !hasHeight) {
      setScreen('intro');
      return;
    }
    setScreen('analysing');
    const result = await analysis.run({
      heightCm: convertValue(measurement.values.height, measurement.unit, 'cm'),
      images: session.images,
    });
    if (!result) return;
    applyCameraAnalysis(result, { captureCount: session.capturedCount });
    updateMeasurement({ skippedCount: session.skippedCount });
    setScreen('review');
  };

  const openCamera = () => setScreen(consented && hasHeight ? 'setup' : 'intro');

  const retakeView = (key) => {
    session.retake(key);
    setScreen('capture');
  };

  return (
    <div className="measurement-page-wrapper">
      <MeasurementHeader onNavigate={navigate} />

      <main className="measurement-main-container" id="main-content">
        {screen === 'intro' && (
          <MeasurementIntro
            consented={consented}
            onConsentChange={setConsented}
            onStartCamera={() => setScreen('setup')}
            onStartManual={() => setScreen('manual')}
            onBack={() => navigate('dashboard')}
          />
        )}

        {screen === 'setup' && (
          <SetupInstructions
            onProceed={() => setScreen('capture')}
            onManual={() => setScreen('manual')}
            onBack={() => setScreen('intro')}
          />
        )}

        {screen === 'capture' && (
          <CaptureScreen
            session={session}
            onAnalyse={startAnalysis}
            onBackToSetup={() => setScreen('setup')}
            onSwitchToManual={() => setScreen('manual')}
          />
        )}

        {screen === 'analysing' && (
          <MeasurementProgress
            status={analysis.status}
            error={analysis.error}
            images={session.images}
            onRetry={startAnalysis}
            onCancel={() => {
              analysis.cancel();
              setScreen('capture');
            }}
            onBackToCapture={() => setScreen('capture')}
            onManual={() => setScreen('manual')}
          />
        )}

        {screen === 'manual' && (
          <ManualMeasurementForm
            onSubmitted={() => setScreen('review')}
            onSwitchToCamera={openCamera}
            onBack={() => setScreen('intro')}
          />
        )}

        {screen === 'review' && (
          <MeasurementReview
            images={session.images}
            onRetakeView={retakeView}
            onEditManual={() => setScreen('manual')}
            onDashboard={() => navigate('dashboard')}
            onDesigner={() => navigate('designer')}
            onContinue={() => {
              session.clear();
              navigate('results');
            }}
          />
        )}
      </main>
    </div>
  );
}
