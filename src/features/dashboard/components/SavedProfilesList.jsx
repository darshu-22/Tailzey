import React from 'react';
import { Plus, Ruler } from 'lucide-react';
import EmptyState from '../../../shared/ui/EmptyState';
import { countRecorded, isCameraProfile } from '../utils/recordFormat';
import RecordPanel from './RecordPanel';
import SavedRecordItem from './SavedRecordItem';

/** The user's saved measurement profiles with completeness and capture method. */
export default function SavedProfilesList({ profiles, actions, className }) {
  return (
    <RecordPanel
      id="saved-profiles"
      className={className}
      title="Measurement profiles"
      description="Body measurements from the camera or entered by hand."
      list={profiles}
      newLabel="New measurement"
      newIcon={Plus}
      onNew={actions.startMeasurement}
      emptyState={
        <EmptyState
          icon={Ruler}
          title="No measurement profiles yet"
          description="Measure yourself with the camera or enter your measurements by hand, then save the profile."
          actionLabel="Measure yourself"
          onAction={actions.startMeasurement}
        />
      }
    >
      <ul className="dash-records">
        {profiles.items.map((profile) => {
          const { recorded, total } = countRecorded(profile.values);
          const camera = isCameraProfile(profile);
          return (
            <SavedRecordItem
              key={profile.id}
              icon={Ruler}
              title={profile.profileName}
              details={`${recorded} of ${total} measurements · ${profile.unit === 'in' ? 'inches' : 'centimetres'}`}
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
