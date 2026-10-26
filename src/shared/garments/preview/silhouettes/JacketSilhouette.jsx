import React from 'react';
import { FILL } from '../silhouetteStyle';

function Lapels({ neckline, palette }) {
  if (neckline === 'mandarin-stand') {
    return (
      <rect x="126" y="46" width="48" height="12" rx="2" fill={FILL.primary} stroke={palette.outline} strokeWidth="1.5" />
    );
  }
  const [left, right] =
    neckline === 'peak-lapel'
      ? ['M 124 54 L 102 96 L 148 148 L 150 162 L 132 102 L 136 60 Z', 'M 176 54 L 198 96 L 152 148 L 150 162 L 168 102 L 164 60 Z']
      : ['M 126 54 L 112 92 L 120 98 L 108 122 L 148 162 L 136 94 Z', 'M 174 54 L 188 92 L 180 98 L 192 122 L 152 162 L 164 94 Z'];
  return (
    <g className={neckline === 'peak-lapel' ? 'peak-lapels' : 'notched-lapels'}>
      <path d={left} fill={palette.secondary} stroke={palette.outline} strokeWidth="1.5" />
      <path d={right} fill={palette.secondary} stroke={palette.outline} strokeWidth="1.5" />
    </g>
  );
}

/** Tailored jacket: lapel style, longline length, windowpane and pick-stitch details. */
export default function JacketSilhouette({ options, palette, patterns }) {
  const hemY = options.garmentLength === 'extended-longline' ? 318 : 282;

  const body = `
    M 118 52 L 72 72 L 38 252 L 68 256 L 86 142 L 90 200 L 92 ${hemY}
    L 208 ${hemY} L 210 200 L 214 142 L 232 256 L 262 252 L 228 72 L 182 52 Z
  `;
  const shimmer = `
    M 118 52 L 72 72 L 38 252 L 68 256 L 92 ${hemY}
    L 208 ${hemY} L 232 256 L 262 252 L 228 72 L 182 52 Z
  `;
  const pocket = { fill: palette.secondary, stroke: palette.outline, strokeWidth: 1 };

  return (
    <g id="preview-jacket" className="silhouette-group">
      <path d={body} fill={FILL.primary} stroke={palette.outline} strokeWidth="2" strokeLinejoin="round" />
      <path d={shimmer} fill={FILL.shimmer} />

      {patterns.windowpane && (
        <path d={`M 92 100 L 92 ${hemY} L 208 ${hemY} L 208 100 Z`} fill={FILL.windowpane} opacity="0.35" />
      )}

      <Lapels neckline={options.neckline} palette={palette} />

      {options.pattern === 'pick-stitch' && (
        <path
          d="M 126 54 L 112 92 L 148 162 L 152 162 L 188 92 L 174 54"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
      )}

      <line x1="150" y1="162" x2="150" y2={hemY} stroke={palette.outline} strokeWidth="1.4" />
      <circle cx="150" cy="180" r="3" fill={palette.accent} stroke="#120D0A" strokeWidth="1" />
      <circle cx="150" cy="210" r="3" fill={palette.accent} stroke="#120D0A" strokeWidth="1" />

      <rect x="110" y="118" width="22" height="3.5" rx="0.8" {...pocket} />
      <rect x="98" y="210" width="30" height="6" rx="1" {...pocket} />
      <rect x="172" y="210" width="30" height="6" rx="1" {...pocket} />
    </g>
  );
}
