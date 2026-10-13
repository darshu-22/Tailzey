import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Send,
  Eye,
  Ruler,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

/**
 * Interactive Design Foundation & UI Kit Showcase
 * Allows real-time verification of all Phase 1 reusable UI components
 */
export default function UiKitSection({ onOpenPhaseNotice }) {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons'); // buttons, inputs, states

  return (
    <section className="section-padding" id="foundation-ui" aria-label="Design System Showcase">
      <PageContainer>
        <SectionHeading
          eyebrow="Phase 1 Foundation"
          title="Reusable Component Architecture"
          titleGradient
          description="Explore the luxury design tokens, buttons, inputs, badges, and layout components engineered for Tailzy."
        />

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant={activeTab === 'buttons' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('buttons')}
          >
            Buttons & Badges
          </Button>
          <Button
            variant={activeTab === 'inputs' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('inputs')}
          >
            Form Inputs
          </Button>
          <Button
            variant={activeTab === 'states' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('states')}
          >
            Loading, Empty & Error
          </Button>
        </div>

        {/* Tab 1: Buttons & Badges */}
        {activeTab === 'buttons' && (
          <div className="ui-kit-card">
            <div className="ui-kit-grid">
              <div>
                <h4 className="ui-kit-group-title">Button Variants & Sizes</h4>
                <div className="ui-kit-row">
                  <Button variant="primary" size="sm">Primary Sm</Button>
                  <Button variant="primary" size="md">Primary Md</Button>
                  <Button variant="primary" size="lg" icon={Sparkles}>Primary Lg</Button>
                </div>
                <div className="ui-kit-row">
                  <Button variant="secondary" size="sm">Secondary Sm</Button>
                  <Button variant="secondary" size="md" icon={Ruler}>Secondary Md</Button>
                  <Button variant="secondary" size="lg">Secondary Lg</Button>
                </div>
                <div className="ui-kit-row">
                  <Button variant="outline" size="sm">Outline Sm</Button>
                  <Button variant="outline" size="md" icon={Eye}>Outline Md</Button>
                  <Button variant="ghost" size="sm">Ghost Button</Button>
                  <Button variant="primary" size="sm" disabled>Disabled</Button>
                </div>
              </div>

              <div>
                <h4 className="ui-kit-group-title">Status Badges & Tokens</h4>
                <div className="ui-kit-row">
                  <StatusBadge variant="gold" dot>Gold Badge</StatusBadge>
                  <StatusBadge variant="bronze" dot>Bronze Accent</StatusBadge>
                  <StatusBadge variant="success" icon={CheckCircle}>Verified Fit</StatusBadge>
                  <StatusBadge variant="info" icon={Info}>In Review</StatusBadge>
                  <StatusBadge variant="neutral">Draft</StatusBadge>
                </div>
                <div
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(11, 9, 8, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    marginTop: '1.25rem',
                  }}
                >
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--color-gold)' }}>Color Palette Tokens:</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#0B0908', border: '1px solid #333', borderRadius: '4px' }}>#0B0908 (Primary)</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#15110F', border: '1px solid #333', borderRadius: '4px' }}>#15110F (Secondary)</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#1B1512', border: '1px solid #333', borderRadius: '4px' }}>#1B1512 (Card)</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#9B6038', color: '#fff', borderRadius: '4px' }}>#9B6038 (Bronze)</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#D9B47A', color: '#000', borderRadius: '4px' }}>#D9B47A (Gold)</span>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#F4EEE5', color: '#000', borderRadius: '4px' }}>#F4EEE5 (Ivory)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inputs */}
        {activeTab === 'inputs' && (
          <div className="ui-kit-card">
            <div className="ui-kit-grid">
              <div>
                <h4 className="ui-kit-group-title">Form Input Components</h4>
                <Input
                  label="Outfit Concept Name"
                  placeholder="e.g. Midnight Silk Smoking Tuxedo"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  hint="A personalized moniker for your tailored design."
                  icon={Sparkles}
                />

                <Input
                  label="Search Silhouette Library"
                  placeholder="Filter garments by style, cut, or occasion..."
                  icon={Search}
                />
              </div>

              <div>
                <h4 className="ui-kit-group-title">Validation & Error States</h4>
                <Input
                  label="Target Chest Measurement (Inches)"
                  placeholder="e.g. 38"
                  value={hasError ? 'abc' : '38'}
                  error={hasError ? 'Please enter a valid numeric measurement in inches.' : undefined}
                  icon={Ruler}
                  onChange={() => {}}
                />

                <div style={{ marginTop: '1rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHasError(!hasError)}
                  >
                    Toggle Error State Demo ({hasError ? 'Active' : 'Normal'})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: States */}
        {activeTab === 'states' && (
          <div className="ui-kit-card">
            <div className="ui-kit-grid">
              <div>
                <h4 className="ui-kit-group-title">Loading Indicator</h4>
                <LoadingState message="Calculating Bespoke Geometry..." />
              </div>

              <div>
                <h4 className="ui-kit-group-title">Empty & Error Containers</h4>
                <EmptyState
                  title="No Saved Silhouettes"
                  description="Begin designing your first dream outfit to build your private Tailzy wardrobe."
                  actionLabel="Start New Design"
                  onAction={() =>
                    onOpenPhaseNotice ? onOpenPhaseNotice('Outfit Design Studio') : null
                  }
                />

                <div style={{ marginTop: '2rem' }}>
                  <ErrorState
                    title="Measurement Calibration Paused"
                    description="Could not synchronize client-side measurement tokens. Ensure internet connectivity and retry."
                    retryLabel="Retry Calibration"
                    onRetry={() =>
                      onOpenPhaseNotice ? onOpenPhaseNotice('Measurement Calibration') : null
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
