import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("workInProgress");

export default function WorkInProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
