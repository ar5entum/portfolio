"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts a formatted number ("1,342", "0.947", "2.6×") up from zero when it
 * scrolls into view, keeping the original formatting.
 */
export function Counter({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const m = value.match(/^([^\d]*)([\d,]*\.?\d*)(.*)$/);
    if (!m) return;
    const [, pre, numStr, post] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = (numStr.split(".")[1] ?? "").length;
    const useCommas = numStr.includes(",");
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      let s = v.toFixed(decimals);
      if (useCommas) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      setText(`${pre}${s}${post}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return <span ref={ref}>{text}</span>;
}
