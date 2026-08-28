"use client";

import { CalendarDays, ClipboardList, EyeOff, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Visit } from "../../domain/booking";
import StatusBadge from "../StatusBadge";

type ScheduleMode = "upcoming" | "history";

export default function VisitScheduleList({ initialVisits, today }: { initialVisits: Visit[]; today: string }) {
  const [mode, setMode] = useState<ScheduleMode>("upcoming");
  const [hideCancelled, setHideCancelled] = useState(true);

  const visits = useMemo(() => initialVisits
    .filter((visit) => (visit.record_kind ?? "real") === "real")
    .filter((visit) => !hideCancelled || visit.status !== "Odwołane")
    .filter((visit) => mode === "upcoming" ? visit.visit_date >= today : visit.visit_date < today)
    .sort((left, right) => {
      const comparison = `${left.visit_date}T${left.visit_time}`.localeCompare(`${right.visit_date}T${right.visit_time}`);
      return mode === "upcoming" ? comparison : -comparison;
    }), [hideCancelled, initialVisits, mode, today]);

  const groups = useMemo(() => {
    const grouped = new Map<string, Visit[]>();
    for (const visit of visits) grouped.set(visit.visit_date, [...(grouped.get(visit.visit_date) ?? []), visit]);
    return [...grouped.entries()];
  }, [visits]);

  return <div className="mx-auto max-w-5xl space-y-6">
    <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm text-gray-500">Szybki widok dnia po dniu</p><h1 className="mt-1 flex items-center gap-3 text-3xl font-bold text-[#2D4739]"><CalendarDays size={30} aria-hidden="true" />Terminarz</h1><p className="mt-2 text-gray-600">Tylko najważniejsze informacje: kiedy, kto i w którym gabinecie.</p></div>
        <Link href="/panel/visits" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2D4739] px-5 py-3 font-semibold text-white"><ClipboardList size={19} aria-hidden="true" />Zarządzaj wizytami</Link>
      </div>
    </header>

    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-4 shadow-[0_10px_30px_rgba(45,71,57,0.05)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F5F0] p-1">
          <ModeButton active={mode === "upcoming"} onClick={() => setMode("upcoming")}>Dzisiaj i dalej</ModeButton>
          <ModeButton active={mode === "history"} onClick={() => setMode("history")}>Historia</ModeButton>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#E5E1D8] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><input type="checkbox" checked={hideCancelled} onChange={(event) => setHideCancelled(event.target.checked)} className="h-5 w-5 accent-[#6D7A62]" /><EyeOff size={18} aria-hidden="true" />Ukryj odwołane</label>
      </div>
    </section>

    <div className="space-y-5">
      {groups.map(([date, dayVisits]) => <section key={date} className="overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white shadow-[0_10px_30px_rgba(45,71,57,0.05)]">
        <header className="border-b border-[#E5E1D8] bg-[#F3F7F1] px-5 py-4 sm:px-6"><p className="text-lg font-bold capitalize text-[#2D4739]">{formatDayHeading(date, today)}</p><p className="mt-0.5 text-sm text-[#6D7A62]">{dayVisits.length} {visitCountLabel(dayVisits.length)}</p></header>
        <div className="divide-y divide-[#EEEAE3]">{dayVisits.map((visit) => <ScheduleRow key={visit.id} visit={visit} />)}</div>
      </section>)}
    </div>

    {groups.length === 0 && <div className="rounded-3xl border border-dashed border-[#D5DCCF] bg-white p-10 text-center"><CalendarDays className="mx-auto text-[#8A9781]" size={34} aria-hidden="true" /><p className="mt-3 font-bold text-[#2D4739]">Brak wizyt w tym widoku</p><p className="mt-1 text-sm text-gray-500">Zmień zakres albo pokaż wizyty odwołane.</p></div>}
  </div>;
}

function ScheduleRow({ visit }: { visit: Visit }) {
  return <article className="grid gap-3 px-5 py-4 sm:grid-cols-[76px_minmax(0,1fr)_minmax(180px,0.7fr)_auto] sm:items-center sm:px-6">
    <time className="text-2xl font-bold tabular-nums text-[#2D4739]" dateTime={`${visit.visit_date}T${visit.visit_time}`}>{visit.visit_time.slice(0, 5)}</time>
    <div className="min-w-0"><p className="truncate text-base font-bold text-[#263E32]">{visit.name}</p>{visit.patient_id && <Link href={`/panel/patients/${visit.patient_id}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#6D7A62] hover:underline"><UserRound size={14} aria-hidden="true" />Otwórz kartę</Link>}</div>
    <p className="flex min-w-0 items-center gap-2 text-sm text-[#55624D]"><MapPin size={17} className="shrink-0 text-[#8A9781]" aria-hidden="true" /><span className="truncate">{visit.location}</span></p>
    <div className="justify-self-start sm:justify-self-end"><StatusBadge status={visit.status} /></div>
  </article>;
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`min-h-10 rounded-xl px-4 py-2 text-sm font-semibold transition ${active ? "bg-[#2D4739] text-white shadow-sm" : "text-[#2D4739] hover:bg-white"}`}>{children}</button>;
}

function formatDayHeading(value: string, today: string) {
  const formatted = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Warsaw" }).format(new Date(`${value}T12:00:00Z`));
  return value === today ? `Dzisiaj · ${formatted}` : formatted;
}

function visitCountLabel(count: number) {
  if (count === 1) return "wizyta";
  if (count >= 2 && count <= 4) return "wizyty";
  return "wizyt";
}
