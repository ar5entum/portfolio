"use client";

import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { research } from "@/content/research";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { TiltCard } from "@/components/ui/TiltCard";
import { Counter } from "@/components/ui/Counter";

export function Research() {
  const ref = useSceneSection<HTMLElement>("rastrigin", "research");
  const featured = research.filter((r) => r.featured);
  const rest = research.filter((r) => !r.featured);

  return (
    <section ref={ref} id="research" className="relative py-28 md:py-40">
      <div className="container-x">
        <Reveal className="eyebrow mb-4">// 03 — research</Reveal>
        <h2 className="display text-[clamp(2.4rem,7vw,6rem)] max-w-[16ch] mb-14">
          <SplitText text="Where models fail, not just where they rank." em={["fail,"]} />
        </h2>

        <div className="grid gap-6">
          {featured.map((f, fi) => (
            <Reveal key={f.id} delay={fi * 2}>
              <Link href={f.href} className="block" style={{ viewTransitionName: `${f.id}-card` }}>
                <TiltCard className="card card-featured grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-7 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <span className="tag tag-accent">{f.id === "viera" ? "Releasing soon" : "Featured"}</span>
                      <span className="eyebrow">
                        {f.venue} · {f.year}
                      </span>
                    </div>
                    <h3 className="display text-[clamp(2.4rem,6vw,5rem)]" style={{ viewTransitionName: `${f.id}-title` }}>
                      <Title text={f.title} />
                    </h3>
                    <p className="text-fg-muted text-[1.05rem] leading-relaxed max-w-[52ch]">{f.summary}</p>
                    <span className="link-arrow mt-auto">Read the case study</span>
                  </div>
                  <dl className="md:col-span-5 grid grid-cols-2 gap-x-6 gap-y-8 content-center">
                    {f.stats?.map((s) => (
                      <div key={s.label}>
                        <dt className="eyebrow mb-2">{s.label}</dt>
                        <dd className="font-display text-[2.4rem] leading-none tabular-nums">
                          <Counter value={s.value} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>

        <ul className="mt-6 divide-y hairline border-y">
          {rest.map((r, i) => (
            <Reveal key={r.id} as="li" delay={i * 2}>
              <a
                href={r.href}
                target={r.external ? "_blank" : undefined}
                rel={r.external ? "noreferrer" : undefined}
                className="group grid md:grid-cols-12 gap-3 py-6 items-baseline"
              >
                <span className="eyebrow md:col-span-2">{r.year}</span>
                <span className="md:col-span-6 font-display text-[1.5rem] leading-tight group-hover:text-accent transition-colors">
                  {r.title}
                </span>
                <span className="md:col-span-4 text-fg-muted text-sm md:text-right">
                  {r.venue} {r.external && <span aria-hidden>↗</span>}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Codename: Viera" -> small italic "Codename:" over the name. */
function Title({ text }: { text: string }) {
  const m = text.match(/^(Codename:)\s*(.+)$/);
  if (!m) return <>{text}</>;
  return (
    <>
      <em className="block text-[0.42em] leading-none mb-2">{m[1]}</em>{" "}
      {m[2]}
    </>
  );
}
