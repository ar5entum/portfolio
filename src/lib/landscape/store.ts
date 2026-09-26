import { create } from "zustand";
import { presets, type FnId, WORLD_HALF } from "./functions";
import { defaultHyper, optimizerIds, type Hyper, type OptimizerId } from "./optimizers";
import type { CompiledCustom } from "./glsl";

export type CameraPreset = "hero" | "skills" | "path" | "research" | "flat" | "playground" | "lost";

export type SceneState = {
  /** function currently blending from / to; `mix` goes 0 -> 1 */
  fnFrom: FnId;
  fnTo: FnId;
  custom: CompiledCustom | null;
  optimizers: OptimizerId[];
  hyper: Hyper;
  running: boolean;
  /** in ambient mode particles re-drop periodically; in the playground they don't */
  ambient: boolean;
  camera: CameraPreset;
  /** 0..1 scroll progress through the Path section, drives the descent camera */
  descent: number;
  /** pointer in world xz, strength 0..1 */
  pointer: { x: number; z: number; strength: number };
  interactive: boolean;
  quality: "high" | "low";
  reducedMotion: boolean;
  /** mirrors <html data-theme>; contexts don't cross into the R3F root */
  dark: boolean;
  /** bumps whenever particles should re-drop */
  dropSeq: number;

  setFunction: (id: FnId) => void;
  setCustom: (c: CompiledCustom | null) => void;
  setOptimizers: (ids: OptimizerId[]) => void;
  toggleOptimizer: (id: OptimizerId) => void;
  setHyper: (h: Partial<Hyper>) => void;
  setRunning: (v: boolean) => void;
  setAmbient: (v: boolean) => void;
  setCamera: (c: CameraPreset) => void;
  setDescent: (v: number) => void;
  setPointer: (x: number, z: number, strength: number) => void;
  setInteractive: (v: boolean) => void;
  setQuality: (q: "high" | "low") => void;
  setReducedMotion: (v: boolean) => void;
  setDark: (v: boolean) => void;
  drop: () => void;
};

export const useScene = create<SceneState>((set, get) => ({
  fnFrom: "saddle",
  fnTo: "saddle",
  custom: null,
  optimizers: ["adam", "momentum", "rmsprop", "sgd"],
  hyper: { ...defaultHyper },
  running: true,
  ambient: true,
  camera: "hero",
  descent: 0,
  pointer: { x: 0, z: 0, strength: 0 },
  interactive: false,
  quality: "high",
  reducedMotion: false,
  dark: true,
  dropSeq: 0,

  setFunction: (id) => {
    const { fnTo } = get();
    if (id === fnTo) return;
    // the morph runtime (see morph.ts) snapshots the current blend into fnFrom
    set({ fnFrom: fnTo, fnTo: id });
    morph.restart();
  },
  setCustom: (c) => set({ custom: c }),
  setOptimizers: (ids) => set({ optimizers: ids.filter((i) => optimizerIds.includes(i)) }),
  toggleOptimizer: (id) => {
    const cur = get().optimizers;
    set({ optimizers: cur.includes(id) ? cur.filter((o) => o !== id) : [...cur, id] });
  },
  setHyper: (h) => set({ hyper: { ...get().hyper, ...h } }),
  setRunning: (v) => set({ running: v }),
  setAmbient: (v) => set({ ambient: v }),
  setCamera: (c) => set({ camera: c }),
  setDescent: (v) => set({ descent: v }),
  setPointer: (x, z, strength) => set({ pointer: { x, z, strength } }),
  setInteractive: (v) => set({ interactive: v }),
  setQuality: (q) => set({ quality: q }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setDark: (v) => set({ dark: v }),
  drop: () => set({ dropSeq: get().dropSeq + 1 }),
}));

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __scene: typeof useScene }).__scene = useScene;
}

/**
 * Mutable, frame-rate driven values that React never needs to re-render on.
 * Read from useFrame; written by the rig.
 */
export const morph = {
  /** 0..1 blend between fnFrom and fnTo */
  mix: 1,
  restart() {
    this.mix = 0;
  },
};

export const well = {
  x: 0,
  z: 0,
  /** smoothed strength */
  s: 0,
  sigma: 1.1,
  depth: 1.6,
};

/** Live numbers for the HUD. */
export const telemetry = {
  loss: 0,
  steps: 0,
  optimizer: "adam" as OptimizerId,
  fn: "saddle" as FnId,
  fps: 60,
};

export const SERIES_LEN = 600;
/** Per-optimizer loss history (ring buffer) for the playground chart. */
export const series: Record<OptimizerId, { buf: Float32Array; n: number; head: number }> = Object.fromEntries(
  optimizerIds.map((id) => [id, { buf: new Float32Array(SERIES_LEN), n: 0, head: 0 }]),
) as never;

export function pushSeries(id: OptimizerId, v: number) {
  const s = series[id];
  s.buf[s.head] = v;
  s.head = (s.head + 1) % SERIES_LEN;
  s.n = Math.min(SERIES_LEN, s.n + 1);
}

export function resetSeries(id?: OptimizerId) {
  for (const k of optimizerIds) {
    if (id && k !== id) continue;
    series[k].n = 0;
    series[k].head = 0;
  }
}

/** Height in world units at (x, z), including the morph blend and the pointer well. */
export function heightAt(x: number, z: number): number {
  const s = useScene.getState();
  const from = fnEval(s.fnFrom, s.custom);
  const to = fnEval(s.fnTo, s.custom);
  const m = morph.mix;
  let h = m >= 1 ? to(x, z) : m <= 0 ? from(x, z) : from(x, z) * (1 - m) + to(x, z) * m;
  if (well.s > 0.001) {
    const dx = x - well.x;
    const dz = z - well.z;
    h -= well.depth * well.s * Math.exp(-(dx * dx + dz * dz) / (2 * well.sigma * well.sigma));
  }
  return h;
}

function fnEval(id: FnId, custom: CompiledCustom | null) {
  if (id === "custom") return custom ? custom.js : flat;
  return presets[id].js;
}

const flat = () => 0;

export function inWorld(x: number, z: number, margin = 0.2) {
  return Math.abs(x) < WORLD_HALF - margin && Math.abs(z) < WORLD_HALF - margin;
}
