"use client";

import { useRef, useState, useTransition } from "react";
import { FiTrash2, FiUpload } from "react-icons/fi";
import { deleteMediaAction } from "@/app/dashboard/(app)/actions";
import { newId } from "@/lib/ids";
import { referencedMediaIds } from "@/lib/content/references";
import type { EmploymentType, Organization, Technology } from "@/lib/content/schema";
import { useEditor } from "../EditorContext";
import { Button, Card, ListEditor, PanelHeader, TextInput, Toggle } from "../fields";
import { IconPicker } from "../IconPicker";
import { MediaPicker, MediaThumb, useUpload } from "../MediaPicker";

/** Shared master data: organizations, technologies, employment types. */
export function LibraryPanel() {
  const { doc, update, notify } = useEditor();

  const guardRemove = <T extends { id: string }>(prev: T[], next: T[], isUsed: (id: string) => boolean, what: string) => {
    const removed = prev.filter((p) => !next.some((n) => n.id === p.id));
    const blocked = removed.find((r) => isUsed(r.id));
    if (blocked) {
      notify(`That ${what} is still in use — remove it from its entries first.`, "error");
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-10">
      <div>
        <PanelHeader title="Organizations" description="Companies and schools referenced by Experience and Education." />
        <ListEditor<Organization>
          items={doc.organizations}
          onChange={(items) => {
            const used = (id: string) => doc.experiences.some((e) => e.organizationId === id) || doc.educations.some((e) => e.organizationId === id);
            if (guardRemove(doc.organizations, items, used, "organization")) update((d) => { d.organizations = items; });
          }}
          isActive={(o) => o.isActive}
          title={(o) => o.name}
          addLabel="Add organization"
          create={() => ({ id: newId("organization"), isActive: true, name: "", websiteUrl: "", logoMediaId: null })}
          renderItem={(o, set) => (
            <>
              <Toggle label="Active (inactive hides its entries)" checked={o.isActive} onChange={(isActive) => set({ isActive })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Name" value={o.name} placeholder="Organization name" onChange={(name) => set({ name })} />
                <TextInput label="Website (optional)" value={o.websiteUrl} placeholder="https://…" onChange={(websiteUrl) => set({ websiteUrl })} />
              </div>
              <MediaPicker label="Logo" value={o.logoMediaId} onChange={(logoMediaId) => set({ logoMediaId })} />
            </>
          )}
        />
      </div>

      <div>
        <PanelHeader title="Technologies" description="Used by project tech stacks and skills." />
        <ListEditor<Technology>
          items={doc.technologies}
          onChange={(items) => {
            const used = (id: string) => doc.skills.some((s) => s.technologyId === id) || doc.projects.some((p) => p.technologies.some((t) => t.technologyId === id));
            if (guardRemove(doc.technologies, items, used, "technology")) update((d) => { d.technologies = items; });
          }}
          isActive={(t) => t.isActive}
          title={(t) => t.name}
          addLabel="Add technology"
          create={() => ({ id: newId("technology"), isActive: true, name: "", iconKey: null, iconMediaId: null })}
          renderItem={(t, set) => (
            <>
              <Toggle label="Active" checked={t.isActive} onChange={(isActive) => set({ isActive })} />
              <TextInput label="Name" value={t.name} placeholder="e.g. Docker" onChange={(name) => set({ name })} />
              <IconPicker label="Icon" value={t} onChange={(v) => set(v)} />
            </>
          )}
        />
      </div>

      <div>
        <PanelHeader title="Employment types" description="e.g. Intern, Full-time, Freelance." />
        <ListEditor<EmploymentType>
          items={doc.employmentTypes}
          onChange={(items) => {
            const used = (id: string) => doc.experiences.some((e) => e.employmentTypeId === id);
            if (guardRemove(doc.employmentTypes, items, used, "employment type")) update((d) => { d.employmentTypes = items; });
          }}
          isActive={(e) => e.isActive}
          title={(e) => e.name}
          addLabel="Add employment type"
          create={() => ({ id: newId("employmentType"), isActive: true, name: "" })}
          renderItem={(e, set) => (
            <>
              <Toggle label="Active" checked={e.isActive} onChange={(isActive) => set({ isActive })} />
              <TextInput label="Name" value={e.name} placeholder="e.g. Full-time" onChange={(name) => set({ name })} />
            </>
          )}
        />
      </div>
    </div>
  );
}

export function MediaPanel() {
  const { doc, removeMedia, notify } = useEditor();
  const { upload, pending } = useUpload();
  const [deleting, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const used = referencedMediaIds(doc);
  const items = doc.media.filter((m) => m.fileName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PanelHeader
        title="Media library"
        description="Uploaded images and files (PNG, JPEG, WebP, GIF, AVIF, PDF — up to 10 MB). Uploads are stored in the database and cached for a year by browsers."
        actions={
          <>
            <input ref={fileRef} type="file" hidden multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf"
              onChange={(e) => {
                for (const f of Array.from(e.target.files ?? [])) upload(f);
                e.target.value = "";
              }} />
            <Button variant="primary" disabled={pending} onClick={() => fileRef.current?.click()}>
              <FiUpload /> {pending ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />
      <input className="mb-4 w-full max-w-xs rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm" placeholder="Search files…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {items.map((m) => (
          <Card key={m.id} className="space-y-2 p-2">
            <MediaThumb media={m} className="h-24 w-full" />
            <p className="truncate text-xs text-slate-300" title={m.fileName}>{m.fileName}</p>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] uppercase ${used.has(m.id) ? "text-emerald-400" : "text-slate-500"}`}>{used.has(m.id) ? "in use" : "unused"}</span>
              <Button variant="ghost" title="Delete" disabled={deleting || used.has(m.id)} onClick={() => {
                if (!confirm(`Delete ${m.fileName}?`)) return;
                start(async () => {
                  const res = await deleteMediaAction(m.id);
                  if (!res.ok) return notify(res.error, "error");
                  removeMedia(m.id);
                  notify("File deleted.", "success");
                });
              }}>
                <FiTrash2 className="text-red-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
