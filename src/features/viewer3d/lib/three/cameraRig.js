import { MathUtils, Spherical, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Orbit camera around the mannequin: framing from body height, damping, zoom / tilt limits,
 * and eased preset views (front / side / back). The figure faces +z.
 */

export const VIEW_AZIMUTH = { front: 0, side: Math.PI / 2, back: Math.PI };
const DEFAULT_POLAR = Math.PI / 2 - 0.08;
const TWEEN_MS = 650;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function createCameraRig(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 0.8;
  controls.autoRotateSpeed = 1.2;
  controls.minPolarAngle = 0.32;
  controls.maxPolarAngle = Math.PI / 2 + 0.06;

  let height = 1.7;
  let homeDistance = 4;
  let framed = false;
  let tween = null;

  const spherical = new Spherical();
  const offset = new Vector3();

  function fitDistance(aspect) {
    const tanHalf = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const byHeight = (height * 0.58) / tanHalf;
    const byWidth = (height * 0.26) / (tanHalf * Math.max(aspect, 0.1));
    return Math.max(byHeight, byWidth) + 0.2;
  }

  function place(azimuth, polar, distance) {
    spherical.set(distance, polar, azimuth);
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
    camera.lookAt(controls.target);
  }

  function current() {
    spherical.setFromVector3(offset.copy(camera.position).sub(controls.target));
    return { azimuth: spherical.theta, polar: spherical.phi, distance: spherical.radius };
  }

  function animateTo(azimuth, polar, distance) {
    const from = current();
    if (prefersReducedMotion()) {
      place(azimuth, polar, distance);
      controls.update();
      return;
    }
    tween = { from, to: { azimuth: from.azimuth + wrapAngle(azimuth - from.azimuth), polar, distance }, start: performance.now() };
  }

  return {
    controls,
    /** Fit the camera to a body `bodyHeight` metres tall; keeps the user's angle after the first fit. */
    frame(bodyHeight, aspect) {
      height = bodyHeight;
      homeDistance = fitDistance(aspect);
      controls.minDistance = homeDistance * 0.4;
      controls.maxDistance = homeDistance * 1.6;
      const angle = framed ? current() : { azimuth: VIEW_AZIMUTH.front, polar: DEFAULT_POLAR };
      controls.target.set(0, height * 0.5, 0);
      place(angle.azimuth, angle.polar, homeDistance);
      controls.update();
      framed = true;
    },
    setView(name) {
      animateTo(VIEW_AZIMUTH[name] ?? 0, DEFAULT_POLAR, homeDistance);
    },
    reset() {
      animateTo(VIEW_AZIMUTH.front, DEFAULT_POLAR, homeDistance);
    },
    /** Advance tween + damping; true when the camera moved. */
    update(dt) {
      if (tween) {
        const t = Math.min(1, (performance.now() - tween.start) / TWEEN_MS);
        const k = easeInOut(t);
        const { from, to } = tween;
        place(
          MathUtils.lerp(from.azimuth, to.azimuth, k),
          MathUtils.lerp(from.polar, to.polar, k),
          MathUtils.lerp(from.distance, to.distance, k)
        );
        if (t >= 1) tween = null;
        return true;
      }
      return controls.update(dt);
    },
    cancelTween() {
      tween = null;
    },
    dispose() {
      controls.dispose();
    },
  };
}
