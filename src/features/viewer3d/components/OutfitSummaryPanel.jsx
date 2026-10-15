import React from 'react';
import { FileText, Info, LayoutDashboard, Palette, Sliders } from 'lucide-react';
import { useRouter, useWorkspace } from '../../../app/hooks';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import { getColorById, getFitById, getStyleById } from '../../../shared/data/designerData';
import { MANUAL_MEASUREMENT_FIELDS } from '../../../shared/data/measurementData';
import { isMissing } from '../../../shared/utils/units';
import { useDesignEditor } from '../../designer/hooks/useDesignEditor';
import OutfitQuickControls from './OutfitQuickControls';
import OutfitSpecList from './OutfitSpecList';

/**
 * Side panel of the 3D studio: quick garment / colour edits (written to the workspace),
 * the design + measurement summary, a sample-preview disclaimer and next steps.
 */
export default function OutfitSummaryPanel() {
  const { navigate } = useRouter();
  const { measurement } = useWorkspace();
  const { design, garment, selectGarment, setColor } = useDesignEditor();
  const color = getColorById(design.colorId);
  const recordedCount = MANUAL_MEASUREMENT_FIELDS.filter((f) => !isMissing(measurement.values[f.id])).length;

  return (
    <aside className="viewer3d-sidebar-panel" aria-label="Outfit and sizing summary">
      <div className="outfit-summary-sheet">
        <div className="summary-sheet-top">
          <div>
            <span className="summary-eyebrow">Atelier Studio Preview</span>
            <h3 className="summary-sheet-title">{design.name || 'Outfit Specification'}</h3>
          </div>
          <StatusBadge variant="gold" dot>
            Sample Preview
          </StatusBadge>
        </div>

        <OutfitQuickControls
          garmentId={design.garmentId}
          colorId={design.colorId}
          colorName={color.name}
          onGarmentChange={selectGarment}
          onColorChange={setColor}
        />

        <OutfitSpecList
          garment={garment}
          color={color}
          style={getStyleById(design.styleId)}
          fit={getFitById(design.fitId)}
          measurement={measurement}
          recordedCount={recordedCount}
          totalFields={MANUAL_MEASUREMENT_FIELDS.length}
        />

        <div className="sample-disclaimer-card" role="note">
          <Info size={16} className="disclaimer-icon" aria-hidden="true" />
          <p className="disclaimer-text">
            <strong>Sample preview only:</strong> your garment, colour and fit ease are shown on a standard
            dress-form mannequin. It is <strong>not</strong> a 3D scan of your body, and your measurements do
            not reshape it.
          </p>
        </div>

        <div className="sidebar-actions-stack">
          <Button variant="primary" size="md" icon={FileText} onClick={() => navigate('design-report')} className="sidebar-action-btn">
            Export Design Report
          </Button>
          <Button variant="outline" size="md" icon={Palette} onClick={() => navigate('designer')} className="sidebar-action-btn">
            Refine in Dream Designer
          </Button>
          <Button variant="outline" size="md" icon={Sliders} onClick={() => navigate('results')} className="sidebar-action-btn">
            Measurement Studio & Sizes
          </Button>
          <Button variant="ghost" size="sm" icon={LayoutDashboard} onClick={() => navigate('dashboard')} className="sidebar-action-btn">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </aside>
  );
}
