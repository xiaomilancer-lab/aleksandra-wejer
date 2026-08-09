"use client";

import { Check, Heart, SkipForward } from "lucide-react";
import { useState, useTransition } from "react";
import { resolveFollowupReminderAction } from "../actions/followupReminderActions";
import type { FollowupReminder } from "../domain";

interface FollowupReminderListProps {
  patientId: string;
  reminders: FollowupReminder[];
  visitId?: number | null;
  title?: string;
  showEmpty?: boolean;
  showResolved?: boolean;
}

export default function FollowupReminderList({ patientId, reminders: initialReminders, visitId, title = "Do sprawdzenia dzisiaj", showEmpty = false, showResolved = false }: FollowupReminderListProps) {
  const [reminders, setReminders] = useState(initialReminders);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resolveReminder(reminderId: string, status: "done" | "dismissed") {
    setPendingId(reminderId);
    startTransition(async () => {
      try {
        await resolveFollowupReminderAction(reminderId, patientId, status, visitId);
        setReminders((items) => items.map((item) => item.id === reminderId ? { ...item, status, completed_at: new Date().toISOString() } : item));
      } finally {
        setPendingId(null);
      }
    });
  }

  const displayedReminders = showResolved ? reminders : reminders.filter((reminder) => reminder.status === "open");
  if (!displayedReminders.length && !showEmpty) return null;

  return <section className="rounded-2xl border border-[#E7D9D9] bg-[#FFF9F8] p-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#FBE8E8] p-2.5 text-[#B65A5A]"><Heart size={18} aria-hidden="true" /></span><div><p className="text-sm text-[#8B5E5E]">Follow-up</p><h2 className="font-bold text-[#2D4739]">{title}</h2></div></div>{displayedReminders.length === 0 ? <p className="mt-4 rounded-xl bg-white px-4 py-5 text-center text-sm text-gray-500">Nie ma teraz żadnych otwartych przypomnień.</p> : <div className="mt-4 space-y-3">{displayedReminders.map((reminder) => <article key={reminder.id} className="rounded-xl bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{reminder.title}</p>{reminder.description && <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{reminder.description}</p>}</div>{reminder.status !== "open" && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${reminder.status === "done" ? "bg-[#E5F1E3] text-[#3E7C49]" : "bg-[#F1EFEB] text-[#6B665F]"}`}>{reminder.status === "done" ? "Omówione" : "Pominięte"}</span>}</div>{reminder.status === "open" && <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => resolveReminder(reminder.id, "done")} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-[#6D7A62] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#58644F] disabled:bg-gray-400"><Check size={15} aria-hidden="true" />Omówione</button><button type="button" onClick={() => resolveReminder(reminder.id, "dismissed")} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F5F0] px-3 py-2 text-sm font-semibold text-[#55624D] transition hover:bg-[#EEF1EB] disabled:text-gray-400"><SkipForward size={15} aria-hidden="true" />Pomiń</button>{pendingId === reminder.id && <span className="self-center text-xs text-gray-500">Zapisywanie…</span>}</div>}</article>)}</div>}</section>;
}
