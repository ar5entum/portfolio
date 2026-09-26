"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Loads the WebGL scene after first paint; falls back to a static poster. */
export function SceneMount() {
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    const id = window.requestIdleCallback ? window.requestIdleCallback(() => setReady(true), { timeout: 800 }) : window.setTimeout(() => setReady(true), 120);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  if (!webgl) return <Poster />;
  return (
    <>
      {!ready && <Poster />}
      {ready && <Scene />}
    </>
  );
}

/** Static contour poster shown before the scene mounts or when WebGL is missing. */
function Poster() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 poster" />
  );
}
