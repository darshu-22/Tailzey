import React from 'react';

const BODY_PATH =
  'M148 112h24v10c18 2 34 8 38 22l12 92c1 6-8 8-10 2l-14-74l-6 34l6 26l4 128c0 6-10 7-11 1l-15-118h-32' +
  'l-15 118c-1 6-11 5-11-1l4-128l6-26l-6-34l-14 74c-2 6-11 4-10-2l12-92c4-14 20-20 38-22z';

/** Measurement guides: y position, where the line leaves the figure, and its label. */
const GUIDES = [
  { y: 144, from: 210, label: 'Shoulders' },
  { y: 170, from: 202, label: 'Chest' },
  { y: 198, from: 192, label: 'Waist' },
  { y: 224, from: 198, label: 'Hips' },
];

/** Decorative hero drawing: a phone camera framing a figure with measurement guides. */
export default function HeroIllustration() {
  return (
    <div className="home-hero-visual" aria-hidden="true">
      <svg className="home-hero-svg" viewBox="0 0 360 440" focusable="false">
        <rect className="hero-phone" x="60" y="10" width="200" height="420" rx="32" />
        <rect className="hero-screen" x="72" y="24" width="176" height="392" rx="22" />
        <path className="hero-guide" d="M88 56v-16h16M232 56v-16h-16M88 368v16h16M232 368v16h-16" />
        <circle className="hero-figure" cx="160" cy="92" r="20" />
        <path className="hero-figure" d={BODY_PATH} />
        {GUIDES.map(({ y, from, label }) => (
          <g key={label}>
            <line className="hero-measure" x1={320 - from} y1={y} x2={from} y2={y} />
            <line className="hero-leader" x1={from} y1={y} x2="270" y2={y} />
            <text className="hero-label" x="276" y={y + 4}>
              {label}
            </text>
          </g>
        ))}
        <circle className="hero-shutter" cx="160" cy="398" r="10" />
      </svg>

      <ul className="home-hero-chips">
        <li className="home-hero-chip">Front + side photo</li>
        <li className="home-hero-chip">± range on every value</li>
      </ul>
    </div>
  );
}
