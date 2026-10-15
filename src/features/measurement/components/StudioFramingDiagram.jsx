import React from 'react';

/** Illustration of camera distance, elevation and full-body framing. */
export default function StudioFramingDiagram() {
  return (
    <div className="setup-diagram-box" aria-hidden="true">
      <svg
        viewBox="0 0 400 200"
        className="setup-diagram-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="diagram-beam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D9B47A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D9B47A" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Floor Line */}
        <line x1="20" y1="170" x2="380" y2="170" stroke="rgba(217, 180, 122, 0.3)" strokeWidth="1.5" />

        {/* Camera / Tripod */}
        <g transform="translate(60, 105)">
          {/* Tripod legs */}
          <line x1="15" y1="20" x2="0" y2="65" stroke="#BA7B4C" strokeWidth="2" />
          <line x1="15" y1="20" x2="15" y2="65" stroke="#BA7B4C" strokeWidth="2" />
          <line x1="15" y1="20" x2="30" y2="65" stroke="#BA7B4C" strokeWidth="2" />
          {/* Phone Mount */}
          <rect x="7" y="2" width="16" height="22" rx="2" fill="#1B1512" stroke="#D9B47A" strokeWidth="1.5" />
          <circle cx="15" cy="8" r="2" fill="#D9B47A" />
          <text x="15" y="85" textAnchor="middle" fill="#A99C90" fontSize="9" fontFamily="sans-serif">
            Stable Surface
          </text>
        </g>

        {/* Camera Vision Cone */}
        <polygon points="86,116 320,30 320,170" fill="url(#diagram-beam)" />

        {/* Human Silhouette within Framing Cone */}
        <g transform="translate(300, 36)">
          {/* Head */}
          <circle cx="15" cy="18" r="10" fill="#E8CFA1" />
          {/* Torso & Limbs */}
          <path
            d="M5 34 L25 34 L28 85 L22 134 L18 134 L16 90 L14 90 L12 134 L8 134 L2 85 Z"
            fill="#D9B47A"
          />
          {/* Arms */}
          <line x1="4" y1="38" x2="-2" y2="78" stroke="#D9B47A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="26" y1="38" x2="32" y2="78" stroke="#D9B47A" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Distance Indicator Arrow */}
        <g transform="translate(85, 178)">
          <line x1="0" y1="0" x2="215" y2="0" stroke="#D9B47A" strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="0,0 6,-3 6,3" fill="#D9B47A" />
          <polygon points="215,0 209,-3 209,3" fill="#D9B47A" />
          <text x="108" y="14" textAnchor="middle" fill="#D9B47A" fontSize="10" fontFamily="sans-serif">
            2.0 – 3.0 Meters (6 – 9 ft)
          </text>
        </g>

        {/* Full-Body Height Indicator */}
        <g transform="translate(345, 36)">
          <line x1="0" y1="4" x2="0" y2="134" stroke="#D9B47A" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="-3" y1="4" x2="3" y2="4" stroke="#D9B47A" strokeWidth="1" />
          <line x1="-3" y1="134" x2="3" y2="134" stroke="#D9B47A" strokeWidth="1" />
          <text x="10" y="74" fill="#E3D9CC" fontSize="9" fontFamily="sans-serif">
            Full Body
          </text>
        </g>
      </svg>
    </div>
  );
}
