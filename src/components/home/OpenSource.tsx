import { opensource, projects, type HFItem } from "@/content/opensource";
import { links } from "@/content/site";
import { OpenSourceClient } from "./OpenSourceClient";

type Stats = { downloads?: number; likes?: number };

async function fetchStats(item: HFItem): Promise<Stats> {
  const base = item.kind === "model" ? "https://huggingface.co/api/models/" : "https://huggingface.co/api/datasets/";
  try {
    const res = await fetch(base + item.id, { next: { revalidate: 86400 } });
    if (!res.ok) return {};
    const j = (await res.json()) as { downloads?: number; likes?: number };
    return { downloads: j.downloads, likes: j.likes };
  } catch {
    return {};
  }
}

/** Server component: pulls live HF numbers at build/ISR time, renders the client grid. */
export async function OpenSource() {
  const stats = await Promise.all(opensource.map(fetchStats));
  const items = opensource.map((it, i) => ({ ...it, ...stats[i] }));
  return <OpenSourceClient items={items} projects={projects} hfUrl={links.huggingface} />;
}
