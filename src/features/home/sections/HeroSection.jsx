import React from 'react';
import { Palette, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import PageContainer from '../../../shared/layout/PageContainer';
import Button from '../../../shared/ui/Button';

const HIGHLIGHTS = [
  { icon: Palette, label: 'Personalized Aesthetics' },
  { icon: Ruler, label: 'Smart Fit Geometry' },
  { icon: ShieldCheck, label: 'Privacy-First Experience' },
];

/** Landing hero: brand mark, headline and the two primary entry points (designer, measurement). */
export default function HeroSection() {
  const { navigate } = useRouter();

  return (
    <section className="hero-section" id="home" aria-label="Introduction to Tailzey">
      <div className="hero-backdrop-glow" aria-hidden="true" />

      <PageContainer>
        <div className="hero-content">
          <div className="hero-logo-container">
            <div className="hero-brand-card">
              <img src="/assets/tailzy-logo.png" alt="Tailzey official monogram logo" className="hero-logo-img" />
              <div className="hero-brand-meta">
                <span className="hero-brand-title">TAILZEY</span>
                <span className="hero-brand-tagline">CUSTOM ✦ STYLISH ✦ YOU</span>
              </div>
            </div>
          </div>

          <h1 className="hero-heading">
            Your Style. Your Fit. <span className="text-gold-gradient">Your Tailzy.</span>
          </h1>

          <p className="hero-subheading">
            Imagine your perfect outfit, explore your style, and discover a more personal approach to fit.
          </p>

          <div className="hero-actions">
            <Button variant="primary" size="lg" icon={Sparkles} onClick={() => navigate('designer')}>
              Design Your Dream Outfit
            </Button>
            <Button variant="secondary" size="lg" icon={Ruler} onClick={() => navigate('measurement')}>
              Explore Smart Measurement
            </Button>
          </div>

          <div className="hero-pill-highlights">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="hero-pill-item">
                <Icon size={15} className="hero-pill-icon" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
