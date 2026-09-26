"use client";

import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { skills, type Skill } from "@/content/skills";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { TiltCard } from "@/components/ui/TiltCard";

export function Skills() {
  const ref = useSceneSection<HTMLElement>("himmelblau", "skills");
  return (
    <section ref={ref} id="work" className="relative py-28 md:py-40">
      <div className="container-x">
        <Reveal className="eyebrow mb-4">// 01 — what I work on</Reveal>
        <h2 className="display text-[clamp(2.4rem,7vw,6rem)] max-w-[14ch] mb-14">
          <SplitText text="Five minima, one descent." em={["descent"]} />
        </h2>

        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.id} as="li" delay={i * 1.5} className="h-full">
              <TiltCard className="card h-full flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="eyebrow">{s.index}</span>
                  <Motif kind={s.motif} />
                </div>
                <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.01em]">{s.title}</h3>
                <p className="text-fg-muted text-[0.95rem] leading-relaxed">{s.blurb}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                {s.href && (
                  <Link href={s.href} className="link-arrow mt-2 self-start">
                    {s.hrefLabel ?? "Read more"}
                  </Link>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Small live glyph per theme, pure SVG + CSS. */
function Motif({ kind }: { kind: Skill["motif"] }) {
  const stroke = "currentColor";
  const common = { fill: "none", stroke, strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };
  switch (kind) {
    case "contour":
      return (
        <svg viewBox="0 0 48 48" className="motif">
          {[6, 11, 16, 21].map((r, i) => (
            <ellipse key={r} cx="24" cy="24" rx={r} ry={r * 0.7} {...common} className="motif-ring" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
          <circle cx="24" cy="24" r="1.6" fill="currentColor" />
        </svg>
      );
    case "pipeline":
      return (
        <svg viewBox="0 0 48 48" className="motif">
          <path d="M4 24 H44" {...common} strokeDasharray="2 3" />
          {[8, 24, 40].map((x) => (
            <rect key={x} x={x - 4} y="19" width="8" height="10" rx="1.5" {...common} />
          ))}
          <circle r="2" cy="24" fill="currentColor" className="motif-dot" />
        </svg>
      );
    case "agent":
      return (
        <svg viewBox="0 0 48 48" className="motif">
          <circle cx="24" cy="24" r="4" {...common} />
          <circle cx="24" cy="24" r="10" {...common} className="motif-pulse" />
          <circle cx="24" cy="24" r="16" {...common} className="motif-pulse" style={{ animationDelay: "0.6s" }} />
          <path d="M24 8 v-4 M24 44 v-4 M8 24 h-4 M44 24 h-4" {...common} />
        </svg>
      );
    case "graph":
      return (
        <svg viewBox="0 0 48 48" className="motif">
          <path d="M10 36 L22 14 L36 30 L22 14 M10 36 L36 30 M36 30 L42 12" {...common} />
          {[
            [10, 36],
            [22, 14],
            [36, 30],
            [42, 12],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.4" fill="currentColor" className="motif-node" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 48 48" className="motif">
          <path d="M2 24 C 8 8, 14 40, 20 24 S 32 8, 38 24 S 46 30, 46 24" {...common} className="motif-wave" />
        </svg>
      );
  }
}
