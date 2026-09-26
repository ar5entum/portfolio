"use client";

import { useEffect, useRef } from "react";
import { useScene, type CameraPreset } from "@/lib/landscape/store";
import type { FnId } from "@/lib/landscape/functions";

/**
 * When the returned ref's element is the dominant section in view, point the
 * scene at the given function and camera preset. Sections hand off as you
 * scroll, so the landscape morphs with the content.
 */
export function useSceneSection<T extends HTMLElement>(fn: FnId, camera: CameraPreset, threshold = 0.45) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const s = useScene.getState();
            s.setFunction(fn);
            s.setCamera(camera);
          }
        }
      },
      { threshold, rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fn, camera, threshold]);
  return ref;
}
