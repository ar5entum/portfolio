import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/descent`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/work/captionbench`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/work/viera`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
}
