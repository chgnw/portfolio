/**
 * Applies pending SQL migrations from db/migrations in filename order.
 *   npm run db:migrate
 */
import fs from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db/client";
import { loadEnv } from "./env";

export async function migrate() {
  const client = db();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tr_schema_migration (
      szMigrationId     TEXT    NOT NULL PRIMARY KEY,
      bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
      bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
      dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
      dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
    )`);

  const applied = new Set(
    (await client.execute("SELECT szMigrationId FROM tr_schema_migration WHERE bIsDeleted = 0")).rows.map((r) =>
      String(r.szMigrationId),
    ),
  );
  const dir = path.join(process.cwd(), "db", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    await client.executeMultiple(sql);
    await client.execute({ sql: "INSERT INTO tr_schema_migration (szMigrationId) VALUES (?)", args: [file] });
    console.log(`✔ applied ${file}`);
  }
  console.log("Database schema is up to date.");
}

if (process.argv[1]?.endsWith("db-migrate.ts")) {
  loadEnv();
  migrate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
