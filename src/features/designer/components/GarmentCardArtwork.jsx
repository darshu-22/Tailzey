import React from 'react';

/** Static gold line-art icon for each garment category on the selection cards. */
export default function GarmentCardArtwork({ garmentId }) {
  switch (garmentId) {
    case 't-shirt':
      return (
        <svg
          viewBox="0 0 100 100"
          className="garment-card-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tshirt-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9B47A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#9B6038" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* T-Shirt Torso & Sleeves */}
          <path
            d="M32 20 L22 28 L14 42 L24 48 L28 40 L28 82 L72 82 L72 40 L76 48 L86 42 L78 28 L68 20 C64 26 36 26 32 20 Z"
            fill="url(#tshirt-card-grad)"
            stroke="#D9B47A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Neckline seam */}
          <path
            d="M38 22 C44 28 56 28 62 22"
            fill="none"
            stroke="#120D0A"
            strokeWidth="1.8"
          />
          {/* Subtle hem and sleeve folds */}
          <line x1="28" y1="78" x2="72" y2="78" stroke="#0B0908" strokeWidth="0.8" opacity="0.4" />
          <line x1="16" y1="40" x2="25" y2="46" stroke="#0B0908" strokeWidth="0.8" opacity="0.4" />
          <line x1="84" y1="40" x2="75" y2="46" stroke="#0B0908" strokeWidth="0.8" opacity="0.4" />
        </svg>
      );

    case 'shirt':
      return (
        <svg
          viewBox="0 0 100 100"
          className="garment-card-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="shirt-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8CFA1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#B59052" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          {/* Shirt Body */}
          <path
            d="M34 18 L20 28 L12 56 L22 58 L26 36 L26 84 L74 84 L74 36 L78 58 L88 56 L80 28 L66 18 Z"
            fill="url(#shirt-card-grad)"
            stroke="#D9B47A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Placket */}
          <line x1="50" y1="26" x2="50" y2="84" stroke="#120D0A" strokeWidth="1.2" />
          {/* Collar Wings */}
          <path d="M34 18 L46 26 L50 20 L54 26 L66 18 L50 16 Z" fill="#D9B47A" stroke="#120D0A" strokeWidth="1" />
          {/* Small placket buttons */}
          <circle cx="50" cy="34" r="1.3" fill="#120D0A" />
          <circle cx="50" cy="46" r="1.3" fill="#120D0A" />
          <circle cx="50" cy="58" r="1.3" fill="#120D0A" />
          <circle cx="50" cy="70" r="1.3" fill="#120D0A" />
        </svg>
      );

    case 'jacket':
      return (
        <svg
          viewBox="0 0 100 100"
          className="garment-card-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="jacket-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9B47A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#744424" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {/* Blazer Silhouette */}
          <path
            d="M32 18 L16 26 L8 64 L20 66 L24 40 L24 84 L76 84 L76 40 L80 66 L92 64 L84 26 L68 18 Z"
            fill="url(#jacket-card-grad)"
            stroke="#D9B47A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Lapels */}
          <path d="M36 18 L46 42 L50 48 L36 34 Z" fill="#1B1512" stroke="#D9B47A" strokeWidth="1" />
          <path d="M64 18 L54 42 L50 48 L64 34 Z" fill="#1B1512" stroke="#D9B47A" strokeWidth="1" />
          {/* Center closure line */}
          <line x1="50" y1="48" x2="50" y2="84" stroke="#120D0A" strokeWidth="1.2" />
          {/* Pockets */}
          <rect x="28" y="62" width="14" height="2.5" rx="1" fill="#120D0A" />
          <rect x="58" y="62" width="14" height="2.5" rx="1" fill="#120D0A" />
          {/* Welt breast pocket */}
          <rect x="32" y="38" width="10" height="2" rx="0.5" fill="#120D0A" />
          {/* Button */}
          <circle cx="50" cy="56" r="1.8" fill="#D9B47A" />
        </svg>
      );

    case 'trousers':
      return (
        <svg
          viewBox="0 0 100 100"
          className="garment-card-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="trousers-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9B47A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#9B6038" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Trouser Waist and Legs */}
          <path
            d="M26 18 L74 18 L72 86 L53 86 L50 44 L47 86 L28 86 Z"
            fill="url(#trousers-card-grad)"
            stroke="#D9B47A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Waistband */}
          <line x1="26" y1="24" x2="74" y2="24" stroke="#120D0A" strokeWidth="1.2" />
          {/* Fly Line */}
          <line x1="50" y1="24" x2="50" y2="44" stroke="#120D0A" strokeWidth="1.2" />
          {/* Crease Lines */}
          <line x1="38" y1="28" x2="38" y2="84" stroke="#0B0908" strokeWidth="0.9" strokeDasharray="3 2" />
          <line x1="62" y1="28" x2="62" y2="84" stroke="#0B0908" strokeWidth="0.9" strokeDasharray="3 2" />
        </svg>
      );

    case 'ethnic':
    default:
      return (
        <svg
          viewBox="0 0 100 100"
          className="garment-card-svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ethnic-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8CFA1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#744424" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {/* Sherwani / Bandhgala Torso */}
          <path
            d="M34 16 L20 26 L12 60 L22 62 L26 38 L24 88 L76 88 L74 38 L78 62 L88 60 L80 26 L66 16 Z"
            fill="url(#ethnic-card-grad)"
            stroke="#D9B47A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* High Bandhgala Collar */}
          <rect x="42" y="14" width="16" height="5" rx="1.5" fill="#D9B47A" stroke="#120D0A" strokeWidth="1" />
          {/* Regal Placket with ornamental buttons */}
          <line x1="50" y1="19" x2="50" y2="88" stroke="#120D0A" strokeWidth="1.3" />
          <circle cx="50" cy="27" r="1.3" fill="#D9B47A" />
          <circle cx="50" cy="35" r="1.3" fill="#D9B47A" />
          <circle cx="50" cy="43" r="1.3" fill="#D9B47A" />
          <circle cx="50" cy="51" r="1.3" fill="#D9B47A" />
          <circle cx="50" cy="59" r="1.3" fill="#D9B47A" />
          {/* Diagonal Accent line (Angrakha feel) */}
          <path d="M42 19 Q48 30 50 42" fill="none" stroke="#B59052" strokeWidth="1" />
        </svg>
      );
  }
}
