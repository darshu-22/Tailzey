import React from 'react';
import { Sparkles, Compass, ShieldCheck, Ruler, Palette } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';

/**
 * Hero section introducing Tailzy with prominent logo branding,
 * high-converting luxury headline, and clear action pathways.
 */
export default function HeroSection({ onOpenPhaseNotice, onNavigate }) {
  const handlePrimaryAction = () => {
    if (onNavigate) {
      onNavigate('designer');
    } else if (onOpenPhaseNotice) {
      onOpenPhaseNotice('Outfit Design Studio (Dream Design)');
    }
  };

  const handleSecondaryAction = () => {
    if (onNavigate) {
      onNavigate('measurement');
    } else {
      const featEl = document.getElementById('features');
      if (featEl) {
        featEl.scrollIntoView({ behavior: 'smooth' });
      } else if (onOpenPhaseNotice) {
        onOpenPhaseNotice('Smart Body Measurement');
      }
    }
  };

  return (
    <section className="hero-section" id="home" aria-label="Introduction to Tailzey">
      <div className="hero-backdrop-glow" aria-hidden="true" />

      <PageContainer>
        <div className="hero-content">
          {/* Prominent, Tasteful Official Logo Presentation */}
          <div className="hero-logo-container">
            <div className="hero-brand-card">
              <img
                src="/assets/tailzy-logo.png"
                alt="Tailzey official monogram logo"
                className="hero-logo-img"
              />
              <div className="hero-brand-meta">
                <span className="hero-brand-title">TAILZEY</span>
                <span className="hero-brand-tagline">CUSTOM ✦ STYLISH ✦ YOU</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            Your Style. Your Fit.{' '}
            <span className="text-gold-gradient">Your Tailzy.</span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-subheading">
            Imagine your perfect outfit, explore your style, and discover a more personal approach to fit.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              onClick={handlePrimaryAction}
              ariaLabel="Design Your Dream Outfit"
            >
              Design Your Dream Outfit
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={Ruler}
              onClick={handleSecondaryAction}
              ariaLabel="Explore Smart Measurement"
            >
              Explore Smart Measurement
            </Button>
          </div>

          {/* Curated Brand Highlights */}
          <div className="hero-pill-highlights">
            <div className="hero-pill-item">
              <Palette size={15} className="hero-pill-icon" aria-hidden="true" />
              <span>Personalized Aesthetics</span>
            </div>
            <div className="hero-pill-item">
              <Ruler size={15} className="hero-pill-icon" aria-hidden="true" />
              <span>Smart Fit Geometry</span>
            </div>
            <div className="hero-pill-item">
              <ShieldCheck size={15} className="hero-pill-icon" aria-hidden="true" />
              <span>Privacy-First Experience</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
