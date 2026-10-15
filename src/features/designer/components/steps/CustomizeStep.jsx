import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Button from '../../../../shared/ui/Button';
import { useDesignEditor } from '../../hooks/useDesignEditor';
import ColorSwatches from '../ColorSwatches';
import StyleSelector from '../StyleSelector';
import FitSelector from '../FitSelector';
import CustomOptionGroup from '../CustomOptionGroup';
import GarmentPreview from '../GarmentPreview';
import DesignSummary from '../DesignSummary';
import StepIntro from './StepIntro';

/** Step 2: colour, mood, fit and garment-specific options beside a live preview and summary. */
export default function CustomizeStep({ onBack, onReview, onOpen3D }) {
  const { design, garment, options, setColor, setStyle, setFit, setOption, resetToDefaults } = useDesignEditor();

  return (
    <section className="designer-step-section" aria-label="Step 2: Customize style">
      <StepIntro
        step={2}
        pill={`${garment.name} Customization`}
        title={
          <>
            Sculpt Your <span className="text-gold-gradient">{garment.name}</span>
          </>
        }
        description="Refine palette tones, style mood, tailored fit profile, and category craftsmanship details in real time."
      />

      <div className="designer-workspace-layout">
        <div className="customization-controls-panel">
          <div className="panel-title-bar">
            <h2 className="panel-title">Craftsmanship Controls</h2>
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetToDefaults} ariaLabel="Reset design options">
              Reset
            </Button>
          </div>

          <ColorSwatches selectedColorId={design.colorId} onColorChange={setColor} />
          <div className="panel-divider" aria-hidden="true" />
          <StyleSelector selectedStyleId={design.styleId} onStyleChange={setStyle} />
          <div className="panel-divider" aria-hidden="true" />
          <FitSelector selectedFitId={design.fitId} onFitChange={setFit} />
          <div className="panel-divider" aria-hidden="true" />

          <div className="category-attributes-container">
            <h3 className="category-attributes-heading">{garment.name} Tailoring Details</h3>
            {Object.entries(garment.customControls || {}).map(([key, config]) => (
              <CustomOptionGroup
                key={key}
                controlKey={key}
                controlConfig={config}
                selectedValue={options[key]}
                onChange={setOption}
              />
            ))}
          </div>
        </div>

        <div className="workspace-preview-panel">
          <GarmentPreview onOpen3DViewer={onOpen3D} />
        </div>

        <div className="workspace-summary-panel">
          <DesignSummary onReview={onReview} />
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={onBack} className="summary-back-btn">
            Change Silhouette ({garment.name})
          </Button>
        </div>
      </div>
    </section>
  );
}
