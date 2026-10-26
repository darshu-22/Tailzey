import { circumferenceToAxes } from './bodyProfile';
import { bustShape } from './bustShape';

/**
 * Body landmarks for the mannequin, in metres (y up, feet on y = 0, facing +z).
 * Heights use typical anthropometric ratios of stature; widths come from the measurements.
 * Depth/width ratios turn circumferences into elliptical cross-sections. With an underbust the
 * chest section is the ribcage and the bust is added on top of it (see bustShape.js).
 */

const DEPTH_RATIO = { chest: 0.72, waist: 0.78, hip: 0.8, neck: 0.88 };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function bodyDimensions(cm) {
  const H = cm.height / 100;
  const s = H / 1.7; // overall scale against a 170 cm reference
  const girth = clamp(Math.sqrt(cm.chest / (0.56 * cm.height)), 0.85, 1.3);

  const bust = bustShape(cm, s);
  const chest = bust ? bust.rib : circumferenceToAxes(cm.chest, DEPTH_RATIO.chest);
  const waist = circumferenceToAxes(cm.waist, DEPTH_RATIO.waist);
  const hip = circumferenceToAxes(cm.hip, DEPTH_RATIO.hip);
  const neck = circumferenceToAxes(cm.neck, DEPTH_RATIO.neck);

  // Inseam runs crotch → bottom of the ankle, which sits a little above the floor.
  const crotchY = clamp(cm.legLength / 100 + 0.025 * H, 0.4 * H, 0.52 * H);
  const hipY = Math.max(0.515 * H, crotchY + 0.035 * H);
  const waistY = Math.max(0.615 * H, hipY + 0.07 * H);
  const chestY = Math.max(0.725 * H, waistY + 0.08 * H);
  const shoulderY = Math.max(0.818 * H, chestY + 0.07 * H);
  const neckBaseY = shoulderY + 0.024 * H;
  const chinY = 0.872 * H;

  const shoulderHalf = Math.max(cm.shoulderWidth / 200, chest.a * 1.02);
  const upperArmR = 0.045 * s * girth;
  const thighR = Math.min((0.6 * cm.hip) / 100 / (2 * Math.PI), hip.a * 0.55);

  return {
    H,
    s,
    girth,
    levels: {
      top: H,
      chin: chinY,
      neckBase: neckBaseY,
      shoulder: shoulderY,
      chest: chestY,
      waist: waistY,
      hip: hipY,
      seat: crotchY + 0.025 * H,
      crotch: crotchY,
      knee: crotchY * 0.6,
      ankle: 0.045 * H,
    },
    axes: { chest, waist, hip, neck },
    bust: bust && { ...bust, y: chestY },
    shoulderHalf,
    arm: {
      length: cm.armLength / 100,
      upperR: upperArmR,
      jointX: shoulderHalf - upperArmR * 0.85,
      jointY: shoulderY - upperArmR * 0.7,
      angle: 0.2, // radians away from the body (relaxed A-pose)
    },
    leg: { x: hip.a * 0.5, thighR, kneeR: 0.05 * s, calfR: 0.056 * s * girth, ankleR: 0.032 * s },
  };
}
