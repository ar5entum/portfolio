import type { Metadata } from "next";
import { Suspense } from "react";
import { Playground } from "@/components/descent/Playground";

export const metadata: Metadata = {
  title: "Descent",
  description:
    "A live gradient-descent playground. Race SGD, Momentum, Nesterov, Adagrad, RMSProp and Adam over classic test functions, or type your own f(x, z).",
};

export default function DescentPage() {
  return (
    <Suspense fallback={null}>
      <Playground />
    </Suspense>
  );
}
