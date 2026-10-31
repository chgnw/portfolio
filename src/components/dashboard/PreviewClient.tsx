"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import type { SectionKey } from "@/lib/content/registry";
import type { PortfolioDocument } from "@/lib/content/schema";
import { resolvePortfolio } from "@/lib/content/view";
import { isMessage, type FromPreview, type ToPreview } from "@/lib/preview-protocol";

export function PreviewClient({ initialDoc, icons }: { initialDoc: PortfolioDocument; icons: Record<string, ReactNode> }) {
  const [doc, setDoc] = useState(initialDoc);
  const [section, setSection] = useState<SectionKey | undefined>(undefined);
  const view = useMemo(() => resolvePortfolio(doc), [doc]);

  useEffect(() => {
    const framed = window.parent !== window;
    const post = (msg: FromPreview) => framed && window.parent.postMessage(msg, window.location.origin);

    const onMessage = (event: MessageEvent) => {
      // Only accept messages from the dashboard on this same origin.
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (isMessage<ToPreview>(event.data, "pf-preview:update")) {
        setDoc(event.data.doc);
        if (event.data.section) setSection(event.data.section);
      }
    };
    window.addEventListener("message", onMessage);
    post({ type: "pf-preview:ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <div className="fixed bottom-3 left-3 z-[60] rounded-full bg-amber-400/90 text-gray-900 text-xs font-bold px-3 py-1 shadow-lg pointer-events-none">
        PREVIEW · draft
      </div>
      <PortfolioView
        view={view}
        icons={icons}
        section={section}
        onSectionChange={(s) => {
          setSection(s);
          window.parent.postMessage({ type: "pf-preview:section", section: s } satisfies FromPreview, window.location.origin);
        }}
      />
    </>
  );
}
