"use client";

import { SECTION_BY_KEY, type SectionKey } from "@/lib/content/registry";
import { useEditor } from "../EditorContext";
import { Card, PanelHeader, TextArea, TextInput, Toggle } from "../fields";

/** Headings, taglines and labels of one fixed section. */
export function TextsPanel({ sectionKey }: { sectionKey: SectionKey }) {
  const { doc, update } = useEditor();
  const def = SECTION_BY_KEY[sectionKey];
  const section = doc.sections.find((s) => s.key === sectionKey);
  if (!section) return null;

  type S = NonNullable<typeof section>;
  const set = (mutate: (s: S) => void) =>
    update((d) => {
      const s = d.sections.find((x) => x.key === sectionKey);
      if (s) mutate(s);
    });

  return (
    <div>
      <PanelHeader title={`${def.title} texts`} description={`${def.description} Empty fields show the placeholder text.`} />
      <div className="space-y-6">
        {sectionKey !== "global" && (
          <Card className="flex flex-wrap items-end gap-6">
            <div className="min-w-[14rem] flex-1">
              <TextInput label="Navbar label" value={section.navLabel} placeholder={def.defaultNavLabel}
                onChange={(v) => set((s) => { s.navLabel = v; })} />
            </div>
            {sectionKey !== "home" && (
              <Toggle label="Show this section" checked={section.isActive} onChange={(v) => set((s) => { s.isActive = v; })} />
            )}
          </Card>
        )}
        <Card className="space-y-4">
          {def.texts.map((slot) => {
            const props = {
              label: slot.label,
              value: section.texts[slot.key] ?? "",
              placeholder: slot.fallback || "(optional — hidden when empty)",
              onChange: (v: string) => set((s) => { s.texts[slot.key] = v; }),
            };
            return slot.multiline ? <TextArea key={slot.key} rows={2} {...props} /> : <TextInput key={slot.key} {...props} />;
          })}
        </Card>
      </div>
    </div>
  );
}
