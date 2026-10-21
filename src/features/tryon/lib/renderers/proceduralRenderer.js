import { drawTop } from './drawTop';
import { drawTrousers } from './drawTrousers';

const GARMENT_OPACITY = 0.96; // a hint of the real body underneath keeps it readable as a preview

/**
 * Live, on-device renderer: draws the garment from body landmarks with canvas paths.
 * Implements the TryOnRenderer interface described in ./index.js.
 */
export const proceduralRenderer = {
  id: 'procedural',
  label: 'Live preview',
  live: true,

  /**
   * @param {CanvasRenderingContext2D} ctx overlay context, same pixel size as the video frame
   * @param {{ body: object|null, silhouette: object|null, width: number, height: number }} frame
   * @param {{ spec: object, color: { hex: string, isLight: boolean } }} look
   */
  render(ctx, frame, look) {
    const { body, silhouette, width, height } = frame;
    ctx.clearRect(0, 0, width, height);
    if (!body) return;
    ctx.save();
    ctx.globalAlpha = GARMENT_OPACITY;
    if (look.spec.kind === 'bottom') drawTrousers(ctx, body, look.spec, look.color);
    else drawTop(ctx, body, look.spec, look.color);
    ctx.restore();
    if (silhouette) {
      // Grow the outline by the fit's ease so relaxed fits can stand off the body.
      const grow = (look.spec.ease + 0.03) * body.shoulderSpan;
      silhouette.trim(ctx, width, height, grow);
    }
  },
};
