import React, { useState } from 'react';
import {
  Palette,
  Ruler,
  Sparkles,
  Info,
  Clock,
  Shirt,
  Scissors,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardActionCard from '../components/dashboard/DashboardActionCard';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';

/**
 * Dashboard page representing the signed-in user workspace foundation (Phase 2)
 */
export default function Dashboard({ onNavigate, onOpenPhaseNotice }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleActionClick = (featureName) => {
    if (onOpenPhaseNotice) {
      onOpenPhaseNotice(featureName);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Dashboard Top Header */}
      <DashboardHeader
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenPhaseNotice={onOpenPhaseNotice}
      />

      <div className="dashboard-body">
        {/* Desktop & Mobile Sidebar */}
        <DashboardSidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          onNavigate={onNavigate}
          onOpenPhaseNotice={onOpenPhaseNotice}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="dashboard-main" id="dashboard-content">
          {/* Greeting Hero Card */}
          <div className="dashboard-hero-card">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <StatusBadge variant="gold" dot>
                Atelier Workspace
              </StatusBadge>
              <StatusBadge variant="neutral">
                Phase 2 Prototype
              </StatusBadge>
            </div>

            <h1 className="dashboard-hero-title">
              Welcome to your{' '}
              <span className="text-gold-gradient">Style Studio</span>
            </h1>

            <p className="dashboard-hero-sub">
              Your personal atelier for bespoke fashion. Shape your silhouettes, explore guided body measurements, and build your tailored wardrobe foundation.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                background: 'rgba(217, 180, 122, 0.08)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(217, 180, 122, 0.2)',
              }}
            >
              <Info size={14} style={{ color: 'var(--color-gold)' }} />
              <span>Demo Mode: Real account authentication and saved design syncing will connect in future phases.</span>
            </div>
          </div>

          {/* Two Prominent Action Cards */}
          <div className="dashboard-actions-grid">
            <DashboardActionCard
              title="Design Your Dream Outfit"
              description="Personalize bespoke cuts, select luxury materials, and configure garment palettes designed for your personal aesthetic."
              badgeText="Studio Feature"
              badgeVariant="gold"
              icon={Palette}
              actionLabel="Launch Outfit Designer"
              onClick={() => (onNavigate ? onNavigate('designer') : handleActionClick('Dream Outfit Designer Studio'))}
            />

            <DashboardActionCard
              title="Start Smart Measurement"
              description="A guided, step-by-step measurement interface to calibrate and review your tailored proportions with precision."
              badgeText="Precision Fit"
              badgeVariant="bronze"
              icon={Ruler}
              actionLabel="Begin Fit Review"
              onClick={() => (onNavigate ? onNavigate('measurement') : handleActionClick('Smart Measurement Experience'))}
            />
          </div>

          {/* Recent Designs & Measurements Section with Tasteful Empty States */}
          <div className="dashboard-sections-grid">
            {/* Recent Designs Panel */}
            <div className="dashboard-panel-box">
              <div className="dashboard-panel-header">
                <div>
                  <h2 className="dashboard-panel-title">Recent Designs</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Your customized silhouettes & pieces
                  </p>
                </div>
                <StatusBadge variant="neutral">0 items</StatusBadge>
              </div>

              <div style={{ padding: '1rem 0', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                  icon={Shirt}
                  title="No Designs Created Yet"
                  description="Your customized garments will be saved here once you start crafting outfits in the studio."
                  actionLabel="Create First Design"
                  onAction={() => (onNavigate ? onNavigate('designer') : handleActionClick('Dream Outfit Designer Studio'))}
                />
              </div>
            </div>

            {/* My Measurements Summary Panel */}
            <div className="dashboard-panel-box">
              <div className="dashboard-panel-header">
                <div>
                  <h2 className="dashboard-panel-title">My Measurements</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Calibrated body fit dimensions
                  </p>
                </div>
                <StatusBadge variant="neutral">Uncalibrated</StatusBadge>
              </div>

              <div style={{ padding: '1rem 0', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                  icon={Scissors}
                  title="No Fit Profile on Record"
                  description="Complete a guided measurement session or enter your bespoke metrics directly in the Measurement Studio."
                  actionLabel="Open Measurement Studio"
                  onAction={() => (onNavigate ? onNavigate('results') : handleActionClick('Measurement Studio'))}
                />
              </div>
            </div>
          </div>

          {/* Small "Coming Soon" Area for Future Features */}
          <div className="dashboard-coming-soon-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(217, 180, 122, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-text-primary)' }}>
                  Coming Soon to Your Workspace
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Virtual drape preview, fabric swatch orders, and 3D fit visualization are in active development.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => handleActionClick('Upcoming Features Roadmap')}
            >
              View Studio Roadmap
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
