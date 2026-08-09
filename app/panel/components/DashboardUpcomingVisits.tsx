import { Heart } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { DashboardVisit } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";

interface DashboardUpcomingVisitsProps {
  visits: DashboardVisit[];
}

export default function DashboardUpcomingVisits({ visits }: DashboardUpcomingVisitsProps) {
  return (
    <DashboardCard>
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FBE8E8] p-3 text-[#BF4D4D]"><Heart size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Priorytety</p><h2 className="font-bold text-[#2D4739]">Wymagają uwagi</h2></div></div>
      {visits.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Brak wizyt wymagających uwagi.</p>
      ) : (
        <div className="mt-5 space-y-3">{visits.map((visit) => <div key={visit.id} className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{visit.name}</p><p className="mt-1 text-sm text-gray-600">{visit.visit_date} · {visit.visit_time}</p></div><StatusBadge status={visit.status} /></div><p className="mt-2 text-sm text-[#6D7A62]">{visit.location}</p></div>)}</div>
      )}
    </DashboardCard>
  );
}
