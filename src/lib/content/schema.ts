import { z } from "zod";
import { ID_PATTERN } from "@/lib/ids";
import { SECTION_KEYS } from "./registry";

/**
 * PortfolioDocument — the editable content tree the dashboard works on.
 * It mirrors the normalized tables (entries reference master data by id) and
 * is validated with this schema on every save/publish.
 */

export const ICON_PACKS = ["fi", "fa6", "si", "lu", "md", "tb"] as const;
export type IconPack = (typeof ICON_PACKS)[number];

const id = z.string().regex(ID_PATTERN, "Invalid id");
const optionalId = id.nullable();
const text = (max = 500) => z.string().max(max);
const longText = z.string().max(10_000);

/** Only safe link schemes — blocks javascript:, data: and friends. */
export function isSafeUrl(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return /^(https?:\/\/|mailto:|tel:)/i.test(value) && !/\s/.test(value);
}
const url = z.string().max(2000).refine(isSafeUrl, "Use http(s)://, mailto:, tel: or a /path");

export const iconKey = z
  .string()
  .regex(new RegExp(`^(${ICON_PACKS.join("|")}):[A-Za-z0-9]+$`), "Invalid icon")
  .nullable();

const datePart = z.string().regex(/^(\d{4}(-(0[1-9]|1[0-2]))?)?$/, "Use YYYY or YYYY-MM");

const entry = { id, isActive: z.boolean() };

export const mediaSchema = z.object({
  id,
  url: z.string().max(2000),
  fileName: text(300),
  mimeType: text(150),
});

export const profileSchema = z.object({
  id,
  fullName: text(150),
  jobTitle: text(150),
  shortBio: longText,
  aboutDescription: longText,
  cvMediaId: optionalId,
  cvFileName: text(200),
});

export const sectionSchema = z.object({
  id,
  key: z.enum(SECTION_KEYS),
  navLabel: text(60),
  isActive: z.boolean(),
  texts: z.record(z.string().max(60), z.string().max(5000)),
});

export const organizationSchema = z.object({
  ...entry,
  name: text(200),
  websiteUrl: url,
  logoMediaId: optionalId,
});

export const employmentTypeSchema = z.object({ ...entry, name: text(100) });

export const technologySchema = z.object({
  ...entry,
  name: text(100),
  iconKey,
  iconMediaId: optionalId,
});

const period = {
  startDate: datePart,
  endDate: datePart,
  isCurrent: z.boolean(),
  periodNote: text(200),
};

export const experienceSchema = z.object({
  ...entry,
  organizationId: id,
  employmentTypeId: optionalId,
  roleTitle: text(200),
  description: longText,
  ...period,
});

export const educationSchema = z.object({
  ...entry,
  organizationId: id,
  degree: text(200),
  ...period,
});

export const projectSchema = z.object({
  ...entry,
  title: text(200),
  summary: longText,
  images: z.array(z.object({ id, mediaId: id })).max(30),
  technologies: z.array(z.object({ id, technologyId: id })).max(50),
  links: z
    .array(z.object({ id, label: text(100), url, iconKey, iconMediaId: optionalId }))
    .max(20),
  details: z.array(z.object({ id, heading: text(150), body: longText })).max(20),
});

export const skillSchema = z.object({
  ...entry,
  technologyId: id,
  certificateMediaId: optionalId,
});

export const socialLinkSchema = z.object({
  ...entry,
  displayName: text(150),
  url,
  iconKey,
  iconMediaId: optionalId,
});

export const portfolioDocumentSchema = z
  .object({
    profile: profileSchema,
    sections: z.array(sectionSchema),
    organizations: z.array(organizationSchema).max(200),
    employmentTypes: z.array(employmentTypeSchema).max(100),
    technologies: z.array(technologySchema).max(500),
    experiences: z.array(experienceSchema).max(200),
    educations: z.array(educationSchema).max(100),
    projects: z.array(projectSchema).max(200),
    skills: z.array(skillSchema).max(300),
    socialLinks: z.array(socialLinkSchema).max(50),
    media: z.array(mediaSchema),
  })
  .superRefine((doc, ctx) => {
    const ids = (list: { id: string }[]) => new Set(list.map((x) => x.id));
    const orgs = ids(doc.organizations);
    const emp = ids(doc.employmentTypes);
    const tech = ids(doc.technologies);
    const media = ids(doc.media);

    const ref = (ok: boolean, path: (string | number)[], what: string) => {
      if (!ok) ctx.addIssue({ code: "custom", path, message: `Unknown ${what}` });
    };
    const mediaRef = (value: string | null, path: (string | number)[]) =>
      ref(value === null || media.has(value), path, "media");

    // Every id must be unique across the whole document.
    const seen = new Set<string>();
    const walk = (value: unknown, path: (string | number)[]) => {
      if (Array.isArray(value)) value.forEach((v, i) => walk(v, [...path, i]));
      else if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (typeof obj.id === "string" && path[0] !== "media") {
          if (seen.has(obj.id)) ctx.addIssue({ code: "custom", path, message: `Duplicate id ${obj.id}` });
          seen.add(obj.id);
        }
        for (const [k, v] of Object.entries(obj)) if (k !== "texts") walk(v, [...path, k]);
      }
    };
    walk(doc, []);

    const uniqueName = (list: { name: string }[], path: string) => {
      const names = new Set<string>();
      list.forEach((x, i) => {
        const n = x.name.trim().toLowerCase();
        if (!n) return;
        if (names.has(n)) ctx.addIssue({ code: "custom", path: [path, i, "name"], message: `Duplicate name "${x.name}"` });
        names.add(n);
      });
    };
    uniqueName(doc.technologies, "technologies");
    uniqueName(doc.employmentTypes, "employmentTypes");

    const sectionKeys = new Set<string>();
    doc.sections.forEach((s, i) => {
      if (sectionKeys.has(s.key)) ctx.addIssue({ code: "custom", path: ["sections", i], message: "Duplicate section" });
      sectionKeys.add(s.key);
    });

    mediaRef(doc.profile.cvMediaId, ["profile", "cvMediaId"]);
    doc.organizations.forEach((o, i) => mediaRef(o.logoMediaId, ["organizations", i, "logoMediaId"]));
    doc.technologies.forEach((t, i) => mediaRef(t.iconMediaId, ["technologies", i, "iconMediaId"]));
    doc.experiences.forEach((e, i) => {
      ref(orgs.has(e.organizationId), ["experiences", i, "organizationId"], "organization");
      ref(e.employmentTypeId === null || emp.has(e.employmentTypeId), ["experiences", i, "employmentTypeId"], "employment type");
    });
    doc.educations.forEach((e, i) => ref(orgs.has(e.organizationId), ["educations", i, "organizationId"], "organization"));
    doc.projects.forEach((p, i) => {
      p.images.forEach((img, j) => mediaRef(img.mediaId, ["projects", i, "images", j, "mediaId"]));
      const usedTech = new Set<string>();
      p.technologies.forEach((t, j) => {
        ref(tech.has(t.technologyId), ["projects", i, "technologies", j], "technology");
        if (usedTech.has(t.technologyId))
          ctx.addIssue({ code: "custom", path: ["projects", i, "technologies", j], message: "Technology added twice" });
        usedTech.add(t.technologyId);
      });
      p.links.forEach((l, j) => mediaRef(l.iconMediaId, ["projects", i, "links", j, "iconMediaId"]));
    });
    doc.skills.forEach((s, i) => {
      ref(tech.has(s.technologyId), ["skills", i, "technologyId"], "technology");
      mediaRef(s.certificateMediaId, ["skills", i, "certificateMediaId"]);
    });
    doc.socialLinks.forEach((s, i) => mediaRef(s.iconMediaId, ["socialLinks", i, "iconMediaId"]));
  });

export type PortfolioDocument = z.infer<typeof portfolioDocumentSchema>;
export type MediaItem = z.infer<typeof mediaSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type Technology = z.infer<typeof technologySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
