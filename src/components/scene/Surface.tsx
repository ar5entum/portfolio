"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScene, morph, well, type CameraPreset } from "@/lib/landscape/store";
import { fnIndex, WORLD_HALF } from "@/lib/landscape/functions";
import { buildFunctionGLSL, surfaceFragment, surfaceVertex } from "./shaders";
import { useThemeColors } from "./useThemeColors";

const SEGMENTS_HIGH = 220;
const SEGMENTS_LOW = 110;

/** How loud the contours are per camera preset (text sits on top of them). */
const DIM: Record<CameraPreset, number> = {
  hero: 1,
  skills: 0.7,
  path: 0.62,
  research: 0.72,
  flat: 0.26,
  playground: 1,
  lost: 0.8,
};

export function Surface() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const custom = useScene((s) => s.custom);
  const quality = useScene((s) => s.quality);
  const colors = useThemeColors();
  const { camera } = useThree();

  const segments = quality === "high" ? SEGMENTS_HIGH : SEGMENTS_LOW;

  // Custom GLSL is baked into the shader source, so a new custom function
  // means a new material (keyed below). Presets never recompile.
  const shader = useMemo(() => {
    const fnGLSL = buildFunctionGLSL(custom?.glsl ?? null);
    return {
      key: custom?.glsl ?? "presets",
      vertexShader: surfaceVertex(fnGLSL),
      fragmentShader: surfaceFragment,
    };
  }, [custom]);

  const uniforms = useMemo(
    () => ({
      uFnFrom: { value: 0 },
      uFnTo: { value: 0 },
      uMix: { value: 1 },
      uWell: { value: new THREE.Vector3(0, 0, 0) },
      uWellSigma: { value: well.sigma },
      uTime: { value: 0 },
      uBg: { value: new THREE.Color("#0b0d12") },
      uLine: { value: new THREE.Color("#3a3f4a") },
      uLineStrong: { value: new THREE.Color("#8a8f9a") },
      uAccent: { value: new THREE.Color("#ee6c4d") },
      uAccent2: { value: new THREE.Color("#98c1d9") },
      uGlow: { value: 1 },
      uFogNear: { value: 13 },
      uFogFar: { value: 30 },
      uContourStep: { value: 0.22 },
      uCamPos: { value: new THREE.Vector3() },
      uDim: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shader.key],
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    const s = useScene.getState();
    const u = m.uniforms;
    u.uFnFrom.value = fnIndex[s.fnFrom];
    u.uFnTo.value = fnIndex[s.fnTo];
    u.uMix.value = morph.mix;
    u.uWell.value.set(well.x, well.z, well.depth * well.s);
    u.uTime.value = state.clock.elapsedTime;
    u.uCamPos.value.copy(camera.position);
    u.uBg.value.set(colors.bg);
    u.uLine.value.set(colors.line);
    u.uLineStrong.value.set(colors.lineStrong);
    u.uAccent.value.set(colors.accent);
    u.uAccent2.value.set(colors.accent2);
    u.uGlow.value = colors.glow;
    u.uDim.value += (DIM[s.camera] - u.uDim.value) * Math.min(1, dt * 2.5);
    // advance the morph
    if (morph.mix < 1) morph.mix = Math.min(1, morph.mix + dt / 1.4);
  });

  return (
    <mesh frustumCulled={false}>
      {/* plane authored in xy, rewritten to xz by fixPlane; y is computed in the shader */}
      <planeGeometry key={segments} args={[WORLD_HALF * 2, WORLD_HALF * 2, segments, segments]} onUpdate={fixPlane} />
      <shaderMaterial
        key={shader.key}
        ref={matRef}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * The plane is authored in xy. The shader wants x,z horizontal with y up, so we
 * rewrite the geometry once: (x, y, 0) -> (x, 0, -y). Doing it here keeps the
 * shader simple and avoids a rotation matrix in every vertex.
 */
function fixPlane(geo: THREE.PlaneGeometry) {
  if (geo.userData.fixed) return;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setXYZ(i, x, 0, -y);
  }
  pos.needsUpdate = true;
  geo.userData.fixed = true;
}
