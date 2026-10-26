import { getColorById, getFitById, getStyleById } from '../../../shared/data/designerData';
import { describeOption } from '../../../shared/garments/options';
import { useDesignEditor } from '../hooks/useDesignEditor';

/**
 * Compact review of every choice in the workspace design: one line for the basics
 * ("Jacket · Navy · Formal · Slim fit") and one for the garment details.
 */
export default function DesignSummary() {
  const { design, garment, options } = useDesignEditor();
  const basics = [
    garment.name,
    getColorById(design.colorId).name,
    getStyleById(design.styleId).name,
    `${getFitById(design.fitId).name} fit`,
  ].join(' · ');
  const details = Object.keys(garment.customControls || {})
    .map((key) => describeOption(garment, key, options[key]).valueLabel)
    .join(' · ');

  return (
    <div className="designer-summary">
      <p className="designer-summary-basics">
        <span className="sr-only">Your design: </span>
        {basics}
      </p>
      {details && (
        <p className="designer-summary-details" title={details}>
          <span className="sr-only">Details: </span>
          {details}
        </p>
      )}
    </div>
  );
}
