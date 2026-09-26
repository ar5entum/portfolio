export type Waypoint = {
  id: string;
  role: string;
  org: string;
  period: string;
  line: string;
  href?: string;
  hrefLabel?: string;
};

// Newest first: the last entry is the starting point, the first is the minimum.
export const path: Waypoint[] = [
  {
    id: "deccan",
    role: "Machine Learning Engineer",
    org: "Deccan AI",
    period: "2026 — now",
    line: "Evaluating and building multimodal AI.",
    href: "/work/captionbench",
    hrefLabel: "CaptionBench",
  },
  {
    id: "assisto",
    role: "AI/ML Research Engineer",
    org: "Assisto Technologies",
    period: "2024 — 2026",
    line: "Speech recognition and language models for Indic languages.",
  },
  {
    id: "assisto-intern",
    role: "MLE Intern",
    org: "Assisto Technologies",
    period: "2024",
    line: "Seq2seq and language modelling.",
  },
  {
    id: "mit",
    role: "BTech, Computer Science",
    org: "MIT ADT University",
    period: "2020 — 2024",
    line: "Where the descent started.",
  },
];
