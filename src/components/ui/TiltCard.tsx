"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/** Card with a cursor-following highlight and a touch of 3D tilt. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-4, 4]), { stiffness: 180, damping: 20 });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: MouseEvent) => {
    if (!ref.current || reduce) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative group ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          // motion drives the two CSS vars; the gradient reads them
          ["--gx" as string]: glowX,
          ["--gy" as string]: glowY,
          backgroundImage: "radial-gradient(360px circle at var(--gx) var(--gy), color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
