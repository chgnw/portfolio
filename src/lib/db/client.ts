import { createClient, type Client, type InStatement } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

/**
 * libSQL client.
 *  - Local dev: an embedded SQLite file (sub-millisecond queries, zero setup).
 *  - Production: Turso (libSQL over the network), set DATABASE_URL + DATABASE_AUTH_TOKEN.
 *
 * No `server-only` import here so CLI scripts (tsx) can reuse it.
 */
const DEFAULT_URL = "file:./data/portfolio.db";

declare global {
  var __portfolioDb: Client | undefined;
}

function makeClient(): Client {
  const url = process.env.DATABASE_URL || DEFAULT_URL;
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  }
  return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
}

export function db(): Client {
  if (!globalThis.__portfolioDb) {
    globalThis.__portfolioDb = makeClient();
    // Best effort: enforce declared FKs on embedded SQLite connections.
    globalThis.__portfolioDb.execute("PRAGMA foreign_keys = ON").catch(() => {});
  }
  return globalThis.__portfolioDb;
}

/** Runs all statements atomically in one write transaction. */
export async function writeBatch(statements: InStatement[]) {
  if (statements.length === 0) return;
  await db().batch(statements, "write");
}
