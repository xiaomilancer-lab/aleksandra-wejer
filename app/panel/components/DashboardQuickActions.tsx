import { BookOpen, CalendarClock, ClipboardCheck, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import DashboardCard from "./DashboardCard";

const actions = [
  { label: "Pacjenci", icon: Users, href: "/panel/patients" },
  { label: "Grafik i dostępność", icon: CalendarClock, href: "/panel/availability" },
  { label: "Biblioteka", icon: BookOpen, href: "/panel/library" },
  { label: "Szablony", icon: FolderKanban, href: "/panel/templates" },
  { label: "Domknięcie dnia", icon: ClipboardCheck, href: "/panel/day-closing" },
];

export default function DashboardQuickActions() {
  return (
    <DashboardCard>
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Szybkie akcje</p>
      <h2 className="mt-1 text-xl font-bold text-[#2D4739]">Co chcesz zrobić?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{actions.map(({ label, icon: Icon, href }) => <Link key={label} href={href} className="flex items-center gap-3 rounded-2xl border border-[#E5E1D8] px-4 py-3.5 text-left font-semibold text-[#2D4739] transition-colors hover:border-[#6D7A62] hover:bg-[#F8F5F0]"><span className="rounded-xl bg-[#EEF1EB] p-2 text-[#6D7A62]"><Icon size={18} aria-hidden="true" /></span>{label}</Link>)}</div>
    </DashboardCard>
  );
}
