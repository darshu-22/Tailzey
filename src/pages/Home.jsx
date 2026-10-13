import React from 'react';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import UiKitSection from '../sections/UiKitSection';

/**
 * Tailzey Homepage Foundation (Phase 1 & Phase 2 integration)
 * Assembles the Hero, Feature Cards, How It Works, and Design System UI Kit
 */
export default function Home({ onOpenPhaseNotice, onNavigate }) {
  return (
    <main id="main-content">
      <HeroSection onOpenPhaseNotice={onOpenPhaseNotice} onNavigate={onNavigate} />
      <hr className="section-divider" />
      <FeaturesSection onOpenPhaseNotice={onOpenPhaseNotice} onNavigate={onNavigate} />
      <hr className="section-divider" />
      <HowItWorksSection onOpenPhaseNotice={onOpenPhaseNotice} onNavigate={onNavigate} />
      <hr className="section-divider" />
      <UiKitSection onOpenPhaseNotice={onOpenPhaseNotice} onNavigate={onNavigate} />
    </main>
  );
}
