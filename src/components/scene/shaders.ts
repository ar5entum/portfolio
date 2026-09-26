import { presets, presetIds } from "@/lib/landscape/functions";

/** Every preset compiled into one GLSL switch, plus an injected custom body. */
export function buildFunctionGLSL(customBody: string | null) {
  const fns = presetIds
    .map((id) => `float fn_${id}(float x, float z) {${presets[id].glsl}\n}`)
    .join("\n");
  const custom = `float fn_custom(float x, float z) { ${customBody ?? "return 0.0;"} }`;
  const cases = presetIds.map((id, i) => `if (id == ${i}) return fn_${id}(x, z);`).join("\n  ");
  return `
${fns}
${custom}
float evalFn(int id, float x, float z) {
  ${cases}
  return fn_custom(x, z);
}
float heightAt(float x, float z) {
  float a = evalFn(uFnFrom, x, z);
  float b = evalFn(uFnTo, x, z);
  float h = mix(a, b, uMix);
  float dx = x - uWell.x; float dz = z - uWell.y;
  h -= uWell.z * exp(-(dx * dx + dz * dz) / (2.0 * uWellSigma * uWellSigma));
  return h;
}`;
}

export const surfaceVertex = (fnGLSL: string) => `
uniform int uFnFrom;
uniform int uFnTo;
uniform float uMix;
uniform vec3 uWell;      // x, z, depth*strength
uniform float uWellSigma;
uniform float uTime;

varying float vH;
varying vec3 vWorld;
varying vec3 vNormal;

${fnGLSL}

void main() {
  vec3 p = position; // plane is rotated so x,z are horizontal; y is up
  float h = heightAt(p.x, p.z);
  // finite-difference normal for lighting
  float e = 0.05;
  float hx = heightAt(p.x + e, p.z) - heightAt(p.x - e, p.z);
  float hz = heightAt(p.x, p.z + e) - heightAt(p.x, p.z - e);
  vNormal = normalize(vec3(-hx / (2.0 * e), 1.0, -hz / (2.0 * e)));
  vH = h;
  vec3 world = vec3(p.x, h, p.z);
  vWorld = world;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`;

export const surfaceFragment = `
precision highp float;

uniform vec3 uBg;
uniform vec3 uLine;
uniform vec3 uLineStrong;
uniform vec3 uAccent;
uniform vec3 uAccent2;
uniform float uGlow;        // 1 = dark theme (glow), 0 = light theme (ink)
uniform float uFogNear;
uniform float uFogFar;
uniform float uContourStep;
uniform float uTime;
uniform vec3 uCamPos;
uniform float uDim;   // 1 = full contrast, lower = quieter behind text

varying float vH;
varying vec3 vWorld;
varying vec3 vNormal;

// anti-aliased iso-line at multiples of sp
float isoline(float v, float sp, float width) {
  float f = fract(v / sp);
  float d = min(f, 1.0 - f) * sp;
  float w = fwidth(v) * width;
  return 1.0 - smoothstep(0.0, w, d);
}

void main() {
  // colormap by height: low = accent2 (cool), high = accent (warm)
  float t = clamp((vH + 0.5) / 5.5, 0.0, 1.0);
  vec3 ramp = mix(uAccent2, uAccent, smoothstep(0.15, 0.95, t));

  // contour lines: fine and coarse
  float fine = isoline(vH, uContourStep, 1.0);
  float coarse = isoline(vH, uContourStep * 5.0, 1.6);
  float lines = max(fine * 0.55, coarse);

  // grid on the ground plane, very faint
  float gx = isoline(vWorld.x, 1.0, 0.8);
  float gz = isoline(vWorld.z, 1.0, 0.8);
  float grid = max(gx, gz) * 0.18;

  // simple lighting so the surface reads as a form
  vec3 L = normalize(vec3(0.4, 1.0, 0.3));
  float ndl = clamp(dot(normalize(vNormal), L), 0.0, 1.0);
  float shade = 0.35 + 0.65 * ndl;

  vec3 col;
  if (uGlow > 0.5) {
    // dark: surface is nearly background, lines glow with the height ramp
    vec3 base = mix(uBg, ramp, 0.06 + 0.06 * (1.0 - t)) * shade;
    vec3 lineCol = mix(uLine, ramp, 0.85) * (0.9 + 0.6 * coarse);
    col = mix(base, lineCol, lines);
    col = mix(col, uLine, grid * (1.0 - lines));
  } else {
    // light: paper with ink contours, faint wash by height
    vec3 base = mix(uBg, ramp, 0.10 * t) * (0.94 + 0.06 * shade);
    vec3 ink = mix(uLineStrong, ramp, 0.45);
    col = mix(base, ink, lines * 0.9);
    col = mix(col, uLineStrong, grid * (1.0 - lines) * 0.6);
  }

  // quieter behind text
  col = mix(uBg, col, uDim);

  // distance fog to the background
  float dist = distance(vWorld, uCamPos);
  float fog = smoothstep(uFogNear, uFogFar, dist);
  col = mix(col, uBg, fog);

  // dissolve the edges of the world into the background instead of a hard cliff
  float edge = max(abs(vWorld.x), abs(vWorld.z));
  col = mix(col, uBg, smoothstep(4.6, 6.0, edge));

  gl_FragColor = vec4(col, 1.0);
  // uniforms are linear (THREE.Color); encode for the target like built-ins do
  #include <colorspace_fragment>
}
`;
