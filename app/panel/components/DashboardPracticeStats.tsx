import Link from "next/link";
import { ArrowRight, Banknote, CalendarCheck2, CalendarX2, ChartNoAxesCombined } from "lucide-react";
import type { PracticeStatisticsData } from "../services/practiceStatisticsService";

export default function DashboardPracticeStats({ data }: { data: PracticeStatisticsData }) {
  const year = data.years.find((item) => item.year === data.currentYear) ?? data.years[0];
  const month = year?.months[data.currentMonth - 1];
  if (!month) return null;

  return <section className="mt-6 rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><ChartNoAxesCombined size={22} aria-hidden="true" /></span><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Bieżący miesiąc</p><h2 className="text-xl font-bold text-[#2D4739]">Gabinet w liczbach</h2></div></div><Link href="/panel/statistics" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold text-[#2D4739]">Pełne statystyki <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><SmallMetric icon={CalendarCheck2} label="Odbyte" value={String(month.completedVisits)} /><SmallMetric icon={CalendarX2} label="Odwołane" value={String(month.cancelledVisits)} /><SmallMetric icon={Banknote} label="Kwota odbytych" value={data.financeAvailable ? formatCurrency(month.completedRevenue) : "Po uruchomieniu SQL"} /></div></section>;
}

function SmallMetric({ icon: Icon, label, value }: { icon: typeof CalendarCheck2; label: string; value: string }) { return <div className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-center gap-2 text-sm text-gray-500"><Icon size={17} className="text-[#6D7A62]" aria-hidden="true" />{label}</div><p className="mt-2 break-words text-xl font-bold text-[#2D4739]">{value}</p></div>; }
function formatCurrency(value: number) { return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value); }
