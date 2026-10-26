import React from 'react';
import { Check } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { useStartActions } from '../hooks/useStartActions';
import HeroIllustration from './HeroIllustration';

const POINTS = ['Two guided photos, no tape measure', 'Every measurement shows its ± range', 'Photos are never stored'];

/** First screen: headline, one-line explanation, the two calls to action and a simple drawing. */
export default function HeroSection() {
  const { primary, secondary } = useStartActions();

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="container home-hero-grid">
        <div className="home-hero-copy">
          <p className="eyebrow">Custom tailoring</p>
          <h1 id="home-hero-title" className="home-hero-title">
            Custom-tailored clothes, measured with your phone camera.
          </h1>
          <p className="home-hero-lead">
            Design an outfit, take a front and side photo, and get body measurements ready for your tailor.
          </p>

          <div className="home-hero-actions">
            <Button size="lg" onClick={primary.onClick}>
              {primary.label}
            </Button>
            <Button variant="secondary" size="lg" onClick={secondary.onClick}>
              {secondary.label}
            </Button>
          </div>

          <ul className="home-hero-points">
            {POINTS.map((point) => (
              <li key={point}>
                <Check size={16} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
