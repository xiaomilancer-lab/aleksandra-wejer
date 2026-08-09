import { BarChart3, CalendarDays, UserRoundPlus } from "lucide-react";
import DashboardCard from "./DashboardCard";

const stats = [
  { label: "Liczba wizyt", value: "—", icon: CalendarDays },
  { label: "Nowi pacjenci", value: "—", icon: UserRoundPlus },
  { label: "Średnia wizyt dziennie", value: "—", icon: BarChart3 },
];

export default function DashboardStats() {
  return (
    <DashboardCard className="mt-6">
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Podsumowanie</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">Statystyki tygodnia</h2></div><BarChart3 className="text-[#6D7A62]" size={22} aria-hidden="true" /></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm text-gray-500">{label}</p><Icon size={17} className="text-[#6D7A62]" aria-hidden="true" /></div><p className="mt-3 text-2xl font-bold text-[#2D4739]">{value}</p></div>)}</div>
    </DashboardCard>
  );
}
