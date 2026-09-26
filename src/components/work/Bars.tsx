"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type Row = { label: string; value: number };

/**
 * Horizontal bar chart: one series, one axis, single hue, direct labels.
 * Bars grow in when scrolled into view; hover shows the exact value.
 */
export function Bars({
  title,
  rows,
  max,
  reference,
  format = (v) => String(v),
}: {
  title: string;
  rows: Row[];
  max: number;
  reference?: { value: number; label: string };
  format?: (v: number) => string;
}) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure>
      <figcaption className="eyebrow mb-5">{title}</figcaption>
      <div className="relative grid gap-4">
        {reference && (
          <div
            aria-hidden
            className="absolute top-0 bottom-0 border-l border-dashed border-line-strong"
            style={{ left: `calc(9rem + (100% - 9rem) * ${reference.value / max})` }}
          >
            <span className="absolute -top-5 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fg-faint whitespace-nowrap">
              {reference.label}
            </span>
          </div>
        )}
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="grid grid-cols-[9rem_1fr] items-center gap-3 min-h-[28px]"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            title={`${r.label}: ${format(r.value)}`}
          >
            <span className="text-sm text-fg-muted truncate">{r.label}</span>
            <div className="relative h-[22px]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-r-[4px]"
                style={{ background: "var(--accent-2)", opacity: hover === null || hover === i ? 1 : 0.55 }}
                initial={reduce ? { width: `${(r.value / max) * 100}%` } : { width: 0 }}
                whileInView={{ width: `${(r.value / max) * 100}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.12 }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 font-mono text-[0.72rem] tabular-nums text-fg"
                style={{ left: `calc(${(r.value / max) * 100}% + 8px)` }}
              >
                {format(r.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{format(r.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
