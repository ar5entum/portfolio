import type { Metadata } from "next";
import { CaptionBench } from "@/components/work/CaptionBench";

export const metadata: Metadata = {
  title: "CaptionBench",
  description:
    "A video-captioning benchmark where trained reviewers rewrite and grade every caption against the footage. A stalemate on the leaderboard masks distinct failure modes.",
  openGraph: {
    title: "CaptionBench — ar5entum",
    description: "A stalemate on the leaderboard masks distinct failure modes.",
  },
};

export default function Page() {
  return <CaptionBench />;
}
