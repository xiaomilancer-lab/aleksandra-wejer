import { CalendarDays, Heart, Star } from "lucide-react";
import type { DashboardVisit } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";

type DashboardTodayOverviewProps = {
  visits: DashboardVisit[];
  nextVisit: DashboardVisit | null;
  followupCount: number;
};

export default function DashboardTodayOverview({
  visits,
  nextVisit,
  followupCount,
}: DashboardTodayOverviewProps) {
  const firstVisit = visits[0] ?? null;

  return (
    <DashboardCard>
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-[#FBE8E8] p-3 text-[#BF4D4D]">
          <Heart size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-gray-500">Plan dnia</p>
          <h2 className="font-bold text-[#2D4739]">Dzisiaj</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric icon={CalendarDays} label="Wizyty" value={String(visits.length)} />
        <Metric icon={Heart} label="Follow-up" value={String(followupCount)} />
        <Metric icon={Star} label="Oczekujące opinie" value="0" />
        <div className="rounded-2xl bg-[#F8F5F0] p-4">
          <p className="text-xs text-gray-500">Pierwsza wizyta</p>
          <p className="mt-2 font-semibold text-[#2D4739]">
            {firstVisit
              ? `${firstVisit.visit_time} · ${firstVisit.name}`
              : "Spokojny początek dnia"}
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Następna: {nextVisit ? `${nextVisit.visit_time} · ${nextVisit.name}` : "brak kolejnej wizyty"}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F8F5F0] p-4">
      <div className="flex items-center gap-2 text-[#6D7A62]">
        <Icon size={16} aria-hidden="true" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#2D4739]">{value}</p>
    </div>
  );
}
