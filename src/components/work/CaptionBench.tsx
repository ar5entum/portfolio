"use client";

import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { research, captionbench } from "@/content/research";
import { Reveal, SplitText } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { Bars } from "./Bars";
import { TimelineStrip } from "./TimelineStrip";

const cb = research.find((r) => r.id === "captionbench")!;

export function CaptionBench() {
  const ref = useSceneSection<HTMLElement>("saddle", "flat", 0.05);

  return (
    <main ref={ref} className="pt-28 pb-24">
      {/* header */}
      <header className="container-x" style={{ viewTransitionName: "captionbench-card" }}>
        <Reveal className="eyebrow mb-4">
          // research · {cb.venue} · {cb.year}
        </Reveal>
        <h1 className="display text-[clamp(3rem,10vw,9rem)] mb-6" style={{ viewTransitionName: "captionbench-title" }}>
          CaptionBench
        </h1>
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <Reveal className="md:col-span-7 text-[1.15rem] md:text-[1.3rem] leading-relaxed text-fg-muted max-w-[46ch]" delay={4}>
            A stalemate on the leaderboard masks distinct failure modes. We had trained reviewers rewrite and grade every
            caption against the footage — then checked what those corrections revealed against what the scores said.
          </Reveal>
          <Reveal className="md:col-span-5 flex flex-wrap gap-3 md:justify-end" delay={8}>
            <a href={captionbench.url} target="_blank" rel="noreferrer" className="btn btn-primary">
              Read the full post ↗
            </a>
            <a href="https://data.deccan.ai/access" target="_blank" rel="noreferrer" className="btn">
              Dataset access ↗
            </a>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-y hairline py-8">
          {cb.stats!.map((s) => (
            <div key={s.label}>
              <dt className="eyebrow mb-2">{s.label}</dt>
              <dd className="font-display text-[2.6rem] md:text-[3.2rem] leading-none tabular-nums">
                <Counter value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* why */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 01 — why captions matter now</p>
          <h2 className="font-display text-[2rem] leading-tight">A caption used to be metadata.</h2>
        </Reveal>
        <div className="md:col-span-8 grid gap-5 text-fg-muted leading-relaxed max-w-[60ch]">
          <Reveal as="p" delay={2}>
            Captions now drive retrieval, clipping and search directly over caption corpora, where the caption is the
            primary artefact rather than a label attached to one. A caption that reads well but places an action three
            seconds off from when it actually happens is a real defect.
          </Reveal>
          <Reveal as="p" delay={4}>
            Anyone choosing a captioner needs two answers: which model fits their footage, and when a model gets
            something wrong, what fixes it. Reference-based metrics answer neither.
          </Reveal>
          <Reveal delay={6}>
            <TimelineStrip />
          </Reveal>
        </div>
      </section>

      {/* method */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 02 — method</p>
          <h2 className="font-display text-[2rem] leading-tight">Rewrite, then grade.</h2>
        </Reveal>
        <ol className="md:col-span-8 grid sm:grid-cols-2 gap-4">
          {[
            ["196 clips", "Short-form footage, mostly under thirty seconds, across the kinds of video people actually caption."],
            ["Six models", captionbench.models.join(" · ")],
            ["Two passes", "Each caption graded once as a whole summary and again segment-by-segment against the timeline."],
            ["Six failure types", "Every rejection tagged with a category and a severity; critical means more than 45% of the text had to be replaced."],
            ["κ = 0.947", "Inter-rater agreement across 1,144 double-reviewed captions."],
            ["5,431 windows", "Window-level judgments, so timing errors are measurable rather than anecdotal."],
          ].map(([t, d], i) => (
            <Reveal key={t} as="li" delay={i * 1.5} className="card">
              <div className="font-display text-[1.6rem] leading-none mb-2">{t}</div>
              <p className="text-fg-muted text-sm leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* metrics at chance */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 03 — the metrics didn’t know</p>
          <h2 className="font-display text-[2rem] leading-tight">BLEU and CIDEr scored good and bad captions alike.</h2>
          <p className="mt-4 text-fg-muted text-sm leading-relaxed max-w-[36ch]">
            Area under the curve at separating accepted from rejected captions. 0.5 is a coin flip.
          </p>
        </Reveal>
        <Reveal className="md:col-span-8 card" delay={3}>
          <Bars
            title="AUC · accepted vs rejected"
            max={1}
            reference={{ value: 0.5, label: "chance" }}
            rows={[
              { label: "BLEU-4", value: 0.51 },
              { label: "CIDEr", value: 0.53 },
            ]}
            format={(v) => v.toFixed(2)}
          />
        </Reveal>
      </section>

      {/* failure profiles */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 04 — distinct failure modes</p>
          <h2 className="font-display text-[2rem] leading-tight">Similar scores, different problems.</h2>
          <p className="mt-4 text-fg-muted text-sm leading-relaxed max-w-[36ch]">
            Each needs a different fix: less assertion, more coverage, or a different model.
          </p>
        </Reveal>
        <div className="md:col-span-8 grid sm:grid-cols-3 gap-4">
          {[
            {
              model: "Qwen3.8-27B",
              stat: "46.4%",
              label: "hallucination rate",
              note: "Over-assertive: invents detail, but has excellent timeline accuracy.",
            },
            {
              model: "Gemini 3.1 Pro",
              stat: "worst",
              label: "temporal alignment & omission",
              note: "Conservative but incomplete: rarely wrong, often missing.",
            },
            {
              model: "Muse Spark 1.2",
              stat: "16%",
              label: "critical-failure rate",
              note: "2.6× the best model, and 41.7% of its accepted captions hid a rejected segment.",
            },
          ].map((f, i) => (
            <Reveal key={f.model} delay={i * 2} className="card flex flex-col gap-3">
              <span className="eyebrow">{f.model}</span>
              <span className="font-display text-[2.6rem] leading-none tabular-nums">
                {/^[\d.]/.test(f.stat) ? <Counter value={f.stat} /> : f.stat}
              </span>
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-fg-muted">{f.label}</span>
              <p className="text-fg-muted text-sm leading-relaxed">{f.note}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* camera/shot */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 05 — the expensive error</p>
          <h2 className="font-display text-[2rem] leading-tight">Camera and shot errors hide in summaries.</h2>
          <p className="mt-4 text-fg-muted text-sm leading-relaxed max-w-[36ch]">
            Reviewing segment-by-segment surfaced 4.7× more camera/shot failures than reading the caption as a whole. It’s
            also the category most often marked critical (21.6%).
          </p>
        </Reveal>
        <Reveal className="md:col-span-8 card" delay={3}>
          <Bars
            title="Camera/shot failures found · relative to full-summary review"
            max={5}
            rows={[
              { label: "Full-summary review", value: 1 },
              { label: "Segment-by-segment", value: 4.7 },
            ]}
            format={(v) => `${v.toFixed(1)}×`}
          />
        </Reveal>
      </section>

      {/* output */}
      <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
        <Reveal className="md:col-span-4">
          <p className="eyebrow mb-3">// 06 — what it produced</p>
          <h2 className="font-display text-[2rem] leading-tight">Corrections, not just scores.</h2>
        </Reveal>
        <div className="md:col-span-8">
          <ul className="divide-y hairline border-y">
            {[
              ["1,342", "reviewed captions"],
              ["454", "rejected outputs with human corrections"],
              ["5,431", "window-level judgments"],
              ["6", "failure categories, each with a severity"],
            ].map(([n, l], i) => (
              <Reveal key={l} as="li" delay={i * 1.5} className="grid grid-cols-[8rem_1fr] items-baseline py-4">
                <span className="font-display text-[2rem] leading-none tabular-nums">
                  <Counter value={n} />
                </span>
                <span className="text-fg-muted">{l}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8 text-fg-muted text-sm" delay={6}>
            With {captionbench.authors.filter((a) => a !== "Astitva").join(", ")} at Deccan AI.
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap gap-3" delay={8}>
            <a href={captionbench.url} target="_blank" rel="noreferrer" className="btn btn-primary">
              Read the full post ↗
            </a>
            <Link href="/#research" className="btn">
              ← Back
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
