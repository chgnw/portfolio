"use client";

import { PROFILE_FALLBACK } from "@/lib/content/registry";
import { useEditor } from "../EditorContext";
import { Card, PanelHeader, TextArea, TextInput } from "../fields";
import { MediaPicker } from "../MediaPicker";

export function ProfilePanel() {
  const { doc, update } = useEditor();
  const p = doc.profile;
  const set = (patch: Partial<typeof p>) => update((d) => { Object.assign(d.profile, patch); });

  return (
    <div>
      <PanelHeader title="Profile" description="Your name, title and bios shown on the Home and About sections." />
      <div className="space-y-6">
        <Card className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Full name" value={p.fullName} placeholder={PROFILE_FALLBACK.fullName} onChange={(fullName) => set({ fullName })} />
          <TextInput label="Job title" value={p.jobTitle} placeholder={PROFILE_FALLBACK.jobTitle} onChange={(jobTitle) => set({ jobTitle })} />
        </Card>
        <Card className="space-y-4">
          <TextArea label="Short bio (Home)" rows={4} value={p.shortBio} placeholder={PROFILE_FALLBACK.shortBio} onChange={(shortBio) => set({ shortBio })} />
          <TextArea label="About description" rows={6} value={p.aboutDescription} placeholder={PROFILE_FALLBACK.aboutDescription} onChange={(aboutDescription) => set({ aboutDescription })} />
        </Card>
        <Card className="grid gap-4 sm:grid-cols-2">
          <MediaPicker label="CV (PDF)" accept="pdf" value={p.cvMediaId} onChange={(cvMediaId) => set({ cvMediaId })} hint="No CV — the download button is hidden" />
          <TextInput label="Download file name" value={p.cvFileName} placeholder={PROFILE_FALLBACK.cvFileName} onChange={(cvFileName) => set({ cvFileName })} />
        </Card>
      </div>
    </div>
  );
}
