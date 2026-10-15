import React from 'react';
import { PlusCircle, Ruler, Scissors } from 'lucide-react';
import EmptyState from '../../../shared/ui/EmptyState';
import { countRecorded, isCameraProfile } from '../utils/recordFormat';
import RecordPanel from './RecordPanel';
import SavedRecordItem from './SavedRecordItem';

/** The user's saved measurement profiles with completeness and capture method. */
export default function SavedProfilesList({ profiles, actions }) {
  return (
    <RecordPanel
      id="saved-profiles"
      title="Measurement Profiles"
      subtitle="Calibrated body fit dimensions"
      list={profiles}
      newLabel="New measurement"
      newIcon={PlusCircle}
      onNew={actions.startMeasurement}
      emptyState={
        <EmptyState
          icon={Scissors}
          title="No Fit Profile on Record"
          description="Complete a guided camera session or enter your measurements manually, then save the profile."
          actionLabel="Start Measuring"
          onAction={actions.startMeasurement}
        />
      }
    >
      <ul className="saved-record-list">
        {profiles.items.map((profile) => {
          const { recorded, total } = countRecorded(profile.values);
          const camera = isCameraProfile(profile);
          return (
            <SavedRecordItem
              key={profile.id}
              icon={Ruler}
              title={profile.profileName}
              details={`${recorded} of ${total} measurements recorded · ${profile.unit === 'in' ? 'inches' : 'centimetres'}`}
              badges={[{ label: camera ? 'Camera' : 'Manual', variant: camera ? 'info' : 'neutral' }]}
              updatedAt={profile.updatedAt}
              opening={actions.busyId === profile.id}
              disabled={actions.busyId !== null}
              onOpen={() => actions.openProfile(profile)}
              onDelete={() => actions.deleteProfile(profile)}
            />
          );
        })}
      </ul>
    </RecordPanel>
  );
}
