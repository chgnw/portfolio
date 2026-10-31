"use client";

import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiPlus, FiX } from "react-icons/fi";
import { newId } from "@/lib/ids";
import type { Project } from "@/lib/content/schema";
import { useEditor } from "../EditorContext";
import { Card, ListEditor, PanelHeader, TextArea, TextInput, Toggle } from "../fields";
import { IconPicker } from "../IconPicker";
import { MediaLibraryModal, MediaThumb } from "../MediaPicker";
import { TechnologyTags } from "../masterPickers";

type Link = Project["links"][number];
type Detail = Project["details"][number];

function ImagesEditor({ value, onChange }: { value: Project["images"]; onChange: (v: Project["images"]) => void }) {
  const { doc } = useEditor();
  const [open, setOpen] = useState(false);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Screenshots (carousel)</span>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={img.id} className="relative rounded-md border border-slate-800 p-1">
            <MediaThumb media={doc.media.find((m) => m.id === img.mediaId)} className="h-20 w-28" />
            <div className="mt-1 flex justify-between">
              <button type="button" aria-label="Move left" onClick={() => move(i, -1)} className="p-1 text-slate-400 hover:text-white"><FiArrowLeft size={12} /></button>
              <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((x) => x.id !== img.id))} className="p-1 text-red-400 hover:text-red-300"><FiX size={12} /></button>
              <button type="button" aria-label="Move right" onClick={() => move(i, 1)} className="p-1 text-slate-400 hover:text-white"><FiArrowRight size={12} /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setOpen(true)}
          className="flex h-[6.5rem] w-28 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-700 text-xs text-slate-400 hover:border-sky-400 hover:text-sky-300">
          <FiPlus /> Add image
        </button>
      </div>
      {value.length === 0 && <p className="text-xs text-slate-500">No images — a placeholder image is shown.</p>}
      {open && (
        <MediaLibraryModal accept="image" onClose={() => setOpen(false)}
          onSelect={(m) => onChange([...value, { id: newId("projectImage"), mediaId: m.id }])} />
      )}
    </div>
  );
}

export function ProjectsPanel() {
  const { doc, update } = useEditor();
  return (
    <div>
      <PanelHeader title="Projects" description="Cards in the Projects section. Click a card on the site to see its detail sections." />
      <ListEditor<Project>
        items={doc.projects}
        onChange={(items) => update((d) => { d.projects = items; })}
        isActive={(p) => p.isActive}
        title={(p) => p.title}
        addLabel="Add project"
        create={() => ({
          id: newId("project"), isActive: true, title: "", summary: "", images: [], technologies: [], links: [],
          details: [
            { id: newId("projectDetail"), heading: "Background", body: "" },
            { id: newId("projectDetail"), heading: "Process", body: "" },
            { id: newId("projectDetail"), heading: "Tech Stack Reasoning", body: "" },
          ],
        })}
        renderItem={(p, set) => (
          <>
            <Toggle label="Visible on site" checked={p.isActive} onChange={(isActive) => set({ isActive })} />
            <TextInput label="Title" value={p.title} placeholder="Untitled project" onChange={(title) => set({ title })} />
            <TextArea label="Short description (card front)" rows={3} value={p.summary} placeholder="Project description coming soon." onChange={(summary) => set({ summary })} />
            <ImagesEditor value={p.images} onChange={(images) => set({ images })} />
            <TechnologyTags value={p.technologies} onChange={(technologies) => set({ technologies })} />

            <Card className="space-y-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Links (optional)</span>
              <ListEditor<Link>
                items={p.links}
                onChange={(links) => set({ links })}
                title={(l) => l.label || l.url}
                addLabel="Add link"
                empty="No links."
                create={() => ({ id: newId("projectLink"), label: "", url: "", iconKey: "fi:FiExternalLink", iconMediaId: null })}
                renderItem={(l, setLink) => (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput label="Label" value={l.label} placeholder="e.g. GitHub" onChange={(label) => setLink({ label })} />
                      <TextInput label="URL" value={l.url} placeholder="https://…" onChange={(url) => setLink({ url })} />
                    </div>
                    <IconPicker label="Icon" value={l} onChange={(v) => setLink(v)} />
                  </>
                )}
              />
            </Card>

            <Card className="space-y-3">
              <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Detail sections (card back)</span>
              <ListEditor<Detail>
                items={p.details}
                onChange={(details) => set({ details })}
                title={(d) => d.heading}
                addLabel="Add detail section"
                empty="No details."
                create={() => ({ id: newId("projectDetail"), heading: "", body: "" })}
                renderItem={(d, setDetail) => (
                  <>
                    <TextInput label="Heading" value={d.heading} placeholder="e.g. Background" onChange={(heading) => setDetail({ heading })} />
                    <TextArea label="Body" rows={4} value={d.body} placeholder="Write a few sentences…" onChange={(body) => setDetail({ body })} />
                  </>
                )}
              />
            </Card>
          </>
        )}
      />
    </div>
  );
}
