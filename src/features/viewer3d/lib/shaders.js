/**
 * GLSL for the mannequin: Blinn-Phong key light, ambient fill and a warm Fresnel rim.
 * uLightingMode 0 = atelier (soft), 1 = dramatic (darker fill, stronger rim).
 */
const VERTEX_SHADER = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec3 aColor;

  uniform mat4 uMVP;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vColor;

  void main() {
    vNormal = normalize(aNormal);
    vPosition = aPosition;
    vColor = aColor;
    gl_Position = uMVP * vec4(aPosition, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vColor;

  uniform vec3 uLightPos;
  uniform vec3 uLightColor;
  uniform vec3 uCameraPos;
  uniform int uWireframe;
  uniform int uLightingMode;

  void main() {
    if (uWireframe == 1) {
      gl_FragColor = vec4(0.85, 0.70, 0.48, 0.9);
      return;
    }

    bool dramatic = uLightingMode == 1;
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vPosition);
    vec3 L = normalize(uLightPos - vPosition);

    vec3 ambient = vColor * (dramatic ? 0.14 : 0.28);
    vec3 diffuse = vColor * max(dot(N, L), 0.0) * uLightColor;

    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 28.0) * (dramatic ? 0.5 : 0.35);
    vec3 specular = vec3(0.95, 0.85, 0.70) * spec;

    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.2) * (dramatic ? 0.65 : 0.42);
    vec3 rimLight = vec3(0.85, 0.70, 0.48) * rim;

    gl_FragColor = vec4(ambient + diffuse + specular + rimLight, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

/** Compile + link the mannequin program. Shaders are detached and freed once linked. */
export function createMannequinProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  let fs;
  try {
    fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  } catch (error) {
    gl.deleteShader(vs);
    throw error;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}
