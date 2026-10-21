import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { getColorById, getFitById } from '../../../shared/data/designerData';
import { useDesignEditor } from '../hooks/useDesignEditor';
import GarmentSilhouetteSvg from '../../../shared/garments/preview/GarmentSilhouetteSvg';
import DesignSummary from './DesignSummary';

/**
 * Live illustration of the workspace design on a quiet stage, with a full / close-up toggle
 * and a one-line summary of the choices. Clearly labelled as an illustration, not a
 * pattern or a body model.
 */
export default function GarmentPreview() {
  const [isDetailView, setIsDetailView] = useState(false);
  const { design, garment, options } = useDesignEditor();
  const color = getColorById(design.colorId);
  const fit = getFitById(design.fitId);

  return (
    <figure className="designer-stage">
      <div className="designer-stage-canvas">
        <GarmentSilhouetteSvg
          garmentId={design.garmentId}
          color={color}
          fitId={design.fitId}
          options={options}
          isDetailView={isDetailView}
          label={`Illustration of a ${fit.name.toLowerCase()} fit ${garment.name.toLowerCase()} in ${color.name}`}
        />
        <span className="designer-stage-tag">Live preview</span>
        <button
          type="button"
          className="designer-stage-zoom"
          onClick={() => setIsDetailView((v) => !v)}
          aria-pressed={isDetailView}
        >
          {isDetailView ? <ZoomOut size={16} aria-hidden="true" /> : <ZoomIn size={16} aria-hidden="true" />}
          <span>Close-up</span>
        </button>
      </div>

      <figcaption className="designer-stage-caption">
        <DesignSummary />
        <p className="designer-stage-note">Illustration only — not a sewing pattern or a model of your body.</p>
      </figcaption>
    </figure>
  );
}
