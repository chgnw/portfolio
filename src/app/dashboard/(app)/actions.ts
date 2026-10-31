"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db, writeBatch } from "@/lib/db/client";
import { hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/auth/password";
import { logout, requireUser } from "@/lib/auth/session";
import { DRAFT_TAG, PUBLISHED_TAG, PUBLISH_HISTORY_TAG } from "@/lib/content/queries";
import { portfolioDocumentSchema, isSafeUrl, type MediaItem, type PortfolioDocument } from "@/lib/content/schema";
import {
  getLatestPublish,
  getPublishSnapshot,
  hashDocument,
  insertMedia,
  listPublishes,
  loadDocument,
  publishDocument,
  referencedMediaIds,
  saveDocument,
  softDeleteMedia,
  type PublishRecord,
} from "@/lib/content/store";

/**
 * Every action re-checks the session against the database. Next.js server
 * actions also reject cross-origin POSTs, and the session cookie is
 * SameSite=Strict, so these can't be triggered from another site.
 */

export type ActionResult<T = null> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: { path: string; message: string }[] };

async function validate(input: unknown): Promise<{ ok: true; doc: PortfolioDocument } | { ok: false; error: string; issues: { path: string; message: string }[] }> {
  // Media rows are managed by upload/delete actions only — trust the database list, not the client's.
  const media = (await loadDocument()).media;
  const candidate = typeof input === "object" && input !== null ? { ...(input as object), media } : input;
  const parsed = portfolioDocumentSchema.safeParse(candidate);
  if (parsed.success) return { ok: true, doc: parsed.data };
  return {
    ok: false,
    error: "Some fields are invalid.",
    issues: parsed.error.issues.slice(0, 20).map((i) => ({ path: i.path.join("."), message: i.message })),
  };
}

export async function saveDraftAction(input: unknown): Promise<ActionResult<{ hash: string; doc: PortfolioDocument }>> {
  const user = await requireUser();
  const v = await validate(input);
  if (!v.ok) return v;
  await saveDocument(v.doc, user.userId);
  updateTag(DRAFT_TAG);
  const stored = await loadDocument();
  return { ok: true, data: { hash: hashDocument(stored), doc: stored } };
}

export async function publishAction(
  input: unknown,
  note: string,
): Promise<ActionResult<{ hash: string; doc: PortfolioDocument; record: PublishRecord }>> {
  const user = await requireUser();
  const v = await validate(input);
  if (!v.ok) return v;
  await saveDocument(v.doc, user.userId);
  const stored = await loadDocument();
  const record = await publishDocument(stored, user.userId, note.slice(0, 300));
  updateTag(DRAFT_TAG);
  updateTag(PUBLISHED_TAG);
  updateTag(PUBLISH_HISTORY_TAG);
  revalidatePath("/");
  return { ok: true, data: { hash: record.hash, doc: stored, record } };
}

export async function discardDraftAction(): Promise<ActionResult<{ doc: PortfolioDocument; hash: string }>> {
  await requireUser();
  const doc = await loadDocument();
  return { ok: true, data: { doc, hash: hashDocument(doc) } };
}

export async function loadPublishedVersionAction(publishId: string): Promise<ActionResult<{ doc: PortfolioDocument }>> {
  await requireUser();
  const snapshot = await getPublishSnapshot(String(publishId));
  if (!snapshot) return { ok: false, error: "Version not found." };
  // Keep the current media library (uploads are not versioned).
  const media = (await loadDocument()).media;
  return { ok: true, data: { doc: { ...snapshot, media } } };
}

export async function listPublishesAction(): Promise<ActionResult<{ items: PublishRecord[] }>> {
  await requireUser();
  return { ok: true, data: { items: await listPublishes(30) } };
}

// -----------------------------------------------------------------------------
// media
// -----------------------------------------------------------------------------
const ALLOWED_UPLOADS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function sniffMime(bytes: Uint8Array): string | null {
  const starts = (...sig: number[]) => sig.every((v, i) => bytes[i] === v);
  if (starts(0x89, 0x50, 0x4e, 0x47)) return "image/png";
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x47, 0x49, 0x46, 0x38)) return "image/gif";
  if (starts(0x25, 0x50, 0x44, 0x46)) return "application/pdf";
  if (starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "image/avif";
  return null;
}

export async function uploadMediaAction(formData: FormData): Promise<ActionResult<{ media: MediaItem }>> {
  const user = await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received." };
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Files must be 10 MB or smaller." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  // Trust the file's magic bytes, not its extension or the browser-reported type.
  const mime = sniffMime(bytes);
  if (!mime || !ALLOWED_UPLOADS[mime]) return { ok: false, error: "Only PNG, JPEG, WebP, GIF, AVIF or PDF files are allowed." };

  const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^\w\-]+/g, "-").slice(0, 80) || "file";
  const media = await insertMedia({ fileName: `${baseName}.${ALLOWED_UPLOADS[mime]}`, mimeType: mime, content: bytes }, user.userId);
  updateTag(DRAFT_TAG);
  return { ok: true, data: { media } };
}

export async function addMediaUrlAction(url: string, fileName: string): Promise<ActionResult<{ media: MediaItem }>> {
  const user = await requireUser();
  const clean = String(url).trim();
  if (!clean || !isSafeUrl(clean) || /^(mailto|tel):/i.test(clean)) return { ok: false, error: "Use an https:// URL or a /path to a file in /public." };
  const name = String(fileName || clean.split("/").pop() || "file").slice(0, 200);
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const mime = ext === "pdf" ? "application/pdf" : ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext || "png"}`;
  const media = await insertMedia({ fileName: name, mimeType: mime, externalUrl: clean }, user.userId);
  updateTag(DRAFT_TAG);
  return { ok: true, data: { media } };
}

export async function deleteMediaAction(mediaId: string): Promise<ActionResult> {
  const user = await requireUser();
  const [draft, live] = await Promise.all([loadDocument(), getLatestPublish()]);
  if (referencedMediaIds(draft).has(mediaId)) return { ok: false, error: "This file is still used in your saved draft. Remove it there and save first." };
  if (live && referencedMediaIds(live.doc).has(mediaId)) return { ok: false, error: "This file is used on the live site. Publish without it first." };
  await softDeleteMedia(String(mediaId), user.userId);
  updateTag(DRAFT_TAG);
  return { ok: true, data: null };
}

// -----------------------------------------------------------------------------
// account
// -----------------------------------------------------------------------------
export async function changePasswordAction(current: string, next: string): Promise<ActionResult> {
  const user = await requireUser();
  const row = (await db().execute({ sql: "SELECT szPasswordHash FROM ms_user WHERE szUserId = ?", args: [user.userId] })).rows[0];
  if (!row || !(await verifyPassword(String(current), String(row.szPasswordHash)))) {
    return { ok: false, error: "Current password is incorrect." };
  }
  const problem = validatePasswordStrength(String(next));
  if (problem) return { ok: false, error: problem };
  const now = new Date().toISOString();
  await writeBatch([
    { sql: "UPDATE ms_user SET szPasswordHash = ?, dtmLastUpdatedAt = ?, szUpdatedBy = ? WHERE szUserId = ?", args: [await hashPassword(String(next)), now, user.userId, user.userId] },
    // Sign out every other session.
    {
      sql: "UPDATE tr_user_session SET dtmRevokedAt = ?, bIsActive = 0, dtmLastUpdatedAt = ?, szUpdatedBy = ? WHERE szUserId = ? AND szSessionId <> ? AND dtmRevokedAt IS NULL",
      args: [now, now, user.userId, user.userId, user.sessionId],
    },
  ]);
  return { ok: true, data: null };
}

export async function logoutAction() {
  await logout();
  redirect("/dashboard/login");
}
