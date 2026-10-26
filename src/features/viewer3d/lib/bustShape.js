import { circumferenceToAxes } from './bodyProfile';

/**
 * The mannequin's bust, used only when an underbust is measured (bust & cup sizing on).
 * The chest section becomes the ribcage (an ellipse from the underbust) and each breast is a
 * dome on its front. Breasts add girth to the sides as well as the front, so the forward
 * projection is only part of bust − underbust (about 6–7 cm for a C cup).
 * Lengths are metres; `s` is the body scale against a 170 cm reference.
 */

const RIB_DEPTH_RATIO = 0.74;
const RIB_GROWTH = 1.03; // ribcage at bust level vs. directly under the bust
const PROJECTION_SHARE = 0.35;
const MIN_PROJECTION = 0.005;

/** { rib, projection, apexX, rx, ryUp, ryDown } or null when there is no bust to shape. */
export function bustShape(cm, s) {
  if (!cm.underbust || !(cm.chest > cm.underbust)) return null;
  const projection = (PROJECTION_SHARE * (cm.chest - cm.underbust)) / 100;
  if (projection < MIN_PROJECTION) return null;
  const rib = circumferenceToAxes(Math.min(cm.underbust * RIB_GROWTH, cm.chest), RIB_DEPTH_RATIO);
  return {
    rib,
    projection,
    apexX: rib.a * 0.5,
    rx: 0.05 * s + 0.3 * projection,
    ryUp: 0.065 * s + 0.25 * projection,
    ryDown: 0.035 * s + 0.35 * projection,
  };
}
