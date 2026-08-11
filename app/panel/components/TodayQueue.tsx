"use client";

import { getBookingLocationDisplayName } from "@/app/booking/locations";
import { BookOpen, Brain, CalendarPlus, ClipboardList, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TodayQueueItem } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";
import PsycholkaTodaySlot from "./PsycholkaTodaySlot";
import StatusBadge from "./StatusBadge";

export default function TodayQueue({ visits, initialNow }: { visits: TodayQueueItem[]; initialNow: string }) {
  const [now, setNow] = useState(() => new Date(initialNow));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (visits.length === 0) return <QuietDay />;

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-gray-500">Plan dnia</p><h2 className="font-bold text-[#2D4739]">Dzisiejsza kolejka</h2></div><span className="text-sm text-gray-500">{visits.length} wizyt</span></div>
        <div className="mt-5 space-y-3">{visits.map((visit) => <QueueRow key={visit.id} visit={visit} now={now} />)}</div>
      </DashboardCard>
    </div>
  );
}

function QueueRow({ visit, now }: { visit: TodayQueueItem; now: Date }) {
  const state = timeState(visit, now);
  const patientLabel = visit.patient_id ? `${visit.previousVisitsCount + 1}. wizyta` : "BRAK KARTY PACJENTA";
  return <Link href={`/panel/visits/${visit.id}/brief`} className={`block min-w-0 rounded-2xl border p-4 transition hover:border-[#BFCBB8] hover:bg-[#FCFDFB] ${visit.status === "Zrealizowane" ? "border-[#E5E1D8] bg-[#FAFAF8] opacity-75" : "border-[#E5E1D8] bg-white"}`}><div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 gap-4"><time className="w-12 shrink-0 pt-0.5 font-bold text-[#2D4739]">{visit.visit_time}</time><div className="min-w-0"><div className="flex min-w-0 flex-wrap items-center gap-2"><h3 className="min-w-0 break-words font-semibold text-[#2D4739]">{visit.name}</h3><span className="max-w-full break-words rounded-full bg-[#EEF1EB] px-2 py-0.5 text-xs font-semibold text-[#55624D]">{patientLabel}</span></div><p className="mt-1 min-w-0 break-words text-sm text-gray-600">{getBookingLocationDisplayName(visit.location_id, visit.location)} · {visit.source || "strona"}{visit.message ? ` · ${visit.message}` : ""}</p><Indicators visit={visit} /></div></div><div className="flex min-w-0 flex-wrap items-center gap-2"><span className="max-w-full break-words rounded-full bg-[#F8F5F0] px-2.5 py-1 text-xs text-[#55624D]">{state.label}</span><StatusBadge status={visit.status} /></div></div>{visit.requiresClosure && <p className="mt-3 ml-16 break-words text-xs font-semibold text-[#7A6540]">Wymaga domknięcia</p>}</Link>;
}

function Indicators({ visit }: { visit: TodayQueueItem }) {
  const items = [{ show: Boolean(visit.latestNote), icon: FileText, label: "Notatka z poprzedniej wizyty" }, { show: Boolean(visit.activeTask), icon: ClipboardList, label: "Aktywne zadanie" }, { show: visit.pinnedMemoryCount > 0, icon: Brain, label: "Przypięte Memory" }, { show: visit.pinnedMaterialsCount > 0, icon: BookOpen, label: "Materiały" }, { show: visit.hasVisitPlan, icon: CalendarPlus, label: "Przygotowany plan wizyty" }].filter((item) => item.show);
  if (!items.length) return null;
  return <div className="mt-3 flex flex-wrap gap-2">{items.map(({ icon: Icon, label }) => <span key={label} title={label} className="inline-flex items-center gap-1 rounded-lg bg-[#F8F5F0] px-2 py-1 text-xs text-[#55624D]"><Icon size={14} aria-hidden="true" />{label}</span>)}</div>;
}

function QuietDay() {
  return <DashboardCard><div className="text-center"><div className="flex justify-center"><PsycholkaTodaySlot hasVisits={false} /></div><p className="text-sm text-[#6D7A62]">Spokojniejszy dzień</p><h1 className="mt-2 text-2xl font-bold text-[#2D4739]">Dzisiaj nie masz zaplanowanych wizyt.</h1><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/panel/patients" className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Users size={16} className="mr-2 inline" />Pacjenci</Link><Link href="/panel/library" className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]">Biblioteka</Link><Link href="/panel/day-closing" className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]">Domknięcie dnia</Link></div></div></DashboardCard>;
}

function timeState(visit: TodayQueueItem, now: Date) {
  if (visit.status === "Zrealizowane") return { kind: "ended", label: "Zakończona" };
  const start = new Date(`${visit.visit_date}T${visit.visit_time}:00`);
  const difference = Math.round((start.getTime() - now.getTime()) / 60_000);
  if (difference <= -50) return { kind: "ended", label: "Zakończona" };
  if (difference <= 0) return { kind: "active", label: "Trwa / czas wizyty" };
  if (difference <= 5) return { kind: "soon", label: "Za chwilę" };
  if (difference <= 60) return { kind: "soon", label: `Za ${difference} min` };
  return { kind: "later", label: "Później" };
}
