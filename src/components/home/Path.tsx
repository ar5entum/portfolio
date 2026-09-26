"use client";

import { useEffect, useRef } from "react";
import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { useScroll, useMotionValueEvent } from "motion/react";
import { path } from "@/content/experience";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { useScene } from "@/lib/landscape/store";

export function Path() {
  const ref = useSceneSection<HTMLElement>("rosenbrock", "path");
  const inner = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: inner, offset: ["start 70%", "end 40%"] });
  const setDescent = useScene((s) => s.setDescent);

  useMotionValueEvent(scrollYProgress, "change", (v) => setDescent(v));
  useEffect(() => () => setDescent(0), [setDescent]);

  // oldest at the top of the list reads as "start of descent"; data is newest-first
  const steps = [...path].reverse();

  return (
    <section ref={ref} id="path" className="relative py-28 md:py-40">
      <div className="container-x grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal className="eyebrow mb-4">// 02 — path</Reveal>
            <h2 className="display text-[clamp(2.4rem,6.5vw,5.5rem)] max-w-[12ch]">
              <SplitText text="Following the gradient." em={["gradient"]} />
            </h2>
            <Reveal className="mt-6 text-fg-muted max-w-[32ch]" delay={4}>
              Each step is a waypoint. The camera behind this text is descending the same valley.
            </Reveal>
          </div>
        </div>

        <div ref={inner} className="md:col-span-7">
          <ol className="relative border-l hairline pl-8 md:pl-12">
            {steps.map((w, i) => (
              <Reveal key={w.id} as="li" delay={i * 2} className="relative pb-16 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[2.35rem] md:-left-[3.35rem] top-2 h-[9px] w-[9px] rounded-full bg-accent shadow-[0_0_0_4px_var(--bg)]"
                />
                <div className="eyebrow mb-2">{w.period}</div>
                <h3 className="font-display text-[1.9rem] md:text-[2.4rem] leading-none tracking-[-0.01em]">{w.role}</h3>
                <div className="mt-2 text-fg-muted">{w.org}</div>
                <p className="mt-3 max-w-[40ch] text-fg-muted">{w.line}</p>
                {w.href && (
                  <Link href={w.href} className="link-arrow mt-3 inline-block">
                    {w.hrefLabel}
                  </Link>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
