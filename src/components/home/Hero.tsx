"use client";

import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { SplitText, Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Hud } from "@/components/ui/Hud";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { scrollToId } from "@/components/ui/SmoothScroll";
import { useFontsReady } from "@/components/ui/useFontsReady";

export function Hero() {
  const ref = useSceneSection<HTMLElement>("saddle", "hero", 0.3);
  const reduce = useReducedMotion();
  const fontsReady = useFontsReady();

  return (
    <section ref={ref} id="top" className="relative min-h-dvh flex flex-col justify-end pb-10 pt-28">
      {/* hidden until the web fonts land: the block is bottom-anchored, so a
          fallback-font reflow would shift everything and count as CLS */}
      <div className="container-x" style={{ visibility: fontsReady ? "visible" : "hidden" }}>
        <Reveal className="eyebrow mb-5" delay={2}>
          // {site.role} · {site.company} · {site.location}
        </Reveal>

        <h1 className="display text-[clamp(3.4rem,13.5vw,12.5rem)] mb-6">
          <SplitText text="Astitva Jaiswal" em={["Jaiswal"]} delay={0.15} wordClassName="block md:inline-block" />
        </h1>

        <div className="grid md:grid-cols-12 gap-6 items-end">
          <Reveal className="md:col-span-6 max-w-[38rem] text-[1.05rem] md:text-[1.15rem] leading-relaxed text-fg-muted" delay={8}>
            I build and evaluate multimodal AI — video and image benchmarks, generative-media infrastructure, speech and
            language models. The surface behind this text is a loss landscape; the beads are optimizers looking for the
            minimum.
          </Reveal>
          <Reveal className="md:col-span-6 flex flex-wrap items-center gap-4 md:justify-end" delay={12}>
            <Magnetic>
              <Link href="/descent" className="btn btn-primary">
                Enter the descent
                <span aria-hidden>↘</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => scrollToId("work")} className="btn">
                What I work on
              </button>
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-12 flex items-center justify-between border-t hairline pt-4">
          <Hud />
          {!reduce && (
            <motion.span
              aria-hidden
              className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-fg-faint"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              scroll ↓
            </motion.span>
          )}
        </div>
      </div>
    </section>
  );
}
