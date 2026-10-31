import "server-only";
import type { ReactNode } from "react";
import { resolveIcon } from "./packs";

/**
 * Renders library icons on the server so the public page ships ready-made
 * SVG markup (no icon-pack download, no icon pop-in).
 */
export async function renderIcons(keys: string[]): Promise<Record<string, ReactNode>> {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const Icon = await resolveIcon(key);
      return [key, Icon ? <Icon /> : null] as const;
    }),
  );
  return Object.fromEntries(entries.filter(([, node]) => node !== null));
}
