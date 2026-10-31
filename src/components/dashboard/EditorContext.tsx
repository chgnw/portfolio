"use client";

import { createContext, useContext } from "react";
import type { MediaItem, PortfolioDocument } from "@/lib/content/schema";

export interface EditorApi {
  doc: PortfolioDocument;
  /** Immutable update: receives a deep copy to mutate. */
  update: (mutate: (draft: PortfolioDocument) => void) => void;
  addMedia: (media: MediaItem) => void;
  removeMedia: (mediaId: string) => void;
  notify: (message: string, kind?: "success" | "error" | "info") => void;
}

export const EditorContext = createContext<EditorApi | null>(null);

export function useEditor(): EditorApi {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <Editor>");
  return ctx;
}
