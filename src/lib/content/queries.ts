import "server-only";
import { unstable_cache } from "next/cache";
import { getLatestPublish, hashDocument, listPublishes, loadDocument } from "./store";

/**
 * Cached reads. Content changes rarely (only when the owner saves/publishes),
 * so reads are served from Next's data cache and invalidated by tag:
 *   - PUBLISHED_TAG: busted on publish  -> production site
 *   - DRAFT_TAG:     busted on save     -> dashboard + preview
 */
export const PUBLISHED_TAG = "portfolio:published";
export const DRAFT_TAG = "portfolio:draft";
export const PUBLISH_HISTORY_TAG = "portfolio:publish-history";

export const getPublishedDocument = unstable_cache(
  async () => {
    const latest = await getLatestPublish();
    if (!latest) return null;
    return { doc: latest.doc, hash: latest.hash, publishedAt: latest.publishedAt };
  },
  ["portfolio-published-v1"],
  { tags: [PUBLISHED_TAG] },
);

export const getDraftDocument = unstable_cache(
  async () => {
    const doc = await loadDocument();
    return { doc, hash: hashDocument(doc) };
  },
  ["portfolio-draft-v1"],
  { tags: [DRAFT_TAG] },
);

export const getPublishHistory = unstable_cache(async () => listPublishes(30), ["portfolio-publish-history-v1"], {
  tags: [PUBLISH_HISTORY_TAG],
});
