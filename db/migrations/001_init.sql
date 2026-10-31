-- =============================================================================
-- 001_init.sql — Portfolio CMS schema (3NF)
--
-- Naming convention
--   ms_*  master data   : reference entities other rows point to
--   tr_*  transaction   : portfolio entries / mappings / event logs that
--                         reference master data
--
-- Column prefixes (Hungarian notation)
--   sz  = string     b   = boolean (0/1)    i = integer
--   dtm = ISO-8601 UTC datetime string      bin = binary blob
--
-- Every table carries the standard audit columns:
--   bIsDeleted, bIsActive, dtmCreatedAt, szCreatedBy, dtmLastUpdatedAt, szUpdatedBy
-- All primary keys are strings named after the entity (szUserId, szProjectId…).
-- =============================================================================

PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- Security
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ms_user (
  szUserId          TEXT    NOT NULL PRIMARY KEY,
  szEmail           TEXT    NOT NULL COLLATE NOCASE,
  szPasswordHash    TEXT    NOT NULL,
  szDisplayName     TEXT    NOT NULL DEFAULT '',
  dtmLastLoginAt    TEXT    NULL,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ms_user_email ON ms_user (szEmail) WHERE bIsDeleted = 0;

CREATE TABLE IF NOT EXISTS tr_user_session (
  szSessionId       TEXT    NOT NULL PRIMARY KEY,
  szUserId          TEXT    NOT NULL REFERENCES ms_user (szUserId),
  szTokenHash       TEXT    NOT NULL,
  dtmExpiresAt      TEXT    NOT NULL,
  dtmRevokedAt      TEXT    NULL,
  szIpAddress       TEXT    NOT NULL DEFAULT '',
  szUserAgent       TEXT    NOT NULL DEFAULT '',
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tr_user_session_token ON tr_user_session (szTokenHash);
CREATE INDEX IF NOT EXISTS ix_tr_user_session_user ON tr_user_session (szUserId);

CREATE TABLE IF NOT EXISTS tr_login_attempt (
  szLoginAttemptId  TEXT    NOT NULL PRIMARY KEY,
  szEmail           TEXT    NOT NULL COLLATE NOCASE,
  szIpAddress       TEXT    NOT NULL DEFAULT '',
  bIsSuccess        INTEGER NOT NULL DEFAULT 0 CHECK (bIsSuccess IN (0, 1)),
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_login_attempt_email ON tr_login_attempt (szEmail, dtmCreatedAt);
CREATE INDEX IF NOT EXISTS ix_tr_login_attempt_ip ON tr_login_attempt (szIpAddress, dtmCreatedAt);

-- -----------------------------------------------------------------------------
-- Master data
-- -----------------------------------------------------------------------------

-- Media: either an uploaded binary (binContent) or an external/static URL.
CREATE TABLE IF NOT EXISTS ms_media (
  szMediaId         TEXT    NOT NULL PRIMARY KEY,
  szFileName        TEXT    NOT NULL DEFAULT '',
  szMimeType        TEXT    NOT NULL DEFAULT '',
  iSizeBytes        INTEGER NOT NULL DEFAULT 0,
  szExternalUrl     TEXT    NULL,
  binContent        BLOB    NULL,
  szChecksum        TEXT    NULL,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  CHECK (szExternalUrl IS NOT NULL OR binContent IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS ix_ms_media_checksum ON ms_media (szChecksum);

-- Owner profile (single row in practice).
CREATE TABLE IF NOT EXISTS ms_profile (
  szProfileId         TEXT    NOT NULL PRIMARY KEY,
  szFullName          TEXT    NOT NULL DEFAULT '',
  szJobTitle          TEXT    NOT NULL DEFAULT '',
  szShortBio          TEXT    NOT NULL DEFAULT '',
  szAboutDescription  TEXT    NOT NULL DEFAULT '',
  szCvMediaId         TEXT    NULL REFERENCES ms_media (szMediaId),
  szCvFileName        TEXT    NOT NULL DEFAULT '',
  bIsDeleted          INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive           INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy         TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy         TEXT    NOT NULL DEFAULT 'SYSTEM'
);

-- Fixed page sections (layout is fixed by design; only labels/visibility change).
CREATE TABLE IF NOT EXISTS ms_section (
  szSectionId       TEXT    NOT NULL PRIMARY KEY,
  szSectionKey      TEXT    NOT NULL,
  szNavLabel        TEXT    NOT NULL DEFAULT '',
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ms_section_key ON ms_section (szSectionKey);

-- Headings, taglines, button labels… one row per (section, text key).
CREATE TABLE IF NOT EXISTS ms_site_text (
  szSiteTextId      TEXT    NOT NULL PRIMARY KEY,
  szSectionId       TEXT    NOT NULL REFERENCES ms_section (szSectionId),
  szTextKey         TEXT    NOT NULL,
  szValue           TEXT    NOT NULL DEFAULT '',
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_ms_site_text_key ON ms_site_text (szSectionId, szTextKey);

-- Companies, universities, schools… shared by experience & education.
CREATE TABLE IF NOT EXISTS ms_organization (
  szOrganizationId  TEXT    NOT NULL PRIMARY KEY,
  szName            TEXT    NOT NULL DEFAULT '',
  szWebsiteUrl      TEXT    NOT NULL DEFAULT '',
  szLogoMediaId     TEXT    NULL REFERENCES ms_media (szMediaId),
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);

CREATE TABLE IF NOT EXISTS ms_employment_type (
  szEmploymentTypeId TEXT    NOT NULL PRIMARY KEY,
  szName             TEXT    NOT NULL DEFAULT '',
  bIsDeleted         INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive          INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy        TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy        TEXT    NOT NULL DEFAULT 'SYSTEM'
);

-- Technologies are shared by project tech tags and the skills section.
CREATE TABLE IF NOT EXISTS ms_technology (
  szTechnologyId    TEXT    NOT NULL PRIMARY KEY,
  szName            TEXT    NOT NULL DEFAULT '',
  szIconKey         TEXT    NULL,
  szIconMediaId     TEXT    NULL REFERENCES ms_media (szMediaId),
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);

-- -----------------------------------------------------------------------------
-- Transaction data (portfolio entries)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tr_experience (
  szExperienceId      TEXT    NOT NULL PRIMARY KEY,
  szOrganizationId    TEXT    NOT NULL REFERENCES ms_organization (szOrganizationId),
  szEmploymentTypeId  TEXT    NULL REFERENCES ms_employment_type (szEmploymentTypeId),
  szRoleTitle         TEXT    NOT NULL DEFAULT '',
  szStartDate         TEXT    NOT NULL DEFAULT '',   -- 'YYYY' or 'YYYY-MM'
  szEndDate           TEXT    NOT NULL DEFAULT '',
  bIsCurrent          INTEGER NOT NULL DEFAULT 0 CHECK (bIsCurrent IN (0, 1)),
  szPeriodNote        TEXT    NOT NULL DEFAULT '',
  szDescription       TEXT    NOT NULL DEFAULT '',
  iSortOrder          INTEGER NOT NULL DEFAULT 0,
  bIsDeleted          INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive           INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy         TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy         TEXT    NOT NULL DEFAULT 'SYSTEM'
);

CREATE TABLE IF NOT EXISTS tr_education (
  szEducationId     TEXT    NOT NULL PRIMARY KEY,
  szOrganizationId  TEXT    NOT NULL REFERENCES ms_organization (szOrganizationId),
  szDegree          TEXT    NOT NULL DEFAULT '',
  szStartDate       TEXT    NOT NULL DEFAULT '',
  szEndDate         TEXT    NOT NULL DEFAULT '',
  bIsCurrent        INTEGER NOT NULL DEFAULT 0 CHECK (bIsCurrent IN (0, 1)),
  szPeriodNote      TEXT    NOT NULL DEFAULT '',
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);

CREATE TABLE IF NOT EXISTS tr_project (
  szProjectId       TEXT    NOT NULL PRIMARY KEY,
  szTitle           TEXT    NOT NULL DEFAULT '',
  szSummary         TEXT    NOT NULL DEFAULT '',
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);

CREATE TABLE IF NOT EXISTS tr_project_image (
  szProjectImageId  TEXT    NOT NULL PRIMARY KEY,
  szProjectId       TEXT    NOT NULL REFERENCES tr_project (szProjectId),
  szMediaId         TEXT    NOT NULL REFERENCES ms_media (szMediaId),
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_project_image_project ON tr_project_image (szProjectId);

-- Many-to-many: project <-> technology
CREATE TABLE IF NOT EXISTS tr_project_technology (
  szProjectTechnologyId TEXT    NOT NULL PRIMARY KEY,
  szProjectId           TEXT    NOT NULL REFERENCES tr_project (szProjectId),
  szTechnologyId        TEXT    NOT NULL REFERENCES ms_technology (szTechnologyId),
  iSortOrder            INTEGER NOT NULL DEFAULT 0,
  bIsDeleted            INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive             INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy           TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy           TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_project_technology_project ON tr_project_technology (szProjectId);

CREATE TABLE IF NOT EXISTS tr_project_link (
  szProjectLinkId   TEXT    NOT NULL PRIMARY KEY,
  szProjectId       TEXT    NOT NULL REFERENCES tr_project (szProjectId),
  szLabel           TEXT    NOT NULL DEFAULT '',
  szUrl             TEXT    NOT NULL DEFAULT '',
  szIconKey         TEXT    NULL,
  szIconMediaId     TEXT    NULL REFERENCES ms_media (szMediaId),
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_project_link_project ON tr_project_link (szProjectId);

-- Detail sections shown on the back of a project card (Background, Process…)
CREATE TABLE IF NOT EXISTS tr_project_detail (
  szProjectDetailId TEXT    NOT NULL PRIMARY KEY,
  szProjectId       TEXT    NOT NULL REFERENCES tr_project (szProjectId),
  szHeading         TEXT    NOT NULL DEFAULT '',
  szBody            TEXT    NOT NULL DEFAULT '',
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_project_detail_project ON tr_project_detail (szProjectId);

CREATE TABLE IF NOT EXISTS tr_skill (
  szSkillId             TEXT    NOT NULL PRIMARY KEY,
  szTechnologyId        TEXT    NOT NULL REFERENCES ms_technology (szTechnologyId),
  szCertificateMediaId  TEXT    NULL REFERENCES ms_media (szMediaId),
  iSortOrder            INTEGER NOT NULL DEFAULT 0,
  bIsDeleted            INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive             INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy           TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy           TEXT    NOT NULL DEFAULT 'SYSTEM'
);

-- Icon + display name, optionally wrapped in a link.
CREATE TABLE IF NOT EXISTS tr_social_link (
  szSocialLinkId    TEXT    NOT NULL PRIMARY KEY,
  szDisplayName     TEXT    NOT NULL DEFAULT '',
  szUrl             TEXT    NOT NULL DEFAULT '',
  szIconKey         TEXT    NULL,
  szIconMediaId     TEXT    NULL REFERENCES ms_media (szMediaId),
  iSortOrder        INTEGER NOT NULL DEFAULT 0,
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);

-- Each publish freezes an immutable snapshot of the content. Production only
-- ever reads the latest row here, so draft edits never leak to the live site.
-- (The JSON is a point-in-time release record, like an invoice line that
-- copies the price at sale time; the editable source of truth stays in the
-- normalized tables above.)
CREATE TABLE IF NOT EXISTS tr_publish_history (
  szPublishId       TEXT    NOT NULL PRIMARY KEY,
  szContentHash     TEXT    NOT NULL,
  szSnapshotJson    TEXT    NOT NULL,
  szNote            TEXT    NOT NULL DEFAULT '',
  bIsDeleted        INTEGER NOT NULL DEFAULT 0 CHECK (bIsDeleted IN (0, 1)),
  bIsActive         INTEGER NOT NULL DEFAULT 1 CHECK (bIsActive IN (0, 1)),
  dtmCreatedAt      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szCreatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM',
  dtmLastUpdatedAt  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  szUpdatedBy       TEXT    NOT NULL DEFAULT 'SYSTEM'
);
CREATE INDEX IF NOT EXISTS ix_tr_publish_history_created ON tr_publish_history (dtmCreatedAt);
