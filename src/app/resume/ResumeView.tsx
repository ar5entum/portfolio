"use client";

import { useSceneSection } from "@/components/ui/useSceneSection";

export function ResumeView() {
  const ref = useSceneSection<HTMLElement>("saddle", "flat");
  return (
    <main ref={ref} className="container-x min-h-dvh pt-24 pb-10 flex flex-col">
      <h1 className="display text-[clamp(2rem,5vw,3.6rem)] mb-6">Resume</h1>
      <object data="/resume.pdf#page=1&zoom=150" type="application/pdf" className="flex-1 min-h-[80vh] w-full rounded-lg border hairline">
        <p className="text-fg-muted">
          Your browser can’t display PDFs inline.{" "}
          <a href="/resume.pdf" className="underline">
            Download the resume
          </a>
          .
        </p>
      </object>
    </main>
  );
}
