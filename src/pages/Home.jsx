import React from 'react';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import UiKitSection from '../sections/UiKitSection';

/**
 * Tailzy Homepage Foundation (Phase 1)
 * Assembles the Hero, Feature Cards, How It Works, and Design System UI Kit
 */
export default function Home({ onOpenPhaseNotice }) {
  return (
    <main id="main-content">
      <HeroSection onOpenPhaseNotice={onOpenPhaseNotice} />
      <hr className="section-divider" />
      <FeaturesSection onOpenPhaseNotice={onOpenPhaseNotice} />
      <hr className="section-divider" />
      <HowItWorksSection onOpenPhaseNotice={onOpenPhaseNotice} />
      <hr className="section-divider" />
      <UiKitSection onOpenPhaseNotice={onOpenPhaseNotice} />
    </main>
  );
}
