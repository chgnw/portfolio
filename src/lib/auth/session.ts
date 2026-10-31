import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, writeBatch } from "@/lib/db/client";
import { newId } from "@/lib/ids";
import { DUMMY_HASH, verifyPassword } from "./password";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_EMAIL = 5;
const MAX_FAILURES_PER_IP = 20;

/** `__Host-` cookies must be Secure, path=/ and host-only: can't be set by subdomains or over http. */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-pf_session" : "pf_session";

export interface SessionUser {
  userId: string;
  email: string;
  displayName: string;
  sessionId: string;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

async function clientInfo() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim().slice(0, 100);
  return { ip, userAgent: (h.get("user-agent") ?? "").slice(0, 300) };
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(emailInput: string, password: string): Promise<LoginResult> {
  const email = emailInput.trim().toLowerCase();
  const { ip, userAgent } = await clientInfo();
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS).toISOString();

  const [byEmail, byIp] = await db().batch([
    { sql: "SELECT COUNT(*) AS n FROM tr_login_attempt WHERE szEmail = ? AND bIsSuccess = 0 AND dtmCreatedAt > ?", args: [email, since] },
    { sql: "SELECT COUNT(*) AS n FROM tr_login_attempt WHERE szIpAddress = ? AND bIsSuccess = 0 AND dtmCreatedAt > ?", args: [ip, since] },
  ], "read");
  if (Number(byEmail.rows[0].n) >= MAX_FAILURES_PER_EMAIL || Number(byIp.rows[0].n) >= MAX_FAILURES_PER_IP) {
    return { ok: false, error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const userRow = (await db().execute({
    sql: "SELECT szUserId, szPasswordHash FROM ms_user WHERE szEmail = ? AND bIsDeleted = 0 AND bIsActive = 1",
    args: [email],
  })).rows[0];
  // Always run bcrypt so timing doesn't reveal whether the email exists.
  const valid = await verifyPassword(password, userRow ? String(userRow.szPasswordHash) : DUMMY_HASH);
  const success = Boolean(userRow) && valid;
  const now = new Date().toISOString();

  const statements = [{
    sql: `INSERT INTO tr_login_attempt (szLoginAttemptId, szEmail, szIpAddress, bIsSuccess, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy)
          VALUES (?, ?, ?, ?, ?, 'SYSTEM', ?, 'SYSTEM')`,
    args: [newId("loginAttempt"), email, ip, success ? 1 : 0, now, now],
  }];
  if (!success) {
    await writeBatch(statements);
    return { ok: false, error: "Invalid email or password." };
  }

  const userId = String(userRow!.szUserId);
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await writeBatch([
    ...statements,
    {
      sql: `INSERT INTO tr_user_session (szSessionId, szUserId, szTokenHash, dtmExpiresAt, szIpAddress, szUserAgent, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [newId("session"), userId, sha256(token), expiresAt.toISOString(), ip, userAgent, now, userId, now, userId],
    },
    { sql: "UPDATE ms_user SET dtmLastLoginAt = ? WHERE szUserId = ?", args: [now, userId] },
  ]);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  return { ok: true };
}

/** Resolves the signed-in user from the session cookie (deduped per request). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 200) return null;
  const row = (await db().execute({
    sql: `SELECT s.szSessionId, u.szUserId, u.szEmail, u.szDisplayName
          FROM tr_user_session s JOIN ms_user u ON u.szUserId = s.szUserId
          WHERE s.szTokenHash = ? AND s.dtmRevokedAt IS NULL AND s.bIsDeleted = 0 AND s.bIsActive = 1
            AND s.dtmExpiresAt > ? AND u.bIsDeleted = 0 AND u.bIsActive = 1`,
    args: [sha256(token), new Date().toISOString()],
  })).rows[0];
  if (!row) return null;
  return {
    sessionId: String(row.szSessionId),
    userId: String(row.szUserId),
    email: String(row.szEmail),
    displayName: String(row.szDisplayName),
  };
});

/** Use at the top of every dashboard page, server action and route handler. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/login");
  return user;
}

export async function logout(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    const now = new Date().toISOString();
    await writeBatch([{
      sql: "UPDATE tr_user_session SET dtmRevokedAt = ?, bIsActive = 0, dtmLastUpdatedAt = ?, szUpdatedBy = ? WHERE szSessionId = ?",
      args: [now, now, user.userId, user.sessionId],
    }]);
  }
  (await cookies()).delete(SESSION_COOKIE);
}
