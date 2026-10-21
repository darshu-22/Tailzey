import { RotateCcw } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import GarmentPreview from '../components/GarmentPreview';
import DesignerTabs from '../components/DesignerTabs';
import { DetailChoices, GarmentChoices, StyleFitChoices } from '../components/DesignerControls';
import NextSteps from '../components/NextSteps';
import DesignSaveBar from '../components/DesignSaveBar';
import { useDesignEditor } from '../hooks/useDesignEditor';
import { useDesignSave } from '../hooks/useDesignSave';
import { useDesignerTabs } from '../hooks/useDesignerTabs';

/**
 * Outfit designer: a single-screen studio. The live preview sits on the left (top on mobile);
 * the choices are split into three tabs on the right. Continue and the name + Save form a
 * bottom action bar (desktop) / follow the tabs with a sticky save bar (mobile).
 * Edits go straight into the workspace design; Save stores it in the user's account.
 */
export default function DesignerPage() {
  const saveState = useDesignSave();
  const { garment, resetToDefaults } = useDesignEditor();
  const { tabs, activeId, setActiveId, errorTabs } = useDesignerTabs(saveState.fieldErrors);
  const { fieldErrors } = saveState;

  return (
    <div className="page-tool designer-page">
      <div className="designer-titlebar">
        <h1 className="designer-title">Design your outfit</h1>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={resetToDefaults}
          ariaLabel={`Reset ${garment.name.toLowerCase()} options`}
          title={`Reset ${garment.name.toLowerCase()} options to their defaults`}
        >
          Reset
        </Button>
      </div>

      <div className="designer-studio">
        <GarmentPreview />

        <div className="designer-panel">
          <DesignerTabs
            label="Design options"
            tabs={tabs}
            activeId={activeId}
            onChange={setActiveId}
            errorTabs={errorTabs}
            panels={{
              garment: <GarmentChoices fieldErrors={fieldErrors} />,
              style: <StyleFitChoices fieldErrors={fieldErrors} />,
              details: <DetailChoices fieldErrors={fieldErrors} />,
            }}
          />
        </div>

        <NextSteps />
        <DesignSaveBar saveState={saveState} />
      </div>
    </div>
  );
}
