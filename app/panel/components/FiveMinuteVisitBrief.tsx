"use client";

import { ArrowRight, ClipboardCheck, Play, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Visit } from "../domain";
import { resolvePsycholkaMood } from "../psycholka/psycholkaEmotion";
import type { VisitBriefData } from "../services/visitBriefService";
import FollowupReminderList from "./FollowupReminderList";
import MoodJourneyTimeline from "./MoodJourneyTimeline";
import PsychOLKAAssistantCard from "./PsychOLKAAssistantCard";
import PsycholkaWidget from "./PsychOLKAWidget";

export default function FiveMinuteVisitBrief({ visit, brief }: { visit: Visit; brief: VisitBriefData | null }) {
  const [ready, setReady] = useState(false);
  const reason = brief?.firstReason ?? visit.message ?? "Brak wiadomości pozostawionej podczas rejestracji.";

  return <div className="space-y-5"><section className="rounded-3xl border border-[#D5DCCF] bg-[#FCFDFB] p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-start gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Timer size={20} aria-hidden="true" /></span><div><p className="text-sm text-[#55624D]">Tryb przygotowania · około 5 minut</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">Najpierw zobacz to, co najważniejsze</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-700">{reason}</p></div></div><div className="flex shrink-0 items-center gap-3"><PsycholkaWidget context="before_visit" mood={resolvePsycholkaMood("before_visit")} className="hidden sm:block" /><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><Link href={`/panel/visits/${visit.id}/brief?full=1`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739] hover:bg-white"><ArrowRight size={16} aria-hidden="true" />Pełny Brief</Link><Link href={`/panel/visits/${visit.id}/session`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#58644F]"><Play size={16} aria-hidden="true" />Rozpocznij wizytę</Link></div></div></div></section>{visit.patient_id && <FollowupReminderList patientId={visit.patient_id} visitId={visit.id} reminders={brief?.followupReminders ?? []} />}{visit.patient_id && <MoodJourneyTimeline patientId={visit.patient_id} entries={brief?.moodEntries ?? []} />}<PsychOLKAAssistantCard patientId={visit.patient_id ?? ""} brief={brief} /><section className="flex flex-col gap-3 rounded-2xl bg-[#F8F5F0] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><ClipboardCheck size={19} className="text-[#6D7A62]" aria-hidden="true" /><div><p className="text-sm font-semibold text-[#2D4739]">Gotowość do spotkania</p><p className="text-sm text-gray-600">Szybkie potwierdzenie tylko dla tej sesji przeglądarki.</p></div></div><button type="button" onClick={() => setReady((value) => !value)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${ready ? "bg-[#6D7A62] text-white" : "bg-white text-[#2D4739]"}`}>{ready ? "Gotowe do rozpoczęcia" : "Oznacz jako gotowe"}</button></section></div>;
}
