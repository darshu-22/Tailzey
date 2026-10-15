import React from 'react';
import { FILL } from '../../../lib/silhouetteStyle';

const BUTTONS_Y = [64, 84, 104, 124, 144, 164, 184];

/** Sherwani / kurta: angrakha wrap vs centred placket, bandi length, zari borders. */
export default function EthnicSilhouette({ options, palette, patterns }) {
  const isAngrakha = options.neckline === 'angrakha-wrap';
  const isShortBandi = options.garmentLength === 'short-bandi';
  const hemY = isShortBandi ? 250 : 330;
  const trim = patterns.zari ? palette.accent : palette.outline;

  const body = `
    M 118 48 L 72 68 L 38 248 L 64 252 L 84 140 L 88 200 L 86 ${hemY}
    ${isShortBandi ? `L 214 ${hemY}` : `L 150 ${hemY - 4} L 214 ${hemY}`}
    L 212 200 L 216 140 L 236 252 L 262 248 L 228 68 L 182 48 Z
  `;
  const shimmer = `M 118 48 L 72 68 L 38 248 L 86 ${hemY} L 214 ${hemY} L 262 248 L 228 68 L 182 48 Z`;

  return (
    <g id="preview-ethnic" className="silhouette-group">
      <path d={body} fill={FILL.primary} stroke={palette.outline} strokeWidth="2" strokeLinejoin="round" />
      <path d={shimmer} fill={FILL.shimmer} />

      <rect x="126" y="40" width="48" height="14" rx="3" fill={FILL.primary} stroke={trim} strokeWidth="1.8" />

      {isAngrakha ? (
        <path d={`M 132 54 Q 164 120 152 200 L 150 ${hemY}`} fill="none" stroke={trim} strokeWidth="1.8" />
      ) : (
        <line x1="150" y1="54" x2="150" y2={hemY} stroke={trim} strokeWidth="1.8" />
      )}

      <g className="regal-buttons">
        {BUTTONS_Y.map((y) => (
          <circle
            key={y}
            cx={isAngrakha && y > 90 ? 154 : 150}
            cy={y}
            r="2.6"
            fill={FILL.zari}
            stroke="#120D0A"
            strokeWidth="0.8"
          />
        ))}
      </g>

      {patterns.zari && (
        <g className="zari-embroidery-borders">
          <line x1="88" y1={hemY - 8} x2="212" y2={hemY - 8} stroke={palette.accent} strokeWidth="2.5" />
          <line x1="88" y1={hemY - 14} x2="212" y2={hemY - 14} stroke={palette.accent} strokeWidth="1" strokeDasharray="3 2" />
          <line x1="40" y1="244" x2="64" y2="248" stroke={palette.accent} strokeWidth="2" />
          <line x1="236" y1="248" x2="260" y2="244" stroke={palette.accent} strokeWidth="2" />
        </g>
      )}
    </g>
  );
}
