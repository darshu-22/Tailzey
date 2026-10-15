import React from 'react';
import { PlusCircle, Shirt } from 'lucide-react';
import EmptyState from '../../../shared/ui/EmptyState';
import { describeDesign } from '../utils/recordFormat';
import RecordPanel from './RecordPanel';
import SavedRecordItem from './SavedRecordItem';

/** The user's saved outfit designs, newest first as returned by the API. */
export default function SavedDesignsList({ designs, actions }) {
  return (
    <RecordPanel
      id="saved-designs"
      title="Saved Designs"
      subtitle="Your customized silhouettes & pieces"
      list={designs}
      newLabel="New design"
      newIcon={PlusCircle}
      onNew={actions.startDesign}
      emptyState={
        <EmptyState
          icon={Shirt}
          title="No Designs Saved Yet"
          description="Craft an outfit in the studio and save it — it will appear here for you to reopen any time."
          actionLabel="Create First Design"
          onAction={actions.startDesign}
        />
      }
    >
      <ul className="saved-record-list">
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
