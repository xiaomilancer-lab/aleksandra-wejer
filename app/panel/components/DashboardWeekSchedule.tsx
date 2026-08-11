"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { DashboardWeekData } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";

export default function DashboardWeekSchedule({ schedule }: { schedule: DashboardWeekData }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <DashboardCard>
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><CalendarDays size={20} aria-hidden="true" /></span>
        <div><p className="text-sm text-gray-500">Plan pracy</p><h2 className="font-bold text-[#2D4739]">Najbliższe 7 dni</h2></div>
      </div>

      {!schedule.isAvailable ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-sm text-gray-600">Plan najbliższych wizyt pojawi się tutaj po ponownym wczytaniu danych.</p> : <div className="mt-5 min-w-0 space-y-2">{schedule.days.map((day) => {
        const isOpen = selectedDate === day.date;
        const label = new Date(`${day.date}T12:00:00`).toLocaleDateString("pl-PL", { weekday: "long" });
        return <div key={day.date} className="min-w-0 rounded-xl bg-[#F8F5F0]"><button type="button" onClick={() => setSelectedDate(isOpen ? null : day.date)} aria-expanded={isOpen} className="flex w-full min-w-0 items-center justify-between gap-3 px-3 py-3 text-left sm:px-4"><span className="min-w-0 capitalize font-semibold text-[#2D4739]">{label}</span><span className="flex shrink-0 items-center gap-2 text-sm text-[#55624D]"><span>{day.visits.length} {day.visits.length === 1 ? "wizyta" : day.visits.length >= 2 && day.visits.length <= 4 ? "wizyty" : "wizyt"}</span><ChevronDown size={16} className={`transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" /></span></button>{isOpen && <div className="border-t border-[#E5E1D8] px-3 py-3 sm:px-4">{day.visits.length === 0 ? <p className="text-sm text-gray-600">Brak zaplanowanych wizyt.</p> : <div className="space-y-2">{day.visits.map((visit) => <a key={visit.id} href={`/panel/visits/${visit.id}/brief`} className="flex min-w-0 flex-col items-start gap-2 rounded-lg bg-white px-3 py-2.5 text-sm transition hover:bg-[#EEF1EB] sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0 break-words"><strong className="text-[#2D4739]">{visit.visit_time} · {visit.name}</strong><span className="mt-0.5 block text-xs text-gray-500">{visit.location}</span></span><StatusBadge status={visit.status} /></a>)}</div>}</div>}</div>;
      })}</div>}

      <p className="mt-5 border-t border-[#E5E1D8] pt-4 text-sm font-semibold text-[#2D4739]">Suma: {schedule.totalVisits} zaplanowanych wizyt.</p>
    </DashboardCard>
  );
}
