import { CalendarDays, Sun } from "lucide-react";
import DashboardCard from "./DashboardCard";

interface DashboardGreetingProps {
  dateLabel: string;
  visitsCount: number;
}

export default function DashboardGreeting({
  dateLabel,
  visitsCount,
}: DashboardGreetingProps) {
  return (
    <DashboardCard className="overflow-hidden bg-[#2D4739] text-white">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#DDE6D7]"><Sun size={20} aria-hidden="true" /><span className="text-sm font-semibold uppercase tracking-[0.12em]">Dzień dobry</span></div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Aleksandro</h1>
          <p className="mt-2 capitalize text-[#DDE6D7]">{dateLabel}</p>
        </div>
        <div className="w-fit rounded-2xl bg-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-[#DDE6D7]"><CalendarDays size={18} aria-hidden="true" /><span className="text-sm">Wizyty dzisiaj</span></div>
          <p className="mt-2 text-3xl font-bold">{visitsCount}</p>
        </div>
      </div>
    </DashboardCard>
  );
}
