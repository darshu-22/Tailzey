import React, { useState } from 'react';
import { Palette, Ruler } from 'lucide-react';
import { useAuth } from '../../../app/hooks';
import { designService } from '../../../services/designService';
import { profileService } from '../../../services/profileService';
import ConfirmDialog from '../components/ConfirmDialog';
import DashboardActionCard from '../components/DashboardActionCard';
import DashboardHeader from '../components/DashboardHeader';
import DashboardHero from '../components/DashboardHero';
import DashboardShortcuts from '../components/DashboardShortcuts';
import DashboardSidebar from '../components/DashboardSidebar';
import SavedDesignsList from '../components/SavedDesignsList';
import SavedProfilesList from '../components/SavedProfilesList';
import { useAccountActions } from '../hooks/useAccountActions';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useRecordActions } from '../hooks/useRecordActions';
import { useSavedRecords } from '../hooks/useSavedRecords';

/**
 * Signed-in home: greeting, start-new actions, the user's saved designs and measurement
 * profiles (loaded in parallel), shortcuts, and account actions.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const designs = useSavedRecords(designService);
  const profiles = useSavedRecords(profileService);
  const { confirm, dialogProps } = useConfirmDialog();
  const actions = useRecordActions({ designs, profiles, confirm });
  const account = useAccountActions({ confirm });

  return (
    <div className="dashboard-layout">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onSignOut={account.signOut}
      />

      <div className="dashboard-body">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSignOut={account.signOut}
          onDeleteAccount={account.requestDeleteAccount}
        />

        <main className="dashboard-main" id="main-content">
          <DashboardHero user={user} />

          <div className="dashboard-actions-grid">
            <DashboardActionCard
              title="Design Your Dream Outfit"
              description="Personalize bespoke cuts, select luxury materials, and configure garment palettes designed for your personal aesthetic."
              badgeText="Studio Feature"
              badgeVariant="gold"
              icon={Palette}
              actionLabel="Start a New Design"
              onClick={actions.startDesign}
            />
            <DashboardActionCard
              title="Start Smart Measurement"
              description="A guided, step-by-step measurement session to capture and review your tailored proportions with precision."
              badgeText="Precision Fit"
              badgeVariant="bronze"
              icon={Ruler}
              actionLabel="Begin New Measurement"
              onClick={actions.startMeasurement}
            />
          </div>

          <div className="dashboard-sections-grid">
            <SavedDesignsList designs={designs} actions={actions} />
            <SavedProfilesList profiles={profiles} actions={actions} />
          </div>

          <DashboardShortcuts />
        </main>
      </div>

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
