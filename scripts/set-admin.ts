/**
 * Creates the single dashboard account, or resets its password.
 * There is intentionally no sign-up page — this CLI is the only way in.
 *
 *   npm run admin:set -- you@example.com 'A-Strong-Passw0rd'
 *   (or set ADMIN_EMAIL / ADMIN_PASSWORD in .env.local and run without args)
 */
import { db, writeBatch } from "../src/lib/db/client";
import { newId } from "../src/lib/ids";
import { hashPassword, validatePasswordStrength } from "../src/lib/auth/password";
import { loadEnv } from "./env";
import { migrate } from "./db-migrate";

export async function upsertAdmin(email: string, password: string, displayName = "Owner") {
  const problem = validatePasswordStrength(password);
  if (problem) throw new Error(problem);
  const normalized = email.trim().toLowerCase();
  const hash = await hashPassword(password);
  const now = new Date().toISOString();

  const existing = await db().execute({ sql: "SELECT szUserId FROM ms_user WHERE szEmail = ? AND bIsDeleted = 0", args: [normalized] });
  const others = await db().execute({ sql: "SELECT COUNT(*) AS n FROM ms_user WHERE szEmail <> ? AND bIsDeleted = 0 AND bIsActive = 1", args: [normalized] });

  if (existing.rows[0]) {
    const userId = String(existing.rows[0].szUserId);
    await writeBatch([
      { sql: "UPDATE ms_user SET szPasswordHash = ?, bIsActive = 1, dtmLastUpdatedAt = ?, szUpdatedBy = 'CLI' WHERE szUserId = ?", args: [hash, now, userId] },
      // A password reset signs out every existing session.
      { sql: "UPDATE tr_user_session SET dtmRevokedAt = ?, dtmLastUpdatedAt = ?, szUpdatedBy = 'CLI' WHERE szUserId = ? AND dtmRevokedAt IS NULL", args: [now, now, userId] },
    ]);
    console.log(`✔ password updated for ${normalized} (all sessions signed out)`);
  } else {
    await writeBatch([{
      sql: `INSERT INTO ms_user (szUserId, szEmail, szPasswordHash, szDisplayName, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy)
            VALUES (?, ?, ?, ?, ?, 'CLI', ?, 'CLI')`,
      args: [newId("user"), normalized, hash, displayName, now, now],
    }]);
    console.log(`✔ admin account created for ${normalized}`);
  }
  if (Number(others.rows[0].n) > 0) {
    console.warn("⚠ other active accounts exist in ms_user — the dashboard is meant for a single owner.");
  }
}

if (process.argv[1]?.endsWith("set-admin.ts")) {
  loadEnv();
  const [email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: npm run admin:set -- <email> <password>");
    process.exit(1);
  }
  migrate()
    .then(() => upsertAdmin(email, password, process.env.ADMIN_NAME))
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
