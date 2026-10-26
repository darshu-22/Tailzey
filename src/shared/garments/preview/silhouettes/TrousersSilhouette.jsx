import React from 'react';
import { FILL } from '../silhouetteStyle';

function Pleats({ style, seam }) {
  if (style === 'single-pleat') {
    return (
      <g stroke={seam} strokeWidth="1.2">
        <line x1="130" y1="74" x2="130" y2="108" />
        <line x1="170" y1="74" x2="170" y2="108" />
      </g>
    );
  }
  if (style === 'double-pleats') {
    return (
      <g stroke={seam} strokeWidth="1.2">
        <line x1="126" y1="74" x2="126" y2="114" />
        <line x1="134" y1="74" x2="134" y2="104" />
        <line x1="166" y1="74" x2="166" y2="104" />
        <line x1="174" y1="74" x2="174" y2="114" />
      </g>
    );
  }
  return null;
}

/** Trousers: pleat style, inseam length, side adjusters vs belt loops, pressed creases. */
export default function TrousersSilhouette({ options, palette }) {
  const legHemY = options.garmentLength === 'cropped-inseam' ? 304 : 332;

  const body = `
    M 104 60 L 196 60 L 194 92 L 186 ${legHemY} L 156 ${legHemY}
    L 150 162 L 144 ${legHemY} L 114 ${legHemY} L 106 92 Z
  `;
  const shimmer = `
    M 104 60 L 196 60 L 186 ${legHemY} L 156 ${legHemY}
    L 150 162 L 144 ${legHemY} L 114 ${legHemY} Z
  `;

  return (
    <g id="preview-trousers" className="silhouette-group">
      <path d={body} fill={FILL.primary} stroke={palette.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={shimmer} fill={FILL.shimmer} />

      <rect x="104" y="60" width="92" height="14" fill={palette.secondary} stroke={palette.outline} strokeWidth="1.2" />

      {options.pattern === 'side-adjusters' ? (
        <g className="side-adjusters">
          <rect x="100" y="64" width="7" height="6" rx="1" fill={palette.accent} stroke="#120D0A" strokeWidth="0.8" />
          <rect x="193" y="64" width="7" height="6" rx="1" fill={palette.accent} stroke="#120D0A" strokeWidth="0.8" />
        </g>
      ) : (
        <g className="belt-loops" stroke={palette.seam} strokeWidth="1.2">
          <line x1="124" y1="60" x2="124" y2="74" />
          <line x1="150" y1="60" x2="150" y2="74" />
          <line x1="176" y1="60" x2="176" y2="74" />
        </g>
      )}

      <path d="M 150 74 L 150 132 Q 152 142 150 156" fill="none" stroke={palette.outline} strokeWidth="1.2" />
      <Pleats style={options.neckline} seam={palette.seam} />

      <line x1="132" y1="96" x2="130" y2={legHemY - 4} stroke={palette.seam} strokeWidth="1" strokeDasharray="6 3" />
      <line x1="168" y1="96" x2="170" y2={legHemY - 4} stroke={palette.seam} strokeWidth="1" strokeDasharray="6 3" />

      <line x1="114" y1={legHemY - 6} x2="144" y2={legHemY - 6} stroke={palette.seam} strokeWidth="1" />
      <line x1="156" y1={legHemY - 6} x2="186" y2={legHemY - 6} stroke={palette.seam} strokeWidth="1" />
    </g>
  );
}
