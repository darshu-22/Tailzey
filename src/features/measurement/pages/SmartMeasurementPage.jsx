import React, { useState } from 'react';
import { Camera, Ruler } from 'lucide-react';
import { useRouter, useWorkspace } from '../../../app/hooks';
import { convertValue, isMissing } from '../../../shared/utils/units';
import Button from '../../../shared/ui/Button';
import PageHeader from '../../../shared/ui/PageHeader';
import MeasureSteps from '../components/MeasureSteps';
import BeforeYouStart from '../components/BeforeYouStart';
import CaptureScreen from '../components/CaptureScreen';
import MeasurementProgress from '../components/MeasurementProgress';
import ManualMeasurementForm from '../components/ManualMeasurementForm';
import MeasurementReview from '../components/MeasurementReview';
import { useCaptureSession } from '../hooks/useCaptureSession';
import { useMeasurementAnalysis } from '../hooks/useMeasurementAnalysis';

const SCREENS = {
  intro: {
    step: 0,
    title: 'Measure your body',
    description: 'Four guided photos give you estimates with an honest ± range. Prefer a tape measure? Enter your numbers instead.',
  },
  analysing: { step: 2, title: 'Analysing your photos', description: 'This usually takes a few seconds.' },
  review: { step: 3, title: 'Review your measurements', description: 'Check each value and where it came from before choosing a size.' },
  manual: {
    step: null,
    title: 'Enter your measurements',
    description: 'Measure with a flexible tape. Leave a field empty if you haven’t measured it; nothing is filled in for you.',
  },
};

/**
 * Measurement flow: before you start (height + consent) → capture → analysing → review,
 * with manual tape entry reachable from every step. Results go into the shared workspace;
 * photos stay in this page's memory except for the analysis request.
 */
export default function SmartMeasurementPage() {
  const { navigate } = useRouter();
  const { measurement, applyCameraAnalysis, updateMeasurement } = useWorkspace();
  const [screen, setScreen] = useState('intro'); // intro | capture | analysing | review | manual
  const [manualReturn, setManualReturn] = useState('intro');
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

  const openManual = () => {
    analysis.cancel();
    setManualReturn(screen === 'review' ? 'review' : 'intro');
    setScreen('manual');
  };
  const openCamera = () => setScreen(consented && hasHeight ? 'capture' : 'intro');
  const retakeView = (key) => {
    session.retake(key);
    setScreen('capture');
  };

  if (screen === 'capture') {
    return (
      <CaptureScreen
        session={session}
        onAnalyse={startAnalysis}
        onBack={() => setScreen('intro')}
        onSwitchToManual={openManual}
      />
    );
  }

  const copy = SCREENS[screen];
  const headerAction =
    screen === 'manual' ? (
      <Button variant="outline" icon={Camera} onClick={openCamera}>
        Use the camera
      </Button>
    ) : (
      <Button variant="outline" icon={Ruler} onClick={openManual}>
        Enter manually
      </Button>
    );

  return (
    <div className={`page measure-page is-${screen}`}>
      <PageHeader className="measure-head" title={copy.title} description={copy.description} actions={headerAction} />
      {copy.step !== null && <MeasureSteps current={copy.step} />}

      <div className="measure-body">
        {screen === 'intro' && (
          <BeforeYouStart consented={consented} onConsentChange={setConsented} onStart={() => setScreen('capture')} />
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
          />
        )}

        {screen === 'manual' && (
          <ManualMeasurementForm onSubmitted={() => setScreen('review')} onCancel={() => setScreen(manualReturn)} />
        )}

        {screen === 'review' && (
          <MeasurementReview
            images={session.images}
            onRetakeView={retakeView}
            onEditManual={openManual}
            onContinue={() => {
              session.clear();
              navigate('results');
            }}
          />
        )}
      </div>
    </div>
  );
}
