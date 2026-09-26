"use client";

import { useState } from "react";
import { site, links } from "@/content/site";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSceneSection } from "@/components/ui/useSceneSection";

const socials = [
  { label: "GitHub", href: links.github },
  { label: "Hugging Face", href: links.huggingface },
  { label: "LinkedIn", href: links.linkedin },
  { label: "Kaggle", href: links.kaggle },
];

export function Contact() {
  const ref = useSceneSection<HTMLElement>("saddle", "hero");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <section ref={ref} id="contact" className="relative pt-28 md:pt-40 pb-10">
      <div className="container-x">
        <Reveal className="eyebrow mb-4">// 05 — contact</Reveal>
        <h2 className="display text-[clamp(2.6rem,9vw,8rem)] max-w-[10ch] mb-10">
          <SplitText text="Let's converge." em={["converge."]} />
        </h2>

        <Reveal className="flex flex-wrap items-center gap-4 mb-16" delay={4}>
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              {site.email}
            </a>
          </Magnetic>
          <Magnetic>
            <button type="button" onClick={copy} className="btn">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </Magnetic>
        </Reveal>

        <footer className="border-t hairline pt-6 grid gap-6 md:grid-cols-12 items-end">
          <ul className="md:col-span-6 flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="nav-link">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="md:col-span-6 font-mono text-[0.68rem] tracking-[0.12em] uppercase text-fg-faint md:text-right">
            {site.handle} · {new Date().getFullYear()} · next.js + three.js · press ⌘K
          </p>
        </footer>
      </div>
    </section>
  );
}
