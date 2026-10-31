import type { ComponentType } from "react";
import type { IconPack } from "@/lib/content/schema";

/**
 * Icon keys look like "si:SiReact" — `<pack>:<react-icons export name>`.
 * Packs are loaded lazily so the public bundle never ships whole icon sets.
 */
export type IconComponent = ComponentType<{ className?: string; size?: string | number; title?: string }>;
type IconModule = Record<string, IconComponent>;

export const ICON_PACK_LABELS: Record<IconPack, string> = {
  fi: "Feather",
  fa6: "Font Awesome 6",
  si: "Simple Icons (brands)",
  lu: "Lucide",
  md: "Material Design",
  tb: "Tabler",
};

const loaders: Record<IconPack, () => Promise<unknown>> = {
  fi: () => import("react-icons/fi"),
  fa6: () => import("react-icons/fa6"),
  si: () => import("react-icons/si"),
  lu: () => import("react-icons/lu"),
  md: () => import("react-icons/md"),
  tb: () => import("react-icons/tb"),
};

const cache = new Map<IconPack, Promise<IconModule>>();

export function loadIconPack(pack: IconPack): Promise<IconModule> {
  let p = cache.get(pack);
  if (!p) {
    p = loaders[pack]().then((m) => m as IconModule);
    cache.set(pack, p);
  }
  return p;
}

export function parseIconKey(key: string): { pack: IconPack; name: string } | null {
  const [pack, name] = key.split(":");
  if (!name || !(pack in loaders)) return null;
  return { pack: pack as IconPack, name };
}

export async function resolveIcon(key: string): Promise<IconComponent | null> {
  const parsed = parseIconKey(key);
  if (!parsed) return null;
  const mod = await loadIconPack(parsed.pack);
  return mod[parsed.name] ?? null;
}
