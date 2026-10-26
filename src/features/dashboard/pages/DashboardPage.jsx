import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../app/hooks';
import { designService } from '../../../services/designService';
import { profileService } from '../../../services/profileService';
import Button from '../../../shared/ui/Button';
import PageHeader from '../../../shared/ui/PageHeader';
import SegmentedControl from '../../../shared/ui/SegmentedControl';
import AccountCard from '../components/AccountCard';
import ConfirmDialog from '../components/ConfirmDialog';
import QuickActions from '../components/QuickActions';
import SavedDesignsList from '../components/SavedDesignsList';
import SavedProfilesList from '../components/SavedProfilesList';
import { useAccountActions } from '../hooks/useAccountActions';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useRecordActions } from '../hooks/useRecordActions';
import { useSavedRecords } from '../hooks/useSavedRecords';

const countLabel = (label, list) => (list.status === 'ready' ? `${label} (${list.total})` : label);

/**
 * Signed-in home: greeting, shortcuts into the tools, the user's saved designs and
 * measurement profiles (loaded in parallel), and the account row.
 * Wide screens: fits one viewport; the two record lists scroll inside their panels.
 * Narrow screens: one record list at a time, switched with a segmented control.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const designs = useSavedRecords(designService);
  const profiles = useSavedRecords(profileService);
  const { confirm, dialogProps } = useConfirmDialog();
  const actions = useRecordActions({ designs, profiles, confirm });
  const { requestDeleteAccount } = useAccountActions({ confirm });
  const [tab, setTab] = useState('designs');
  const firstName = user?.displayName?.trim().split(/\s+/)[0];

  const tabOptions = [
    { value: 'designs', label: countLabel('Designs', designs) },
    { value: 'profiles', label: countLabel('Measurements', profiles) },
  ];

  return (
    <div className="page dashboard">
      <PageHeader
        className="dash-header"
        title={firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        description="Pick up a saved design or measurement, or start something new."
        actions={
          <Button icon={Plus} onClick={actions.startDesign}>
            New design
          </Button>
        }
      />

      <QuickActions />

      <SegmentedControl
        className="dash-tabs"
        label="Saved records to show"
        options={tabOptions}
        value={tab}
        onChange={setTab}
      />

      <div className="dash-panels">
        <SavedDesignsList designs={designs} actions={actions} className={tab === 'designs' ? '' : 'is-tab-hidden'} />
        <SavedProfilesList
          profiles={profiles}
          actions={actions}
          className={tab === 'profiles' ? '' : 'is-tab-hidden'}
        />
      </div>

      <AccountCard user={user} onDeleteAccount={requestDeleteAccount} />

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
