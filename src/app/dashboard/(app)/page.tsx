import { Editor } from "@/components/dashboard/Editor";
import { requireUser } from "@/lib/auth/session";
import { getDraftDocument, getPublishedDocument, getPublishHistory } from "@/lib/content/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  // Served from the data cache (busted on save/publish), so the editor opens instantly.
  const [draft, published, history] = await Promise.all([getDraftDocument(), getPublishedDocument(), getPublishHistory()]);
  return (
    <Editor
      initialDoc={draft.doc}
      initialSavedHash={draft.hash}
      initialPublishedHash={published?.hash ?? null}
      initialHistory={history}
      userEmail={user.email}
    />
  );
}
