"use client";

import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { viera } from "@/content/viera";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { useSceneSection } from "@/components/ui/useSceneSection";
import { Bars } from "./Bars";

// Codename page. Don't add the project's real name, title or repository here.

const v = viera;
const BLIND = 65.8;

const models = [
  { label: "Muse-Spark-1.2", value: 71.3 },
  { label: "Seed-2.1-Turbo", value: 71.1 },
  { label: "Qwen3.8-Max", value: 69.3 },
  { label: "Qwen3.8-27B", value: 67.3 },
  { label: "GLM-5V-Turbo", value: 64.7 },
  { label: "Gemini 3.1 Pro", value: 64.4 },
  { label: "MiMo-v2.5", value: 63.6 },
  { label: "VideoChat3-4B", value: 55.6 },
].map((m) => ({ ...m, muted: m.value < BLIND }));

const properties = [
  { name: "Camera movement", base: 30.2, above: 8 },
  { name: "Scene speed", base: 72.6, above: 7 },
  { name: "Object visibility", base: 39.1, above: 7 },
  { name: "Playback direction", base: 86.8, above: 1 },
  { name: "Frame continuity", base: 80.1, above: 1 },
  { name: "Focus change", base: 84.5, above: 0 },
  { name: "Video defects", base: 67.0, above: 0 },
];

export function Viera() {
  const ref = useSceneSection<HTMLElement>("saddle", "flat", 0.05);

  return (
    <main ref={ref} className="pt-28 pb-24">
      {/* header */}
      <header className="container-x" style={{ viewTransitionName: "viera-card" }}>
        <Reveal className="eyebrow mb-4">
          // research · releasing soon · {v.year}
        </Reveal>
        <h1 className="display text-[clamp(3rem,10vw,9rem)] mb-6" style={{ viewTransitionName: "viera-title" }}>
          <em className="block text-[0.4em] leading-none mb-3">Codename:</em>{" "}
          Viera
        </h1>
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <Reveal className="md:col-span-8 text-[1.15rem] md:text-[1.3rem] leading-relaxed text-fg-muted max-w-[50ch]" delay={4}>
            <span className="text-fg">A system that never watches the video scores 65.8%.</span> We asked video models directly about
            seven low-level properties: how fast, what’s visible, which way it plays, what the camera does. On four of the
            seven, the field can’t beat a constant answer from a system with no access to the footage.
          </Reveal>
          <Reveal className="md:col-span-4 flex flex-wrap gap-3 md:justify-end" delay={8}>
            <Link href="/work/captionbench" className="btn">
              ← Follows CaptionBench
            </Link>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-y hairline py-8">
          {[
            { label: "Clips", value: "840" },
            { label: "Human-reviewed references", value: "5,880" },
            { label: "Models", value: "8" },
            { label: "Judged cells", value: "42,063" },
          ].map((s) => (
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
      <Section n="01" eyebrow="why ask directly" title="From by-product to instrument.">
        <Reveal as="p" delay={2}>
          CaptionBench found that camera and shot description was the most expensive caption failure to repair, and the one
          whole-caption review was worst at seeing. But it was measured as a by-product: reviewers were judging captions,
          and camera errors fell out of the corrections.
        </Reveal>
        <Reveal as="p" delay={4}>
          So we stopped inferring these properties from prose and asked about them directly: scene speed, object
          visibility, video defects, focus change, playback direction, frame continuity and camera movement. Five of the
          captioners from the last study reappear, so the field is largely the same.
        </Reveal>
        <Reveal as="p" delay={6} className="text-fg">
          The headline isn’t a ranking. On most of these properties, the number a model earns is mostly the label prior,
          not the model.
        </Reveal>
      </Section>

      {/* 1. blind baseline */}
      <Section n="02" eyebrow="the blind baseline" title="Half the field can’t beat a constant answer." aside="Macro accuracy across seven properties on the 682 clips every model completed. Dashed line: a system that ignores the video and always gives each property’s most common answer.">
        <Reveal className="card" delay={2}>
          <Bars
            title="Macro accuracy · 682 paired clips"
            max={100}
            reference={{ value: BLIND, label: "blind 65.8%" }}
            rows={models}
            format={(x) => `${x.toFixed(1)}%`}
          />
          <p className="mt-5 font-mono text-[0.68rem] text-fg-faint">
            Grey bars fall below the blind baseline. The 4B model runs locally on a smaller frame budget, so it’s a reference
            point rather than a like-for-like entry.
          </p>
        </Reveal>
        <Reveal as="p" delay={4}>
          Four of eight clear it, and the best margin is 5.5 points.
        </Reveal>
      </Section>

      {/* 2. per property */}
      <Section n="03" eyebrow="per property" title="The highest raw scores carry the least information." aside="For each property: the blind baseline, and how many of the eight models beat it.">
        <Reveal className="card" delay={2}>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-0 items-center">
            <span className="eyebrow pb-3">property</span>
            <span className="eyebrow pb-3 text-right">blind</span>
            <span className="eyebrow pb-3">models above it</span>
            {properties.map((p) => (
              <Row key={p.name} {...p} />
            ))}
          </div>
        </Reveal>
        <Reveal as="p" delay={4}>
          The ordering inverts. Playback direction, frame continuity and focus change produce the highest raw accuracy in the
          study, and they’re where models learn almost nothing. The reason is the corpus:{" "}
          <span className="text-fg">86.9% of clips play forward, 84.4% hold focus, 80.7% run continuous.</span> Always guess the
          common case and you score in the eighties while telling nobody anything.
        </Reveal>
        <Reveal className="card border-l-2 !border-l-accent" delay={6}>
          <p className="eyebrow mb-2 !text-accent">the practical version</p>
          <p className="text-fg">
            A headline average is dominated by whichever properties happen to have skewed priors in your corpus. Three of our
            seven measure the model. Four measure the corpus.
          </p>
        </Reveal>
      </Section>

      {/* 3. camera */}
      <Section n="04" eyebrow="camera movement" title="Hardest, and most informative.">
        <Reveal as="p" delay={2}>
          Camera movement records the lowest accuracy in the study, <span className="text-fg">30.4% to 41.1%</span>, and it’s the
          only property every model clears. Both come from the same place: a weak prior. The most common answer covers just
          30.2% of clips, spread over 127 distinct combinations.
        </Reveal>
        <Reveal as="p" delay={4}>
          It’s multi-label, too. A third of clips carry three or more simultaneous camera behaviours, one carries seven, and a
          prediction only counts if it names all of them. The most common pair is a pan that reverses mid-clip.
        </Reveal>
        <Reveal delay={6}>
          <CameraStrip />
        </Reveal>
      </Section>

      {/* 4. defects */}
      <Section n="05" eyebrow="video defects" title="On defects, models are worse than useless.">
        <Reveal as="p" delay={2}>
          Every model scores below the “this clip is clean” base rate of 67.0%, from 64.7% down to 38.4%. Scoring in the
          thirties when “clean” gets you sixty-seven means{" "}
          <span className="text-fg">systematically claiming defects on footage that has none.</span> The direction is the same for
          all eight models: they over-report, never under-report.
        </Reveal>
      </Section>

      {/* 5. cost */}
      <Section n="06" eyebrow="price" title="Price and accuracy are close to uncorrelated.">
        <Reveal className="grid grid-cols-2 gap-4" delay={2}>
          <div className="card">
            <div className="eyebrow mb-2">cost per accuracy point</div>
            <div className="font-display text-[3rem] leading-none tabular-nums">
              <Counter value="51×" />
            </div>
            <p className="mt-2 text-fg-muted text-sm">spread across the hosted field, $0.015 to $0.755</p>
          </div>
          <div className="card">
            <div className="eyebrow mb-2">macro accuracy</div>
            <div className="font-display text-[3rem] leading-none tabular-nums">
              ~<Counter value="7" /> pts
            </div>
            <p className="mt-2 text-fg-muted text-sm">spread across the same models</p>
          </div>
        </Reveal>
        <Reveal as="p" delay={4}>
          The most expensive system isn’t the most accurate, and the cheapest hosted one is mid-table. For anyone picking a
          model for a perception-heavy pipeline, it’s the most actionable number here, and no accuracy table reports it.
        </Reveal>
      </Section>

      {/* 6. non-findings */}
      <Section n="07" eyebrow="what we expected and didn’t find" title="Two dead ends, so you can skip them.">
        <Reveal className="card" delay={2}>
          <h3 className="font-display text-[1.5rem] leading-tight mb-2">Scale barely moves these properties.</h3>
          <p className="text-fg-muted text-sm leading-relaxed">
            Leaving out the local 4B model, the other seven span 63.6% to 71.3%, just 7.7 points from a frontier proprietary
            system to six hosted open-weight ones. The same models separate by far more on semantic video suites. Whatever
            these properties measure, parameter count isn’t the lever.
          </p>
        </Reveal>
        <Reveal className="card" delay={4}>
          <h3 className="font-display text-[1.5rem] leading-tight mb-2">A vocabulary guard didn’t stop answer leakage.</h3>
          <p className="text-fg-muted text-sm leading-relaxed">
            Prompts were optimised per model with a guard meant to reject any candidate containing the answer vocabulary. All
            eight final prompts still carried 15 to 23 of the 35 answer strings, because of two gaps in how the guard was
            wired. The lesson: an obvious guard isn’t enough. Audit the artefacts, not the mechanism.
          </p>
        </Reveal>
      </Section>

      {/* method */}
      <Section n="08" eyebrow="method & limits" title="Read it as diagnosis, not a leaderboard.">
        <Reveal as="p" delay={2}>
          Each model gets a clip as a frame sequence and returns one structured response covering all seven properties in
          prose. It never sees the answer options. A fixed language-model judge scores each property against human-written
          reference descriptions, with the same judge, prompt and parsing for every system. Comparisons use only the 682 clips
          every model completed.
        </Reveal>
        <Reveal as="ul" delay={4}>
          {[
            "Prompts are option-free but not fully label-blind: the instructions name 13 of the 35 answer strings.",
            "One model runs a smaller frame budget and isn’t frame-matched.",
            "No confidence intervals or chance-corrected statistics, so small gaps aren’t separations.",
            "The categorical key for defects is still being reconciled against the reference text.",
          ].map((t) => (
            <li key={t} className="py-2 border-b hairline text-fg-muted text-sm">
              {t}
            </li>
          ))}
        </Reveal>
        <Reveal as="p" delay={6}>
          Every model got a prompt tuned for it, so model differences reflect the model and its prompt together. The findings
          that survive that caveat are about the <span className="text-fg">properties</span>: which discriminate, which are prior,
          which are expensive.
        </Reveal>
      </Section>

      {/* output */}
      <Section n="09" eyebrow="what it produces" title="A corpus, not just a score.">
        <Reveal as="p" delay={2}>
          As with CaptionBench, the benchmark is a by-product. The annotation yields{" "}
          <span className="text-fg">5,880 human-reviewed reference descriptions</span> across 840 clips. Each one is paired with a
          label from a frozen vocabulary covering seven properties that caption-level review measures poorly.
        </Reveal>
        <Reveal as="ul" delay={4} className="grid sm:grid-cols-3 gap-4 mt-2">
          {[
            ["Training target", "Each reference is a supervised target for the property it describes."],
            ["Evaluation slice", "Score a model on camera movement alone, not an average that hides it."],
            ["Judge check", "Paired label and description let you test whether a scorer agrees with a human."],
          ].map(([t, d]) => (
            <li key={t} className="card">
              <div className="font-display text-[1.3rem] leading-tight mb-1">{t}</div>
              <p className="text-fg-muted text-sm leading-relaxed">{d}</p>
            </li>
          ))}
        </Reveal>
        <Reveal className="mt-8 flex flex-wrap gap-3" delay={6}>
          <Link href="/work/captionbench" className="btn btn-primary">
            Read CaptionBench
          </Link>
          <Link href="/#research" className="btn">
            ← Back
          </Link>
        </Reveal>
      </Section>
    </main>
  );
}

function Section({
  n,
  eyebrow,
  title,
  aside,
  children,
}: {
  n: string;
  eyebrow: string;
  title: string;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-x mt-24 grid md:grid-cols-12 gap-10">
      <Reveal className="md:col-span-4">
        <p className="eyebrow mb-3">
          // {n} — {eyebrow}
        </p>
        <h2 className="font-display text-[2rem] leading-tight">{title}</h2>
        {aside && <p className="mt-4 text-fg-muted text-sm leading-relaxed max-w-[36ch]">{aside}</p>}
      </Reveal>
      <div className="md:col-span-8 grid gap-5 text-fg-muted leading-relaxed max-w-[64ch]">{children}</div>
    </section>
  );
}

/** One property row: name, blind baseline, eight dots for models that beat it. */
function Row({ name, base, above }: { name: string; base: number; above: number }) {
  return (
    <>
      <span className="py-3 border-t hairline text-fg text-sm">{name}</span>
      <span className="py-3 border-t hairline font-mono text-[0.75rem] tabular-nums text-right text-fg-muted">{base.toFixed(1)}%</span>
      <span className="py-3 border-t hairline flex items-center gap-1.5" aria-label={`${above} of 8 models beat the baseline`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: i < above ? "var(--accent-2)" : "transparent", border: "1px solid var(--line-strong)" }}
          />
        ))}
        <span className="ml-2 font-mono text-[0.72rem] tabular-nums text-fg">{above}/8</span>
      </span>
    </>
  );
}

/** Illustration: a pan that reverses mid-clip, drawn as a camera path over frames. */
function CameraStrip() {
  return (
    <figure className="card" role="img" aria-label="Illustration: a pan that reverses direction mid-clip">
      <figcaption className="eyebrow mb-4">illustration · the most common pair: a pan that reverses</figcaption>
      <svg viewBox="0 0 600 110" className="w-full h-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={6 + i * 49} y={10} width={44} height={30} rx={3} fill="var(--line)" />
        ))}
        <path
          d="M 20 80 C 140 80, 240 80, 330 80 C 360 80, 360 95, 330 95 C 250 95, 180 95, 110 95"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeDasharray="600"
          className="camera-path"
        />
        <polygon points="110,90 100,95 110,100" fill="var(--accent)" />
        <text x={20} y={70} className="font-mono" fontSize={10} fill="var(--fg-muted)">
          pan right →
        </text>
        <text x={120} y={108} className="font-mono" fontSize={10} fill="var(--fg-muted)">
          ← pan left
        </text>
        <text x={372} y={92} className="font-mono" fontSize={10} fill="var(--accent)">
          reversal: both labels required
        </text>
      </svg>
    </figure>
  );
}
