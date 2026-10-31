"use client";

import { newId } from "@/lib/ids";
import type { Skill, SocialLink } from "@/lib/content/schema";
import { useEditor } from "../EditorContext";
import { ListEditor, PanelHeader, TextInput, Toggle } from "../fields";
import { IconPicker } from "../IconPicker";
import { MediaPicker } from "../MediaPicker";
import { TechnologyEditor } from "../masterPickers";

export function SkillsPanel() {
  const { doc, update } = useEditor();
  const name = (id: string) => doc.technologies.find((t) => t.id === id)?.name ?? "";
  return (
    <div>
      <PanelHeader title="Skills" description="Tiles in the Skills section. Each skill is a technology with an icon and an optional certificate." />
      <ListEditor<Skill>
        items={doc.skills}
        onChange={(items) => update((d) => { d.skills = items; })}
        isActive={(s) => s.isActive}
        title={(s) => name(s.technologyId)}
        addLabel="Add skill"
        create={() => {
          const used = new Set(doc.skills.map((s) => s.technologyId));
          const free = doc.technologies.find((t) => !used.has(t.id));
          return { id: newId("skill"), isActive: true, technologyId: free?.id ?? "", certificateMediaId: null };
        }}
        renderItem={(s, set) => (
          <>
            <Toggle label="Visible on site" checked={s.isActive} onChange={(isActive) => set({ isActive })} />
            <TechnologyEditor value={s.technologyId} onChange={(technologyId) => set({ technologyId })} />
            <MediaPicker label="Certificate (optional)" value={s.certificateMediaId} onChange={(certificateMediaId) => set({ certificateMediaId })}
              hint="No certificate — the button is hidden" />
          </>
        )}
      />
    </div>
  );
}

export function SocialPanel() {
  const { doc, update } = useEditor();
  return (
    <div>
      <PanelHeader
        title="Social links"
        description="Icon + display name, shown under the contact form. When a URL is set, both the icon and the name link to it."
      />
      <ListEditor<SocialLink>
        items={doc.socialLinks}
        onChange={(items) => update((d) => { d.socialLinks = items; })}
        isActive={(s) => s.isActive}
        title={(s) => s.displayName || s.url}
        addLabel="Add social link"
        create={() => ({ id: newId("socialLink"), isActive: true, displayName: "", url: "", iconKey: null, iconMediaId: null })}
        renderItem={(s, set) => (
          <>
            <Toggle label="Visible on site" checked={s.isActive} onChange={(isActive) => set({ isActive })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Display name" value={s.displayName} placeholder="e.g. insta_user" onChange={(displayName) => set({ displayName })} />
              <TextInput label="Link (optional)" value={s.url} placeholder="https://… or mailto:you@mail.com"
                hint="Leave empty to show the item without a link." onChange={(url) => set({ url })} />
            </div>
            <IconPicker label="Icon" value={s} onChange={(v) => set(v)} />
          </>
        )}
      />
    </div>
  );
}
