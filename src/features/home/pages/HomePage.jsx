import React from 'react';
import Header from '../../../shared/layout/Header';
import Footer from '../../../shared/layout/Footer';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';

/** Public landing page: site header, hero, feature pillars, how-it-works and footer. */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <hr className="section-divider" />
        <FeaturesSection />
        <hr className="section-divider" />
        <HowItWorksSection />
        <hr className="section-divider" />
      </main>
      <Footer />
    </>
  );
}
