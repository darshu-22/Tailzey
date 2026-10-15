import React from 'react';
import { useWorkspace } from '../../../app/hooks';
import StatusBadge from '../../../shared/ui/StatusBadge';
import StudioHeader from '../components/StudioHeader';
import ModelViewer3D from '../components/ModelViewer3D';
import OutfitSummaryPanel from '../components/OutfitSummaryPanel';

/**
 * 3D Outfit Studio: the workspace design rendered on an illustrative sample mannequin,
 * beside a summary panel that can switch garment / colour in place.
 */
export default function AvatarPreviewPage() {
  const { design } = useWorkspace();

  return (
    <div className="avatar-studio-page">
      <StudioHeader />

      <main className="avatar-studio-main" id="main-content">
        <section className="avatar-studio-hero" aria-label="3D studio overview">
          <div className="studio-hero-badges">
            <StatusBadge variant="gold" dot>
              Interactive 3D Stage
            </StatusBadge>
            <span className="studio-hero-kicker">Sample mannequin preview</span>
          </div>
          <h1 className="studio-hero-title">
            Interactive <span className="text-gold-gradient">3D Outfit Studio</span>
          </h1>
          <p className="studio-hero-desc">
            Inspect your garment from any angle on a standard sample mannequin. Orbit, zoom and try fabric tones
            in real time — this is an illustration of the design, not a scan of your body.
          </p>
        </section>

        <div className="viewer3d-layout-grid">
          <ModelViewer3D garmentId={design.garmentId} colorId={design.colorId} fitId={design.fitId} />
          <OutfitSummaryPanel />
        </div>
      </main>
    </div>
  );
}
