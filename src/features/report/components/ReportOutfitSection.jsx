import { getColorById, getFitById, getGarmentById, getStyleById } from '../../../shared/data/designerData';
import GarmentSilhouetteSvg from '../../../shared/garments/preview/GarmentSilhouetteSvg';
import { describeOption, resolveCustomOptions } from '../../../shared/garments/options';
import SpecList from './SpecList';

/** Section 1: the garment, its colour, style, fit and every garment-specific option. */
export default function ReportOutfitSection({ design }) {
  const garment = getGarmentById(design.garmentId);
  const color = getColorById(design.colorId);
  const style = getStyleById(design.styleId);
  const fit = getFitById(design.fitId);
  const options = resolveCustomOptions(design.garmentId, design.customOptions);

  const items = [
    { label: 'Garment', value: garment.name },
    {
      label: 'Colour',
      value: (
        <span className="report-colour">
          <svg viewBox="0 0 16 16" className="report-swatch" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill={color.hex} />
          </svg>
          {color.name}
        </span>
      ),
      sub: color.hex,
    },
    { label: 'Style', value: style.name, sub: style.tagline },
    { label: 'Fit', value: fit.name, sub: fit.subtitle },
    ...Object.keys(garment.customControls || {}).map((key) => {
      const detail = describeOption(garment, key, options[key]);
      return { label: detail.label, value: detail.valueLabel, sub: detail.subtext };
    }),
  ];

  return (
    <section className="report-section" aria-labelledby="report-outfit-title">
      <h2 id="report-outfit-title" className="report-section-title">
        Outfit
      </h2>
      <div className="report-outfit">
        <figure className="report-figure">
          <GarmentSilhouetteSvg
            garmentId={design.garmentId}
            color={color}
            fitId={design.fitId}
            options={options}
            label={`Illustration of the ${garment.name.toLowerCase()} in ${color.name}`}
          />
          <figcaption>Illustration only — not drawn from your body or measurements.</figcaption>
        </figure>
        <SpecList items={items} />
      </div>
    </section>
  );
}
