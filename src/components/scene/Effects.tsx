"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useScene } from "@/lib/landscape/store";
import * as THREE from "three";

const caOffset = new THREE.Vector2(0.0006, 0.0004);

/**
 * Dark: bloom on the bright trail heads, vignette, a whisper of chromatic
 * aberration. Light: just a soft vignette (ink on paper doesn't glow).
 */
export function Effects() {
  const quality = useScene((s) => s.quality);
  const dark = useScene((s) => s.dark);
  if (quality === "low") return null;

  if (dark) {
    return (
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur radius={0.6} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={caOffset} radialModulation modulationOffset={0.3} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Vignette eskil={false} offset={0.3} darkness={0.28} />
    </EffectComposer>
  );
}
