import React from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import PageContainer from '../../../shared/layout/PageContainer';
import SectionHeading from '../../../shared/ui/SectionHeading';
import Button from '../../../shared/ui/Button';

const STEPS = [
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

/** The three-step journey plus a closing call to action into the designer. */
export default function HowItWorksSection() {
  const { navigate } = useRouter();

  return (
    <section className="section-padding how-it-works-section" id="how-it-works" aria-label="How Tailzey Works">
      <PageContainer>
        <SectionHeading
          eyebrow="The Journey"
          title="How Tailzey Works"
          titleGradient
          description="A three-step approach designed to turn personal inspiration into garments tailored specifically for you."
        />

        <div className="steps-container">
          {STEPS.map((step) => (
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

        <div className="how-it-works-callout">
          <div className="eyebrow-badge how-it-works-callout-badge">
            <span>Tailzey Philosophy</span>
          </div>
          <h3 className="how-it-works-callout-quote">
            "Couture shouldn't be an exception. It should be your standard."
          </h3>
          <p className="how-it-works-callout-text">
            Explore our interconnected digital atelier: personalized silhouette design, guided smart measurement
            discovery, 3D avatar drape inspection, and exportable design dossiers.
          </p>
          <Button variant="outline" size="md" icon={Sparkles} onClick={() => navigate('designer')}>
            Launch Outfit Designer
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
