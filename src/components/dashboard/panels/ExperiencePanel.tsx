"use client";

import { newId } from "@/lib/ids";
import type { Education, Experience } from "@/lib/content/schema";
import { useEditor } from "../EditorContext";
import { ListEditor, PanelHeader, TextArea, TextInput, Toggle } from "../fields";
import { EmploymentTypePicker, OrganizationPicker } from "../masterPickers";
import { PeriodFields } from "./PeriodFields";

export function ExperiencePanel() {
  const { doc, update } = useEditor();
  const orgName = (id: string) => doc.organizations.find((o) => o.id === id)?.name ?? "";

  return (
    <div>
      <PanelHeader title="Experience" description="Shown in the About section, in this order." />
      <ListEditor<Experience>
        items={doc.experiences}
        onChange={(items) => update((d) => { d.experiences = items; })}
        isActive={(e) => e.isActive}
        title={(e) => [e.roleTitle, orgName(e.organizationId)].filter(Boolean).join(" · ")}
        addLabel="Add experience"
        create={() => {
          const org = doc.organizations[0];
          return {
            id: newId("experience"), isActive: true, organizationId: org?.id ?? "", employmentTypeId: null, roleTitle: "",
            description: "", startDate: "", endDate: "", isCurrent: false, periodNote: "",
          };
        }}
        renderItem={(e, set) => (
          <>
            <Toggle label="Visible on site" checked={e.isActive} onChange={(isActive) => set({ isActive })} />
            <OrganizationPicker label="Company" value={e.organizationId} onChange={(organizationId) => set({ organizationId })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Role" value={e.roleTitle} placeholder="e.g. Application Developer" onChange={(roleTitle) => set({ roleTitle })} />
              <EmploymentTypePicker key={e.employmentTypeId ?? "none"} value={e.employmentTypeId} onChange={(employmentTypeId) => set({ employmentTypeId })} />
            </div>
            <PeriodFields value={e} onChange={set} />
            <TextArea label="Description (optional)" rows={3} value={e.description} placeholder="What did you work on?" onChange={(description) => set({ description })} />
          </>
        )}
      />
    </div>
  );
}

export function EducationPanel() {
  const { doc, update } = useEditor();
  const orgName = (id: string) => doc.organizations.find((o) => o.id === id)?.name ?? "";

  return (
    <div>
      <PanelHeader title="Education" description="Shown in the About section, in this order." />
      <ListEditor<Education>
        items={doc.educations}
        onChange={(items) => update((d) => { d.educations = items; })}
        isActive={(e) => e.isActive}
        title={(e) => [orgName(e.organizationId), e.degree].filter(Boolean).join(" · ")}
        addLabel="Add education"
        create={() => ({
          id: newId("education"), isActive: true, organizationId: doc.organizations[0]?.id ?? "", degree: "",
          startDate: "", endDate: "", isCurrent: false, periodNote: "",
        })}
        renderItem={(e, set) => (
          <>
            <Toggle label="Visible on site" checked={e.isActive} onChange={(isActive) => set({ isActive })} />
            <OrganizationPicker label="Institution" value={e.organizationId} onChange={(organizationId) => set({ organizationId })} />
            <TextInput label="Degree / program" value={e.degree} placeholder="e.g. Bachelor of Computer Science" onChange={(degree) => set({ degree })} />
            <PeriodFields value={e} onChange={set} />
          </>
        )}
      />
    </div>
  );
}
