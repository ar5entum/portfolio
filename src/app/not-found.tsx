import type { Metadata } from "next";
import { Lost } from "@/components/ui/Lost";

export const metadata: Metadata = { title: "Diverged" };

export default function NotFound() {
  return <Lost />;
}
