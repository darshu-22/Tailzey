import React from 'react';
import { useRouter } from '../../../app/hooks';
import DesignerHeader from '../components/DesignerHeader';
import DesignSaveBar from '../components/DesignSaveBar';
import GarmentStep from '../components/steps/GarmentStep';
import CustomizeStep from '../components/steps/CustomizeStep';
import ReviewStep from '../components/steps/ReviewStep';
import { STEP, useDesignerSteps } from '../hooks/useDesignerSteps';
import { useDesignSave } from '../hooks/useDesignSave';

/**
 * Dream Outfit Designer: a three-step wizard (garment → customise → review) that edits
 * the workspace design in place and saves it to the user's account on demand.
 */
export default function DesignerPage() {
  const { navigate } = useRouter();
  const { currentStep, goTo } = useDesignerSteps();
  const saveState = useDesignSave();

  return (
    <div className="designer-page-wrapper">
      <DesignerHeader currentStep={currentStep} onStepChange={goTo} />

      <main className="designer-main-container" id="main-content">
        <DesignSaveBar saveState={saveState} />

        {currentStep === STEP.GARMENT && <GarmentStep onNext={() => goTo(STEP.CUSTOMIZE)} />}
        {currentStep === STEP.CUSTOMIZE && (
          <CustomizeStep
            onBack={() => goTo(STEP.GARMENT)}
            onReview={() => goTo(STEP.REVIEW)}
            onOpen3D={() => navigate('preview3d')}
          />
        )}
        {currentStep === STEP.REVIEW && <ReviewStep saveState={saveState} onBack={() => goTo(STEP.CUSTOMIZE)} />}
      </main>
    </div>
  );
}
