import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Ruler } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import CameraPreview from './CameraPreview';
import CaptureGuidePanel from './CaptureGuidePanel';

/**
 * Step 2 (full-height tool page): the live viewfinder is the hero, with a compact guidance
 * panel beside it on desktop and below it on phones. Hands-free mode captures every view
 * automatically and starts the analysis after the last one.
 */
export default function CaptureScreen({ session, onAnalyse, onBack, onSwitchToManual }) {
  const { activeStep, images } = session;
  const [handsFree, setHandsFree] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [finishWhenCaptured, setFinishWhenCaptured] = useState(false);
  const analysisStarted = useRef(false);

  const handleCapture = (dataUrl) => {
    session.capture(dataUrl);
    if (handsFree && session.isLastStep) setFinishWhenCaptured(true);
  };

  // Analyse once the final hands-free photo has landed in the session.
  const lastPhotoTaken = Boolean(images[activeStep.key]) && session.isLastStep;
  useEffect(() => {
    if (!finishWhenCaptured || !lastPhotoTaken || !session.canAnalyse || analysisStarted.current) return;
    analysisStarted.current = true;
    onAnalyse();
  }, [finishWhenCaptured, lastPhotoTaken, session.canAnalyse, onAnalyse]);

  return (
    <div className="page-tool capture-tool">
      <div className="capture-topbar">
        <div className="capture-topbar-text">
          <p className="eyebrow">Step 2 of 4</p>
          <h1 className="capture-title">Take your photos</h1>
        </div>
        <div className="capture-topbar-actions">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <Button variant="outline" size="sm" icon={Ruler} onClick={onSwitchToManual}>
            Enter manually
          </Button>
        </div>
      </div>

      <div className="capture-layout">
        <CameraPreview
          activeStep={activeStep}
          hasPhoto={Boolean(images[activeStep.key])}
          handsFree={handsFree}
          voiceOn={voiceOn}
          onToggleHandsFree={() => setHandsFree((v) => !v)}
          onToggleVoice={() => setVoiceOn((v) => !v)}
          onCaptureFrame={handleCapture}
          onSwitchToManual={onSwitchToManual}
        />
        <CaptureGuidePanel session={session} handsFree={handsFree} onAnalyse={onAnalyse} />
      </div>
    </div>
  );
}
