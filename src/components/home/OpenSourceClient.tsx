"use client";

import type { HFItem } from "@/content/opensource";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { TiltCard } from "@/components/ui/TiltCard";
import { Counter } from "@/components/ui/Counter";

type Item = HFItem & { downloads?: number; likes?: number };
type Project = { title: string; blurb: string; href: string; year: string };

function fmt(n?: number) {
  if (n == null) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function OpenSourceClient({ items, projects, hfUrl }: { items: Item[]; projects: Project[]; hfUrl: string }) {
  const ref = useSceneSection<HTMLElement>("ackley", "skills");
  const models = items.filter((i) => i.kind === "model");
  const datasets = items.filter((i) => i.kind === "dataset");

  return (
    <section ref={ref} id="opensource" className="relative py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <Reveal className="eyebrow mb-4">// 04 — open source</Reveal>
            <h2 className="display text-[clamp(2.4rem,7vw,6rem)] max-w-[14ch]">
              <SplitText text="Weights on the Hub." em={["Hub."]} />
            </h2>
          </div>
          <Reveal delay={4}>
            <a href={hfUrl} target="_blank" rel="noreferrer" className="link-arrow">
              huggingface.co/ar5entum
            </a>
          </Reveal>
        </div>

        <Reveal className="eyebrow mb-4">models</Reveal>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {models.map((m, i) => (
            <HFCard key={m.id} item={m} i={i} />
          ))}
        </ul>

        <Reveal className="eyebrow mb-4">datasets</Reveal>
        <ul className="grid gap-3 sm:grid-cols-2 mb-16">
          {datasets.map((m, i) => (
            <HFCard key={m.id} item={m} i={i} />
          ))}
        </ul>

        <Reveal className="eyebrow mb-4">earlier projects</Reveal>
        <ul className="divide-y hairline border-y">
          {projects.map((p, i) => (
            <Reveal key={p.title} as="li" delay={i * 2}>
              <a href={p.href} target="_blank" rel="noreferrer" className="group grid md:grid-cols-12 gap-3 py-5 items-baseline">
                <span className="eyebrow md:col-span-2">{p.year}</span>
                <span className="md:col-span-5 font-display text-[1.4rem] leading-tight group-hover:text-accent transition-colors">{p.title}</span>
                <span className="md:col-span-5 text-fg-muted text-sm">{p.blurb} <span aria-hidden>↗</span></span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HFCard({ item, i }: { item: Item; i: number }) {
  const href = `https://huggingface.co/${item.kind === "dataset" ? "datasets/" : ""}${item.id}`;
  const dl = fmt(item.downloads);
  const likes = fmt(item.likes);
  return (
    <Reveal as="li" delay={i * 1.2} className="h-full">
      <a href={href} target="_blank" rel="noreferrer" className="block h-full">
        <TiltCard className="card h-full flex flex-col gap-3 py-5">
          <div className="flex items-center justify-between">
            <span className="tag">{item.kind}</span>
            <span className="font-mono text-[0.68rem] text-fg-faint tabular-nums flex gap-3">
              {dl && (
                <span title="downloads (30d)">
                  ↓ <Counter value={dl} />
                </span>
              )}
              {likes && (
                <span title="likes">
                  ♥ <Counter value={likes} />
                </span>
              )}
            </span>
          </div>
          <h3 className="font-display text-[1.35rem] leading-tight">{item.title}</h3>
          <p className="font-mono text-[0.7rem] text-fg-faint break-all">{item.id}</p>
          <p className="text-fg-muted text-sm leading-relaxed">{item.blurb}</p>
        </TiltCard>
      </a>
    </Reveal>
  );
}
