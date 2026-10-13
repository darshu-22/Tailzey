import React from 'react';
import { Sparkles, Check, SlidersHorizontal, Eye, Compass } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

/**
 * How Tailzy Works section outlining the 3 numbered steps
 */
export default function HowItWorksSection({ onOpenPhaseNotice }) {
  const steps = [
    {
      stepNumber: '01',
      title: 'Choose Your Style',
      description:
        'Select your preferred garment silhouette, fabric textures, color palettes, and bespoke accents that reflect your personal aesthetic.',
      highlight: 'Silhouette & Aesthetics',
    },
    {
      stepNumber: '02',
      title: 'Explore Your Fit',
      description:
        'Input or review your key body measurements through a comfortable, guided interface designed for accuracy and anatomical harmony.',
      highlight: 'Tailored Proportions',
    },
    {
      stepNumber: '03',
      title: 'Preview Your Look',
      description:
        'Visualize how your chosen cuts and contours come together into a coherent personal collection ready for bespoke creation.',
      highlight: 'Complete Style Harmony',
    },
  ];

  return (
    <section
      className="section-padding"
      id="how-it-works"
      aria-label="How Tailzy Works"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <PageContainer>
        <SectionHeading
          eyebrow="The Journey"
          title="How Tailzy Works"
          titleGradient
          description="A three-step approach designed to turn personal inspiration into garments tailored specifically for you."
        />

        <div className="steps-container">
          {steps.map((step) => (
            <div key={step.stepNumber} className="step-card">
              <div className="step-number-badge">
                <span>{step.stepNumber}</span>
                <span className="step-number-sub">/ Step</span>
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>

              <div className="step-highlight-tag">
                <span className="ornament-star">✦</span>
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout container */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
            padding: '2.5rem',
            background: 'rgba(27, 21, 18, 0.7)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div className="eyebrow-badge" style={{ marginBottom: 0 }}>
            <span>Tailzy Philosophy</span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              color: 'var(--color-text-primary)',
              maxWidth: '680px',
            }}
          >
            "Couture shouldn't be an exception. It should be your standard."
          </h3>
          <p
            style={{
              maxWidth: '560px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            Phase 1 sets the visual foundation and brand identity. Interactive fitting and design studios will unfold in upcoming phases.
          </p>
          <Button
            variant="outline"
            size="md"
            icon={Sparkles}
            onClick={() =>
              onOpenPhaseNotice ? onOpenPhaseNotice('Phase Roadmap & Atelier') : null
            }
          >
            Explore Phase Roadmap
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
