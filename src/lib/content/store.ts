import { createHash } from "node:crypto";
import type { InStatement, InValue, Row } from "@libsql/client";
import { db, writeBatch } from "@/lib/db/client";
import { newId } from "@/lib/ids";
import { SECTION_DEFINITIONS } from "./registry";
import type { MediaItem, PortfolioDocument } from "./schema";

/**
 * Data access for portfolio content. Pure DB logic (no Next.js APIs) so the
 * CLI seed script can reuse it; cached wrappers live in ./queries.ts.
 */

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------
const nowIso = () => new Date().toISOString();
const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const strOrNull = (v: unknown) => (v === null || v === undefined || v === "" ? null : String(v));
const bool = (v: unknown) => Number(v) === 1;
const b = (v: boolean) => (v ? 1 : 0);

async function select(sql: string, args: InValue[] = []): Promise<Row[]> {
  return (await db().execute({ sql, args })).rows;
}

/** Stable JSON (sorted keys) so equal content always hashes the same. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

export function hashDocument(doc: PortfolioDocument): string {
  return createHash("sha256").update(canonical(doc)).digest("hex");
}

export function mediaUrlFor(row: { id: string; externalUrl: string | null }): string {
  return row.externalUrl ?? `/media/${row.id}`;
}

// -----------------------------------------------------------------------------
// load (tables -> document)
// -----------------------------------------------------------------------------
const LIVE = "bIsDeleted = 0";

export async function loadDocument(): Promise<PortfolioDocument> {
  const [
    profileRows, sectionRows, textRows, orgRows, empRows, techRows, expRows, eduRows,
    projRows, imgRows, ptRows, linkRows, detailRows, skillRows, socialRows, mediaRows,
  ] = await db().batch([
    `SELECT * FROM ms_profile WHERE ${LIVE} ORDER BY dtmCreatedAt LIMIT 1`,
    `SELECT * FROM ms_section WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT szSectionId, szTextKey, szValue FROM ms_site_text WHERE ${LIVE}`,
    `SELECT * FROM ms_organization WHERE ${LIVE} ORDER BY szName`,
    `SELECT * FROM ms_employment_type WHERE ${LIVE} ORDER BY szName`,
    `SELECT * FROM ms_technology WHERE ${LIVE} ORDER BY szName COLLATE NOCASE`,
    `SELECT * FROM tr_experience WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_education WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_project WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_project_image WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_project_technology WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_project_link WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_project_detail WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_skill WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT * FROM tr_social_link WHERE ${LIVE} ORDER BY iSortOrder`,
    `SELECT szMediaId, szFileName, szMimeType, szExternalUrl FROM ms_media WHERE ${LIVE} ORDER BY dtmCreatedAt DESC`,
  ], "read");

  const p = profileRows.rows[0];
  const textsBySection = new Map<string, Record<string, string>>();
  for (const r of textRows.rows) {
    const map = textsBySection.get(str(r.szSectionId)) ?? {};
    map[str(r.szTextKey)] = str(r.szValue);
    textsBySection.set(str(r.szSectionId), map);
  }
  const sectionsByKey = new Map(sectionRows.rows.map((r) => [str(r.szSectionKey), r]));

  const children = <T>(rows: Row[], map: (r: Row) => T) => {
    const out = new Map<string, T[]>();
    for (const r of rows) {
      const list = out.get(str(r.szProjectId)) ?? [];
      list.push(map(r));
      out.set(str(r.szProjectId), list);
    }
    return out;
  };
  const images = children(imgRows.rows, (r) => ({ id: str(r.szProjectImageId), mediaId: str(r.szMediaId) }));
  const techs = children(ptRows.rows, (r) => ({ id: str(r.szProjectTechnologyId), technologyId: str(r.szTechnologyId) }));
  const links = children(linkRows.rows, (r) => ({
    id: str(r.szProjectLinkId), label: str(r.szLabel), url: str(r.szUrl),
    iconKey: strOrNull(r.szIconKey), iconMediaId: strOrNull(r.szIconMediaId),
  }));
  const details = children(detailRows.rows, (r) => ({ id: str(r.szProjectDetailId), heading: str(r.szHeading), body: str(r.szBody) }));

  const period = (r: Row) => ({
    startDate: str(r.szStartDate), endDate: str(r.szEndDate), isCurrent: bool(r.bIsCurrent), periodNote: str(r.szPeriodNote),
  });

  return {
    profile: {
      id: p ? str(p.szProfileId) : "PRF-MAIN",
      fullName: str(p?.szFullName),
      jobTitle: str(p?.szJobTitle),
      shortBio: str(p?.szShortBio),
      aboutDescription: str(p?.szAboutDescription),
      cvMediaId: strOrNull(p?.szCvMediaId),
      cvFileName: str(p?.szCvFileName),
    },
    // Always return every section defined by the fixed layout.
    sections: SECTION_DEFINITIONS.map((def) => {
      const r = sectionsByKey.get(def.key);
      return {
        id: r ? str(r.szSectionId) : `SEC-${def.key.toUpperCase()}`,
        key: def.key,
        navLabel: r ? str(r.szNavLabel) : def.defaultNavLabel,
        isActive: r ? bool(r.bIsActive) : true,
        texts: (r && textsBySection.get(str(r.szSectionId))) || {},
      };
    }),
    organizations: orgRows.rows.map((r) => ({
      id: str(r.szOrganizationId), isActive: bool(r.bIsActive), name: str(r.szName),
      websiteUrl: str(r.szWebsiteUrl), logoMediaId: strOrNull(r.szLogoMediaId),
    })),
    employmentTypes: empRows.rows.map((r) => ({ id: str(r.szEmploymentTypeId), isActive: bool(r.bIsActive), name: str(r.szName) })),
    technologies: techRows.rows.map((r) => ({
      id: str(r.szTechnologyId), isActive: bool(r.bIsActive), name: str(r.szName),
      iconKey: strOrNull(r.szIconKey), iconMediaId: strOrNull(r.szIconMediaId),
    })),
    experiences: expRows.rows.map((r) => ({
      id: str(r.szExperienceId), isActive: bool(r.bIsActive), organizationId: str(r.szOrganizationId),
      employmentTypeId: strOrNull(r.szEmploymentTypeId), roleTitle: str(r.szRoleTitle), description: str(r.szDescription),
      ...period(r),
    })),
    educations: eduRows.rows.map((r) => ({
      id: str(r.szEducationId), isActive: bool(r.bIsActive), organizationId: str(r.szOrganizationId), degree: str(r.szDegree),
      ...period(r),
    })),
    projects: projRows.rows.map((r) => {
      const pid = str(r.szProjectId);
      return {
        id: pid, isActive: bool(r.bIsActive), title: str(r.szTitle), summary: str(r.szSummary),
        images: images.get(pid) ?? [], technologies: techs.get(pid) ?? [], links: links.get(pid) ?? [], details: details.get(pid) ?? [],
      };
    }),
    skills: skillRows.rows.map((r) => ({
      id: str(r.szSkillId), isActive: bool(r.bIsActive), technologyId: str(r.szTechnologyId),
      certificateMediaId: strOrNull(r.szCertificateMediaId),
    })),
    socialLinks: socialRows.rows.map((r) => ({
      id: str(r.szSocialLinkId), isActive: bool(r.bIsActive), displayName: str(r.szDisplayName), url: str(r.szUrl),
      iconKey: strOrNull(r.szIconKey), iconMediaId: strOrNull(r.szIconMediaId),
    })),
    media: mediaRows.rows.map(rowToMedia),
  };
}

function rowToMedia(r: Row): MediaItem {
  const id = str(r.szMediaId);
  return { id, url: mediaUrlFor({ id, externalUrl: strOrNull(r.szExternalUrl) }), fileName: str(r.szFileName), mimeType: str(r.szMimeType) };
}

// -----------------------------------------------------------------------------
// save (document -> tables)
// -----------------------------------------------------------------------------
interface TableRow {
  id: string;
  isActive: boolean;
  values: Record<string, InValue>;
}

interface TableSync {
  table: string;
  pk: string;
  columns: string[];
  rows: TableRow[];
  /** Soft-delete live rows that are no longer in the document. */
  deleteMissing: boolean;
}

/**
 * Builds statements that make `table` match `rows`:
 *   - soft-delete (bIsDeleted = 1) rows that disappeared,
 *   - upsert the rest; audit columns only change when a value really changed.
 */
async function syncStatements(spec: TableSync, actor: string, now: string): Promise<InStatement[]> {
  const out: InStatement[] = [];
  if (spec.deleteMissing) {
    const keep = new Set(spec.rows.map((r) => r.id));
    const existing = await select(`SELECT ${spec.pk} AS id FROM ${spec.table} WHERE bIsDeleted = 0`);
    const gone = existing.map((r) => str(r.id)).filter((id) => !keep.has(id));
    for (const id of gone) {
      out.push({
        sql: `UPDATE ${spec.table} SET bIsDeleted = 1, dtmLastUpdatedAt = ?, szUpdatedBy = ? WHERE ${spec.pk} = ?`,
        args: [now, actor, id],
      });
    }
  }

  const cols = [spec.pk, ...spec.columns, "bIsActive", "bIsDeleted", "dtmCreatedAt", "szCreatedBy", "dtmLastUpdatedAt", "szUpdatedBy"];
  const tracked = [...spec.columns, "bIsActive"];
  const sql =
    `INSERT INTO ${spec.table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")}) ` +
    `ON CONFLICT (${spec.pk}) DO UPDATE SET ` +
    `${tracked.map((c) => `${c} = excluded.${c}`).join(", ")}, bIsDeleted = 0, ` +
    `dtmLastUpdatedAt = excluded.dtmLastUpdatedAt, szUpdatedBy = excluded.szUpdatedBy ` +
    `WHERE ${spec.table}.bIsDeleted <> 0 OR ${tracked.map((c) => `${spec.table}.${c} IS NOT excluded.${c}`).join(" OR ")}`;

  for (const row of spec.rows) {
    out.push({
      sql,
      args: [row.id, ...spec.columns.map((c) => row.values[c] ?? null), b(row.isActive), 0, now, actor, now, actor],
    });
  }
  return out;
}

export async function saveDocument(doc: PortfolioDocument, actor: string): Promise<void> {
  const now = nowIso();
  const sorted = <T>(list: T[]) => list.map((item, i) => ({ item, i }));

  // Site texts keep a stable id per (section, key).
  const textIds = new Map(
    (await select(`SELECT szSiteTextId, szSectionId, szTextKey FROM ms_site_text`)).map((r) => [
      `${str(r.szSectionId)}|${str(r.szTextKey)}`,
      str(r.szSiteTextId),
    ]),
  );
  const allowedTexts = new Map(SECTION_DEFINITIONS.map((d) => [d.key, new Set(d.texts.map((t) => t.key))]));
  const textRows: TableRow[] = doc.sections.flatMap((s) =>
    Object.entries(s.texts)
      .filter(([key]) => allowedTexts.get(s.key)?.has(key))
      .map(([key, value]) => ({
        id: textIds.get(`${s.id}|${key}`) ?? newId("siteText"),
        isActive: true,
        values: { szSectionId: s.id, szTextKey: key, szValue: value },
      })),
  );

  const projectChildren = <T extends { id: string }>(pick: (p: PortfolioDocument["projects"][number]) => T[], values: (c: T) => Record<string, InValue>) =>
    doc.projects.flatMap((p) => pick(p).map((c, i) => ({ id: c.id, isActive: true, values: { szProjectId: p.id, iSortOrder: i, ...values(c) } })));

  const specs: TableSync[] = [
    {
      table: "ms_profile", pk: "szProfileId", deleteMissing: false,
      columns: ["szFullName", "szJobTitle", "szShortBio", "szAboutDescription", "szCvMediaId", "szCvFileName"],
      rows: [{
        id: doc.profile.id, isActive: true,
        values: {
          szFullName: doc.profile.fullName, szJobTitle: doc.profile.jobTitle, szShortBio: doc.profile.shortBio,
          szAboutDescription: doc.profile.aboutDescription, szCvMediaId: doc.profile.cvMediaId, szCvFileName: doc.profile.cvFileName,
        },
      }],
    },
    {
      table: "ms_section", pk: "szSectionId", deleteMissing: false,
      columns: ["szSectionKey", "szNavLabel", "iSortOrder"],
      rows: doc.sections.map((s) => ({
        id: s.id, isActive: s.isActive,
        values: { szSectionKey: s.key, szNavLabel: s.navLabel, iSortOrder: SECTION_DEFINITIONS.findIndex((d) => d.key === s.key) },
      })),
    },
    { table: "ms_site_text", pk: "szSiteTextId", deleteMissing: false, columns: ["szSectionId", "szTextKey", "szValue"], rows: textRows },
    {
      table: "ms_organization", pk: "szOrganizationId", deleteMissing: true,
      columns: ["szName", "szWebsiteUrl", "szLogoMediaId"],
      rows: doc.organizations.map((o) => ({ id: o.id, isActive: o.isActive, values: { szName: o.name, szWebsiteUrl: o.websiteUrl, szLogoMediaId: o.logoMediaId } })),
    },
    {
      table: "ms_employment_type", pk: "szEmploymentTypeId", deleteMissing: true, columns: ["szName"],
      rows: doc.employmentTypes.map((e) => ({ id: e.id, isActive: e.isActive, values: { szName: e.name } })),
    },
    {
      table: "ms_technology", pk: "szTechnologyId", deleteMissing: true, columns: ["szName", "szIconKey", "szIconMediaId"],
      rows: doc.technologies.map((t) => ({ id: t.id, isActive: t.isActive, values: { szName: t.name, szIconKey: t.iconKey, szIconMediaId: t.iconMediaId } })),
    },
    {
      table: "tr_experience", pk: "szExperienceId", deleteMissing: true,
      columns: ["szOrganizationId", "szEmploymentTypeId", "szRoleTitle", "szStartDate", "szEndDate", "bIsCurrent", "szPeriodNote", "szDescription", "iSortOrder"],
      rows: sorted(doc.experiences).map(({ item: e, i }) => ({
        id: e.id, isActive: e.isActive,
        values: {
          szOrganizationId: e.organizationId, szEmploymentTypeId: e.employmentTypeId, szRoleTitle: e.roleTitle,
          szStartDate: e.startDate, szEndDate: e.endDate, bIsCurrent: b(e.isCurrent), szPeriodNote: e.periodNote,
          szDescription: e.description, iSortOrder: i,
        },
      })),
    },
    {
      table: "tr_education", pk: "szEducationId", deleteMissing: true,
      columns: ["szOrganizationId", "szDegree", "szStartDate", "szEndDate", "bIsCurrent", "szPeriodNote", "iSortOrder"],
      rows: sorted(doc.educations).map(({ item: e, i }) => ({
        id: e.id, isActive: e.isActive,
        values: {
          szOrganizationId: e.organizationId, szDegree: e.degree, szStartDate: e.startDate, szEndDate: e.endDate,
          bIsCurrent: b(e.isCurrent), szPeriodNote: e.periodNote, iSortOrder: i,
        },
      })),
    },
    {
      table: "tr_project", pk: "szProjectId", deleteMissing: true, columns: ["szTitle", "szSummary", "iSortOrder"],
      rows: sorted(doc.projects).map(({ item: p, i }) => ({ id: p.id, isActive: p.isActive, values: { szTitle: p.title, szSummary: p.summary, iSortOrder: i } })),
    },
    {
      table: "tr_project_image", pk: "szProjectImageId", deleteMissing: true, columns: ["szProjectId", "iSortOrder", "szMediaId"],
      rows: projectChildren((p) => p.images, (c) => ({ szMediaId: c.mediaId })),
    },
    {
      table: "tr_project_technology", pk: "szProjectTechnologyId", deleteMissing: true, columns: ["szProjectId", "iSortOrder", "szTechnologyId"],
      rows: projectChildren((p) => p.technologies, (c) => ({ szTechnologyId: c.technologyId })),
    },
    {
      table: "tr_project_link", pk: "szProjectLinkId", deleteMissing: true,
      columns: ["szProjectId", "iSortOrder", "szLabel", "szUrl", "szIconKey", "szIconMediaId"],
      rows: projectChildren((p) => p.links, (c) => ({ szLabel: c.label, szUrl: c.url, szIconKey: c.iconKey, szIconMediaId: c.iconMediaId })),
    },
    {
      table: "tr_project_detail", pk: "szProjectDetailId", deleteMissing: true, columns: ["szProjectId", "iSortOrder", "szHeading", "szBody"],
      rows: projectChildren((p) => p.details, (c) => ({ szHeading: c.heading, szBody: c.body })),
    },
    {
      table: "tr_skill", pk: "szSkillId", deleteMissing: true, columns: ["szTechnologyId", "szCertificateMediaId", "iSortOrder"],
      rows: sorted(doc.skills).map(({ item: s, i }) => ({
        id: s.id, isActive: s.isActive, values: { szTechnologyId: s.technologyId, szCertificateMediaId: s.certificateMediaId, iSortOrder: i },
      })),
    },
    {
      table: "tr_social_link", pk: "szSocialLinkId", deleteMissing: true,
      columns: ["szDisplayName", "szUrl", "szIconKey", "szIconMediaId", "iSortOrder"],
      rows: sorted(doc.socialLinks).map(({ item: s, i }) => ({
        id: s.id, isActive: s.isActive,
        values: { szDisplayName: s.displayName, szUrl: s.url, szIconKey: s.iconKey, szIconMediaId: s.iconMediaId, iSortOrder: i },
      })),
    },
  ];

  const statements: InStatement[] = [];
  for (const spec of specs) statements.push(...(await syncStatements(spec, actor, now)));
  await writeBatch(statements);
}

// -----------------------------------------------------------------------------
// publish
// -----------------------------------------------------------------------------
export interface PublishRecord {
  id: string;
  hash: string;
  note: string;
  publishedAt: string;
  publishedBy: string;
}

export async function publishDocument(doc: PortfolioDocument, actor: string, note = ""): Promise<PublishRecord> {
  const record: PublishRecord = { id: newId("publish"), hash: hashDocument(doc), note, publishedAt: nowIso(), publishedBy: actor };
  await writeBatch([{
    sql: `INSERT INTO tr_publish_history (szPublishId, szContentHash, szSnapshotJson, szNote, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [record.id, record.hash, JSON.stringify(doc), note, record.publishedAt, actor, record.publishedAt, actor],
  }]);
  return record;
}

const toPublishRecord = (r: Row): PublishRecord => ({
  id: str(r.szPublishId), hash: str(r.szContentHash), note: str(r.szNote), publishedAt: str(r.dtmCreatedAt), publishedBy: str(r.szCreatedBy),
});

export async function getLatestPublish(): Promise<(PublishRecord & { doc: PortfolioDocument }) | null> {
  const [r] = await select(
    `SELECT * FROM tr_publish_history WHERE bIsDeleted = 0 AND bIsActive = 1 ORDER BY dtmCreatedAt DESC LIMIT 1`,
  );
  return r ? { ...toPublishRecord(r), doc: JSON.parse(str(r.szSnapshotJson)) } : null;
}

export async function listPublishes(limit = 20): Promise<PublishRecord[]> {
  const rows = await select(
    `SELECT szPublishId, szContentHash, szNote, dtmCreatedAt, szCreatedBy FROM tr_publish_history
     WHERE bIsDeleted = 0 ORDER BY dtmCreatedAt DESC LIMIT ?`,
    [limit],
  );
  return rows.map(toPublishRecord);
}

export async function getPublishSnapshot(id: string): Promise<PortfolioDocument | null> {
  const [r] = await select(`SELECT szSnapshotJson FROM tr_publish_history WHERE szPublishId = ? AND bIsDeleted = 0`, [id]);
  return r ? JSON.parse(str(r.szSnapshotJson)) : null;
}

// -----------------------------------------------------------------------------
// media
// -----------------------------------------------------------------------------
export async function insertMedia(
  input: { fileName: string; mimeType: string; content?: Uint8Array; externalUrl?: string },
  actor: string,
): Promise<MediaItem> {
  const checksum = input.content ? createHash("sha256").update(input.content).digest("hex") : null;
  if (checksum) {
    const [dup] = await select(
      `SELECT szMediaId, szFileName, szMimeType, szExternalUrl FROM ms_media WHERE szChecksum = ? AND bIsDeleted = 0 LIMIT 1`,
      [checksum],
    );
    if (dup) return rowToMedia(dup);
  }
  const id = newId("media");
  const now = nowIso();
  await writeBatch([{
    sql: `INSERT INTO ms_media (szMediaId, szFileName, szMimeType, iSizeBytes, szExternalUrl, binContent, szChecksum,
            dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, input.fileName, input.mimeType, input.content?.byteLength ?? 0, input.externalUrl ?? null, input.content ?? null,
      checksum, now, actor, now, actor],
  }]);
  return { id, url: mediaUrlFor({ id, externalUrl: input.externalUrl ?? null }), fileName: input.fileName, mimeType: input.mimeType };
}

export async function getMediaContent(id: string): Promise<{ mimeType: string; fileName: string; content: Uint8Array } | null> {
  // Soft-deleted media is still served: older published snapshots may reference it.
  const [r] = await select(`SELECT szMimeType, szFileName, binContent FROM ms_media WHERE szMediaId = ? AND binContent IS NOT NULL`, [id]);
  if (!r) return null;
  const content = r.binContent as ArrayBuffer;
  return { mimeType: str(r.szMimeType), fileName: str(r.szFileName), content: new Uint8Array(content) };
}

export async function softDeleteMedia(id: string, actor: string): Promise<void> {
  await writeBatch([{
    sql: `UPDATE ms_media SET bIsDeleted = 1, dtmLastUpdatedAt = ?, szUpdatedBy = ? WHERE szMediaId = ?`,
    args: [nowIso(), actor, id],
  }]);
}

export { referencedMediaIds } from "./references";
