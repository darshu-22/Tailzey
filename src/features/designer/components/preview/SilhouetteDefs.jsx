import React from 'react';

/** Gradients and textures shared by every garment silhouette (see FILL in silhouetteStyle). */
export default function SilhouetteDefs({ palette }) {
  return (
    <defs>
      <linearGradient id="fabric-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={palette.primary} />
        <stop offset="65%" stopColor={palette.secondary} />
        <stop offset="100%" stopColor={palette.primary} />
      </linearGradient>

      <linearGradient id="fabric-shimmer-grad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={palette.isLight ? 0.35 : 0.15} />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.02} />
        <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
      </linearGradient>

      <linearGradient id="zari-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5E4B8" />
        <stop offset="50%" stopColor="#D9B47A" />
        <stop offset="100%" stopColor="#9B6038" />
      </linearGradient>

      <pattern id="pinstripe-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke={palette.seam} strokeWidth="0.7" opacity="0.6" />
      </pattern>

      <pattern id="windowpane-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="24" height="24" fill="none" stroke={palette.seam} strokeWidth="0.6" opacity="0.45" />
      </pattern>
    </defs>
  );
}
