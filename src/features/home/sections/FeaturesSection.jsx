import React from 'react';
import { ArrowRight, Eye, Palette, Ruler } from 'lucide-react';
import { useRouter } from '../../../app/hooks';
import PageContainer from '../../../shared/layout/PageContainer';
import SectionHeading from '../../../shared/ui/SectionHeading';
import Card, { CardBody, CardFooter, CardHeader } from '../../../shared/ui/Card';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';

const FEATURES = [
  {
    id: 'dream-design',
    route: 'designer',
    title: 'Dream Outfit Design',
    description:
      'Personalize garment styles, fabrics, and colors tailored to your unique silhouette and aesthetic preference.',
    icon: Palette,
    badge: 'Core Feature',
    badgeVariant: 'gold',
    actionLabel: 'Personalize Outfit',
  },
  {
    id: 'smart-measurement',
    route: 'measurement',
    title: 'Smart Measurement',
    description:
      'A guided experience designed to help users review, verify, and understand their tailored measurements with confidence.',
    icon: Ruler,
    badge: 'Precision Fit',
    badgeVariant: 'bronze',
    actionLabel: 'Review Measurements',
  },
  {
    id: 'style-preview',
    route: 'preview3d',
    title: 'Personal Style Preview',
    description:
      'Explore your outfit on an interactive 3D avatar before bringing your bespoke creation to life.',
    icon: Eye,
    badge: 'Visual Experience',
    badgeVariant: 'info',
    actionLabel: 'Preview Concepts',
  },
];

/** The three product pillars, each linking straight into its studio. */
export default function FeaturesSection() {
  const { navigate } = useRouter();

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
          {FEATURES.map(({ id, route, title, description, icon: Icon, badge, badgeVariant, actionLabel }) => (
            <Card key={id} id={id} interactive className="feature-card" onClick={() => navigate(route)}>
              <CardHeader>
                <div className="feature-card-top">
                  <div className="feature-icon-wrapper">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <StatusBadge variant={badgeVariant}>{badge}</StatusBadge>
                </div>
                <h3 className="feature-card-title">{title}</h3>
              </CardHeader>

              <CardBody>
                <p className="feature-card-desc">{description}</p>
              </CardBody>

              <CardFooter className="feature-card-action">
                <span className="feature-card-action-label">{actionLabel}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  ariaLabel={`${actionLabel} - ${title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(route);
                  }}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
