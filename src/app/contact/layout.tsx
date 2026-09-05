import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("contact");

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
