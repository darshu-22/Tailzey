import React from 'react';

/** Gold framing guides and a pose outline for the active capture view. */
export default function PoseAlignmentOverlay({ silhouetteType = 'front' }) {
  return (
    <div className="camera-alignment-overlay" aria-hidden="true">
      <svg
        viewBox="0 0 360 480"
        className="camera-alignment-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Framing Corner Accents */}
        <path d="M 30 50 L 30 30 L 50 30" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 330 50 L 330 30 L 310 30" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 30 430 L 30 450 L 50 450" stroke="#D9B47A" strokeWidth="2.5" fill="none" />
        <path d="M 330 430 L 330 450 L 310 450" stroke="#D9B47A" strokeWidth="2.5" fill="none" />

        {/* Vertical Center Caliper */}
        <line x1="180" y1="30" x2="180" y2="450" stroke="rgba(217, 180, 122, 0.3)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Head Eyeline Guide */}
        <line x1="140" y1="105" x2="220" y2="105" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Shoulder Line Guide */}
        <line x1="110" y1="160" x2="250" y2="160" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Hip Line Guide */}
        <line x1="120" y1="270" x2="240" y2="270" stroke="rgba(217, 180, 122, 0.4)" strokeWidth="1" />
        {/* Floor Line */}
        <line x1="80" y1="440" x2="280" y2="440" stroke="rgba(217, 180, 122, 0.6)" strokeWidth="1.5" />

        {/* Dynamic Pose Outline */}
        {silhouetteType === 'front' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Head */}
            <ellipse cx="180" cy="95" rx="26" ry="34" />
            {/* Neck */}
            <path d="M 170 128 L 170 148 M 190 128 L 190 148" />
            {/* Torso & Limbs */}
            <path d="M 170 148 L 126 165 L 105 285 M 190 148 L 234 165 L 255 285" />
            <path d="M 135 170 L 142 260 L 132 290 L 140 435 M 225 170 L 218 260 L 228 290 L 220 435" />
          </g>
        )}

        {silhouetteType === 'side' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Profile Head */}
            <circle cx="180" cy="95" r="30" />
            <path d="M 175 125 L 175 152" />
            {/* Spine & Silhouette */}
            <path d="M 175 152 Q 165 220 178 280 L 172 435" />
            <path d="M 180 152 Q 196 200 184 280 L 188 435" />
            {/* Arm Profile */}
            <line x1="178" y1="165" x2="178" y2="280" strokeDasharray="3 3" />
          </g>
        )}

        {silhouetteType === 'back' && (
          <g className="overlay-silhouette" stroke="#D9B47A" strokeWidth="1.8" fill="none" opacity="0.75" filter="url(#gold-glow)">
            {/* Head back */}
            <ellipse cx="180" cy="95" rx="26" ry="32" />
            {/* Back shoulders */}
            <path d="M 124 162 Q 180 152 236 162" />
            <path d="M 124 162 L 102 280 M 236 162 L 258 280" />
            <path d="M 136 170 L 140 265 L 132 290 L 140 435 M 224 170 L 220 265 L 228 290 L 220 435" />
          </g>
        )}
      </svg>
    </div>
  );
}
