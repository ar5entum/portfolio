import type { Research } from "./research";

/**
 * Soft-deleted: nothing imports this outside the parked route, so none of it is
 * linked, routed or shipped. To restore:
 *  1. rename src/app/work/_viera -> src/app/work/viera
 *  2. add `viera` back to the `research` list in ./research.ts (after CaptionBench)
 *  3. add the /work/viera entries back to src/app/sitemap.ts and the ⌘K palette
 */
export const viera: Research = {
    // Codename on purpose. Don't add the project's real name, title or repo here.
    id: "viera",
    title: "Codename: Viera",
    venue: "Deccan AI Research",
    year: "2026",
    summary:
      "A system that never watches the video scores 65.8%. Asking models directly about seven low-level properties of video, half the field can't beat a blind constant answer.",
    href: "/work/viera",
    featured: true,
    stats: [
      { label: "Clips", value: "840" },
      { label: "Human references", value: "5,880" },
      { label: "Judged cells", value: "42,063" },
      { label: "Blind baseline", value: "65.8%" },
    ],
  };
