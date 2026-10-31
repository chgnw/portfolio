"use client";

import { useState, useTransition } from "react";
import { changePasswordAction, loadPublishedVersionAction, logoutAction } from "@/app/dashboard/(app)/actions";
import type { PortfolioDocument } from "@/lib/content/schema";
import type { PublishRecord } from "@/lib/content/store";
import { useEditor } from "../EditorContext";
import { Button, Card, PanelHeader, TextInput } from "../fields";

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function HistoryPanel({ history, liveHash, onRestore }: { history: PublishRecord[]; liveHash: string | null; onRestore: (doc: PortfolioDocument) => void }) {
  const { notify } = useEditor();
  const [pending, start] = useTransition();
  return (
    <div>
      <PanelHeader title="Publish history" description="Every publish is kept. Load a version into the editor to review it, then save or publish to roll back." />
      <div className="space-y-2">
        {history.length === 0 && <p className="text-sm italic text-slate-500">Nothing published yet.</p>}
        {history.map((h) => (
          <Card key={h.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-sm font-medium text-slate-200">
                {fmt(h.publishedAt)}
                {h.hash === liveHash && h === history[0] && <span className="ml-2 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] uppercase text-emerald-300">live</span>}
              </p>
              <p className="text-xs text-slate-500">{h.note || "No note"} · {h.id}</p>
            </div>
            <Button disabled={pending} onClick={() => start(async () => {
              const res = await loadPublishedVersionAction(h.id);
              if (!res.ok) return notify(res.error, "error");
              onRestore(res.data.doc);
              notify("Version loaded into the editor (not saved yet).", "info");
            })}>Load into editor</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AccountPanel({ email }: { email: string }) {
  const { notify } = useEditor();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pending, start] = useTransition();

  return (
    <div>
      <PanelHeader title="Account" description={`Signed in as ${email}. There is no sign-up — this is the only account.`} />
      <Card className="max-w-md space-y-4">
        <h3 className="font-medium text-slate-200">Change password</h3>
        <TextInput label="Current password" type="password" value={current} onChange={setCurrent} />
        <TextInput label="New password" type="password" value={next} onChange={setNext} hint="At least 12 characters with upper & lower case letters and a number." />
        <TextInput label="Confirm new password" type="password" value={confirmPw} onChange={setConfirmPw} />
        <Button variant="primary" disabled={pending || !current || !next} onClick={() => {
          if (next !== confirmPw) return notify("New passwords don't match.", "error");
          start(async () => {
            const res = await changePasswordAction(current, next);
            if (!res.ok) return notify(res.error, "error");
            setCurrent(""); setNext(""); setConfirmPw("");
            notify("Password changed. Other sessions were signed out.", "success");
          });
        }}>Update password</Button>
      </Card>
      <form action={logoutAction} className="mt-6">
        <Button type="submit" variant="danger">Sign out</Button>
      </form>
    </div>
  );
}
