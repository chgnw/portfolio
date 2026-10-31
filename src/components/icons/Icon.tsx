"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { IconRef } from "@/lib/content/view";
import { resolveIcon, type IconComponent } from "@/lib/icons/packs";

/** Server pre-rendered icons (production). Missing keys are lazy-loaded (preview / dashboard). */
const PreloadedIcons = createContext<Record<string, ReactNode>>({});

export function IconProvider({ icons, children }: { icons: Record<string, ReactNode>; children: ReactNode }) {
  return <PreloadedIcons.Provider value={icons}>{children}</PreloadedIcons.Provider>;
}

function useLazyIcon(key: string | null, skip: boolean) {
  const [state, setState] = useState<{ key: string; Icon: IconComponent | null } | null>(null);
  useEffect(() => {
    if (!key || skip) return;
    let alive = true;
    resolveIcon(key).then((Icon) => alive && setState({ key, Icon }), () => alive && setState({ key, Icon: null }));
    return () => {
      alive = false;
    };
  }, [key, skip]);
  return state && state.key === key ? state.Icon : null;
}

const Placeholder = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
  </svg>
);

/**
 * Renders an icon reference: uploaded image > library icon > placeholder.
 * Size it with font-size (e.g. `text-2xl`) or the `size` prop (px).
 */
export function Icon({ icon, size, className = "", label }: { icon: IconRef | null; size?: number; className?: string; label?: string }) {
  const preloaded = useContext(PreloadedIcons);
  const key = icon && !icon.imageUrl ? icon.iconKey : null;
  const pre = key ? preloaded[key] : undefined;
  const Lazy = useLazyIcon(key, pre !== undefined);
  const style = size ? { fontSize: size } : undefined;

  if (icon?.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon.imageUrl} alt={label ?? ""} className={`inline-block h-[1em] w-[1em] object-contain ${className}`} style={style} />
    );
  }
  return (
    <span className={`inline-flex items-center justify-center leading-none ${className}`} style={style} aria-hidden={label ? undefined : true}>
      {pre ?? (Lazy ? <Lazy /> : <Placeholder />)}
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
