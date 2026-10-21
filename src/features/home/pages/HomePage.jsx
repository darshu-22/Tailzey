import React from 'react';
import Header from '../../../shared/layout/Header';
import Footer from '../../../shared/layout/Footer';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';
import CtaSection from '../components/CtaSection';

/**
 * Public landing page: a one-screen hero, then one compact band (how it works, features and
 * a slim call to action) that fits a single viewport on laptop and desktop, then the footer.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="home" tabIndex={-1}>
        <HeroSection />
        <div className="home-overview">
          <div className="container home-overview-inner">
            <HowItWorksSection />
            <FeaturesSection />
            <CtaSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
