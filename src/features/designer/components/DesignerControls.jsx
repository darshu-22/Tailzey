import { COLORS, FITS, GARMENTS, STYLES } from '../../../shared/data/designerData';
import { useDesignEditor } from '../hooks/useDesignEditor';
import ChoiceGroup from './ChoiceGroup';
import GarmentIcon from './GarmentIcon';

const GARMENT_OPTIONS = GARMENTS.map((g) => ({
  id: g.id,
  label: g.name,
  visual: <GarmentIcon garmentId={g.id} />,
}));

const COLOR_OPTIONS = COLORS.map((c) => ({
  id: c.id,
  label: c.name,
  visual: (
    <svg viewBox="0 0 32 32" className="designer-swatch" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill={c.hex} />
    </svg>
  ),
}));

const STYLE_OPTIONS = STYLES.map((s) => ({ id: s.id, label: s.name, subtext: s.tagline }));
const FIT_OPTIONS = FITS.map((f) => ({ id: f.id, label: f.name, subtext: f.subtitle }));

/**
 * The editable choices of the design, one component per designer tab. Server validation
 * errors (422 fieldErrors) are shown next to the matching group.
 * @param {object} props.fieldErrors from useDesignSave()
 */
export function GarmentChoices({ fieldErrors = {} }) {
  const { design, selectGarment, setColor } = useDesignEditor();
  return (
    <>
      <ChoiceGroup
        title="Garment"
        variant="tiles"
        options={GARMENT_OPTIONS}
        value={design.garmentId}
        onChange={selectGarment}
        error={fieldErrors.garmentId}
      />
      <ChoiceGroup
        title="Colour"
        variant="swatches"
        options={COLOR_OPTIONS}
        value={design.colorId}
        onChange={setColor}
        error={fieldErrors.colorId}
      />
    </>
  );
}

export function StyleFitChoices({ fieldErrors = {} }) {
  const { design, setStyle, setFit } = useDesignEditor();
  return (
    <>
      <ChoiceGroup title="Style" options={STYLE_OPTIONS} value={design.styleId} onChange={setStyle} error={fieldErrors.styleId} />
      <ChoiceGroup title="Fit" options={FIT_OPTIONS} value={design.fitId} onChange={setFit} error={fieldErrors.fitId} />
    </>
  );
}

export function DetailChoices({ fieldErrors = {} }) {
  const { garment, options, setOption } = useDesignEditor();
  return Object.entries(garment.customControls || {}).map(([key, control]) => (
    <ChoiceGroup
      key={`${garment.id}-${key}`}
      title={control.label}
      options={control.options}
      value={options[key]}
      onChange={(value) => setOption(key, value)}
      error={fieldErrors[`customOptions.${key}`]}
    />
  ));
}
