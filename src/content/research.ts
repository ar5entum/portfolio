export type Research = {
  id: string;
  title: string;
  venue: string;
  year: string;
  summary: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  stats?: { label: string; value: string }[];
};

export const research: Research[] = [
  {
    id: "captionbench",
    title: "CaptionBench",
    venue: "Deccan AI Research",
    year: "2026",
    summary:
      "A stalemate on the leaderboard masks distinct failure modes. Trained reviewers rewrote and graded every caption against the footage, instead of relying on reference metrics.",
    href: "/work/captionbench",
    featured: true,
    stats: [
      { label: "Clips", value: "196" },
      { label: "Reviewed captions", value: "1,342" },
      { label: "Window judgments", value: "5,431" },
      { label: "Agreement κ", value: "0.947" },
    ],
  },
  {
    id: "glaucoma",
    title: "A Critical Analysis of Approaches to Glaucoma Detection",
    venue: "IJARSCT · DOI 10.48175/IJARSCT-13871",
    year: "2023",
    summary: "A survey of classical and deep-learning approaches to detecting glaucoma from retinal imaging.",
    href: "https://doi.org/10.48175/IJARSCT-13871",
    external: true,
  },
];

export const captionbench = {
  url: "https://www.deccan.ai/research/introducing-caption-bench-video-captioning-benchmark",
  authors: ["Ankit", "Aangeeras", "Astitva", "Anisha Raju", "Chaitanya Prasad"],
  models: ["Qwen3.8-Max", "Muse Spark 1.2", "Kimi K3", "Seed 2.1 Turbo", "Gemini 3.1 Pro", "Qwen3.8-27B"],
};
