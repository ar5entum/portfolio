"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Illustration: a video timeline with the true action window and a caption
 * that describes it three seconds late. Scrubs on hover; loops otherwise.
 */
export function TimelineStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0.35); // playhead 0..1
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    if (!inView || scrub || reduce) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setT(((now - start) / 9000) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, scrub, reduce]);

  const DUR = 20; // seconds
  const action = [6, 9]; // true window
  const caption = [9, 12]; // where the caption places it
  const px = (s: number) => `${(s / DUR) * 100}%`;
  const now = t * DUR;
  const inAction = now >= action[0] && now <= action[1];
  const inCaption = now >= caption[0] && now <= caption[1];

  return (
    <div
      ref={ref}
      className="card select-none"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setScrub(true);
        setT(Math.min(1, Math.max(0, (e.clientX - r.left - 24) / (r.width - 48))));
      }}
      onMouseLeave={() => setScrub(false)}
      aria-label="Illustration: a caption placed three seconds after the action it describes"
      role="img"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="eyebrow">illustration · “someone picks up a cup”</span>
        <span className="font-mono text-[0.68rem] tabular-nums text-fg-faint">{now.toFixed(1).padStart(4, "0")}s / {DUR}s</span>
      </div>

      <div className="relative h-[72px]">
        {/* frames */}
        <div className="absolute inset-x-0 top-0 h-[26px] flex gap-[2px]">
          {Array.from({ length: 40 }).map((_, i) => {
            const s = (i / 40) * DUR;
            const hot = s >= action[0] && s < action[1];
            return (
              <div
                key={i}
                className="flex-1 rounded-[2px]"
                style={{ background: hot ? "var(--accent-2)" : "var(--line)", opacity: hot ? 0.9 : 0.6 }}
              />
            );
          })}
        </div>

        {/* true window */}
        <div className="absolute top-[34px] h-[14px] rounded-[3px]" style={{ left: px(action[0]), width: px(action[1] - action[0]), background: "var(--accent-2)" }}>
          <span className="absolute left-0 top-[17px] font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fg-muted whitespace-nowrap">
            action · 6–9s
          </span>
        </div>

        {/* caption window */}
        <div
          className="absolute top-[34px] h-[14px] rounded-[3px] border"
          style={{ left: px(caption[0]), width: px(caption[1] - caption[0]), borderColor: "var(--accent)", background: "color-mix(in oklab, var(--accent) 22%, transparent)" }}
        >
          <span className="absolute right-0 top-[17px] font-mono text-[0.62rem] uppercase tracking-[0.1em] text-accent whitespace-nowrap">
            caption · 9–12s (+3s)
          </span>
        </div>

        {/* playhead */}
        <div className="absolute top-0 bottom-0 w-px bg-fg" style={{ left: px(now) }}>
          <div className="absolute -top-1 -translate-x-1/2 h-2 w-2 rounded-full bg-fg" />
        </div>
      </div>

      <div className="mt-6 font-mono text-[0.72rem] text-fg-muted h-5">
        {inAction && !inCaption && <span>▶ the cup is being picked up · caption says nothing yet</span>}
        {inCaption && !inAction && <span className="text-accent">▶ caption: “someone picks up a cup” · the moment has passed</span>}
        {!inAction && !inCaption && <span className="text-fg-faint">▶ …</span>}
      </div>
    </div>
  );
}
