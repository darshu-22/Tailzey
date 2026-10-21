import SilhouetteDefs from './SilhouetteDefs';
import TShirtSilhouette from './silhouettes/TShirtSilhouette';
import ShirtSilhouette from './silhouettes/ShirtSilhouette';
import JacketSilhouette from './silhouettes/JacketSilhouette';
import TrousersSilhouette from './silhouettes/TrousersSilhouette';
import EthnicSilhouette from './silhouettes/EthnicSilhouette';
import { GUIDE_STROKE, patternFlags, silhouettePalette } from './silhouetteStyle';

const SILHOUETTES = {
  't-shirt': TShirtSilhouette,
  shirt: ShirtSilhouette,
  jacket: JacketSilhouette,
  trousers: TrousersSilhouette,
  ethnic: EthnicSilhouette,
};

/**
 * Illustrative vector drawing of a garment in the chosen colour, fit and options.
 * Shared by the designer preview and the design report.
 * @param {object} props.color   colour record from designerData (hex, secondaryHex, isLight, name)
 * @param {object} props.options resolved custom options (defaults filled in)
 * @param {string} props.label   accessible description of the drawing
 */
export default function GarmentSilhouetteSvg({ garmentId, color, fitId, options = {}, isDetailView = false, label }) {
  const palette = silhouettePalette(color);
  const Silhouette = SILHOUETTES[garmentId];

  return (
    <svg
      viewBox={isDetailView ? '50 20 200 200' : '0 0 300 360'}
      className="garment-silhouette"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label || `Illustration of the garment in ${color.name}`}
    >
      <SilhouetteDefs palette={palette} />

      <g opacity="0.5" fill="none" stroke={GUIDE_STROKE}>
        <path d="M140 24 L160 24 L164 54 L136 54 Z" strokeWidth="1" />
        <path d="M96 66 Q150 50 204 66" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="150" y1="20" x2="150" y2="340" strokeWidth="0.5" strokeDasharray="4 4" />
      </g>

      {Silhouette && (
        <Silhouette fitId={fitId} options={options} palette={palette} patterns={patternFlags(options.pattern)} />
      )}
    </svg>
  );
}
