"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: 0.06 * i },
  }),
};

/** Fade/blur a block up when it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span" | "section";
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      variants={lineVariants}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
    >
      {children}
    </Tag>
  );
}

/** Split a heading into words and letters that rise in with a stagger. */
export function SplitText({
  text,
  className = "",
  delay = 0,
  em,
  wordClassName = "inline-block",
}: {
  text: string;
  className?: string;
  delay?: number;
  /** words to render italic/accent */
  em?: string[];
  /** e.g. "block md:inline-block" to force one word per line on small screens */
  wordClassName?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  let k = 0;
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, wi) => {
        const isEm = em?.includes(w.replace(/[^\w]/g, ""));
        return (
          <span key={wi} className={`${wordClassName} whitespace-nowrap`}>
            {Array.from(w).map((ch, ci) => {
              const i = k++;
              return reduce ? (
                <span key={ci} className={isEm ? "italic text-accent" : ""}>
                  {ch}
                </span>
              ) : (
                <motion.span
                  key={ci}
                  aria-hidden
                  className={`inline-block ${isEm ? "italic text-accent" : ""}`}
                  initial={{ y: "110%", opacity: 0, rotate: 3 }}
                  whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.2, 0.75, 0.15, 1], delay: delay + i * 0.022 }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        );
      })}
    </span>
  );
}
