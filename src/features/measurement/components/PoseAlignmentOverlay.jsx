import React from 'react';

const GUIDE = 'rgba(255, 255, 255, 0.35)';
const OUTLINE = 'rgba(255, 255, 255, 0.8)';

const SILHOUETTES = {
  front: (
    <>
      <ellipse cx="180" cy="95" rx="26" ry="34" />
      <path d="M 170 128 L 170 148 M 190 128 L 190 148" />
      <path d="M 170 148 L 126 165 L 105 285 M 190 148 L 234 165 L 255 285" />
      <path d="M 135 170 L 142 260 L 132 290 L 140 435 M 225 170 L 218 260 L 228 290 L 220 435" />
    </>
  ),
  side: (
    <>
      <circle cx="180" cy="95" r="30" />
      <path d="M 175 125 L 175 152" />
      <path d="M 175 152 Q 165 220 178 280 L 172 435" />
      <path d="M 180 152 Q 196 200 184 280 L 188 435" />
      <line x1="178" y1="165" x2="178" y2="280" strokeDasharray="3 3" />
    </>
  ),
  back: (
    <>
      <ellipse cx="180" cy="95" rx="26" ry="32" />
      <path d="M 124 162 Q 180 152 236 162" />
      <path d="M 124 162 L 102 280 M 236 162 L 258 280" />
      <path d="M 136 170 L 140 265 L 132 290 L 140 435 M 224 170 L 220 265 L 228 290 L 220 435" />
    </>
  ),
};

/** Framing corners, a centre line and a pose outline for the active view. */
export default function PoseAlignmentOverlay({ silhouetteType = 'front' }) {
  return (
    <svg className="viewfinder-guides" viewBox="0 0 360 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="2.5" fill="none">
        <path d="M 30 50 L 30 30 L 50 30" />
        <path d="M 330 50 L 330 30 L 310 30" />
        <path d="M 30 430 L 30 450 L 50 450" />
        <path d="M 330 430 L 330 450 L 310 450" />
      </g>
      <line x1="180" y1="30" x2="180" y2="450" stroke={GUIDE} strokeWidth="1" strokeDasharray="4 4" />
      <line x1="80" y1="440" x2="280" y2="440" stroke={GUIDE} strokeWidth="1.5" />
      <g stroke={OUTLINE} strokeWidth="2" fill="none" opacity="0.7">
        {SILHOUETTES[silhouetteType] ?? SILHOUETTES.front}
      </g>
    </svg>
  );
}
