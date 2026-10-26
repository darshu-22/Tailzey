import React, { useMemo, useState } from 'react';
import { useWorkspace } from '../../../app/hooks';
import SegmentedControl from '../../../shared/ui/SegmentedControl';
import { resolveBodyProfile } from '../lib/bodyProfile';
import { MANNEQUINS } from '../lib/mannequin/garmentCatalog';
import { useMannequin } from '../hooks/useMannequin';
import { useStudioDesign } from '../hooks/useStudioDesign';
import StudioStage from '../components/StudioStage';
import OutfitSwitcher from '../components/OutfitSwitcher';
import BodyMeasurements from '../components/BodyMeasurements';
import StudioNextSteps from '../components/StudioNextSteps';

/**
 * 3D studio: an approximate mannequin shaped from the workspace measurements, wearing the
 * workspace design, beside a compact panel for quick outfit edits and the values in use.
 * The mannequin is MakeHuman's body fitted to the measurements and dressed in CC0 garments with
 * cloth physics; the simplified figure stands in until it is ready, or if its assets fail.
 * On desktop the page is exactly one viewport tall; on phones the panel follows the canvas.
 */
export default function AvatarPreviewPage() {
  const { measurement } = useWorkspace();
  const { design, spec, selectGarment, setColor, setFit } = useStudioDesign();
  const profile = useMemo(() => resolveBodyProfile(measurement), [measurement]);
  const hasEstimates = Object.values(profile.estimated).some(Boolean);
  const [sex, setSex] = useState(() => (measurement.includeBust ? 'female' : 'male'));
  const mannequin = useMannequin({ sex, bodyCm: profile.cm, spec });
  const realistic = mannequin.status === 'ready';

  return (
    <div className="page-tool studio">
      <StudioStage bodyCm={profile.cm} spec={spec} mannequin={mannequin} />

      <aside className="studio-panel" aria-labelledby="studio-title">
        <header className="studio-panel-header">
          <div className="studio-title-row">
            <h1 id="studio-title" className="studio-title">3D studio</h1>
            <SegmentedControl label="Mannequin" options={MANNEQUINS} value={sex} onChange={setSex} className="studio-sex" />
          </div>
          <p className="studio-note">
            Approximate shape, not a body scan.{' '}
            {realistic && 'MakeHuman models (CC0), draped with cloth physics.'}
            {mannequin.status === 'loading' && 'Loading the detailed mannequin…'}
            {mannequin.status === 'error' && 'Shown as a simplified shape.'}
          </p>
        </header>

        <OutfitSwitcher design={design} spec={spec} onGarment={selectGarment} onColor={setColor} onFit={setFit} />
        <BodyMeasurements profile={profile} measurement={measurement} />
        <StudioNextSteps hasEstimates={hasEstimates} />

      </aside>
    </div>
  );
}
