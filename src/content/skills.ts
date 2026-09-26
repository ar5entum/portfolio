export type Skill = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  tags: string[];
  motif: "contour" | "pipeline" | "agent" | "graph" | "wave";
  href?: string;
  hrefLabel?: string;
};

export const skills: Skill[] = [
  {
    id: "eval",
    index: "01",
    title: "Multimodal evaluation & benchmarking",
    blurb:
      "Designing benchmarks for video and image models: rubric design with human review, failure-mode taxonomies, LLM-as-judge pipelines, inter-rater agreement and prompt optimisation. Probing where models fail, not just where they rank.",
    tags: ["Rubrics", "LLM-as-judge", "DSPy / GEPA", "Video", "Agreement (κ)"],
    motif: "contour",
    href: "/work/captionbench",
    hrefLabel: "See CaptionBench",
  },
  {
    id: "genmedia",
    index: "02",
    title: "Generative-media infrastructure",
    blurb:
      "Distributed job pipelines that serve many image, video and 3D generation models behind one API: queues and workers, multi-provider orchestration, usage and cost accounting, load testing and observability.",
    tags: ["FastAPI", "Kafka", "Celery", "Postgres", "GCP / K8s", "BigQuery"],
    motif: "pipeline",
  },
  {
    id: "agents",
    index: "03",
    title: "Agentic tooling",
    blurb:
      "Tool-grounded AI agents for engineering operations, with safety guards and human-in-the-loop pull requests. Every number in a reply comes from a tool call.",
    tags: ["Claude Agent SDK", "MCP", "Claude Code", "Slack"],
    motif: "agent",
  },
  {
    id: "code",
    index: "04",
    title: "Code intelligence & RL environments",
    blurb:
      "Building verifiable software-engineering tasks for training and evaluating coding agents, using code dependency graphs, git-history mining and sandboxed verification.",
    tags: ["tree-sitter", "LSP", "Docker", "SWE-bench style"],
    motif: "graph",
  },
  {
    id: "speech",
    index: "05",
    title: "Speech & language",
    blurb:
      "ASR, seq2seq translation and transliteration, Indic and code-mixed NLP, and distributed GPU training.",
    tags: ["PyTorch", "Transformers", "DeepSpeed", "NeMo", "Wav2Vec2"],
    motif: "wave",
  },
];
