# Portfolio + Owner Dashboard

A personal portfolio (Next.js 16 · React 19 · TypeScript · Tailwind 4) with a private dashboard where every text, heading, entry, image, icon and link can be edited. Changes show up in a **live preview** first and reach the public site only when you **publish**.

## Quick start

```bash
cp .env.example .env.local      # then set ADMIN_EMAIL / ADMIN_PASSWORD
npm install
npm run db:seed                 # creates the schema, imports the original content, publishes it, creates your login
npm run dev                     # http://localhost:4000
```

| Command | What it does |
| --- | --- |
| `npm run db:migrate` | Applies pending SQL files from `db/migrations/` |
| `npm run db:seed` | Migrates, seeds the original content (skips if content already exists, `-- --force` resets the content tables), then creates or updates the admin from `.env.local` |
| `npm run admin:set -- <email> <password>` | Creates the single owner account, or resets its password (this also signs out every session) |
| `npm run typecheck` / `npm run lint` / `npm run build` | Checks |

## The dashboard

- **Hidden:** nothing on the site links to it. Open `/dashboard` directly, or press **Ctrl/Cmd + Shift + K** on the portfolio.
- **Login only, no sign-up:** a single account created with the CLI (email + password).
- **Editable:** profile (name, title, bios, CV), every section heading/tagline/button label/navbar label, section visibility, experience, education, projects (screenshots, tech stack, links, detail sections), skills (+ certificates), social links, organizations, technologies, employment types and the media library.
- **Icons:** any icon from Feather, Font Awesome 6, Simple Icons (brands), Lucide, Material or Tabler (searchable picker), or an uploaded image. Links are optional. When a social link has a URL, both its icon and its display name are clickable.
- **Placeholders:** empty fields show placeholder text in the editor and fallback text or images on the site. Empty lists show an "empty" message.
- **Live preview:** the right-hand panel renders your *unsaved* draft as you type (desktop / tablet / mobile) and follows the tab you're editing.
- **Save draft** stores the draft in the database. The public site doesn't change.
- **Publish** saves, then freezes a snapshot that the public site serves. Every publish is kept in **Publish history**, and any version can be loaded back into the editor (rollback).
- Ctrl/Cmd + S saves. The browser warns before you leave with unsaved changes.

## How it stays fast (no loading states)

| Data | Strategy |
| --- | --- |
| Public page `/` | Statically pre-rendered HTML with all content and icons inlined (`force-static`). Rebuilt on demand only when you publish (`updateTag` + `revalidatePath`). |
| Published / draft content, publish history | Next.js data cache (`unstable_cache`) with tags. Busted only on save or publish. |
| Library icons on the public site | Rendered to SVG on the server, so no icon pack is downloaded. The dashboard loads packs lazily. |
| Uploaded media `/media/<id>` | Ids are immutable, so files are served with `Cache-Control: public, max-age=31536000, immutable`. |
| Database | libSQL: an embedded SQLite file locally (sub-millisecond), Turso in production. Writes are atomic batches. |

## Database

Schema: [`db/migrations/001_init.sql`](db/migrations/001_init.sql), normalized to 3NF.

- `ms_*` = **master data**: reference entities other rows point to.
- `tr_*` = **transaction data**: portfolio entries, mappings and event logs that reference master data.
- Ids are strings named per entity (`szUserId`, `szProjectId`, …), generated as `PREFIX-<time-sortable>` (e.g. `PRJ-01M68K…`).
- Every table has `bIsDeleted, bIsActive, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy`. Deletes are soft (`bIsDeleted = 1`). `bIsActive` drives "visible on site". Audit columns change only when a value really changes.
- Column prefixes: `sz` string, `b` boolean, `i` integer, `dtm` ISO datetime, `bin` blob.

| Master (`ms_`) | Transaction (`tr_`) |
| --- | --- |
| `ms_user`: owner login (bcrypt hash) | `tr_user_session`: hashed session tokens |
| `ms_profile`: name, title, bios, CV | `tr_login_attempt`: rate limiting and audit |
| `ms_section`: fixed page sections (nav label, visibility) | `tr_experience` → organization, employment type |
| `ms_site_text`: one row per (section, text key) | `tr_education` → organization |
| `ms_organization`: companies and schools (logo, website) | `tr_project`, plus `tr_project_image`, `tr_project_technology` (M:N), `tr_project_link`, `tr_project_detail` |
| `ms_employment_type` | `tr_skill` → technology, certificate |
| `ms_technology`: shared by project tech stacks and skills | `tr_social_link`: icon + display name + optional URL |
| `ms_media`: uploaded blob **or** external/static URL | `tr_publish_history`: immutable published snapshots |
| | `tr_schema_migration`: applied migrations |

`tr_publish_history.szSnapshotJson` is a deliberate point-in-time copy (like an invoice line keeping the price at sale time). The editable source of truth is the normalized tables. The snapshot is what keeps draft edits away from production and makes rollback possible.

## Security

- No sign-up. One account, created via the CLI. Passwords are bcrypt (cost 12) and must be ≥ 12 characters with mixed case and a digit.
- Sessions use a random 256-bit token in an `httpOnly`, `SameSite=Strict` cookie (`__Host-` prefixed and `Secure` in production). Only its SHA-256 is stored, so tokens can be revoked (logout, password change). They expire after 7 days.
- `src/proxy.ts` turns away dashboard requests that have no session cookie. Every dashboard page and **every server action** also checks the session against the database.
- Login rate limit: 5 failures per email or 20 per IP within 15 minutes. Timing is the same for unknown emails.
- All saves are validated server-side with zod: field lengths, id formats, references, uniqueness. Links must be `http(s)://`, `mailto:`, `tel:` or `/path`, so `javascript:` URLs are rejected.
- Uploads are checked by their real file bytes (PNG/JPEG/WebP/GIF/AVIF/PDF, ≤ 10 MB). SVG is not allowed, and images are served with `nosniff` and a sandbox CSP.
- `frame-ancestors 'self'` (only the dashboard can frame the preview). The dashboard sends `noindex` and `no-store`. Preview `postMessage` checks origin and source.

## Deploying (e.g. Vercel + Turso)

1. Create a Turso database. Set `DATABASE_URL` (`libsql://…`) and `DATABASE_AUTH_TOKEN` in the hosting env **and locally**.
2. Run `npm run db:seed` (or `db:migrate` + `admin:set`) once against it.
3. Deploy. The home page is pre-rendered at build time from the published snapshot, so the database must be reachable during the build.

The local `file:` database works for self-hosting (`npm run build && npm start`) but not on serverless platforms, whose filesystem is read-only or ephemeral.

## Project layout

```
db/migrations/            SQL schema
scripts/                  migrate / seed / set-admin CLIs
src/proxy.ts              dashboard route guard
src/lib/db                libSQL client
src/lib/auth              passwords, sessions, rate limiting
src/lib/content           registry (text slots + fallbacks), zod schema, store (DB <-> document), cached queries, view resolver
src/lib/icons             icon packs (lazy) + server rendering
src/components/portfolio  public site (fixed layout, renders a PortfolioView)
src/components/dashboard  editor, pickers, panels, preview client
src/app/dashboard         login, editor, preview, server actions
src/app/media/[mediaId]   media file route
```
