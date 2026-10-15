import React from 'react';
import { FILL } from '../../../lib/silhouetteStyle';

/** T-shirt: fit narrows the waist; sleeve, neckline, length and pattern options change the outline. */
export default function TShirtSilhouette({ fitId, options, palette, patterns }) {
  const waistIn = fitId === 'slim' ? 18 : fitId === 'relaxed' ? 6 : 12;
  const isLongline = options.garmentLength === 'relaxed-longline';
  const hemY = isLongline ? 295 : 275;
  const isLongSleeve = options.sleeveLength === 'long-sleeve';

  const body = `
    M 116 58
    L 78 78
    ${isLongSleeve ? 'L 46 220 L 74 224 L 88 128' : 'L 58 132 L 86 142 L 96 112'}
    L ${96 + (12 - waistIn)} 190
    L 98 ${hemY}
    ${isLongline ? `Q 150 ${hemY + 12} 202 ${hemY}` : `L 202 ${hemY}`}
    L ${204 - (12 - waistIn)} 190
    L 204 112
    ${isLongSleeve ? 'L 212 128 L 226 224 L 254 220 L 222 78' : 'L 214 142 L 242 132 L 222 78'}
    L 184 58
    ${options.neckline === 'v-neck' ? 'L 150 102 L 116 58' : 'Q 150 78 116 58'}
    Z
  `;

  return (
    <g id="preview-tshirt" className="silhouette-group">
      <path d={body} fill={FILL.primary} stroke={palette.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={body} fill={FILL.shimmer} />

      {patterns.pinstripe && (
        <path d={`M 98 112 L 98 ${hemY} L 202 ${hemY} L 202 112 Z`} fill={FILL.pinstripe} opacity="0.3" />
      )}

      {options.neckline === 'henley' && (
        <g className="henley-placket">
          <line x1="150" y1="68" x2="150" y2="124" stroke={palette.seam} strokeWidth="1.5" />
          <circle cx="150" cy="78" r="2.2" fill={palette.accent} />
          <circle cx="150" cy="94" r="2.2" fill={palette.accent} />
          <circle cx="150" cy="110" r="2.2" fill={palette.accent} />
        </g>
      )}

      {patterns.zari && (
        <g className="monogram-badge" transform="translate(122, 115)">
          <circle cx="6" cy="6" r="6" fill="none" stroke={palette.accent} strokeWidth="0.8" />
          <text x="6" y="9" textAnchor="middle" fontSize="6" fill={palette.accent} fontFamily="serif">
            TZ
          </text>
        </g>
      )}

      <line x1="102" y1={hemY - 4} x2="198" y2={hemY - 4} stroke={palette.seam} strokeWidth="0.9" />
    </g>
  );
}
