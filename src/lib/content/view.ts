import type { PortfolioDocument } from "./schema";
import {
  NAV_SECTION_KEYS,
  PLACEHOLDER_IMAGE,
  PROFILE_FALLBACK,
  SECTION_BY_KEY,
  SECTION_DEFINITIONS,
  type SectionKey,
} from "./registry";

/**
 * PortfolioView — what the public site renders. Produced by `resolvePortfolio`
 * (pure, runs on the server for production and in the browser for the live
 * preview): drops hidden/inactive entries, resolves references and applies
 * placeholders for empty fields.
 */

/** An icon: an uploaded image wins over a library icon. */
export interface IconRef {
  iconKey: string | null;
  imageUrl: string | null;
}

export interface ViewLink {
  label: string;
  url: string | null;
  icon: IconRef;
}

export interface PortfolioView {
  nav: { key: SectionKey; label: string }[];
  texts: Record<SectionKey, Record<string, string>>;
  profile: {
    fullName: string;
    jobTitle: string;
    shortBio: string;
    aboutDescription: string;
    cvUrl: string | null;
    cvFileName: string;
  };
  educations: { id: string; institution: string; institutionUrl: string | null; degree: string; period: string; logoUrl: string }[];
  experiences: {
    id: string;
    company: string;
    companyUrl: string | null;
    role: string;
    employmentType: string;
    period: string;
    description: string;
    logoUrl: string;
  }[];
  projects: {
    id: string;
    title: string;
    summary: string;
    images: string[];
    techStack: string[];
    links: ViewLink[];
    details: { heading: string; body: string }[];
  }[];
  skills: { id: string; name: string; icon: IconRef; certificateUrl: string | null }[];
  socialLinks: ViewLink[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value: string): string {
  const [y, m] = value.split("-");
  if (!y) return "";
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

export function formatPeriod(
  p: { startDate: string; endDate: string; isCurrent: boolean; periodNote: string },
  presentLabel: string,
): string {
  const start = formatDate(p.startDate);
  const end = p.isCurrent ? presentLabel : formatDate(p.endDate);
  let range = start && end ? `${start} - ${end}` : start || end;
  if (p.periodNote.trim()) range = range ? `${range} (${p.periodNote.trim()})` : p.periodNote.trim();
  return range;
}

const or = (value: string | null | undefined, fallback: string) => (value && value.trim() ? value : fallback);

export function resolvePortfolio(doc: PortfolioDocument): PortfolioView {
  const media = new Map(doc.media.map((m) => [m.id, m]));
  const mediaUrl = (id: string | null) => (id ? (media.get(id)?.url ?? null) : null);
  const icon = (iconKey: string | null, mediaId: string | null): IconRef => ({ iconKey, imageUrl: mediaUrl(mediaId) });

  const active = <T extends { isActive: boolean }>(list: T[]) => list.filter((x) => x.isActive);
  const orgs = new Map(active(doc.organizations).map((o) => [o.id, o]));
  const empTypes = new Map(active(doc.employmentTypes).map((e) => [e.id, e]));
  const techs = new Map(active(doc.technologies).map((t) => [t.id, t]));
  const sections = new Map(doc.sections.map((s) => [s.key, s]));

  const texts = {} as PortfolioView["texts"];
  for (const def of SECTION_DEFINITIONS) {
    const stored = sections.get(def.key)?.texts ?? {};
    texts[def.key] = Object.fromEntries(def.texts.map((slot) => [slot.key, or(stored[slot.key], slot.fallback)]));
  }
  const present = texts.global.presentLabel;

  const nav = NAV_SECTION_KEYS.filter((key) => sections.get(key)?.isActive ?? true)
    .map((key) => ({ key, label: or(sections.get(key)?.navLabel, SECTION_BY_KEY[key].defaultNavLabel) }));

  return {
    nav,
    texts,
    profile: {
      fullName: or(doc.profile.fullName, PROFILE_FALLBACK.fullName),
      jobTitle: or(doc.profile.jobTitle, PROFILE_FALLBACK.jobTitle),
      shortBio: or(doc.profile.shortBio, PROFILE_FALLBACK.shortBio),
      aboutDescription: or(doc.profile.aboutDescription, PROFILE_FALLBACK.aboutDescription),
      cvUrl: mediaUrl(doc.profile.cvMediaId),
      cvFileName: or(doc.profile.cvFileName, PROFILE_FALLBACK.cvFileName),
    },
    educations: active(doc.educations).flatMap((e) => {
      const org = orgs.get(e.organizationId);
      if (!org) return [];
      return [{
        id: e.id,
        institution: or(org.name, "Institution"),
        institutionUrl: org.websiteUrl || null,
        degree: or(e.degree, "Degree"),
        period: formatPeriod(e, present),
        logoUrl: mediaUrl(org.logoMediaId) ?? PLACEHOLDER_IMAGE,
      }];
    }),
    experiences: active(doc.experiences).flatMap((e) => {
      const org = orgs.get(e.organizationId);
      if (!org) return [];
      return [{
        id: e.id,
        company: or(org.name, "Company"),
        companyUrl: org.websiteUrl || null,
        role: or(e.roleTitle, "Role"),
        employmentType: e.employmentTypeId ? (empTypes.get(e.employmentTypeId)?.name ?? "") : "",
        period: formatPeriod(e, present),
        description: e.description,
        logoUrl: mediaUrl(org.logoMediaId) ?? PLACEHOLDER_IMAGE,
      }];
    }),
    projects: active(doc.projects).map((p) => {
      const images = p.images.map((i) => mediaUrl(i.mediaId)).filter((u): u is string => !!u);
      return {
        id: p.id,
        title: or(p.title, "Untitled project"),
        summary: or(p.summary, "Project description coming soon."),
        images: images.length ? images : [PLACEHOLDER_IMAGE],
        techStack: p.technologies.map((t) => techs.get(t.technologyId)?.name ?? "").filter(Boolean),
        links: p.links.map((l) => ({ label: or(l.label, l.url), url: l.url || null, icon: icon(l.iconKey, l.iconMediaId) })),
        details: p.details
          .filter((d) => d.heading.trim() || d.body.trim())
          .map((d) => ({ heading: or(d.heading, "Details"), body: d.body })),
      };
    }),
    skills: active(doc.skills).flatMap((s) => {
      const t = techs.get(s.technologyId);
      if (!t) return [];
      return [{ id: s.id, name: or(t.name, "Skill"), icon: icon(t.iconKey, t.iconMediaId), certificateUrl: mediaUrl(s.certificateMediaId) }];
    }),
    socialLinks: active(doc.socialLinks).map((s) => ({
      label: or(s.displayName, s.url),
      url: s.url || null,
      icon: icon(s.iconKey, s.iconMediaId),
    })),
  };
}

/** Every library icon key the view uses (so the server can pre-render them). */
export function collectIconKeys(view: PortfolioView): string[] {
  const keys = new Set<string>();
  const add = (i: IconRef) => i.iconKey && !i.imageUrl && keys.add(i.iconKey);
  view.skills.forEach((s) => add(s.icon));
  view.socialLinks.forEach((s) => add(s.icon));
  view.projects.forEach((p) => p.links.forEach((l) => add(l.icon)));
  return [...keys];
}
