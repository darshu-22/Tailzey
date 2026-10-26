import React from 'react';
import { Box, ShieldCheck } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import { ColorSwatches, FitPicker, GarmentPicker } from './LookControls';

/** Side panel (below the camera on phones): what to wear, and syncing with the design. */
export default function TryOnPanel({ lookState, onApply, onOpenStudio }) {
  const { garment, color, fit, matchesDesign, designSummary } = lookState;
  return (
    <aside className="tryon-panel" aria-labelledby="tryon-title">
      <header className="tryon-panel-header">
        <div className="tryon-panel-titlebar">
          <h1 id="tryon-title" className="tryon-title">
            Virtual try-on
          </h1>
          <Button variant="ghost" size="sm" icon={Box} onClick={onOpenStudio} ariaLabel="Open the 3D studio">
            3D studio
          </Button>
        </div>
        <p className="tryon-lede">A live sketch of the cut and colour on you, not an exact fit. Move and turn to check it.</p>
        <p className="tryon-privacy">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>On-device only. Video is never uploaded or stored.</span>
        </p>
      </header>

      <GarmentPicker value={garment.id} onChange={lookState.chooseGarment} />
      <ColorSwatches value={color.id} onChange={lookState.chooseColor} />
      <FitPicker value={fit.id} onChange={lookState.chooseFit} />

      <section className="tryon-design" aria-labelledby="tryon-design-title">
        <p className="tryon-design-summary">
          <span id="tryon-design-title" className="tryon-design-label">
            Your design
          </span>{' '}
          {designSummary}
        </p>
        <div className="tryon-design-actions">
          <Button variant="outline" size="sm" onClick={lookState.loadFromDesign} disabled={matchesDesign}>
            Use my design
          </Button>
          <Button size="sm" onClick={onApply} disabled={matchesDesign}>
            Apply to my design
          </Button>
        </div>
        {matchesDesign && <p className="tryon-note">You’re trying on your current design.</p>}
      </section>
    </aside>
  );
}
