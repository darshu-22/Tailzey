import React from 'react';
import { FILL } from '../../../lib/silhouetteStyle';

const PLACKET_BUTTONS_Y = [78, 108, 138, 168, 198, 228];

/** Dress shirt: collar, sleeve and tuck options; slim fit draws a stronger waist taper. */
export default function ShirtSilhouette({ fitId, options, palette, patterns }) {
  const waistOffset = fitId === 'slim' ? 14 : 6;
  const isShortSleeve = options.sleeveLength === 'short-sleeve';
  const isUntucked = options.garmentLength === 'untucked-casual';
  const hemY = isUntucked ? 275 : 298;

  const body = `
    M 118 56
    L 76 76
    ${isShortSleeve ? 'L 56 142 L 86 150 L 96 116' : 'L 42 242 L 68 246 L 86 136'}
    L ${96 + (10 - waistOffset)} 190
    L 98 ${hemY}
    ${isUntucked ? `L 202 ${hemY}` : `Q 150 ${hemY - 14} 202 ${hemY}`}
    L ${204 - (10 - waistOffset)} 190
    L 204 116
    ${isShortSleeve ? 'L 214 150 L 244 142 L 224 76' : 'L 214 136 L 232 246 L 258 242 L 224 76'}
    L 182 56
    Q 150 68 118 56
    Z
  `;
  const shimmer = `
    M 118 56
    L 76 76
    ${isShortSleeve ? 'L 56 142 L 86 150 L 96 116' : 'L 42 242 L 68 246 L 86 136'}
    L 98 ${hemY}
    L 202 ${hemY}
    L 204 116
    ${isShortSleeve ? 'L 244 142 L 224 76' : 'L 258 242 L 224 76'}
    L 182 56
    Q 150 68 118 56
    Z
  `;
  const panel = `M 98 100 L 98 ${hemY} L 202 ${hemY} L 202 100 Z`;

  return (
    <g id="preview-shirt" className="silhouette-group">
      <path d={body} fill={FILL.primary} stroke={palette.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={shimmer} fill={FILL.shimmer} />

      {patterns.pinstripe && <path d={panel} fill={FILL.pinstripe} opacity="0.35" />}
      {patterns.windowpane && <path d={panel} fill={FILL.windowpane} opacity="0.3" />}

      <rect x="146" y="56" width="8" height={hemY - 56} fill="none" stroke={palette.seam} strokeWidth="1" />
      {PLACKET_BUTTONS_Y.map((y) => (
        <circle key={y} cx="150" cy={y} r="2.2" fill={palette.accent} />
      ))}

      {options.neckline === 'mandarin-band' ? (
        <path
          d="M 126 50 L 174 50 L 172 60 L 128 60 Z"
          fill={FILL.primary}
          stroke={palette.outline}
          strokeWidth="1.5"
        />
      ) : (
        <g className="shirt-collar-wings">
          <path d="M 122 52 L 148 76 L 150 62 L 132 50 Z" fill={FILL.primary} stroke={palette.outline} strokeWidth="1.4" />
          <path d="M 178 52 L 152 76 L 150 62 L 168 50 Z" fill={FILL.primary} stroke={palette.outline} strokeWidth="1.4" />
        </g>
      )}

      <path
        d="M 116 116 L 136 116 L 136 138 L 126 144 L 116 138 Z"
        fill="none"
        stroke={palette.seam}
        strokeWidth="1"
      />
    </g>
  );
}
