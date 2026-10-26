import {
  CircleGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  ShadowMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { createCameraRig } from './cameraRig';
import { createFigure } from './figure';

/**
 * The 3D studio: one WebGL renderer mounted into `container`, a soft-lit scene with the
 * mannequin, and an orbit camera. Renders only when something changed, pauses while the tab
 * is hidden or the GL context is lost, and frees every GPU resource on dispose().
 */

const BACKGROUND = '#faf9f6'; // matches --color-bg
const SHADOW_OPACITY = 0.14;

function addLights(scene) {
  scene.add(new HemisphereLight('#ffffff', '#d6d0c6', 1.5));
  const key = new DirectionalLight('#ffffff', 2.1);
  key.position.set(1.4, 5, 2.4);
  key.target.position.set(0, 0.9, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.03;
  Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 1.6, bottom: -1.4, near: 0.5, far: 10 });
  const fill = new DirectionalLight('#f4efe6', 0.55);
  fill.position.set(-2.5, 2, -2);
  scene.add(key, key.target, fill);
}

export function createStudio(container, { onContextChange } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = NeutralToneMapping;
  const canvas = renderer.domElement;
  canvas.className = 'studio-canvas';
  container.appendChild(canvas);

  const scene = new Scene();
  scene.background = new Color(BACKGROUND);
  addLights(scene);
  // Shadow-only floor: the figure stands on the off-white backdrop with a soft contact shadow.
  const ground = new Mesh(new CircleGeometry(6, 64), new ShadowMaterial({ opacity: SHADOW_OPACITY }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const camera = new PerspectiveCamera(30, 1, 0.05, 40);
  const figure = createFigure();
  scene.add(figure.group);
  const rig = createCameraRig(camera, canvas);

  let dirty = true;
  let running = false;
  let contextLost = false;
  let raf = 0;
  let last = 0;
  const invalidate = () => {
    dirty = true;
  };

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (rig.update(dt)) dirty = true;
    if (!dirty) return;
    dirty = false;
    renderer.render(scene, camera);
  }
  function start() {
    if (running || contextLost || document.hidden) return;
    running = true;
    dirty = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (figure.dimensions) rig.frame(figure.dimensions.H, camera.aspect);
    invalidate();
  }

  const onVisibility = () => (document.hidden ? stop() : start());
  const onLost = (event) => {
    event.preventDefault();
    contextLost = true;
    stop();
    onContextChange?.(false);
  };
  const onRestored = () => {
    contextLost = false;
    start();
    onContextChange?.(true);
  };
  const onStart = () => rig.cancelTween();

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  rig.controls.addEventListener('start', onStart);
  resize();
  start();

  return {
    /** Rebuild the mannequin from body centimetres and a garment spec. */
    setFigure(bodyCm, spec) {
      const dims = figure.update(bodyCm, spec);
      rig.frame(dims.H, camera.aspect);
      invalidate();
    },
    setView(name) {
      rig.setView(name);
    },
    reset() {
      rig.reset();
    },
    setAutoRotate(on) {
      rig.controls.autoRotate = Boolean(on);
      invalidate();
    },
    dispose() {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      rig.controls.removeEventListener('start', onStart);
      rig.dispose();
      figure.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
      scene.traverse((object) => object.isLight && object.dispose?.());
      renderer.dispose();
      canvas.remove();
    },
  };
}
