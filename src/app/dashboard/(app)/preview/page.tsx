import { PreviewClient } from "@/components/dashboard/PreviewClient";
import { getDraftDocument } from "@/lib/content/queries";
import { collectIconKeys, resolvePortfolio } from "@/lib/content/view";
import { renderIcons } from "@/lib/icons/server";

/** Live preview (framed by the dashboard). Shows the draft, never the published version. */
export default async function PreviewPage() {
  const { doc } = await getDraftDocument();
  const icons = await renderIcons(collectIconKeys(resolvePortfolio(doc)));
  return <PreviewClient initialDoc={doc} icons={icons} />;
}
