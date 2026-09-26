"use client";

import { useEffect } from "react";
import { TransitionLink as Link } from "@/components/ui/TransitionLink";
import { useScene } from "@/lib/landscape/store";
import { Magnetic } from "./Magnetic";

/** 404: the optimizer diverged. Loss is NaN, the camera is somewhere it shouldn't be. */
export function Lost() {
  useEffect(() => {
    const s = useScene.getState();
    s.setFunction("rastrigin");
    s.setCamera("lost");
    s.setHyper({ lr: 0.45 });
    s.drop();
    return () => {
      const t = useScene.getState();
      t.setHyper({ lr: 0.05 });
      t.setCamera("hero");
    };
  }, []);

  return (
    <main className="container-x min-h-dvh flex flex-col justify-center gap-6 py-24">
      <p className="eyebrow">// step ∞ · loss NaN</p>
      <h1 className="display text-[clamp(4rem,18vw,16rem)] glitch" data-text="404">
        404
      </h1>
      <p className="max-w-[40ch] text-fg-muted text-lg">
        The learning rate was too high and the optimizer diverged. This page isn’t on the landscape.
      </p>
      <div>
        <Magnetic>
          <Link href="/" className="btn btn-primary">
            Reset to the minimum ↩
          </Link>
        </Magnetic>
      </div>
    </main>
  );
}
