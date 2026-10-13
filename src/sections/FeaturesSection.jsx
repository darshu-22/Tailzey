import React from 'react';
import { Palette, Ruler, Eye, ArrowRight, Sparkles } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/ui/SectionHeading';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

/**
 * Three polished feature cards showcasing the core pillars of Tailzy
 */
export default function FeaturesSection({ onOpenPhaseNotice, onNavigate }) {
  const features = [
    {
      id: 'dream-design',
      title: 'Dream Outfit Design',
      description:
        'Personalize garment styles, fabrics, and colors tailored to your unique silhouette and aesthetic preference.',
      icon: Palette,
      badge: 'Core Feature',
      badgeVariant: 'gold',
      phaseName: 'Dream Outfit Design Studio',
      actionLabel: 'Personalize Outfit',
    },
    {
      id: 'smart-measurement',
      title: 'Smart Measurement',
      description:
        'A guided experience designed to help users review, verify, and understand their tailored measurements with confidence.',
      icon: Ruler,
      badge: 'Precision Fit',
      badgeVariant: 'bronze',
      phaseName: 'Smart Measurement Experience',
      actionLabel: 'Review Measurements',
    },
    {
      id: 'style-preview',
      title: 'Personal Style Preview',
      description:
        'Explore curated outfit concepts through an intuitive visual preview before bringing your bespoke creation to life.',
      icon: Eye,
      badge: 'Visual Experience',
      badgeVariant: 'info',
      phaseName: 'Personal Style Preview',
      actionLabel: 'Preview Concepts',
    },
  ];

  const handleCardClick = (feature) => {
    if (feature.id === 'dream-design' && onNavigate) {
      onNavigate('designer');
      return;
    }
    if (onOpenPhaseNotice) {
      onOpenPhaseNotice(feature.phaseName);
    }
  };

  return (
    <section className="section-padding" id="features" aria-label="Tailzy Features">
      <PageContainer>
        <SectionHeading
          eyebrow="The Tailzy Experience"
          title="Designed for Expression. Tailored for You."
          titleGradient
          description="A trio of interconnected experiences crafted to bridge high fashion aesthetics with personal bespoke fit."
        />

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                id={feature.id}
                interactive
                className="feature-card"
                onClick={() => handleCardClick(feature)}
              >
                <CardHeader>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div className="feature-icon-wrapper">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <StatusBadge variant={feature.badgeVariant}>
                      {feature.badge}
                    </StatusBadge>
                  </div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                </CardHeader>

                <CardBody>
                  <p className="feature-card-desc">{feature.description}</p>
                </CardBody>

                <CardFooter className="feature-card-action">
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-gold)',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {feature.actionLabel}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    ariaLabel={`${feature.actionLabel} - ${feature.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(feature);
                    }}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
