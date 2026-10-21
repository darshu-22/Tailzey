import React, { useMemo } from 'react';
import { useWorkspace } from '../../../app/hooks';
import { resolveBodyProfile } from '../lib/bodyProfile';
import { useStudioDesign } from '../hooks/useStudioDesign';
import StudioStage from '../components/StudioStage';
import OutfitSwitcher from '../components/OutfitSwitcher';
import BodyMeasurements from '../components/BodyMeasurements';
import StudioNextSteps from '../components/StudioNextSteps';

/**
 * 3D studio: an approximate mannequin shaped from the workspace measurements, wearing the
 * workspace design, beside a compact panel for quick outfit edits and the values in use.
 * On desktop the page is exactly one viewport tall; on phones the panel follows the canvas.
 */
export default function AvatarPreviewPage() {
  const { measurement } = useWorkspace();
  const { design, spec, selectGarment, setColor, setFit } = useStudioDesign();
  const profile = useMemo(() => resolveBodyProfile(measurement), [measurement]);
  const hasEstimates = Object.values(profile.estimated).some(Boolean);

  return (
    <div className="page-tool studio">
      <StudioStage bodyCm={profile.cm} spec={spec} />

      <aside className="studio-panel" aria-labelledby="studio-title">
        <header className="studio-panel-header">
          <h1 id="studio-title" className="studio-title">3D studio</h1>
          <p className="studio-note">
            Approximate body shape from your measurements — not a body scan. Garment shapes are simplified.
          </p>
        </header>

        <OutfitSwitcher design={design} spec={spec} onGarment={selectGarment} onColor={setColor} onFit={setFit} />
        <BodyMeasurements profile={profile} measurement={measurement} />
        <StudioNextSteps hasEstimates={hasEstimates} />
      </aside>
    </div>
  );
}
