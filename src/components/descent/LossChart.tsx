"use client";

import { useEffect, useRef } from "react";
import { series, SERIES_LEN, useScene } from "@/lib/landscape/store";
import { optimizerMeta } from "@/lib/landscape/optimizers";

/** 2D canvas line chart of each optimizer's loss history. Redraws at ~30 fps. */
export function LossChart({ height = 140 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return;
      last = t;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const cs = getComputedStyle(document.documentElement);
      const line = cs.getPropertyValue("--line-strong").trim() || "rgba(128,128,128,0.3)";
      const faint = cs.getPropertyValue("--fg-faint").trim();

      const ids = useScene.getState().optimizers;
      // shared y range across visible series
      let lo = Infinity;
      let hi = -Infinity;
      for (const id of ids) {
        const s = series[id];
        for (let i = 0; i < s.n; i++) {
          const v = s.buf[(s.head - s.n + i + SERIES_LEN) % SERIES_LEN];
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      }
      if (!Number.isFinite(lo)) {
        lo = -1;
        hi = 1;
      }
      if (hi - lo < 0.2) {
        const m = (hi + lo) / 2;
        lo = m - 0.1;
        hi = m + 0.1;
      }
      const pad = 6;
      const y = (v: number) => pad + (1 - (v - lo) / (hi - lo)) * (H - pad * 2);

      // gridlines
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      for (let k = 0; k <= 3; k++) {
        const yy = pad + (k / 3) * (H - pad * 2);
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // labels
      ctx.fillStyle = faint;
      ctx.font = "10px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText(hi.toFixed(2), W - 4, pad + 9);
      ctx.fillText(lo.toFixed(2), W - 4, H - pad - 2);

      // series
      for (const id of ids) {
        const s = series[id];
        if (s.n < 2) continue;
        ctx.strokeStyle = cs.getPropertyValue(optimizerMeta[id].cssVar).trim();
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i < s.n; i++) {
          const v = s.buf[(s.head - s.n + i + SERIES_LEN) % SERIES_LEN];
          const x = ((SERIES_LEN - s.n + i) / (SERIES_LEN - 1)) * W;
          if (i === 0) ctx.moveTo(x, y(v));
          else ctx.lineTo(x, y(v));
        }
        ctx.stroke();
        // head dot
        const lastV = s.buf[(s.head - 1 + SERIES_LEN) % SERIES_LEN];
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(W - 1, y(lastV), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height }} className="block" aria-label="Loss over steps" role="img" />;
}
