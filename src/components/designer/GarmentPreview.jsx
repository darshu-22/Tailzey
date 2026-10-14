import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Sparkles, Eye, Info, Check } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { getColorById, getGarmentById, getStyleById, getFitById } from '../../data/designerData';

/**
 * Dynamic Atelier SVG Silhouette Renderer
 * Generates tailored vectors reflecting garment silhouette, color tones,
 * fit contours, necklines, sleeves, and pattern textures.
 */
export function AtelierSilhouetteSvg({
  garmentId,
  color,
  fitId,
  styleId,
  options,
  isDetailView,
}) {
  const primaryFill = color.hex;
  const secondaryFill = color.secondaryHex;
  const isLight = color.isLight;

  // Stitch and line contrast based on color tone
  const outlineColor = isLight ? '#2B2520' : 'rgba(217, 180, 122, 0.7)';
  const seamColor = isLight ? '#5C4A38' : 'rgba(217, 180, 122, 0.4)';
  const accentGold = '#D9B47A';
  const shadowColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.45)';

  // ViewBox adapts for close-up detail or full atelier view
  const viewBox = isDetailView ? '50 20 200 200' : '0 0 300 360';

  // Pattern overlays based on selected pattern option
  const patternId = options?.pattern || 'solid';
  const showPinstripe = patternId === 'bengal-stripe' || patternId === 'fine-ribbed';
  const showWindowpane = patternId === 'subtle-windowpane' || patternId === 'micro-houndstooth';
  const showZari = patternId === 'zari-accents' || patternId === 'subtle-monogram';

  return (
    <svg
      viewBox={viewBox}
      className={`atelier-silhouette-svg ${isDetailView ? 'is-detailed' : ''}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Preview of ${garmentId} in ${color.name}`}
    >
      <defs>
        {/* Dynamic Gradient for the chosen fabric color */}
        <linearGradient id="fabric-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryFill} />
          <stop offset="65%" stopColor={secondaryFill} />
          <stop offset="100%" stopColor={primaryFill} />
        </linearGradient>

        {/* Ambient lighting shimmer */}
        <linearGradient id="fabric-shimmer-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? 0.35 : 0.15} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.02} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
        </linearGradient>

        {/* Gold Embroidery Gradient for Zari/Accents */}
        <linearGradient id="zari-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E4B8" />
          <stop offset="50%" stopColor="#D9B47A" />
          <stop offset="100%" stopColor="#9B6038" />
        </linearGradient>

        {/* Subtle Pinstripe Pattern */}
        <pattern id="pinstripe-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke={seamColor} strokeWidth="0.7" opacity="0.6" />
        </pattern>

        {/* Subtle Windowpane Grid Pattern */}
        <pattern id="windowpane-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="24" height="24" fill="none" stroke={seamColor} strokeWidth="0.6" opacity="0.45" />
        </pattern>
      </defs>

      {/* Atelier Mannequin Stand Backdrop (Subtle Luxury Outline) */}
      <g className="mannequin-frame" opacity="0.25">
        {/* Neck Post */}
        <path d="M140 24 L160 24 L164 54 L136 54 Z" fill="none" stroke="#D9B47A" strokeWidth="1" />
        {/* Shoulder Arch */}
        <path d="M96 66 Q150 50 204 66" fill="none" stroke="#D9B47A" strokeWidth="0.8" strokeDasharray="3 3" />
        {/* Vertical Center Caliper */}
        <line x1="150" y1="20" x2="150" y2="340" stroke="#D9B47A" strokeWidth="0.5" strokeDasharray="4 4" />
      </g>

      {/* RENDER GARMENT CATEGORIES */}
      {garmentId === 't-shirt' && (
        <g id="preview-tshirt" className="silhouette-group">
          {/* Fit offsets */}
          {(() => {
            const isSlim = fitId === 'slim';
            const isRelaxed = fitId === 'relaxed';
            const waistIn = isSlim ? 18 : isRelaxed ? 6 : 12;
            const hemY = options?.garmentLength === 'relaxed-longline' ? 295 : 275;
            const isLongSleeve = options?.sleeveLength === 'long-sleeve';
            const isVneck = options?.neckline === 'v-neck';
            const isHenley = options?.neckline === 'henley';

            return (
              <>
                {/* Main Body Path */}
                <path
                  d={`
                    M 116 58
                    L 78 78
                    ${isLongSleeve ? 'L 46 220 L 74 224 L 88 128' : 'L 58 132 L 86 142 L 96 112'}
                    L ${96 + (12 - waistIn)} 190
                    L 98 ${hemY}
                    ${options?.garmentLength === 'relaxed-longline' ? 'Q 150 ' + (hemY + 12) + ' 202 ' + hemY : 'L 202 ' + hemY}
                    L ${204 - (12 - waistIn)} 190
                    L 204 112
                    ${isLongSleeve ? 'L 212 128 L 226 224 L 254 220 L 222 78' : 'L 214 142 L 242 132 L 222 78'}
                    L 184 58
                    ${isVneck ? 'L 150 102 L 116 58' : 'Q 150 78 116 58'}
                    Z
                  `}
                  fill="url(#fabric-primary-grad)"
                  stroke={outlineColor}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                {/* Shimmer Highlight Layer */}
                <path
                  d={`
                    M 116 58
                    L 78 78
                    ${isLongSleeve ? 'L 46 220 L 74 224 L 88 128' : 'L 58 132 L 86 142 L 96 112'}
                    L ${96 + (12 - waistIn)} 190
                    L 98 ${hemY}
                    ${options?.garmentLength === 'relaxed-longline' ? 'Q 150 ' + (hemY + 12) + ' 202 ' + hemY : 'L 202 ' + hemY}
                    L ${204 - (12 - waistIn)} 190
                    L 204 112
                    ${isLongSleeve ? 'L 212 128 L 226 224 L 254 220 L 222 78' : 'L 214 142 L 242 132 L 222 78'}
                    L 184 58
                    ${isVneck ? 'L 150 102 L 116 58' : 'Q 150 78 116 58'}
                    Z
                  `}
                  fill="url(#fabric-shimmer-grad)"
                />

                {/* Optional Texture Pattern */}
                {showPinstripe && (
                  <path
                    d={`M 98 112 L 98 ${hemY} L 202 ${hemY} L 202 112 Z`}
                    fill="url(#pinstripe-pattern)"
                    opacity="0.3"
                  />
                )}

                {/* Henley Buttons if selected */}
                {isHenley && (
                  <g className="henley-placket">
                    <line x1="150" y1="68" x2="150" y2="124" stroke={seamColor} strokeWidth="1.5" />
                    <circle cx="150" cy="78" r="2.2" fill={accentGold} />
                    <circle cx="150" cy="94" r="2.2" fill={accentGold} />
                    <circle cx="150" cy="110" r="2.2" fill={accentGold} />
                  </g>
                )}

                {/* Subtle Monogram if selected */}
                {showZari && (
                  <g className="monogram-badge" transform="translate(122, 115)">
                    <circle cx="6" cy="6" r="6" fill="none" stroke={accentGold} strokeWidth="0.8" />
                    <text x="6" y="9" textAnchor="middle" fontSize="6" fill={accentGold} fontFamily="serif">
                      TZ
                    </text>
                  </g>
                )}

                {/* Hem Seams */}
                <line x1="102" y1={hemY - 4} x2="198" y2={hemY - 4} stroke={seamColor} strokeWidth="0.9" />
              </>
            );
          })()}
        </g>
      )}

      {garmentId === 'shirt' && (
        <g id="preview-shirt" className="silhouette-group">
          {(() => {
            const isSlim = fitId === 'slim';
            const waistOffset = isSlim ? 14 : 6;
            const isShortSleeve = options?.sleeveLength === 'short-sleeve';
            const isMandarin = options?.neckline === 'mandarin-band';
            const isUntucked = options?.garmentLength === 'untucked-casual';
            const hemY = isUntucked ? 275 : 298;

            return (
              <>
                {/* Main Shirt Body */}
                <path
                  d={`
                    M 118 56
                    L 76 76
                    ${isShortSleeve ? 'L 56 142 L 86 150 L 96 116' : 'L 42 242 L 68 246 L 86 136'}
                    L ${96 + (10 - waistOffset)} 190
                    L 98 ${hemY}
                    ${isUntucked ? 'L 202 ' + hemY : 'Q 150 ' + (hemY - 14) + ' 202 ' + hemY}
                    L ${204 - (10 - waistOffset)} 190
                    L 204 116
                    ${isShortSleeve ? 'L 214 150 L 244 142 L 224 76' : 'L 214 136 L 232 246 L 258 242 L 224 76'}
                    L 182 56
                    Q 150 68 118 56
                    Z
                  `}
                  fill="url(#fabric-primary-grad)"
                  stroke={outlineColor}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                {/* Fabric Shimmer */}
                <path
                  d={`
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
                  `}
                  fill="url(#fabric-shimmer-grad)"
                />

                {/* Pattern Texture Overlays */}
                {showPinstripe && (
                  <path
                    d={`M 98 100 L 98 ${hemY} L 202 ${hemY} L 202 100 Z`}
                    fill="url(#pinstripe-pattern)"
                    opacity="0.35"
                  />
                )}
                {showWindowpane && (
                  <path
                    d={`M 98 100 L 98 ${hemY} L 202 ${hemY} L 202 100 Z`}
                    fill="url(#windowpane-pattern)"
                    opacity="0.3"
                  />
                )}

                {/* Center Button Placket */}
                <rect x="146" y="56" width="8" height={hemY - 56} fill="none" stroke={seamColor} strokeWidth="1" />
                <circle cx="150" cy="78" r="2.2" fill={accentGold} />
                <circle cx="150" cy="108" r="2.2" fill={accentGold} />
                <circle cx="150" cy="138" r="2.2" fill={accentGold} />
                <circle cx="150" cy="168" r="2.2" fill={accentGold} />
                <circle cx="150" cy="198" r="2.2" fill={accentGold} />
                <circle cx="150" cy="228" r="2.2" fill={accentGold} />

                {/* Collar Architecture */}
                {isMandarin ? (
                  <path
                    d="M 126 50 L 174 50 L 172 60 L 128 60 Z"
                    fill="url(#fabric-primary-grad)"
                    stroke={outlineColor}
                    strokeWidth="1.5"
                  />
                ) : (
                  <g className="shirt-collar-wings">
                    {/* Left Wing */}
                    <path
                      d="M 122 52 L 148 76 L 150 62 L 132 50 Z"
                      fill="url(#fabric-primary-grad)"
                      stroke={outlineColor}
                      strokeWidth="1.4"
                    />
                    {/* Right Wing */}
                    <path
                      d="M 178 52 L 152 76 L 150 62 L 168 50 Z"
                      fill="url(#fabric-primary-grad)"
                      stroke={outlineColor}
                      strokeWidth="1.4"
                    />
                  </g>
                )}

                {/* Left Chest Pocket */}
                <path
                  d="M 116 116 L 136 116 L 136 138 L 126 144 L 116 138 Z"
                  fill="none"
                  stroke={seamColor}
                  strokeWidth="1"
                />
              </>
            );
          })()}
        </g>
      )}

      {garmentId === 'jacket' && (
        <g id="preview-jacket" className="silhouette-group">
          {(() => {
            const isPeakLapel = options?.neckline === 'peak-lapel';
            const isStandCollar = options?.neckline === 'mandarin-stand';
            const isLongline = options?.garmentLength === 'extended-longline';
            const hemY = isLongline ? 318 : 282;

            return (
              <>
                {/* Jacket Structured Outer Shell */}
                <path
                  d={`
                    M 118 52
                    L 72 72
                    L 38 252
                    L 68 256
                    L 86 142
                    L 90 200
                    L 92 ${hemY}
                    L 208 ${hemY}
                    L 210 200
                    L 214 142
                    L 232 256
                    L 262 252
                    L 228 72
                    L 182 52
                    Z
                  `}
                  fill="url(#fabric-primary-grad)"
                  stroke={outlineColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Shimmer Highlight */}
                <path
                  d={`
                    M 118 52
                    L 72 72
                    L 38 252
                    L 68 256
                    L 92 ${hemY}
                    L 208 ${hemY}
                    L 232 256
                    L 262 252
                    L 228 72
                    L 182 52
                    Z
                  `}
                  fill="url(#fabric-shimmer-grad)"
                />

                {/* Windowpane Overlay if selected */}
                {showWindowpane && (
                  <path
                    d={`M 92 100 L 92 ${hemY} L 208 ${hemY} L 208 100 Z`}
                    fill="url(#windowpane-pattern)"
                    opacity="0.35"
                  />
                )}

                {/* Tailored Lapel Architecture */}
                {isStandCollar ? (
                  <rect
                    x="126"
                    y="46"
                    width="48"
                    height="12"
                    rx="2"
                    fill="url(#fabric-primary-grad)"
                    stroke={outlineColor}
                    strokeWidth="1.5"
                  />
                ) : isPeakLapel ? (
                  <g className="peak-lapels">
                    {/* Left Peak Lapel */}
                    <path
                      d="M 124 54 L 102 96 L 148 148 L 150 162 L 132 102 L 136 60 Z"
                      fill={secondaryFill}
                      stroke={outlineColor}
                      strokeWidth="1.5"
                    />
                    {/* Right Peak Lapel */}
                    <path
                      d="M 176 54 L 198 96 L 152 148 L 150 162 L 168 102 L 164 60 Z"
                      fill={secondaryFill}
                      stroke={outlineColor}
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  <g className="notched-lapels">
                    {/* Left Notched Lapel */}
                    <path
                      d="M 126 54 L 112 92 L 120 98 L 108 122 L 148 162 L 136 94 Z"
                      fill={secondaryFill}
                      stroke={outlineColor}
                      strokeWidth="1.5"
                    />
                    {/* Right Notched Lapel */}
                    <path
                      d="M 174 54 L 188 92 L 180 98 L 192 122 L 152 162 L 164 94 Z"
                      fill={secondaryFill}
                      stroke={outlineColor}
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Pick Stitching Edge if selected */}
                {options?.pattern === 'pick-stitch' && (
                  <path
                    d="M 126 54 L 112 92 L 148 162 L 152 162 L 188 92 L 174 54"
                    fill="none"
                    stroke={accentGold}
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Waist Center Single Closure */}
                <line x1="150" y1="162" x2="150" y2={hemY} stroke={outlineColor} strokeWidth="1.4" />
                <circle cx="150" cy="180" r="3" fill={accentGold} stroke="#120D0A" strokeWidth="1" />
                <circle cx="150" cy="210" r="3" fill={accentGold} stroke="#120D0A" strokeWidth="1" />

                {/* Welt Breast Pocket & Flap Pockets */}
                <rect x="110" y="118" width="22" height="3.5" rx="0.8" fill={secondaryFill} stroke={outlineColor} strokeWidth="1" />
                <rect x="98" y="210" width="30" height="6" rx="1" fill={secondaryFill} stroke={outlineColor} strokeWidth="1" />
                <rect x="172" y="210" width="30" height="6" rx="1" fill={secondaryFill} stroke={outlineColor} strokeWidth="1" />
              </>
            );
          })()}
        </g>
      )}

      {garmentId === 'trousers' && (
        <g id="preview-trousers" className="silhouette-group">
          {(() => {
            const isSinglePleat = options?.neckline === 'single-pleat';
            const isDoublePleat = options?.neckline === 'double-pleats';
            const isCropped = options?.garmentLength === 'cropped-inseam';
            const legHemY = isCropped ? 304 : 332;

            return (
              <>
                {/* Trouser Waist and Draped Legs */}
                <path
                  d={`
                    M 104 60
                    L 196 60
                    L 194 92
                    L 186 ${legHemY}
                    L 156 ${legHemY}
                    L 150 162
                    L 144 ${legHemY}
                    L 114 ${legHemY}
                    L 106 92
                    Z
                  `}
                  fill="url(#fabric-primary-grad)"
                  stroke={outlineColor}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                {/* Shimmer Highlight */}
                <path
                  d={`
                    M 104 60
                    L 196 60
                    L 186 ${legHemY}
                    L 156 ${legHemY}
                    L 150 162
                    L 144 ${legHemY}
                    L 114 ${legHemY}
                    Z
                  `}
                  fill="url(#fabric-shimmer-grad)"
                />

                {/* Tailored Waistband */}
                <rect x="104" y="60" width="92" height="14" fill={secondaryFill} stroke={outlineColor} strokeWidth="1.2" />

                {/* Side Adjusters or Belt Loops */}
                {options?.pattern === 'side-adjusters' ? (
                  <g className="side-adjusters">
                    <rect x="100" y="64" width="7" height="6" rx="1" fill={accentGold} stroke="#120D0A" strokeWidth="0.8" />
                    <rect x="193" y="64" width="7" height="6" rx="1" fill={accentGold} stroke="#120D0A" strokeWidth="0.8" />
                  </g>
                ) : (
                  <g className="belt-loops" stroke={seamColor} strokeWidth="1.2">
                    <line x1="124" y1="60" x2="124" y2="74" />
                    <line x1="150" y1="60" x2="150" y2="74" />
                    <line x1="176" y1="60" x2="176" y2="74" />
                  </g>
                )}

                {/* Fly Seam */}
                <path d="M 150 74 L 150 132 Q 152 142 150 156" fill="none" stroke={outlineColor} strokeWidth="1.2" />

                {/* Pleats (if selected) */}
                {isSinglePleat && (
                  <g stroke={seamColor} strokeWidth="1.2">
                    <line x1="130" y1="74" x2="130" y2="108" />
                    <line x1="170" y1="74" x2="170" y2="108" />
                  </g>
                )}
                {isDoublePleat && (
                  <g stroke={seamColor} strokeWidth="1.2">
                    <line x1="126" y1="74" x2="126" y2="114" />
                    <line x1="134" y1="74" x2="134" y2="104" />
                    <line x1="166" y1="74" x2="166" y2="104" />
                    <line x1="174" y1="74" x2="174" y2="114" />
                  </g>
                )}

                {/* Razor Sharp Pressed Crease Lines */}
                <line x1="132" y1="96" x2="130" y2={legHemY - 4} stroke={seamColor} strokeWidth="1" strokeDasharray="6 3" />
                <line x1="168" y1="96" x2="170" y2={legHemY - 4} stroke={seamColor} strokeWidth="1" strokeDasharray="6 3" />

                {/* Hem Turn-ups */}
                <line x1="114" y1={legHemY - 6} x2="144" y2={legHemY - 6} stroke={seamColor} strokeWidth="1" />
                <line x1="156" y1={legHemY - 6} x2="186" y2={legHemY - 6} stroke={seamColor} strokeWidth="1" />
              </>
            );
          })()}
        </g>
      )}

      {garmentId === 'ethnic' && (
        <g id="preview-ethnic" className="silhouette-group">
          {(() => {
            const isAngrakha = options?.neckline === 'angrakha-wrap';
            const isShortBandi = options?.garmentLength === 'short-bandi';
            const hemY = isShortBandi ? 250 : 330;

            return (
              <>
                {/* Majestic Royal Sherwani / Kurta Drape */}
                <path
                  d={`
                    M 118 48
                    L 72 68
                    L 38 248
                    L 64 252
                    L 84 140
                    L 88 200
                    L 86 ${hemY}
                    ${isShortBandi ? 'L 214 ' + hemY : 'L 150 ' + (hemY - 4) + ' L 214 ' + hemY}
                    L 212 200
                    L 216 140
                    L 236 252
                    L 262 248
                    L 228 68
                    L 182 48
                    Z
                  `}
                  fill="url(#fabric-primary-grad)"
                  stroke={outlineColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Shimmer Highlight */}
                <path
                  d={`
                    M 118 48
                    L 72 68
                    L 38 248
                    L 86 ${hemY}
                    L 214 ${hemY}
                    L 262 248
                    L 228 68
                    L 182 48
                    Z
                  `}
                  fill="url(#fabric-shimmer-grad)"
                />

                {/* Royal Bandhgala Collar */}
                <rect
                  x="126"
                  y="40"
                  width="48"
                  height="14"
                  rx="3"
                  fill="url(#fabric-primary-grad)"
                  stroke={showZari ? accentGold : outlineColor}
                  strokeWidth="1.8"
                />

                {/* Angrakha Diagonal Wrap or Centered Placket */}
                {isAngrakha ? (
                  <path
                    d={`M 132 54 Q 164 120 152 200 L 150 ${hemY}`}
                    fill="none"
                    stroke={showZari ? accentGold : outlineColor}
                    strokeWidth="1.8"
                  />
                ) : (
                  <line
                    x1="150"
                    y1="54"
                    x2="150"
                    y2={hemY}
                    stroke={showZari ? accentGold : outlineColor}
                    strokeWidth="1.8"
                  />
                )}

                {/* Handcrafted Buttons / Brocade Accents */}
                <g className="regal-buttons">
                  {[64, 84, 104, 124, 144, 164, 184].map((y) => (
                    <circle
                      key={y}
                      cx={isAngrakha && y > 90 ? 154 : 150}
                      cy={y}
                      r="2.6"
                      fill="url(#zari-gold-grad)"
                      stroke="#120D0A"
                      strokeWidth="0.8"
                    />
                  ))}
                </g>

                {/* Gold Zari Border on Hem if selected */}
                {showZari && (
                  <g className="zari-embroidery-borders">
                    <line x1="88" y1={hemY - 8} x2="212" y2={hemY - 8} stroke={accentGold} strokeWidth="2.5" />
                    <line x1="88" y1={hemY - 14} x2="212" y2={hemY - 14} stroke={accentGold} strokeWidth="1" strokeDasharray="3 2" />
                    {/* Cuffs Zari */}
                    <line x1="40" y1="244" x2="64" y2="248" stroke={accentGold} strokeWidth="2" />
                    <line x1="236" y1="248" x2="260" y2="244" stroke={accentGold} strokeWidth="2" />
                  </g>
                )}
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
}

/**
 * GarmentPreview Component
 * Interactive visual preview area with live color fills, silhouette rendering,
 * view toggles, and clear illustrative concept attribution.
 */
export default function GarmentPreview({
  garmentId = 'jacket',
  colorId = 'navy',
  styleId = 'classic',
  fitId = 'slim',
  options = {},
  onOpen3DViewer,
  className = '',
}) {
  const [isDetailView, setIsDetailView] = useState(false);

  const garment = getGarmentById(garmentId);
  const color = getColorById(colorId);
  const style = getStyleById(styleId);
  const fit = getFitById(fitId);

  return (
    <div className={`garment-preview-card ${className}`.trim()}>
      {/* Atelier Canvas Header Meta */}
      <div className="preview-top-bar">
        <div className="preview-meta-tags">
          <StatusBadge variant="gold" dot>
            {garment.name}
          </StatusBadge>
          <span className="preview-color-pill">
            <span
              className="preview-color-dot"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            {color.name}
          </span>
          <span className="preview-spec-pill">{fit.name}</span>
          <span className="preview-spec-pill">{style.name}</span>
        </div>

        {/* View Controls: 3D Studio & Detail Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onOpen3DViewer && (
            <button
              type="button"
              onClick={onOpen3DViewer}
              className="preview-view-toggle-btn"
              style={{ color: 'var(--color-gold)', borderColor: 'var(--color-border)' }}
              aria-label="Inspect silhouette in Interactive 3D Avatar Studio"
              title="Open 3D Avatar Studio"
            >
              <Sparkles size={14} />
              <span>3D Studio</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDetailView(!isDetailView)}
            className="preview-view-toggle-btn"
            aria-label={isDetailView ? 'Switch to Full Silhouette View' : 'Switch to Close-Up Tailoring View'}
            title={isDetailView ? 'Full Silhouette View' : 'Close-up Tailoring Detail'}
          >
            {isDetailView ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            <span>{isDetailView ? 'Full View' : 'Detail View'}</span>
          </button>
        </div>
      </div>

      {/* Main Atelier Canvas Presentation Box */}
      <div className="preview-canvas-box" role="img" aria-label={`Preview of ${garment.name} in ${color.name}`}>
        <div className="preview-canvas-spotlight" aria-hidden="true" />

        {/* Dynamic Vector Artwork */}
        <AtelierSilhouetteSvg
          garmentId={garmentId}
          color={color}
          fitId={fitId}
          styleId={styleId}
          options={options}
          isDetailView={isDetailView}
        />

        {/* Ambient Corner Branding */}
        <div className="preview-canvas-watermark" aria-hidden="true">
          <span>TAILZEY ATELIER</span>
          <span className="preview-canvas-sub">PROTOTYPE CONCEPT</span>
        </div>
      </div>

      {/* Honest Prototype Concept Disclaimer */}
      <div className="preview-disclaimer-card" role="note">
        <Info size={15} className="preview-disclaimer-icon" aria-hidden="true" />
        <div className="preview-disclaimer-text">
          <strong>Illustrative Concept Preview:</strong> Interactive styling visualization for design exploration. 3D avatar drape and fabric scanning will be integrated in upcoming phases.
        </div>
      </div>
    </div>
  );
}
