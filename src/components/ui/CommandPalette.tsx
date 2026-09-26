"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { scrollToId } from "./SmoothScroll";
import { site, links } from "@/content/site";
import { useScene } from "@/lib/landscape/store";
import { presets, presetIds } from "@/lib/landscape/functions";
import { optimizerIds, optimizerMeta } from "@/lib/landscape/optimizers";

let setOpenExternal: ((v: boolean) => void) | null = null;
export function openPalette() {
  setOpenExternal?.(true);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const setFunction = useScene((s) => s.setFunction);
  const toggleOptimizer = useScene((s) => s.toggleOptimizer);
  const optimizers = useScene((s) => s.optimizers);
  const drop = useScene((s) => s.drop);

  useEffect(() => {
    setOpenExternal = setOpen;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setOpenExternal = null;
    };
  }, []);

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  const go = (id: string) =>
    run(() => {
      if (location.pathname === "/") scrollToId(id);
      else router.push(`/#${id}`);
    });

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="cmdk"
      overlayClassName="cmdk-overlay"
      loop
    >
      <Command.Input placeholder="Type a command or search…" className="cmdk-input" autoFocus />
      <Command.List className="cmdk-list">
        <Command.Empty className="cmdk-empty">Nothing found.</Command.Empty>

        <Command.Group heading="Go to" className="cmdk-group">
          <Command.Item onSelect={() => run(() => router.push("/"))}>Home</Command.Item>
          <Command.Item onSelect={() => go("work")}>What I work on</Command.Item>
          <Command.Item onSelect={() => go("path")}>Path</Command.Item>
          <Command.Item onSelect={() => go("research")}>Research</Command.Item>
          <Command.Item onSelect={() => go("opensource")}>Open source</Command.Item>
          <Command.Item onSelect={() => go("contact")}>Contact</Command.Item>
          <Command.Item onSelect={() => run(() => router.push("/descent"))}>
            Descent playground <span className="cmdk-hint">/descent</span>
          </Command.Item>
          <Command.Item onSelect={() => run(() => router.push("/work/captionbench"))}>
            CaptionBench <span className="cmdk-hint">/work/captionbench</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Contact" className="cmdk-group">
          <Command.Item
            onSelect={() => {
              navigator.clipboard?.writeText(site.email).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
          >
            {copied ? "Copied!" : "Copy email"} <span className="cmdk-hint">{site.email}</span>
          </Command.Item>
          <Command.Item onSelect={() => run(() => window.open(links.github, "_blank"))}>GitHub ↗</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(links.huggingface, "_blank"))}>Hugging Face ↗</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(links.linkedin, "_blank"))}>LinkedIn ↗</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(links.kaggle, "_blank"))}>Kaggle ↗</Command.Item>
        </Command.Group>

        <Command.Group heading="Landscape" className="cmdk-group">
          {presetIds.map((id) => (
            <Command.Item key={id} onSelect={() => run(() => { setFunction(id); drop(); })}>
              Surface: {presets[id].name} <span className="cmdk-hint">{presets[id].formula}</span>
            </Command.Item>
          ))}
          {optimizerIds.map((id) => (
            <Command.Item key={id} onSelect={() => toggleOptimizer(id)}>
              <span style={{ color: `var(${optimizerMeta[id].cssVar})` }}>●</span>&nbsp;
              {optimizers.includes(id) ? "Hide" : "Show"} {optimizerMeta[id].name}
            </Command.Item>
          ))}
          <Command.Item onSelect={() => run(drop)}>Re-drop particles</Command.Item>
        </Command.Group>

        <Command.Group heading="Theme" className="cmdk-group">
          <Command.Item onSelect={() => run(() => setTheme("dark"))}>Theme: dark</Command.Item>
          <Command.Item onSelect={() => run(() => setTheme("light"))}>Theme: light</Command.Item>
          <Command.Item onSelect={() => run(() => setTheme("system"))}>Theme: system</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
