"use client";

import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { Icon } from "@/components/icons/Icon";
import { ICON_PACKS, type IconPack } from "@/lib/content/schema";
import { ICON_PACK_LABELS, loadIconPack, parseIconKey, type IconComponent } from "@/lib/icons/packs";
import { useEditor } from "./EditorContext";
import { Button, inputCls } from "./fields";
import { MediaLibraryModal } from "./MediaPicker";

export interface IconValue {
  iconKey: string | null;
  iconMediaId: string | null;
}

const MAX_RESULTS = 240;

function IconSearchModal({ initial, onSelect, onClose }: { initial: string | null; onSelect: (key: string) => void; onClose: () => void }) {
  const [pack, setPack] = useState<IconPack>(() => parseIconKey(initial ?? "")?.pack ?? "si");
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState<{ pack: IconPack; icons: Record<string, IconComponent> } | null>(null);

  useEffect(() => {
    let alive = true;
    loadIconPack(pack).then((icons) => alive && setLoaded({ pack, icons }));
    return () => {
      alive = false;
    };
  }, [pack]);

  const icons = loaded?.pack === pack ? loaded.icons : null;
  const results = useMemo(() => {
    if (!icons) return [];
    const q = query.toLowerCase().replace(/\s+/g, "");
    return Object.keys(icons).filter((name) => /^[A-Z]/.test(name) && name.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [icons, query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-slate-700 bg-slate-950 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="font-semibold text-slate-100">Choose an icon</h3>
          <Button variant="ghost" onClick={onClose}><FiX /></Button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-slate-800 p-4">
          <select className={`${inputCls} max-w-[14rem]`} value={pack} onChange={(e) => setPack(e.target.value as IconPack)}>
            {ICON_PACKS.map((p) => <option key={p} value={p}>{ICON_PACK_LABELS[p]}</option>)}
          </select>
          <input autoFocus className={`${inputCls} flex-1`} placeholder="Search, e.g. github, react, mail…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="grid flex-1 grid-cols-4 gap-2 overflow-y-auto p-4 sm:grid-cols-8">
          {!icons && <p className="col-span-full text-sm text-slate-500">Loading icons…</p>}
          {icons && results.length === 0 && <p className="col-span-full text-sm italic text-slate-500">No icons match.</p>}
          {icons && results.map((name) => {
            const Comp = icons[name];
            return (
              <button key={name} type="button" title={name} onClick={() => { onSelect(`${pack}:${name}`); onClose(); }}
                className="flex flex-col items-center gap-1 rounded-md border border-slate-800 p-2 text-slate-200 hover:border-sky-400 hover:text-sky-300">
                <Comp size={24} />
                <span className="w-full truncate text-[9px] text-slate-500">{name}</span>
              </button>
            );
          })}
        </div>
        {icons && results.length === MAX_RESULTS && <p className="border-t border-slate-800 p-2 text-center text-xs text-slate-500">Showing first {MAX_RESULTS} — refine your search.</p>}
      </div>
    </div>
  );
}

/** Pick a library icon or an uploaded image (image wins when both are set). */
export function IconPicker({ label, value, onChange }: { label: string; value: IconValue; onChange: (v: IconValue) => void }) {
  const { doc } = useEditor();
  const [modal, setModal] = useState<"icon" | "image" | null>(null);
  const imageUrl = value.iconMediaId ? (doc.media.find((m) => m.id === value.iconMediaId)?.url ?? null) : null;
  const hasValue = Boolean(value.iconKey || value.iconMediaId);

  return (
    <div className="space-y-1">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-2xl text-slate-200">
          <Icon icon={hasValue ? { iconKey: value.iconKey, imageUrl } : null} />
        </div>
        <Button onClick={() => setModal("icon")}>Library icon</Button>
        <Button onClick={() => setModal("image")}>Image</Button>
        {hasValue && <Button variant="ghost" onClick={() => onChange({ iconKey: null, iconMediaId: null })}>Clear</Button>}
        <span className="text-xs text-slate-500">{value.iconMediaId ? "Using image" : value.iconKey ?? "No icon (placeholder)"}</span>
      </div>
      {modal === "icon" && (
        <IconSearchModal initial={value.iconKey} onClose={() => setModal(null)} onSelect={(iconKey) => onChange({ iconKey, iconMediaId: null })} />
      )}
      {modal === "image" && (
        <MediaLibraryModal accept="image" onClose={() => setModal(null)} onSelect={(m) => onChange({ iconKey: null, iconMediaId: m.id })} />
      )}
    </div>
  );
}
