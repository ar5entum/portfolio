"use client";

import { useEffect, useMemo } from "react";
import { optimizerMeta, type OptimizerId } from "@/lib/landscape/optimizers";
import { useScene } from "@/lib/landscape/store";

export type ThemeColors = {
  bg: string;
  line: string;
  lineStrong: string;
  accent: string;
  accent2: string;
  fg: string;
  glow: number;
  opt: Record<OptimizerId, string>;
};

const DARK: ThemeColors = {
  bg: "#0b0d12",
  line: "#2a2f3a",
  lineStrong: "#7d8390",
  accent: "#ee6c4d",
  accent2: "#98c1d9",
  fg: "#ecece8",
  glow: 1,
  opt: { sgd: "#ee6c4d", momentum: "#f2c14e", nesterov: "#5ee0a0", adagrad: "#98c1d9", rmsprop: "#b48cff", adam: "#ff7ab8" },
};

function read(): ThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  const isDark = document.documentElement.dataset.theme === "dark";
  const opt = {} as Record<OptimizerId, string>;
  for (const id of Object.keys(optimizerMeta) as OptimizerId[]) opt[id] = v(optimizerMeta[id].cssVar);
  return {
    bg: v("--bg"),
    // rgba() lines don't parse into THREE.Color; use solid equivalents
    line: isDark ? "#2a2f3a" : "#c9c3b7",
    lineStrong: isDark ? "#7d8390" : "#6b6560",
    accent: v("--accent"),
    accent2: v("--accent-2"),
    fg: v("--fg"),
    glow: isDark ? 1 : 0,
    opt,
  };
}

/** Shared mutable colour set, refreshed whenever data-theme changes on <html>. */
let shared: ThemeColors | null = null;
let observing = false;

function ensure(): ThemeColors {
  if (!shared) shared = typeof window === "undefined" ? { ...DARK } : read();
  if (!observing && typeof window !== "undefined") {
    observing = true;
    const sync = () => {
      // computed styles update synchronously after the attribute flips
      Object.assign(shared!, read());
      useScene.getState().setDark(shared!.glow > 0.5);
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  return shared;
}

/**
 * Theme colours as a stable mutable object. Consumers read fields inside
 * useFrame; nothing re-renders when the theme flips.
 */
export function useThemeColors(): ThemeColors {
  const colors = useMemo(ensure, []);
  useEffect(() => {
    Object.assign(colors, read());
  }, [colors]);
  return colors;
}
