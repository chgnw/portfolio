"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  FiBookOpen, FiBriefcase, FiClock, FiCode, FiExternalLink, FiEye, FiEyeOff, FiFolder, FiImage, FiLayers, FiMonitor,
  FiShare2, FiSmartphone, FiTablet, FiType, FiUser, FiUserCheck, FiX,
} from "react-icons/fi";
import { discardDraftAction, publishAction, saveDraftAction } from "@/app/dashboard/(app)/actions";
import { SECTION_DEFINITIONS, type SectionKey } from "@/lib/content/registry";
import { portfolioDocumentSchema, type MediaItem, type PortfolioDocument } from "@/lib/content/schema";
import type { PublishRecord } from "@/lib/content/store";
import { isMessage, type FromPreview, type ToPreview } from "@/lib/preview-protocol";
import { EditorContext, type EditorApi } from "./EditorContext";
import { Button } from "./fields";
import { ProfilePanel } from "./panels/ProfilePanel";
import { TextsPanel } from "./panels/TextsPanel";
import { EducationPanel, ExperiencePanel } from "./panels/ExperiencePanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { SkillsPanel, SocialPanel } from "./panels/SkillsPanel";
import { LibraryPanel, MediaPanel } from "./panels/LibraryPanel";
import { AccountPanel, HistoryPanel } from "./panels/HistoryPanel";

type Tab =
  | "profile" | `texts:${SectionKey}` | "experience" | "education" | "projects" | "skills" | "social"
  | "library" | "media" | "history" | "account";

const TAB_GROUPS: { label: string; tabs: { id: Tab; label: string; icon: React.ReactNode }[] }[] = [
  {
    label: "Content",
    tabs: [
      { id: "profile", label: "Profile", icon: <FiUser /> },
      { id: "experience", label: "Experience", icon: <FiBriefcase /> },
      { id: "education", label: "Education", icon: <FiBookOpen /> },
      { id: "projects", label: "Projects", icon: <FiFolder /> },
      { id: "skills", label: "Skills", icon: <FiCode /> },
      { id: "social", label: "Social links", icon: <FiShare2 /> },
    ],
  },
  {
    label: "Texts & headings",
    tabs: SECTION_DEFINITIONS.map((s) => ({ id: `texts:${s.key}` as Tab, label: s.title, icon: <FiType /> })),
  },
  {
    label: "Library",
    tabs: [
      { id: "library", label: "Shared data", icon: <FiLayers /> },
      { id: "media", label: "Media", icon: <FiImage /> },
    ],
  },
  {
    label: "Site",
    tabs: [
      { id: "history", label: "Publish history", icon: <FiClock /> },
      { id: "account", label: "Account", icon: <FiUserCheck /> },
    ],
  },
];

/** Which portfolio section the preview should show for a tab. */
function sectionForTab(tab: Tab): SectionKey | undefined {
  if (tab.startsWith("texts:")) {
    const key = tab.slice(6) as SectionKey;
    return key === "global" ? undefined : key;
  }
  return ({ profile: "home", experience: "about", education: "about", projects: "projects", skills: "skills", social: "contacts" } as Partial<Record<Tab, SectionKey>>)[tab];
}

const DEVICES = {
  desktop: { width: 1280, icon: <FiMonitor />, label: "Desktop" },
  tablet: { width: 820, icon: <FiTablet />, label: "Tablet" },
  mobile: { width: 390, icon: <FiSmartphone />, label: "Mobile" },
} as const;
type Device = keyof typeof DEVICES;

interface Toast { id: number; message: string; kind: "success" | "error" | "info" }

export function Editor({
  initialDoc, initialSavedHash, initialPublishedHash, initialHistory, userEmail,
}: {
  initialDoc: PortfolioDocument;
  initialSavedHash: string;
  initialPublishedHash: string | null;
  initialHistory: PublishRecord[];
  userEmail: string;
}) {
  const [doc, setDoc] = useState(initialDoc);
  const [dirty, setDirty] = useState(false);
  const [savedHash, setSavedHash] = useState(initialSavedHash);
  const [publishedHash, setPublishedHash] = useState(initialPublishedHash);
  const [history, setHistory] = useState(initialHistory);
  const [tab, setTab] = useState<Tab>("profile");
  const [issues, setIssues] = useState<{ path: string; message: string }[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busy, startBusy] = useTransition();
  const [showPreview, setShowPreview] = useState(true);
  const [device, setDevice] = useState<Device>("desktop");
  const [navOpen, setNavOpen] = useState(false);

  const notify = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3500);
  }, []);

  const api = useMemo<EditorApi>(() => ({
    doc,
    update: (mutate) => {
      setDoc((prev) => {
        const next = structuredClone(prev);
        mutate(next);
        return next;
      });
      setDirty(true);
    },
    // Media is persisted immediately on upload; it isn't a draft change.
    addMedia: (media: MediaItem) => setDoc((prev) => ({ ...prev, media: [media, ...prev.media.filter((m) => m.id !== media.id)] })),
    removeMedia: (mediaId: string) => setDoc((prev) => ({ ...prev, media: prev.media.filter((m) => m.id !== mediaId) })),
    notify,
  }), [doc, notify]);

  // ---------------------------------------------------------------- persistence
  const runValidation = (): boolean => {
    const parsed = portfolioDocumentSchema.safeParse(doc);
    if (parsed.success) {
      setIssues([]);
      return true;
    }
    setIssues(parsed.error.issues.slice(0, 20).map((i) => ({ path: i.path.join("."), message: i.message })));
    notify("Fix the highlighted problems before saving.", "error");
    return false;
  };

  const save = () => {
    if (!runValidation()) return;
    startBusy(async () => {
      const res = await saveDraftAction(doc);
      if (!res.ok) {
        setIssues(res.issues ?? []);
        return notify(res.error, "error");
      }
      setDoc(res.data.doc);
      setSavedHash(res.data.hash);
      setDirty(false);
      notify("Draft saved. The live site is unchanged until you publish.", "success");
    });
  };

  const publish = () => {
    if (!runValidation()) return;
    const note = window.prompt("Publish to the live site.\nOptional note for the history:", "");
    if (note === null) return;
    startBusy(async () => {
      const res = await publishAction(doc, note);
      if (!res.ok) {
        setIssues(res.issues ?? []);
        return notify(res.error, "error");
      }
      setDoc(res.data.doc);
      setSavedHash(res.data.hash);
      setPublishedHash(res.data.hash);
      setHistory((h) => [res.data.record, ...h]);
      setDirty(false);
      notify("Published! The live site has been updated.", "success");
    });
  };

  const discard = () => {
    if (!confirm("Discard unsaved changes and reload the last saved draft?")) return;
    startBusy(async () => {
      const res = await discardDraftAction();
      if (!res.ok) return notify(res.error, "error");
      setDoc(res.data.doc);
      setSavedHash(res.data.hash);
      setDirty(false);
      setIssues([]);
    });
  };

  // Ctrl/Cmd+S saves; warn before leaving with unsaved changes.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [dirty]);

  // ---------------------------------------------------------------- live preview
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewReady = useRef(false);
  const docRef = useRef(doc);
  docRef.current = doc;
  const section = sectionForTab(tab);

  const postToPreview = useCallback((d: PortfolioDocument, s?: SectionKey) => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !previewReady.current) return;
    win.postMessage({ type: "pf-preview:update", doc: d, section: s } satisfies ToPreview, window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (isMessage<FromPreview>(event.data, "pf-preview:ready")) {
        previewReady.current = true;
        postToPreview(docRef.current, sectionForTab(tab));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postToPreview, tab]);

  // Debounced so typing stays smooth.
  useEffect(() => {
    const t = setTimeout(() => postToPreview(doc), 120);
    return () => clearTimeout(t);
  }, [doc, postToPreview]);
  useEffect(() => {
    if (section) postToPreview(docRef.current, section);
  }, [section, postToPreview]);

  // Scale the device frame to fit the panel.
  const frameBox = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = frameBox.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [showPreview]);
  const deviceWidth = DEVICES[device].width;
  const scale = box.w ? Math.min(1, box.w / deviceWidth) : 1;

  // ---------------------------------------------------------------- render
  const status = dirty
    ? { text: "Unsaved changes", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" }
    : savedHash !== publishedHash
      ? { text: "Saved draft · not published", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" }
      : { text: "Live site is up to date", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };

  const panel = (() => {
    if (tab.startsWith("texts:")) return <TextsPanel key={tab} sectionKey={tab.slice(6) as SectionKey} />;
    switch (tab) {
      case "profile": return <ProfilePanel />;
      case "experience": return <ExperiencePanel />;
      case "education": return <EducationPanel />;
      case "projects": return <ProjectsPanel />;
      case "skills": return <SkillsPanel />;
      case "social": return <SocialPanel />;
      case "library": return <LibraryPanel />;
      case "media": return <MediaPanel />;
      case "history": return (
        <HistoryPanel history={history} liveHash={publishedHash} onRestore={(d) => { setDoc(d); setDirty(true); }} />
      );
      case "account": return <AccountPanel email={userEmail} />;
    }
  })();

  return (
    <EditorContext.Provider value={api}>
      <div className="flex h-screen flex-col bg-slate-950 text-slate-200">
        {/* Top bar */}
        <header className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/90 px-4 py-2.5">
          <button className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 lg:hidden" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">☰</button>
          <span className="font-semibold text-slate-100">Portfolio Dashboard</span>
          <span className={`hidden rounded-full border px-2.5 py-0.5 text-xs sm:inline ${status.cls}`}>{status.text}</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:inline-flex">
              <FiExternalLink /> Live site
            </a>
            <Button variant="ghost" onClick={() => setShowPreview((v) => !v)} title="Toggle live preview">
              {showPreview ? <FiEyeOff /> : <FiEye />} <span className="hidden sm:inline">Preview</span>
            </Button>
            {dirty && <Button variant="ghost" disabled={busy} onClick={discard}>Discard</Button>}
            <Button variant="secondary" disabled={busy || !dirty} onClick={save} title="Ctrl/Cmd + S">Save draft</Button>
            <Button variant="success" disabled={busy || (!dirty && savedHash === publishedHash)} onClick={publish}>
              {busy ? "Working…" : "Publish"}
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <nav className={`${navOpen ? "block" : "hidden"} absolute inset-y-0 left-0 top-[53px] z-40 w-60 overflow-y-auto border-r border-slate-800 bg-slate-950 p-3 lg:static lg:block`}>
            {TAB_GROUPS.map((g) => (
              <div key={g.label} className="mb-5">
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{g.label}</p>
                {g.tabs.map((t) => (
                  <button key={t.id} onClick={() => { setTab(t.id); setNavOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${tab === t.id ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-slate-800"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Editor panel */}
          <main className={`min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 ${showPreview ? "xl:max-w-[44rem]" : ""}`}>
            {issues.length > 0 && (
              <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm">
                <div className="mb-2 flex items-center justify-between">
                  <strong className="text-red-300">Can't save yet:</strong>
                  <button onClick={() => setIssues([])} aria-label="Dismiss"><FiX /></button>
                </div>
                <ul className="list-disc space-y-0.5 pl-5 text-red-200/90">
                  {issues.map((i, k) => <li key={k}><code className="text-xs text-red-300/70">{i.path}</code> — {i.message}</li>)}
                </ul>
              </div>
            )}
            {panel}
          </main>

          {/* Live preview */}
          {showPreview && (
            <section className="hidden min-w-0 flex-1 flex-col border-l border-slate-800 bg-slate-900/40 md:flex">
              <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2 text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wide text-amber-300">Live preview</span>
                <span className="hidden lg:inline">— your draft; visitors still see the published site</span>
                <div className="ml-auto flex gap-1">
                  {(Object.keys(DEVICES) as Device[]).map((d) => (
                    <button key={d} title={DEVICES[d].label} onClick={() => setDevice(d)}
                      className={`rounded p-1.5 ${device === d ? "bg-slate-700 text-white" : "hover:bg-slate-800"}`}>{DEVICES[d].icon}</button>
                  ))}
                </div>
              </div>
              <div ref={frameBox} className="relative flex-1 overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src="/dashboard/preview"
                  title="Live preview"
                  className="absolute left-1/2 top-0 origin-top border-0 bg-slate-900"
                  style={{
                    width: deviceWidth,
                    height: box.h / scale || "100%",
                    transform: `translateX(-50%) scale(${scale})`,
                  }}
                />
              </div>
            </section>
          )}
        </div>

        {/* Toasts */}
        <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} className={`pointer-events-auto max-w-sm rounded-lg border px-4 py-2.5 text-sm shadow-xl ${
              t.kind === "error" ? "border-red-500/40 bg-red-950 text-red-200"
                : t.kind === "success" ? "border-emerald-500/40 bg-emerald-950 text-emerald-200"
                  : "border-slate-600 bg-slate-900 text-slate-200"}`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </EditorContext.Provider>
  );
}
