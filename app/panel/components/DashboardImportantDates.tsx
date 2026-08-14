import { CalendarHeart, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ImportantDateOccurrence } from "../domain";
import DashboardCard from "./DashboardCard";

export default function DashboardImportantDates({ occurrences }: { occurrences: ImportantDateOccurrence[] }) {
  const visible = occurrences.filter((entry) => entry.daysUntil >= 0 && entry.daysUntil <= 30 && !entry.isCompleted).slice(0, 3);
  return <DashboardCard><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FFF4D9] p-3 text-[#B7791F]"><CalendarHeart size={20} /></span><div><p className="text-sm text-gray-500">Najbliższe 30 dni</p><h2 className="font-bold text-[#2D4739]">Ważne daty</h2></div></div>{visible.length === 0 ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-6 text-center text-sm text-gray-500">Spokojnie — brak zapisanych okazji w najbliższym czasie.</p> : <div className="mt-5 space-y-3">{visible.map(({ item, occurrenceDate, daysUntil }) => <div key={item.id} className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{item.title}</p><p className="mt-1 text-sm text-gray-600">{new Date(`${occurrenceDate}T00:00:00`).toLocaleDateString("pl-PL")}</p></div><span className="text-xs font-semibold text-[#6D7A62]">{daysUntil === 0 ? "dzisiaj" : `za ${daysUntil} dni`}</span></div></div>)}</div>}<Link href="/panel/important-dates" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]">Zobacz wszystkie <ChevronRight size={16} /></Link></DashboardCard>;
}
