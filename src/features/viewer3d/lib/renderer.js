import { lookAt, multiply, orbitEye, perspective } from './camera';
import { createMannequinProgram } from './shaders';

const LIGHT_POS = [2.5, 4.0, 3.5];
const LIGHT_COLOR = [1.0, 0.94, 0.85];
const MAX_PIXEL_RATIO = 2;

/** True when the browser can create a WebGL context (the probe context is released). */
export function isWebGLAvailable() {
  try {
    const gl = window.WebGLRenderingContext && getWebGLContext(document.createElement('canvas'));
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function getWebGLContext(canvas) {
  const options = { antialias: true, alpha: true };
  return canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
}

function uploadAttribute(gl, program, name, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
  return { buffer, location };
}

/** Match the drawing buffer to the canvas's CSS size × device pixel ratio. */
function syncCanvasSize(gl, canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const width = Math.round((canvas.clientWidth || 600) * dpr);
  const height = Math.round((canvas.clientHeight || 600) * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
}

/**
 * Upload a mesh to the GPU once and return a cheap draw(view) plus dispose().
 * @param {WebGLRenderingContext} gl
 * @param {{ vertices, normals, colors, indices }} mesh
 */
export function createMannequinScene(gl, mesh) {
  const program = createMannequinProgram(gl);
  gl.useProgram(program);

  const attributes = [
    uploadAttribute(gl, program, 'aPosition', mesh.vertices),
    uploadAttribute(gl, program, 'aNormal', mesh.normals),
    uploadAttribute(gl, program, 'aColor', mesh.colors),
  ];
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

  const uniform = (name) => gl.getUniformLocation(program, name);
  const u = {
    mvp: uniform('uMVP'),
    camera: uniform('uCameraPos'),
    lightPos: uniform('uLightPos'),
    lightColor: uniform('uLightColor'),
    wireframe: uniform('uWireframe'),
    lighting: uniform('uLightingMode'),
  };

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  /** @param {{ yaw, pitch, zoom, wireframe, lightingMode }} view */
  function draw(view) {
    const canvas = gl.canvas;
    syncCanvasSize(gl, canvas);
    const eye = orbitEye(view);
    const mvp = multiply(perspective(canvas.width / canvas.height), lookAt(eye));

    gl.uniformMatrix4fv(u.mvp, false, mvp);
    gl.uniform3f(u.camera, eye[0], eye[1], eye[2]);
    gl.uniform3f(u.lightPos, ...LIGHT_POS);
    gl.uniform3f(u.lightColor, ...LIGHT_COLOR);
    gl.uniform1i(u.wireframe, view.wireframe ? 1 : 0);
    gl.uniform1i(u.lighting, view.lightingMode === 'dramatic' ? 1 : 0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(view.wireframe ? gl.LINES : gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function dispose() {
    for (const { buffer, location } of attributes) {
      gl.disableVertexAttribArray(location);
      gl.deleteBuffer(buffer);
    }
    gl.deleteBuffer(indexBuffer);
    gl.useProgram(null);
    gl.deleteProgram(program);
  }

  return { draw, dispose };
}
