import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../shared/ui/Button';
import { GARMENTS } from '../../../../shared/data/designerData';
import { useDesignEditor } from '../../hooks/useDesignEditor';
import GarmentCard from '../GarmentCard';
import StepIntro from './StepIntro';

/** Step 1: pick the base garment. Switching garment resets its tailoring options to defaults. */
export default function GarmentStep({ onNext }) {
  const { design, garment, selectGarment } = useDesignEditor();

  return (
    <section className="designer-step-section" aria-label="Step 1: Choose garment">
      <StepIntro
        step={1}
        pill="Silhouette Selection"
        title={
          <>
            Choose Your Primary <span className="text-gold-gradient">Garment Silhouette</span>
          </>
        }
        description="Select the base bespoke piece you wish to personalize. Each silhouette features tailored proportions and artisanal options."
      />

      <div className="garments-grid" role="radiogroup" aria-label="Garment categories">
        {GARMENTS.map((g) => (
          <GarmentCard key={g.id} garment={g} isSelected={design.garmentId === g.id} onSelect={selectGarment} />
        ))}
      </div>

      <div className="step-action-bar">
        <div className="step-action-info">
          <span className="step-action-selected-text">
            Selected: <strong>{garment.name}</strong> ({garment.category})
          </span>
        </div>
        <Button variant="primary" size="lg" icon={ChevronRight} iconPosition="right" onClick={onNext}>
          Proceed to Customize Style
        </Button>
      </div>
    </section>
  );
}
