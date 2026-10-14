import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  Eye,
  AlertTriangle,
  Move,
  Maximize2,
} from 'lucide-react';
import { getColorById, getGarmentById, getFitById, getStyleById } from '../../data/designerData';

/**
 * Procedural 3D Polygonal Mesh Generator for Tailzey Atelier
 * Generates 3D vertices, normals, and triangular faces for:
 * - Studio Mannequin Body & Pedestal
 * - Garment Silhouettes (Jacket, Shirt, T-Shirt, Trousers, Ethnic Wear)
 */
function createMannequinMesh(garmentId = 'jacket', fitId = 'regular', fabricColorHex = '#161618') {
  const vertices = [];
  const normals = [];
  const colors = [];
  const indices = [];

  // Helper to parse hex color to RGB [0..1]
  const parseHex = (hex) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  };

  const garmentRgb = parseHex(fabricColorHex);
  const mannequinWoodRgb = [0.18, 0.13, 0.10]; // Warm dark ebony wood
  const brassRgb = [0.85, 0.70, 0.48];         // Polished champagne brass
  const standSteelRgb = [0.45, 0.40, 0.35];    // Polished steel rod

  // Fit ease scale factor for waist
  const waistEase = fitId === 'slim' ? 0.88 : fitId === 'relaxed' ? 1.15 : 1.0;

  // Add a quad (2 triangles) with lighting normals
  function addQuad(v0, v1, v2, v3, col) {
    const startIdx = vertices.length / 3;

    // Normal calculation: (v1 - v0) x (v2 - v0)
    const ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2];
    const bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= len; ny /= len; nz /= len;

    [v0, v1, v2, v3].forEach((v) => {
      vertices.push(v[0], v[1], v[2]);
      normals.push(nx, ny, nz);
      colors.push(col[0], col[1], col[2]);
    });

    indices.push(
      startIdx, startIdx + 1, startIdx + 2,
      startIdx, startIdx + 2, startIdx + 3
    );
  }

  // Add cylinder slice
  function addCylinder(yBottom, yTop, rBottom, rTop, segments, col, xOffset = 0, zOffset = 0) {
    const ringBottom = [];
    const ringTop = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      ringBottom.push([xOffset + cos * rBottom, yBottom, zOffset + sin * rBottom]);
      ringTop.push([xOffset + cos * rTop, yTop, zOffset + sin * rTop]);
    }

    for (let i = 0; i < segments; i++) {
      addQuad(ringBottom[i], ringBottom[i + 1], ringTop[i + 1], ringTop[i], col);
    }
  }

  // 1. ATELIER PEDESTAL BASE & STEEL MOUNTING ROD
  // Pedestal Plate (Circular floor plate)
  addCylinder(-2.4, -2.32, 0.9, 0.85, 24, mannequinWoodRgb);
  addCylinder(-2.32, -2.28, 0.85, 0.4, 24, brassRgb);
  // Steel Mounting Rod
  addCylinder(-2.28, -0.6, 0.05, 0.05, 12, standSteelRgb);

  // 2. TORSO MANNEQUIN FOUNDATION
  // Brass Finial Topper on neck
  addCylinder(1.68, 1.82, 0.16, 0.04, 16, brassRgb);
  addCylinder(1.52, 1.68, 0.22, 0.16, 16, brassRgb);
  // Neck
  addCylinder(1.32, 1.52, 0.26, 0.22, 16, mannequinWoodRgb);

  // 3. GARMENT-SPECIFIC SILHOUETTE CONSTRUCTION
  if (garmentId === 'trousers') {
    // Mannequin upper torso in dark linen
    addCylinder(0.9, 1.32, 0.62, 0.38, 18, mannequinWoodRgb);
    addCylinder(0.4, 0.9, 0.54 * waistEase, 0.62, 18, mannequinWoodRgb);

    // Trousers Waistband & Rise
    addCylinder(0.25, 0.45, 0.56 * waistEase, 0.54 * waistEase, 20, garmentRgb);
    addCylinder(-0.15, 0.25, 0.62 * waistEase, 0.56 * waistEase, 20, garmentRgb);

    // Left Trouser Leg
    addCylinder(-1.15, -0.15, 0.28, 0.32, 16, garmentRgb, -0.26);
    addCylinder(-2.15, -1.15, 0.23, 0.28, 16, garmentRgb, -0.26);
    // Left Trouser Cuff / Hem
    addCylinder(-2.22, -2.15, 0.24, 0.23, 16, garmentRgb, -0.26);

    // Right Trouser Leg
    addCylinder(-1.15, -0.15, 0.28, 0.32, 16, garmentRgb, 0.26);
    addCylinder(-2.15, -1.15, 0.23, 0.28, 16, garmentRgb, 0.26);
    // Right Trouser Cuff / Hem
    addCylinder(-2.22, -2.15, 0.24, 0.23, 16, garmentRgb, 0.26);
  } else if (garmentId === 'ethnic') {
    // Imperial Sherwani / Royal Bandhgala
    // High Structured Mandarin Collar
    addCylinder(1.32, 1.48, 0.28, 0.26, 18, brassRgb);

    // Shoulders & Chest
    addCylinder(0.9, 1.32, 0.76, 0.42, 20, garmentRgb);
    // Tapered Torso
    addCylinder(0.35, 0.9, 0.64 * waistEase, 0.76, 20, garmentRgb);
    // Long Flared Tunic / Sherwani Drop below knees
    addCylinder(-0.4, 0.35, 0.74, 0.64 * waistEase, 20, garmentRgb);
    addCylinder(-1.25, -0.4, 0.82, 0.74, 20, garmentRgb);
    // Gold Embroidered Hemline Border
    addCylinder(-1.32, -1.25, 0.83, 0.82, 20, brassRgb);

    // Left Arm / Sleeve
    addCylinder(0.45, 1.15, 0.22, 0.26, 14, garmentRgb, -0.82);
    addCylinder(-0.25, 0.45, 0.18, 0.22, 14, garmentRgb, -0.82);
    // Left Gold Cuff
    addCylinder(-0.32, -0.25, 0.19, 0.18, 14, brassRgb, -0.82);

    // Right Arm / Sleeve
    addCylinder(0.45, 1.15, 0.22, 0.26, 14, garmentRgb, 0.82);
    addCylinder(-0.25, 0.45, 0.18, 0.22, 14, garmentRgb, 0.82);
    // Right Gold Cuff
    addCylinder(-0.32, -0.25, 0.19, 0.18, 14, brassRgb, 0.82);
  } else if (garmentId === 'shirt') {
    // Crisp Tailored Shirt
    // Spread Collar
    addCylinder(1.28, 1.42, 0.32, 0.25, 18, garmentRgb);
    // Yoke & Shoulders
    addCylinder(0.85, 1.28, 0.72, 0.38, 20, garmentRgb);
    // Fitted Chest to Waist
    addCylinder(0.3, 0.85, 0.58 * waistEase, 0.72, 20, garmentRgb);
    // Curved Shirttail Hem
    addCylinder(-0.15, 0.3, 0.62 * waistEase, 0.58 * waistEase, 20, garmentRgb);

    // Left Cuffed Long Sleeve
    addCylinder(0.4, 1.12, 0.21, 0.25, 14, garmentRgb, -0.78);
    addCylinder(-0.35, 0.4, 0.17, 0.21, 14, garmentRgb, -0.78);
    // Left Pearl Button Cuff
    addCylinder(-0.42, -0.35, 0.18, 0.17, 14, [0.95, 0.95, 0.92], -0.78);

    // Right Cuffed Long Sleeve
    addCylinder(0.4, 1.12, 0.21, 0.25, 14, garmentRgb, 0.78);
    addCylinder(-0.35, 0.4, 0.17, 0.21, 14, garmentRgb, 0.78);
    // Right Pearl Button Cuff
    addCylinder(-0.42, -0.35, 0.18, 0.17, 14, [0.95, 0.95, 0.92], 0.78);

    // Wooden lower torso base
    addCylinder(-0.45, -0.15, 0.42, 0.58, 16, mannequinWoodRgb);
  } else if (garmentId === 't-shirt') {
    // Ribbed Collar Ring
    addCylinder(1.24, 1.34, 0.31, 0.25, 18, garmentRgb);
    // Shoulders
    addCylinder(0.85, 1.24, 0.70, 0.38, 20, garmentRgb);
    // Torso Drape
    addCylinder(0.25, 0.85, 0.57 * waistEase, 0.70, 20, garmentRgb);
    // Straight Hem
    addCylinder(-0.2, 0.25, 0.60 * waistEase, 0.57 * waistEase, 20, garmentRgb);

    // Short Sleeves
    addCylinder(0.7, 1.12, 0.24, 0.26, 14, garmentRgb, -0.76);
    addCylinder(0.7, 1.12, 0.24, 0.26, 14, garmentRgb, 0.76);

    // Wooden lower torso base
    addCylinder(-0.5, -0.2, 0.4, 0.56, 16, mannequinWoodRgb);
  } else {
    // DEFAULT: TAILORED JACKET / BLAZER
    // Lapels & Collar
    addCylinder(1.26, 1.40, 0.34, 0.26, 18, garmentRgb);
    // Structured Padded Shoulders
    addCylinder(0.85, 1.26, 0.78, 0.42, 22, garmentRgb);
    // Contoured Chest & Double-Button Waist
    addCylinder(0.25, 0.85, 0.62 * waistEase, 0.78, 22, garmentRgb);
    // Flared Hip Drop with Rear Vent
    addCylinder(-0.35, 0.25, 0.68 * waistEase, 0.62 * waistEase, 22, garmentRgb);

    // Tailored Left Jacket Arm
    addCylinder(0.4, 1.18, 0.23, 0.27, 14, garmentRgb, -0.84);
    addCylinder(-0.38, 0.4, 0.19, 0.23, 14, garmentRgb, -0.84);

    // Tailored Right Jacket Arm
    addCylinder(0.4, 1.18, 0.23, 0.27, 14, garmentRgb, 0.84);
    addCylinder(-0.38, 0.4, 0.19, 0.23, 14, garmentRgb, 0.84);

    // Wooden lower torso base
    addCylinder(-0.6, -0.35, 0.42, 0.62, 16, mannequinWoodRgb);
  }

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
  };
}

/**
 * ModelViewer3D Component (Phase 6)
 * Native WebGL 3D Atelier Mannequin with interactive orbit controls,
 * Blinn-Phong luxury lighting, preset angles, turntable rotation,
 * and seamless fallback support.
 */
export default function ModelViewer3D({
  garmentId = 'jacket',
  colorId = 'black',
  fitId = 'regular',
  styleId = 'classic',
  options = {},
  unit = 'cm',
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Active color specifications
  const color = getColorById(colorId);
  const garment = getGarmentById(garmentId);
  const fit = getFitById(fitId);

  // 3D Camera & Interaction State
  const [yaw, setYaw] = useState(0.4);         // Horizontal rotation (radians)
  const [pitch, setPitch] = useState(0.08);    // Vertical tilt (radians)
  const [zoom, setZoom] = useState(2.8);        // Distance from model
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState('atelier'); // 'atelier' | 'dramatic' | 'pure'
  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [canvasResizeKey, setCanvasResizeKey] = useState(0);

  // Resize listener to adapt canvas resolution
  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setCanvasResizeKey((k) => k + 1);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse drag coordinates tracking
  const dragStartRef = useRef({ x: 0, y: 0, yaw: 0, pitch: 0 });
  const animFrameRef = useRef(null);

  // Initial load simulation (smooth luxury atelier transition)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [garmentId, fitId]);

  // Turntable Auto-Rotation Loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let lastTime = performance.now();
    const rotateLoop = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setYaw((prev) => (prev + delta * 0.45) % (Math.PI * 2));
      animFrameRef.current = requestAnimationFrame(rotateLoop);
    };

    animFrameRef.current = requestAnimationFrame(rotateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isDragging]);

  // WEBGL 3D RENDER LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: true }) ||
           canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
    } catch (e) {
      setHasWebGLError(true);
      return;
    }

    if (!gl) {
      setHasWebGLError(true);
      return;
    }

    setHasWebGLError(false);

    // Resize viewport to display size
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Build procedural 3D mannequin mesh
    const mesh = createMannequinMesh(garmentId, fitId, color.hex);

    // Shaders: Vertex & Fragment
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec3 aColor;

      uniform mat4 uMVP;
      uniform mat4 uModel;
      uniform mat3 uNormalMat;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vColor;

      void main() {
        vNormal = normalize(uNormalMat * aNormal);
        vec4 worldPos = uModel * vec4(aPosition, 1.0);
        vPosition = worldPos.xyz;
        vColor = aColor;
        gl_Position = uMVP * vec4(aPosition, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vColor;

      uniform vec3 uLightPos1;
      uniform vec3 uLightColor1;
      uniform vec3 uCameraPos;
      uniform int uWireframe;
      uniform int uLightingMode;

      void main() {
        if (uWireframe == 1) {
          gl_FragColor = vec4(0.85, 0.70, 0.48, 0.9);
          return;
        }

        vec3 N = normalize(vNormal);
        vec3 V = normalize(uCameraPos - vPosition);

        // Ambient atelier lighting
        vec3 ambient = vColor * 0.28;

        // Key light (warm champagne spotlight)
        vec3 L1 = normalize(uLightPos1 - vPosition);
        float diff1 = max(dot(N, L1), 0.0);
        vec3 diffuse1 = vColor * diff1 * uLightColor1;

        // Specular highlight (Blinn-Phong)
        vec3 H1 = normalize(L1 + V);
        float spec1 = pow(max(dot(N, H1), 0.0), 28.0) * 0.35;
        vec3 specular = vec3(0.95, 0.85, 0.70) * spec1;

        // Luxury Fresnel Rim lighting
        float rimFactor = 1.0 - max(dot(N, V), 0.0);
        float rim = pow(rimFactor, 3.2) * 0.42;
        vec3 rimLight = vec3(0.85, 0.70, 0.48) * rim;

        vec3 finalColor = ambient + diffuse1 + specular + rimLight;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile Shader helper
    function compileShader(src, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Buffers setup
    const vBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const nBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    const aNorm = gl.getAttribLocation(prog, 'aNormal');
    gl.enableVertexAttribArray(aNorm);
    gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

    const cBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
    const aCol = gl.getAttribLocation(prog, 'aColor');
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    const iBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    // Matrix calculations
    // Perspective Projection Matrix
    const fov = (42 * Math.PI) / 180;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 100.0;
    const f = 1.0 / Math.tan(fov / 2);
    const proj = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0,
    ]);

    // View Matrix (Orbit Camera)
    const camDist = zoom;
    const camX = camDist * Math.sin(yaw) * Math.cos(pitch);
    const camY = camDist * Math.sin(pitch) + 0.1;
    const camZ = camDist * Math.cos(yaw) * Math.cos(pitch);

    // LookAt matrix targeting model center [0, -0.15, 0]
    const target = [0, -0.15, 0];
    const up = [0, 1, 0];
    // Forward (target - eye)
    let fx = target[0] - camX, fy = target[1] - camY, fz = target[2] - camZ;
    const flen = Math.sqrt(fx * fx + fy * fy + fz * fz) || 1;
    fx /= flen; fy /= flen; fz /= flen;
    // Right (f x up)
    let rx = fy * up[2] - fz * up[1];
    let ry = fz * up[0] - fx * up[2];
    let rz = fx * up[1] - fy * up[0];
    const rlen = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1;
    rx /= rlen; ry /= rlen; rz /= rlen;
    // Up (r x f)
    const ux = ry * fz - rz * fy;
    const uy = rz * fx - rx * fz;
    const uz = rx * fy - ry * fx;

    const view = new Float32Array([
      rx, ux, -fx, 0,
      ry, uy, -fy, 0,
      rz, uz, -fz, 0,
      -(rx * camX + ry * camY + rz * camZ),
      -(ux * camX + uy * camY + uz * camZ),
      fx * camX + fy * camY + fz * camZ,
      1,
    ]);

    // Multiply Proj * View
    function multiplyMatrices(a, b) {
      const out = new Float32Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          out[j * 4 + i] =
            a[i] * b[j * 4] +
            a[4 + i] * b[j * 4 + 1] +
            a[8 + i] * b[j * 4 + 2] +
            a[12 + i] * b[j * 4 + 3];
        }
      }
      return out;
    }

    const mvp = multiplyMatrices(proj, view);
    const modelMat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);

    const normMat = new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);

    // Set Uniforms
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'uMVP'), false, mvp);
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'uModel'), false, modelMat);
    gl.uniformMatrix3fv(gl.getUniformLocation(prog, 'uNormalMat'), false, normMat);
    gl.uniform3f(gl.getUniformLocation(prog, 'uCameraPos'), camX, camY, camZ);
    gl.uniform3f(gl.getUniformLocation(prog, 'uLightPos1'), 2.5, 4.0, 3.5);
    gl.uniform3f(gl.getUniformLocation(prog, 'uLightColor1'), 1.0, 0.94, 0.85);
    gl.uniform1i(gl.getUniformLocation(prog, 'uWireframe'), isWireframe ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(prog, 'uLightingMode'), lightingMode === 'dramatic' ? 1 : 0);

    // Draw
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const drawMode = isWireframe ? gl.LINES : gl.TRIANGLES;
    gl.drawElements(drawMode, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

    // Clean up
    return () => {
      gl.deleteBuffer(vBuf);
      gl.deleteBuffer(nBuf);
      gl.deleteBuffer(cBuf);
      gl.deleteBuffer(iBuf);
      gl.deleteProgram(prog);
    };
  }, [garmentId, fitId, color.hex, yaw, pitch, zoom, isWireframe, lightingMode, canvasResizeKey]);

  // ORBIT CONTROLS EVENT HANDLERS
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      yaw,
      pitch,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newYaw = dragStartRef.current.yaw + deltaX * 0.008;
    // Clamp pitch between -35° and +45°
    const newPitch = Math.max(-0.45, Math.min(0.75, dragStartRef.current.pitch + deltaY * 0.006));

    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((prev) => Math.max(1.6, Math.min(4.2, prev + e.deltaY * 0.0025)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Keyboard navigation for rotation and zoom
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsAutoRotating(false);
      setYaw((prev) => prev - 0.12);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsAutoRotating(false);
      setYaw((prev) => prev + 0.12);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsAutoRotating(false);
      setPitch((prev) => Math.min(0.75, prev + 0.08));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsAutoRotating(false);
      setPitch((prev) => Math.max(-0.45, prev - 0.08));
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoom((prev) => Math.max(1.6, prev - 0.25));
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setZoom((prev) => Math.min(4.2, prev + 0.25));
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      handleResetView();
    }
  };

  // PRESET VIEW ANGLE CONTROLS
  const setPresetAngle = (targetYaw, targetPitch = 0.06) => {
    setIsAutoRotating(false);
    setYaw(targetYaw);
    setPitch(targetPitch);
  };

  const handleResetView = () => {
    setIsAutoRotating(false);
    setYaw(0.4);
    setPitch(0.08);
    setZoom(2.8);
  };

  return (
    <div
      ref={containerRef}
      className={`viewer3d-stage-card ${className}`.trim()}
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="3D Avatar & Outfit Interactive Stage. Use Arrow keys to rotate, plus or minus to zoom, and R to reset perspective."
    >
      {/* Top Overlay: Badges and Mode Toggles */}
      <div className="viewer3d-top-overlay">
        <div className="viewer-badge-cluster">
          <span className="viewer-render-tag">
            3D Atelier Mannequin
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {garment.name} • {color.name}
          </span>
        </div>

        <div className="viewer-tools-group" role="toolbar" aria-label="3D Display Modes">
          <button
            type="button"
            className={`viewer-tool-btn ${isWireframe ? 'is-active' : ''}`}
            onClick={() => setIsWireframe(!isWireframe)}
            aria-pressed={isWireframe}
            aria-label="Toggle CAD wireframe mesh mode"
            title="Toggle Wireframe Mesh"
          >
            <Layers size={13} />
            <span>{isWireframe ? 'Shaded' : 'Wireframe'}</span>
          </button>

          <button
            type="button"
            className={`viewer-tool-btn ${isAutoRotating ? 'is-active' : ''}`}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            aria-pressed={isAutoRotating}
            aria-label="Toggle 360 degree turntable auto-rotation"
            title="360° Turntable Mode"
          >
            <RotateCcw size={13} />
            <span>Turntable</span>
          </button>

          <button
            type="button"
            className={`viewer-tool-btn ${lightingMode === 'dramatic' ? 'is-active' : ''}`}
            onClick={() => setLightingMode(lightingMode === 'atelier' ? 'dramatic' : 'atelier')}
            aria-label="Toggle dramatic lighting contrast"
            title="Studio Lighting"
          >
            <Sun size={13} />
            <span>Lighting</span>
          </button>
        </div>
      </div>

      {/* Drag & Rotation Guide Hint */}
      {!isDragging && (
        <div className="viewer-drag-hint">
          <Move size={12} style={{ color: 'var(--color-gold)' }} />
          <span>Click & drag or swipe to rotate 360° • Scroll to zoom</span>
        </div>
      )}

      {/* Central 3D Canvas Viewport */}
      <div
        className={`viewer3d-canvas-wrap ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <canvas ref={canvasRef} className="viewer3d-canvas" />
      </div>

      {/* Floating Bottom Navigation Controls Bar */}
      <div className="viewer3d-bottom-controls" role="group" aria-label="Viewing Angle & Zoom Controls">
        {/* Preset Angle Buttons */}
        <div className="angle-presets-group" role="radiogroup" aria-label="Camera Angle Presets">
          <button
            type="button"
            className={`angle-preset-btn ${Math.abs(yaw % (Math.PI * 2)) < 0.25 ? 'is-active' : ''}`}
            onClick={() => setPresetAngle(0)}
            aria-label="Front View (0 degrees)"
          >
            Front
          </button>

          <button
            type="button"
            className={`angle-preset-btn ${Math.abs((yaw % (Math.PI * 2)) - 0.78) < 0.25 ? 'is-active' : ''}`}
            onClick={() => setPresetAngle(Math.PI / 4)}
            aria-label="Three-Quarter View (45 degrees)"
          >
            3/4 View
          </button>

          <button
            type="button"
            className={`angle-preset-btn ${Math.abs((yaw % (Math.PI * 2)) - 1.57) < 0.25 ? 'is-active' : ''}`}
            onClick={() => setPresetAngle(Math.PI / 2)}
            aria-label="Side Profile View (90 degrees)"
          >
            Side
          </button>

          <button
            type="button"
            className={`angle-preset-btn ${Math.abs((yaw % (Math.PI * 2)) - Math.PI) < 0.25 ? 'is-active' : ''}`}
            onClick={() => setPresetAngle(Math.PI)}
            aria-label="Back View (180 degrees)"
          >
            Back
          </button>
        </div>

        {/* Zoom Controls & Reset Action */}
        <div className="zoom-actions-group">
          <button
            type="button"
            className="zoom-ctrl-btn"
            onClick={() => setZoom((prev) => Math.max(1.6, prev - 0.35))}
            disabled={zoom <= 1.7}
            aria-label="Zoom in camera"
            title="Zoom In"
          >
            +
          </button>

          <button
            type="button"
            className="zoom-ctrl-btn"
            onClick={() => setZoom((prev) => Math.min(4.2, prev + 0.35))}
            disabled={zoom >= 4.1}
            aria-label="Zoom out camera"
            title="Zoom Out"
          >
            -
          </button>

          <button
            type="button"
            className="reset-view-btn"
            onClick={handleResetView}
            aria-label="Reset camera orientation and zoom"
            title="Reset Perspective"
          >
            <RotateCcw size={12} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="viewer-loading-overlay" aria-live="polite">
          <div className="viewer-spinner" />
          <div style={{ textAlign: 'center' }}>
            <h4 className="viewer-loading-title">Calibrating 3D Atelier Mannequin</h4>
            <p className="viewer-loading-sub">Applying tailored {garment.name} drape and {color.name} fabric luster...</p>
          </div>
        </div>
      )}

      {/* Graceful Fallback Card if WebGL is unavailable */}
      {hasWebGLError && (
        <div className="viewer-fallback-card" role="alert">
          <div className="fallback-icon-wrap">
            <AlertTriangle size={24} />
          </div>
          <h3 className="fallback-title">WebGL Hardware Acceleration Unavailable</h3>
          <p className="fallback-desc">
            Your browser environment does not currently have WebGL graphics acceleration enabled. The 3D viewer requires standard WebGL support. You can continue reviewing your design specifications and measurements in the Atelier Summary.
          </p>
          <button
            type="button"
            className="angle-preset-btn is-active"
            onClick={() => setHasWebGLError(false)}
          >
            Retry WebGL Context
          </button>
        </div>
      )}
    </div>
  );
}
