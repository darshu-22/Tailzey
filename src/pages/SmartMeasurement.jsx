import React, { useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Home,
  Ruler,
  Camera,
  Sparkles,
} from 'lucide-react';
import MeasurementIntro from '../components/measurement/MeasurementIntro';
import SetupInstructions from '../components/measurement/SetupInstructions';
import CameraPreview from '../components/measurement/CameraPreview';
import CaptureStepper from '../components/measurement/CaptureStepper';
import PoseInstructionCard from '../components/measurement/PoseInstructionCard';
import MeasurementProgress from '../components/measurement/MeasurementProgress';
import ManualMeasurementForm from '../components/measurement/ManualMeasurementForm';
import MeasurementReview from '../components/measurement/MeasurementReview';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { CAPTURE_STEPS } from '../data/measurementData';

/**
 * SmartMeasurement Page Component (Phase 4)
 * Coordinates the full guided smart measurement workflow:
 * 1. Intro & Consent
 * 2. Setup & Framing
 * 3. 6-Pose Guided Camera Capture Sequence
 * 4. Processing Simulation Screen
 * 5. Manual Measurement Fallback
 * 6. Honest Results Preview
 */
export default function SmartMeasurement({
  measurementSession = {},
  onUpdateMeasurementSession,
  onNavigate,
  onOpenPhaseNotice,
}) {
  // Screen state: 'intro' | 'setup' | 'capture' | 'progress' | 'manual' | 'review'
  const [currentScreen, setCurrentScreen] = useState('intro');

  // Guided Capture Sequence State
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [capturedImages, setCapturedImages] = useState({});
  const [skippedSteps, setSkippedSteps] = useState({});
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Manual Measurement Form State
  const [manualValues, setManualValues] = useState(() => measurementSession?.manualValues || {});
  const [manualUnit, setManualUnit] = useState(() => measurementSession?.manualUnit || 'cm');

  // Review screen source tracker: 'camera' | 'manual' | 'both'
  const [sessionType, setSessionType] = useState('camera');

  const currentStep = CAPTURE_STEPS[activeStepIndex];

  // Capture frame handler
  const handleCaptureFrame = (dataUrl) => {
    const key = currentStep.key;
    setCapturedImages((prev) => ({
      ...prev,
      [key]: dataUrl,
    }));
    // Remove from skipped if was previously skipped
    setSkippedSteps((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    // Automatically advance to next pose if not on last step
    if (activeStepIndex < CAPTURE_STEPS.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  // Skip current pose
  const handleSkipPose = () => {
    const key = currentStep.key;
    setSkippedSteps((prev) => ({
      ...prev,
      [key]: true,
    }));

    if (activeStepIndex < CAPTURE_STEPS.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      // Finished all steps
      setSessionType('camera');
      setCurrentScreen('progress');
    }
  };

  // Retake specific pose
  const handleRetakePose = (key) => {
    setCapturedImages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSkippedSteps((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    const targetIdx = CAPTURE_STEPS.findIndex((s) => s.key === key);
    if (targetIdx !== -1) {
      setActiveStepIndex(targetIdx);
      setCurrentScreen('capture');
    }
  };

  // Advance to processing sequence
  const handleFinishCaptureSequence = () => {
    setIsCameraActive(false);
    setSessionType('camera');
    if (onUpdateMeasurementSession) {
      onUpdateMeasurementSession({
        ...measurementSession,
        cameraCaptureCount: Object.keys(capturedImages).length,
        isCameraCompleted: Object.keys(capturedImages).length >= 6,
        skippedCount: Object.keys(skippedSteps).length,
      });
    }
    setCurrentScreen('progress');
  };

  // Manual form submission
  const handleManualSubmit = (enteredValues, enteredUnit) => {
    setManualValues(enteredValues);
    setManualUnit(enteredUnit);
    setSessionType(Object.keys(capturedImages).length > 0 ? 'both' : 'manual');
    if (onUpdateMeasurementSession) {
      onUpdateMeasurementSession({
        ...measurementSession,
        manualValues: enteredValues,
        manualUnit: enteredUnit,
        cameraCaptureCount: Object.keys(capturedImages).length,
        isCameraCompleted: Object.keys(capturedImages).length >= 6,
        skippedCount: Object.keys(skippedSteps).length,
      });
    }
    setCurrentScreen('review');
  };

  return (
    <div className="measurement-page-wrapper">
      {/* Top Atelier Navigation Header */}
      <header className="measurement-header" role="banner">
        <div className="measurement-header-left">
          <a
            href="#dashboard"
            className="measurement-brand-link"
            onClick={(e) => {
              e.preventDefault();
              setIsCameraActive(false);
              if (onNavigate) onNavigate('dashboard');
            }}
            aria-label="Back to Dashboard"
          >
            <img
              src="/assets/tailzy-logo.png"
              alt="Tailzey Monogram"
              className="measurement-brand-logo"
            />
            <div className="measurement-brand-info">
              <span className="measurement-brand-title">TAILZEY</span>
              <span className="measurement-brand-subtitle">SMART MEASUREMENT ATELIER</span>
            </div>
          </a>

          <StatusBadge variant="gold" dot className="measurement-phase-badge">
            Guided Fit Calibration
          </StatusBadge>
        </div>

        {/* Right Header Navigation Actions */}
        <div className="measurement-header-right">
          <Button
            variant="ghost"
            size="sm"
            icon={LayoutDashboard}
            onClick={() => {
              setIsCameraActive(false);
              if (onNavigate) onNavigate('dashboard');
            }}
            ariaLabel="Return to Dashboard"
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Home}
            onClick={() => {
              setIsCameraActive(false);
              if (onNavigate) onNavigate('home');
            }}
            ariaLabel="Return to Website Home"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Main Measurement Content Area */}
      <main className="measurement-main-container" id="main-content">
        {/* SCREEN 1: INTRO & CONSENT */}
        {currentScreen === 'intro' && (
          <MeasurementIntro
            onStartCamera={() => setCurrentScreen('setup')}
            onStartManual={() => setCurrentScreen('manual')}
            onBack={() => onNavigate && onNavigate('dashboard')}
          />
        )}

        {/* SCREEN 2: SETUP & FRAMING CHECKLIST */}
        {currentScreen === 'setup' && (
          <SetupInstructions
            onProceed={() => {
              setIsCameraActive(true);
              setCurrentScreen('capture');
            }}
            onManual={() => setCurrentScreen('manual')}
            onBack={() => setCurrentScreen('intro')}
          />
        )}

        {/* SCREEN 3: 6-STEP GUIDED CAMERA CAPTURE */}
        {currentScreen === 'capture' && (
          <section className="capture-flow-section" aria-label="Guided Camera Capture Flow">
            {/* Top Stepper Track with Thumbnails */}
            <CaptureStepper
              activeStepIndex={activeStepIndex}
              capturedImages={capturedImages}
              skippedSteps={skippedSteps}
              onSelectStep={(idx) => setActiveStepIndex(idx)}
              onRetakeStep={handleRetakePose}
            />

            {/* Split View: Live Viewfinder + Instructions Card */}
            <div className="capture-workspace-grid">
              <div className="capture-viewfinder-column">
                <CameraPreview
                  activeStep={currentStep}
                  onCaptureFrame={handleCaptureFrame}
                  onSwitchToManual={() => {
                    setIsCameraActive(false);
                    setCurrentScreen('manual');
                  }}
                  isCameraActive={isCameraActive}
                  setIsCameraActive={setIsCameraActive}
                />
              </div>

              <div className="capture-instructions-column">
                <PoseInstructionCard
                  step={currentStep}
                  stepIndex={activeStepIndex}
                  totalSteps={CAPTURE_STEPS.length}
                  isCaptured={Boolean(capturedImages[currentStep.key])}
                  isSkipped={Boolean(skippedSteps[currentStep.key])}
                  onPrev={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  onNext={() =>
                    setActiveStepIndex((prev) =>
                      Math.min(CAPTURE_STEPS.length - 1, prev + 1)
                    )
                  }
                  onSkip={handleSkipPose}
                  onRetake={() => handleRetakePose(currentStep.key)}
                  onFinishSequence={handleFinishCaptureSequence}
                />

                {/* Exit / Switch Helper Bar */}
                <div className="capture-helper-nav">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={() => {
                      setIsCameraActive(false);
                      setCurrentScreen('setup');
                    }}
                  >
                    Back to Setup
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Ruler}
                    onClick={() => {
                      setIsCameraActive(false);
                      setCurrentScreen('manual');
                    }}
                  >
                    Switch to Manual Entry
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 4: PROCESSING SIMULATION */}
        {currentScreen === 'progress' && (
          <MeasurementProgress
            capturedImages={capturedImages}
            skippedSteps={skippedSteps}
            onContinueToResults={() => setCurrentScreen('review')}
            onRetakeSession={() => {
              setIsCameraActive(true);
              setActiveStepIndex(0);
              setCurrentScreen('capture');
            }}
          />
        )}

        {/* SCREEN 5: MANUAL MEASUREMENT FORM */}
        {currentScreen === 'manual' && (
          <ManualMeasurementForm
            initialValues={manualValues}
            initialUnit={manualUnit}
            onSubmit={handleManualSubmit}
            onSwitchToCamera={() => {
              setIsCameraActive(true);
              setCurrentScreen('setup');
            }}
            onBack={() => setCurrentScreen('intro')}
          />
        )}

        {/* SCREEN 6: HONEST RESULTS PREVIEW */}
        {currentScreen === 'review' && (
          <MeasurementReview
            sessionType={sessionType}
            capturedImages={capturedImages}
            skippedSteps={skippedSteps}
            manualValues={manualValues}
            manualUnit={manualUnit}
            onEditManual={() => setCurrentScreen('manual')}
            onRetakeCamera={() => {
              setIsCameraActive(true);
              setActiveStepIndex(0);
              setCurrentScreen('capture');
            }}
            onReturnDashboard={() => onNavigate && onNavigate('dashboard')}
            onGoToDesigner={() => onNavigate && onNavigate('designer')}
            onGoToResults={() => onNavigate && onNavigate('results')}
          />
        )}
      </main>
    </div>
  );
}
