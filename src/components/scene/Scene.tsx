"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, OrbitControls } from "@react-three/drei";
import { useScene } from "@/lib/landscape/store";
import { Surface } from "./Surface";
import { Particles } from "./Particles";
import { Rig } from "./Rig";
import { Effects } from "./Effects";

/**
 * The one persistent WebGL scene for the whole site. Mounted once in the root
 * layout; routes and sections only change what it shows via the scene store.
 */
export function Scene() {
  const interactive = useScene((s) => s.interactive);
  const setQuality = useScene((s) => s.setQuality);
  const setReducedMotion = useScene((s) => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setReducedMotion]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0"
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      <Canvas
        flat
        dpr={[1, 1.5]}
        camera={{ fov: 38, near: 0.1, far: 80, position: [10, 7.5, 12.5] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor onDecline={() => setQuality("low")} onIncline={() => setQuality("high")} flipflops={2}>
          <Suspense fallback={null}>
            <Surface />
            <Particles />
            <Rig />
            {interactive && (
              <OrbitControls
                makeDefault
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                minDistance={6}
                maxDistance={30}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 0.3, 0]}
              />
            )}
            <Effects />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
