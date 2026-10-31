import type { PortfolioDocument } from "./schema";

/** Media ids referenced anywhere in a document. */
export function referencedMediaIds(doc: PortfolioDocument): Set<string> {
  const ids = new Set<string>();
  const add = (v: string | null) => v && ids.add(v);
  add(doc.profile.cvMediaId);
  doc.organizations.forEach((o) => add(o.logoMediaId));
  doc.technologies.forEach((t) => add(t.iconMediaId));
  doc.projects.forEach((p) => {
    p.images.forEach((i) => add(i.mediaId));
    p.links.forEach((l) => add(l.iconMediaId));
  });
  doc.skills.forEach((s) => add(s.certificateMediaId));
  doc.socialLinks.forEach((s) => add(s.iconMediaId));
  return ids;
}
