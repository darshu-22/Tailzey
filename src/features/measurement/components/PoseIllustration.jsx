import React from 'react';

/** Simple diagram: camera at waist height, person 2–3 m away facing it in a relaxed A-pose. */
export default function PoseIllustration() {
  return (
    <svg
      className="pose-illo"
      viewBox="0 0 260 210"
      role="img"
      aria-label="A camera at waist height and a person standing 2 to 3 metres away, facing it, with arms slightly out and feet hip-width apart."
    >
      {/* Floor */}
      <line className="pose-illo-floor" x1="12" y1="178" x2="248" y2="178" />

      {/* Camera on a stand */}
      <g className="pose-illo-device">
        <line x1="44" y1="118" x2="30" y2="178" />
        <line x1="44" y1="118" x2="44" y2="178" />
        <line x1="44" y1="118" x2="58" y2="178" />
        <rect x="35" y="92" width="18" height="28" rx="3" />
      </g>

      {/* Field of view */}
      <path className="pose-illo-view" d="M53 104 L196 18 M53 104 L196 178" />

      {/* Person in A-pose */}
      <g className="pose-illo-person">
        <circle cx="196" cy="34" r="12" />
        <path d="M181 52 H211 L207 108 H185 Z" />
        <line className="pose-illo-limb" x1="182" y1="56" x2="166" y2="104" />
        <line className="pose-illo-limb" x1="210" y1="56" x2="226" y2="104" />
        <line className="pose-illo-leg" x1="189" y1="110" x2="182" y2="172" />
        <line className="pose-illo-leg" x1="203" y1="110" x2="210" y2="172" />
      </g>

      {/* Distance */}
      <g className="pose-illo-measure">
        <line x1="60" y1="192" x2="176" y2="192" />
        <path d="M60 192 l7 -4 v8 Z M176 192 l-7 -4 v8 Z" />
      </g>
      <text className="pose-illo-label" x="118" y="208" textAnchor="middle">
        2–3 m (6–9 ft)
      </text>
    </svg>
  );
}
