import React from 'react';
import Button from '../../../shared/ui/Button';
import { useStartActions } from '../hooks/useStartActions';

/** Slim closing call to action at the end of the overview band. */
export default function CtaSection() {
  const { primary, secondary } = useStartActions();

  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <div className="home-cta-copy">
        <h2 id="home-cta-title" className="home-cta-title">
          Ready to design something that fits?
        </h2>
        <p>It takes a few minutes to design an outfit and measure yourself.</p>
      </div>
      <div className="home-cta-actions">
        <Button onClick={primary.onClick}>{primary.label}</Button>
        <Button variant="secondary" onClick={secondary.onClick}>
          {secondary.label}
        </Button>
      </div>
    </section>
  );
}
