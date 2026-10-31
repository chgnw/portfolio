"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { newId } from "@/lib/ids";
import { useEditor } from "./EditorContext";
import { Card, Field, inputCls, TextInput } from "./fields";
import { MediaPicker } from "./MediaPicker";
import { IconPicker } from "./IconPicker";

const NEW = "__new__";

/**
 * Choose an organization (shared master data) and edit it inline. Editing here
 * updates the organization everywhere it is used.
 */
export function OrganizationPicker({ value, onChange, label }: { value: string; onChange: (id: string) => void; label: string }) {
  const { doc, update } = useEditor();
  const org = doc.organizations.find((o) => o.id === value);
  const usage = doc.experiences.filter((e) => e.organizationId === value).length + doc.educations.filter((e) => e.organizationId === value).length;

  const patch = (p: Partial<NonNullable<typeof org>>) =>
    update((d) => {
      const o = d.organizations.find((x) => x.id === value);
      if (o) Object.assign(o, p);
    });

  return (
    <Card className="space-y-4">
      <Field label={label}>
        {(id) => (
          <select id={id} className={inputCls} value={org ? value : ""} onChange={(e) => {
            if (e.target.value === NEW) {
              const created = { id: newId("organization"), isActive: true, name: "", websiteUrl: "", logoMediaId: null };
              update((d) => { d.organizations.push(created); });
              onChange(created.id);
            } else onChange(e.target.value);
          }}>
            {!org && <option value="">— select —</option>}
            {doc.organizations.map((o) => <option key={o.id} value={o.id}>{o.name || "(unnamed)"}</option>)}
            <option value={NEW}>+ New organization…</option>
          </select>
        )}
      </Field>
      {org && (
        <>
          {usage > 1 && <p className="text-xs text-amber-300/80">Shared by {usage} entries — changes below apply to all of them.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Name" value={org.name} placeholder="e.g. Bina Nusantara University" onChange={(name) => patch({ name })} />
            <TextInput label="Website (optional)" value={org.websiteUrl} placeholder="https://…" onChange={(websiteUrl) => patch({ websiteUrl })} />
          </div>
          <MediaPicker label="Logo" value={org.logoMediaId} onChange={(logoMediaId) => patch({ logoMediaId })} />
        </>
      )}
    </Card>
  );
}

export function EmploymentTypePicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const { doc, update } = useEditor();
  const current = doc.employmentTypes.find((e) => e.id === value);
  const [text, setText] = useState(current?.name ?? "");
  const listId = "employment-types";

  const commit = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return onChange(null);
    const found = doc.employmentTypes.find((e) => e.name.toLowerCase() === trimmed.toLowerCase());
    if (found) return onChange(found.id);
    const created = { id: newId("employmentType"), isActive: true, name: trimmed };
    update((d) => { d.employmentTypes.push(created); });
    onChange(created.id);
  };

  return (
    <Field label="Employment type" hint="Pick an existing type or type a new one (e.g. Intern, Full-time).">
      {(id) => (
        <>
          <input id={id} list={listId} className={inputCls} value={text} placeholder="e.g. Intern"
            onChange={(e) => setText(e.target.value)} onBlur={(e) => commit(e.target.value)} />
          <datalist id={listId}>
            {doc.employmentTypes.map((e) => <option key={e.id} value={e.name} />)}
          </datalist>
        </>
      )}
    </Field>
  );
}

/** Find a technology by name or create it; returns its id. */
export function useTechnologyResolver() {
  const { doc, update } = useEditor();
  return (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const found = doc.technologies.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
    if (found) return found.id;
    const created = { id: newId("technology"), isActive: true, name: trimmed, iconKey: null, iconMediaId: null };
    update((d) => { d.technologies.push(created); });
    return created.id;
  };
}

/** Tag input for project tech stacks (backed by the shared technology catalogue). */
export function TechnologyTags({ value, onChange }: { value: { id: string; technologyId: string }[]; onChange: (v: { id: string; technologyId: string }[]) => void }) {
  const { doc } = useEditor();
  const resolve = useTechnologyResolver();
  const [text, setText] = useState("");
  const names = new Map(doc.technologies.map((t) => [t.id, t.name]));

  const add = () => {
    const techId = resolve(text);
    setText("");
    if (!techId || value.some((v) => v.technologyId === techId)) return;
    onChange([...value, { id: newId("projectTechnology"), technologyId: techId }]);
  };

  return (
    <Field label="Tech stack" hint="Press Enter to add. New names are added to the technology catalogue.">
      {(id) => (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {value.map((v) => (
              <span key={v.id} className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                {names.get(v.technologyId) || "(unnamed)"}
                <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((x) => x.id !== v.id))} className="text-slate-400 hover:text-red-300">
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
          <input id={id} list="technology-names" className={inputCls} value={text} placeholder="e.g. Next.js"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            onBlur={() => text && add()} />
          <datalist id="technology-names">
            {doc.technologies.map((t) => <option key={t.id} value={t.name} />)}
          </datalist>
        </div>
      )}
    </Field>
  );
}

/** Choose a technology for a skill and edit its shared name + icon inline. */
export function TechnologyEditor({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { doc, update } = useEditor();
  const tech = doc.technologies.find((t) => t.id === value);
  const patch = (p: Partial<NonNullable<typeof tech>>) =>
    update((d) => {
      const t = d.technologies.find((x) => x.id === value);
      if (t) Object.assign(t, p);
    });
  return (
    <Card className="space-y-4">
      <Field label="Technology" hint="Technologies are shared with project tech stacks.">
        {(id) => (
          <select id={id} className={inputCls} value={tech ? value : ""} onChange={(e) => {
            if (e.target.value === NEW) {
              const created = { id: newId("technology"), isActive: true, name: "", iconKey: null, iconMediaId: null };
              update((d) => { d.technologies.push(created); });
              onChange(created.id);
            } else onChange(e.target.value);
          }}>
            {!tech && <option value="">— select —</option>}
            {doc.technologies.map((t) => <option key={t.id} value={t.id}>{t.name || "(unnamed)"}</option>)}
            <option value={NEW}>+ New technology…</option>
          </select>
        )}
      </Field>
      {tech && (
        <>
          <TextInput label="Name" value={tech.name} placeholder="e.g. React.js" onChange={(name) => patch({ name })} />
          <IconPicker label="Icon" value={{ iconKey: tech.iconKey, iconMediaId: tech.iconMediaId }} onChange={(v) => patch(v)} />
        </>
      )}
    </Card>
  );
}
