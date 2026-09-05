import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("services");

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
