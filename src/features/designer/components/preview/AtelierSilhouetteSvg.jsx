import React from 'react';
import SilhouetteDefs from './SilhouetteDefs';
import TShirtSilhouette from './silhouettes/TShirtSilhouette';
import ShirtSilhouette from './silhouettes/ShirtSilhouette';
import JacketSilhouette from './silhouettes/JacketSilhouette';
import TrousersSilhouette from './silhouettes/TrousersSilhouette';
import EthnicSilhouette from './silhouettes/EthnicSilhouette';
import { patternFlags, silhouettePalette } from '../../lib/silhouetteStyle';

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
 * @param {object} props.color  colour record from designerData (hex, secondaryHex, isLight, name)
 * @param {object} props.options resolved custom options (defaults filled in)
 */
export default function AtelierSilhouetteSvg({ garmentId, color, fitId, options = {}, isDetailView = false }) {
  const palette = silhouettePalette(color);
  const Silhouette = SILHOUETTES[garmentId];

  return (
    <svg
      viewBox={isDetailView ? '50 20 200 200' : '0 0 300 360'}
      className={`atelier-silhouette-svg ${isDetailView ? 'is-detailed' : ''}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Preview of ${garmentId} in ${color.name}`}
    >
      <SilhouetteDefs palette={palette} />

      <g className="mannequin-frame" opacity="0.25">
        <path d="M140 24 L160 24 L164 54 L136 54 Z" fill="none" stroke="#D9B47A" strokeWidth="1" />
        <path d="M96 66 Q150 50 204 66" fill="none" stroke="#D9B47A" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="150" y1="20" x2="150" y2="340" stroke="#D9B47A" strokeWidth="0.5" strokeDasharray="4 4" />
      </g>

      {Silhouette && (
        <Silhouette fitId={fitId} options={options} palette={palette} patterns={patternFlags(options.pattern)} />
      )}
    </svg>
  );
}
