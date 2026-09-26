"use client";

import { useEffect, useState } from "react";
import { telemetry } from "@/lib/landscape/store";
import { optimizerMeta } from "@/lib/landscape/optimizers";
import { presets } from "@/lib/landscape/functions";

/** Live loss/step readout in the corner. Polls the mutable telemetry at 12 Hz. */
export function Hud({ className = "" }: { className?: string }) {
  const [t, setT] = useState({ loss: 0, steps: 0, opt: "adam", fn: "saddle" });

  useEffect(() => {
    const id = setInterval(() => {
      setT({ loss: telemetry.loss, steps: telemetry.steps, opt: telemetry.optimizer, fn: telemetry.fn });
    }, 83);
    return () => clearInterval(id);
  }, []);

  const fnName = t.fn === "custom" ? "custom" : presets[t.fn as keyof typeof presets]?.name ?? t.fn;
  const optName = optimizerMeta[t.opt as keyof typeof optimizerMeta]?.short ?? t.opt;

  return (
    <div
      aria-live="off"
      className={`font-mono text-[0.68rem] tracking-[0.12em] uppercase text-fg-faint select-none tabular-nums ${className}`}
    >
      <span className="text-fg-muted">{fnName}</span>
      <span className="mx-2 opacity-50">·</span>
      <span style={{ color: `var(${optimizerMeta[t.opt as keyof typeof optimizerMeta]?.cssVar ?? "--fg"})` }}>{optName}</span>
      <span className="mx-2 opacity-50">·</span>
      <span>step {String(t.steps).padStart(4, "0")}</span>
      <span className="mx-2 opacity-50">·</span>
      <span>
        loss {t.loss >= 0 ? "+" : "−"}
        {Math.abs(t.loss).toFixed(3)}
      </span>
    </div>
  );
}
