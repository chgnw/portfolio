"use client";

import { useRef, useState, useTransition } from "react";
import { FiFileText, FiImage, FiUpload, FiX } from "react-icons/fi";
import { uploadMediaAction, addMediaUrlAction } from "@/app/dashboard/(app)/actions";
import type { MediaItem } from "@/lib/content/schema";
import { useEditor } from "./EditorContext";
import { Button, inputCls } from "./fields";

export function MediaThumb({ media, className = "h-16 w-16" }: { media: MediaItem | undefined; className?: string }) {
  if (!media) {
    return (
      <div className={`${className} flex items-center justify-center rounded-md border border-dashed border-slate-700 text-slate-600`}>
        <FiImage />
      </div>
    );
  }
  if (media.mimeType === "application/pdf") {
    return (
      <div className={`${className} flex flex-col items-center justify-center rounded-md bg-slate-800 text-slate-300 text-[10px]`}>
        <FiFileText size={20} />
        PDF
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.url} alt={media.fileName} className={`${className} rounded-md bg-slate-800 object-contain p-1`} />;
}

/** Upload a file (or register a URL); resolves to the new media item. */
export function useUpload() {
  const { addMedia, notify } = useEditor();
  const [pending, start] = useTransition();
  const upload = (file: File, onDone?: (m: MediaItem) => void) =>
    start(async () => {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadMediaAction(fd);
      if (!res.ok) return notify(res.error, "error");
      addMedia(res.data.media);
      onDone?.(res.data.media);
    });
  const addUrl = (url: string, onDone?: (m: MediaItem) => void) =>
    start(async () => {
      const res = await addMediaUrlAction(url, "");
      if (!res.ok) return notify(res.error, "error");
      addMedia(res.data.media);
      onDone?.(res.data.media);
    });
  return { upload, addUrl, pending };
}

export function MediaLibraryModal({
  onSelect, onClose, accept = "image",
}: { onSelect: (m: MediaItem) => void; onClose: () => void; accept?: "image" | "pdf" | "any" }) {
  const { doc } = useEditor();
  const { upload, addUrl, pending } = useUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");

  const items = doc.media.filter((m) => {
    if (accept === "image" && !m.mimeType.startsWith("image/")) return false;
    if (accept === "pdf" && m.mimeType !== "application/pdf") return false;
    return m.fileName.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-slate-700 bg-slate-950 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="font-semibold text-slate-100">Media library</h3>
          <Button variant="ghost" onClick={onClose}><FiX /></Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 p-4">
          <input ref={fileRef} type="file" hidden
            accept={accept === "pdf" ? "application/pdf" : accept === "image" ? "image/png,image/jpeg,image/webp,image/gif,image/avif" : "image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf"}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f, (m) => { onSelect(m); onClose(); });
              e.target.value = "";
            }} />
          <Button variant="primary" disabled={pending} onClick={() => fileRef.current?.click()}>
            <FiUpload /> {pending ? "Uploading…" : "Upload file"}
          </Button>
          <span className="text-xs text-slate-500">or</span>
          <input className={`${inputCls} max-w-xs`} placeholder="https://… or /path/in/public.png" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button disabled={!url || pending} onClick={() => addUrl(url, (m) => { onSelect(m); onClose(); })}>Add URL</Button>
          <input className={`${inputCls} ml-auto max-w-[12rem]`} placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-5">
          {items.length === 0 && <p className="col-span-full text-sm italic text-slate-500">No files yet — upload one above.</p>}
          {items.map((m) => (
            <button key={m.id} type="button" onClick={() => { onSelect(m); onClose(); }}
              className="group flex flex-col items-center gap-1 rounded-lg border border-slate-800 p-2 hover:border-sky-400">
              <MediaThumb media={m} className="h-20 w-full" />
              <span className="w-full truncate text-[11px] text-slate-400 group-hover:text-slate-200">{m.fileName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MediaPicker({
  label, value, onChange, accept = "image", hint,
}: { label: string; value: string | null; onChange: (id: string | null) => void; accept?: "image" | "pdf" | "any"; hint?: string }) {
  const { doc } = useEditor();
  const [open, setOpen] = useState(false);
  const media = value ? doc.media.find((m) => m.id === value) : undefined;
  return (
    <div className="space-y-1">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <MediaThumb media={media} />
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>{media ? "Change" : "Choose"}</Button>
            {media && <Button variant="ghost" onClick={() => onChange(null)}>Remove</Button>}
          </div>
          <span className="max-w-[14rem] truncate text-xs text-slate-500">{media?.fileName ?? hint ?? "Placeholder will be shown"}</span>
        </div>
      </div>
      {open && <MediaLibraryModal accept={accept} onClose={() => setOpen(false)} onSelect={(m) => onChange(m.id)} />}
    </div>
  );
}
