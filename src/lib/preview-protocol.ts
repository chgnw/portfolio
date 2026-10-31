import type { SectionKey } from "@/lib/content/registry";
import type { PortfolioDocument } from "@/lib/content/schema";

/** postMessage protocol between the dashboard (parent) and the preview iframe. */
export type ToPreview = { type: "pf-preview:update"; doc: PortfolioDocument; section?: SectionKey };
export type FromPreview = { type: "pf-preview:ready" } | { type: "pf-preview:section"; section: SectionKey };

export function isMessage<T extends { type: string }>(data: unknown, type: T["type"]): data is T {
  return typeof data === "object" && data !== null && (data as { type?: unknown }).type === type;
}
