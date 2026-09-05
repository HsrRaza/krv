import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const image = new URL("/logo.png", siteUrl).toString();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1, images: [image] },
    { url: `${siteUrl}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/work-in-progress`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/gallery`, lastModified, changeFrequency: "weekly", priority: 0.8, images: [image] },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
