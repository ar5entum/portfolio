"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScene } from "@/lib/landscape/store";
import { presets, presetIds, type FnId } from "@/lib/landscape/functions";
import { optimizerIds, optimizerMeta, type OptimizerId } from "@/lib/landscape/optimizers";
import { compileCustom } from "@/lib/landscape/glsl";
import { LossChart } from "./LossChart";
import { Hud } from "@/components/ui/Hud";

const LR_MIN = Math.log10(0.002);
const LR_MAX = Math.log10(0.6);

export function Playground() {
  const params = useSearchParams();
  const s = useScene();
  const [expr, setExpr] = useState("");
  const [exprError, setExprError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const didInit = useRef(false);

  // Enter playground mode: interactive canvas, no ambient re-drops, orbit camera.
  useEffect(() => {
    const st = useScene.getState();
    st.setInteractive(true);
    st.setAmbient(false);
    st.setCamera("playground");
    st.setRunning(true);
    return () => {
      const st2 = useScene.getState();
      st2.setInteractive(false);
      st2.setAmbient(true);
      st2.setCamera("hero");
      st2.setRunning(true);
      if (st2.fnTo === "custom") st2.setFunction("saddle");
    };
  }, []);

  // Read URL state once.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const st = useScene.getState();
    const fn = params.get("fn") as FnId | null;
    const q = params.get("expr");
    const opt = params.get("opt");
    const lr = parseFloat(params.get("lr") ?? "");
    const beta = parseFloat(params.get("beta") ?? "");
    if (q) {
      try {
        st.setCustom(compileCustom(q));
        st.setFunction("custom");
        setExpr(q);
      } catch {
        /* ignore bad url */
      }
    } else if (fn && fn !== "custom" && presets[fn]) {
      st.setFunction(fn);
    }
    if (opt) st.setOptimizers(opt.split(",").filter(Boolean) as OptimizerId[]);
    if (Number.isFinite(lr)) st.setHyper({ lr });
    if (Number.isFinite(beta)) st.setHyper({ beta });
    st.drop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write URL state (debounced) so the setup is shareable.
  useEffect(() => {
    const id = setTimeout(() => {
      const u = new URLSearchParams();
      if (s.fnTo === "custom" && s.custom) u.set("expr", s.custom.expr);
      else if (s.fnTo !== "saddle") u.set("fn", s.fnTo);
      u.set("opt", s.optimizers.join(","));
      u.set("lr", s.hyper.lr.toPrecision(3));
      u.set("beta", s.hyper.beta.toFixed(2));
      const qs = u.toString();
      history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
    }, 250);
    return () => clearTimeout(id);
  }, [s.fnTo, s.custom, s.optimizers, s.hyper.lr, s.hyper.beta]);

  const applyExpr = () => {
    try {
      const c = compileCustom(expr);
      s.setCustom(c);
      s.setFunction("custom");
      s.drop();
      setExprError(null);
    } catch (e) {
      setExprError((e as Error).message);
    }
  };

  const lrSlider = useMemo(() => (Math.log10(s.hyper.lr) - LR_MIN) / (LR_MAX - LR_MIN), [s.hyper.lr]);

  const share = () => {
    navigator.clipboard?.writeText(location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <main className="pointer-events-none fixed inset-0 z-10 flex flex-col">
      {/* top-left title */}
      <div className="container-x pt-20 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">// descent · playground</p>
          <h1 className="display text-[clamp(2rem,5vw,3.6rem)]">
            Optimizers, <em>racing.</em>
          </h1>
          <p className="mt-2 text-fg-muted text-sm max-w-[36ch]">Drag to orbit. Scroll to zoom. Move the cursor to dent the surface.</p>
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="pointer-events-auto btn md:hidden"
          aria-expanded={panelOpen}
        >
          {panelOpen ? "Hide controls" : "Controls"}
        </button>
      </div>

      <div className="mt-auto container-x pb-6 grid gap-4 md:grid-cols-12 items-end">
        {/* control panel */}
        <div className={`pointer-events-auto card md:col-span-5 xl:col-span-4 grid gap-5 ${panelOpen ? "" : "hidden md:grid"}`}>
          <Field label="Surface">
            <div className="flex flex-wrap gap-2">
              {presetIds.map((id) => (
                <Chip
                  key={id}
                  active={s.fnTo === id}
                  onClick={() => {
                    s.setFunction(id);
                    s.drop();
                  }}
                >
                  {presets[id].name}
                </Chip>
              ))}
              <Chip active={s.fnTo === "custom"} onClick={() => document.getElementById("expr")?.focus()}>
                Custom
              </Chip>
            </div>
            <div className="font-mono text-[0.7rem] text-fg-faint mt-2">
              {s.fnTo === "custom" ? s.custom?.expr ?? "—" : presets[s.fnTo].formula}
            </div>
          </Field>

          <Field label="Custom f(x, z)">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                applyExpr();
              }}
            >
              <input
                id="expr"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="e.g. sin(x) * cos(z) + 0.05 * (x^2 + z^2)"
                className="input flex-1"
                spellCheck={false}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary !py-2 !px-4">
                Plot
              </button>
            </form>
            {exprError && <p className="mt-1 font-mono text-[0.68rem] text-accent">{exprError}</p>}
          </Field>

          <Field label="Optimizers">
            <div className="flex flex-wrap gap-2">
              {optimizerIds.map((id) => {
                const on = s.optimizers.includes(id);
                return (
                  <Chip key={id} active={on} onClick={() => s.toggleOptimizer(id)} color={`var(${optimizerMeta[id].cssVar})`}>
                    {optimizerMeta[id].name}
                  </Chip>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={`Learning rate · ${s.hyper.lr.toPrecision(2)}`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={lrSlider}
                onChange={(e) => s.setHyper({ lr: Math.pow(10, LR_MIN + parseFloat(e.target.value) * (LR_MAX - LR_MIN)) })}
                className="range"
                aria-label="Learning rate"
              />
            </Field>
            <Field label={`Momentum β · ${s.hyper.beta.toFixed(2)}`}>
              <input
                type="range"
                min={0.5}
                max={0.99}
                step={0.01}
                value={s.hyper.beta}
                onChange={(e) => s.setHyper({ beta: parseFloat(e.target.value) })}
                className="range"
                aria-label="Momentum beta"
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn !py-2 !px-4" onClick={() => s.setRunning(!s.running)}>
              {s.running ? "Pause" : "Run"}
            </button>
            <button type="button" className="btn !py-2 !px-4" onClick={() => s.drop()}>
              Re-drop
            </button>
            <button type="button" className="btn !py-2 !px-4" onClick={share}>
              {copied ? "Link copied ✓" : "Share"}
            </button>
          </div>
        </div>

        {/* loss chart */}
        <div className="pointer-events-auto card md:col-span-7 xl:col-span-8 hidden md:block">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">loss · last 600 steps</span>
            <Hud />
          </div>
          <LossChart height={150} />
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`chip ${active ? "chip-on" : ""}`}
      style={active && color ? { borderColor: color, color } : undefined}
    >
      {color && <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full mr-1.5" style={{ background: color, opacity: active ? 1 : 0.4 }} />}
      {children}
    </button>
  );
}
