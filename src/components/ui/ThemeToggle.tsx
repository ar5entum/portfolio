"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";

const ORDER = ["system", "light", "dark"] as const;
type Mode = (typeof ORDER)[number];

const ICONS: Record<Mode, string> = {
  system: "◐",
  light: "○",
  dark: "●",
};

/** Cycles system → light → dark with a circular reveal from the button. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mode = (mounted ? theme : "system") as Mode;
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    try {
      const vt = doc.startViewTransition(() => setTheme(next));
      vt.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {
          /* transition skipped (tab hidden, etc.); theme still applied */
        });
    } catch {
      setTheme(next);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Theme: ${mode}. Switch to ${next}`}
      title={`Theme: ${mode}`}
      className={`font-mono text-[0.72rem] tracking-[0.14em] uppercase text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-2 ${className}`}
    >
      <span aria-hidden className="text-[0.9rem] leading-none">
        {ICONS[mode]}
      </span>
      <span className="hidden sm:inline">{mode}</span>
    </button>
  );
}
