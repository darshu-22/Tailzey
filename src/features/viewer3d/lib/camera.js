/**
 * Column-major 4×4 matrix helpers for a perspective orbit camera.
 */
const TARGET = [0, -0.15, 0];
const FOV = (42 * Math.PI) / 180;
const NEAR = 0.1;
const FAR = 100;

export function perspective(aspect, fov = FOV, near = NEAR, far = FAR) {
  const f = 1 / Math.tan(fov / 2);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ]);
}

export function lookAt(eye, target = TARGET, up = [0, 1, 0]) {
  let fx = target[0] - eye[0], fy = target[1] - eye[1], fz = target[2] - eye[2];
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl; fy /= fl; fz /= fl;

  let rx = fy * up[2] - fz * up[1];
  let ry = fz * up[0] - fx * up[2];
  let rz = fx * up[1] - fy * up[0];
  const rl = Math.hypot(rx, ry, rz) || 1;
  rx /= rl; ry /= rl; rz /= rl;

  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;
  const [ex, ey, ez] = eye;

  return new Float32Array([
    rx, ux, -fx, 0,
    ry, uy, -fy, 0,
    rz, uz, -fz, 0,
    -(rx * ex + ry * ey + rz * ez), -(ux * ex + uy * ey + uz * ez), fx * ex + fy * ey + fz * ez, 1,
  ]);
}

export function multiply(a, b) {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[j * 4 + i] =
        a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3];
    }
  }
  return out;
}

/** Eye position for an orbit around the model (yaw/pitch in radians, zoom = distance). */
export function orbitEye({ yaw, pitch, zoom }) {
  return [
    zoom * Math.sin(yaw) * Math.cos(pitch),
    zoom * Math.sin(pitch) + 0.1,
    zoom * Math.cos(yaw) * Math.cos(pitch),
  ];
}
