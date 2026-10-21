import React from 'react';
import { Plus, Shirt } from 'lucide-react';
import EmptyState from '../../../shared/ui/EmptyState';
import { describeDesign } from '../utils/recordFormat';
import RecordPanel from './RecordPanel';
import SavedRecordItem from './SavedRecordItem';

/** The user's saved outfit designs, newest first as returned by the API. */
export default function SavedDesignsList({ designs, actions, className }) {
  return (
    <RecordPanel
      id="saved-designs"
      className={className}
      title="Saved designs"
      description="Outfits you have designed and saved."
      list={designs}
      newLabel="New design"
      newIcon={Plus}
      onNew={actions.startDesign}
      emptyState={
        <EmptyState
          icon={Shirt}
          title="No saved designs yet"
          description="Design an outfit and save it. It will appear here so you can open it again any time."
          actionLabel="Design an outfit"
          onAction={actions.startDesign}
        />
      }
    >
      <ul className="dash-records">
        {designs.items.map((design) => {
          const { garment, color } = describeDesign(design);
          return (
            <SavedRecordItem
              key={design.id}
              icon={Shirt}
              title={design.name}
              details={`${garment} · ${color}`}
              badges={design.selectedSize ? [{ label: `Size ${design.selectedSize}`, variant: 'gold' }] : []}
              updatedAt={design.updatedAt}
              opening={actions.busyId === design.id}
              disabled={actions.busyId !== null}
              onOpen={() => actions.openDesign(design)}
              onDelete={() => actions.deleteDesign(design)}
            />
          );
        })}
      </ul>
    </RecordPanel>
  );
}
