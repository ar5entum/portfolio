"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const KEY = "ar5entum:intro";

/**
 * First-visit "training run": epoch and loss count down for ~1.2s, then the
 * curtain lifts and the landscape is already converging behind it. Skipped on
 * repeat visits this session and under reduced motion.
 */
export function Intro() {
  const [show, setShow] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(4.2);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) return;
    setShow(true);
    const start = performance.now();
    const DUR = 1250;
    let raf = 0;
    let cancelled = false; // StrictMode runs this effect twice; only the live run may finish
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / DUR);
      setEpoch(Math.floor(t * 12));
      setLoss(4.2 * Math.pow(1 - t, 2.2) + 0.031);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        setTimeout(() => setShow(false), 120);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[70] flex items-end bg-bg"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } }}
          aria-hidden
        >
          <div className="container-x pb-10 w-full flex items-end justify-between">
            <div className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-fg-muted tabular-nums">
              <div>epoch {String(epoch).padStart(2, "0")} / 12</div>
              <div className="mt-1 text-fg">loss {loss.toFixed(3)}</div>
            </div>
            <div className="h-px flex-1 mx-6 bg-line relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.25, ease: "linear" }}
              />
            </div>
            <div className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-fg-faint">converging</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
