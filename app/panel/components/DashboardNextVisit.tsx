import { getBookingLocationDisplayName } from "@/app/booking/locations";
import { CalendarClock, ClipboardList, UserRound } from "lucide-react";
import Link from "next/link";
import type { TodayQueueItem } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";

export default function DashboardNextVisit({ visit }: { visit: TodayQueueItem | null }) {
  return (
    <DashboardCard className="h-full">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><CalendarClock size={20} aria-hidden="true" /></span>
        <div><p className="text-sm text-gray-500">Najbliższa wizyta</p><h2 className="font-bold text-[#2D4739]">Co jest następne?</h2></div>
      </div>
      {!visit ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Brak nadchodzących wizyt.</p> : (
        <div className="mt-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xl font-bold text-[#2D4739]">{visit.name}</p><p className="mt-1 text-sm text-gray-600">{visit.visit_date} · {visit.visit_time}</p></div>
            <StatusBadge status={visit.status} />
          </div>
          <p className="mt-3 text-sm text-[#55624D]">{getBookingLocationDisplayName(visit.location_id, visit.location)}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#7A6540]">{visit.patient_id ? `${visit.previousVisitsCount + 1}. wizyta` : "Brak przypisanej karty pacjenta"}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/panel/visits/${visit.id}/brief`} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><ClipboardList size={16} aria-hidden="true" />{visit.patient_id ? "Przygotowanie" : "Szczegóły zgłoszenia"}</Link>
            {visit.patient_id && <Link href={`/panel/patients/${visit.patient_id}`} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><UserRound size={16} aria-hidden="true" />Karta pacjenta</Link>}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
