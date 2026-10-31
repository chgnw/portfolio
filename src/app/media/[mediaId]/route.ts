import { getMediaContent } from "@/lib/content/store";
import { ID_PATTERN } from "@/lib/ids";

/**
 * Serves uploaded media. A media id never changes content (a new upload gets a
 * new id), so responses are cached for a year by browsers and CDNs.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params;
  if (!ID_PATTERN.test(mediaId)) return new Response("Not found", { status: 404 });

  const media = await getMediaContent(mediaId);
  if (!media) return new Response("Not found", { status: 404 });

  const inline = media.mimeType.startsWith("image/") || media.mimeType === "application/pdf";
  return new Response(Buffer.from(media.content), {
    headers: {
      "Content-Type": media.mimeType || "application/octet-stream",
      "Content-Length": String(media.content.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${media.fileName.replace(/[^\w.\-]/g, "_")}"`,
      "X-Content-Type-Options": "nosniff",
      ...(media.mimeType.startsWith("image/") ? { "Content-Security-Policy": "default-src 'none'; sandbox" } : {}),
    },
  });
}
