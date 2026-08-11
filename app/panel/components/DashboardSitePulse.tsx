"use client";

import { Activity, ArrowRight, CalendarDays, MousePointerClick, Radio, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { SitePulseDashboardData } from "@/app/site-pulse/domain";
import DashboardCard from "./DashboardCard";

export default function DashboardSitePulse({ initialData }: { initialData: SitePulseDashboardData }) {
  const [data, setData] = useState(initialData);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch("/api/panel/site-pulse", { credentials: "same-origin", cache: "no-store" });
        if (response.ok) setData(await response.json());
      } catch { /* Keep the last reliable snapshot. */ }
      setNow(Date.now());
    };
    const timer = window.setInterval(() => { void refresh(); }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <DashboardCard className="mt-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Activity size={20} aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm text-gray-500">Spokojny obraz ruchu</p><h2 className="font-bold text-[#2D4739]">Puls strony</h2></div></div>{data.available && <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EEF1EB] px-3 py-1.5 text-xs font-semibold text-[#55624D]"><span className="h-2 w-2 rounded-full bg-[#68A06A]" />Aktualizuje się automatycznie</span>}</div>{!data.available ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-sm text-gray-600">Puls pojawi się po ręcznym uruchomieniu przygotowanej migracji i ustawieniu sekretu sesji.</p> : <><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric icon={Radio} label="Teraz na stronie" value={data.activeNow} /><Metric icon={Users} label="Odwiedzający dzisiaj" value={data.visitorsToday} /><Metric icon={CalendarDays} label="Ostatnie 7 dni" value={data.visitorsSevenDays} /><Metric icon={MousePointerClick} label="Wejścia do rezerwacji" value={data.bookingOpened} /></div><section className="mt-5 rounded-2xl bg-[#F8F5F0] p-4"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6D7A62]">Lejek rezerwacji · ostatnie 7 dni</p><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><FunnelStep label="Wejście" value={data.bookingOpened} /><ArrowRight className="hidden text-[#AAB4A4] sm:block" size={18} aria-hidden="true" /><FunnelStep label="Formularz" value={data.bookingFormStarted} /><ArrowRight className="hidden text-[#AAB4A4] sm:block" size={18} aria-hidden="true" /><FunnelStep label="Rezerwacja" value={data.bookingCompleted} /></div></section><div className="mt-5 grid gap-4 lg:grid-cols-3"><Breakdown title="Źródła ruchu" items={data.sources} /><Breakdown title="Najczęściej oglądane" items={data.sections} /><section className="min-w-0 rounded-2xl border border-[#E5E1D8] p-4"><p className="text-sm font-semibold text-[#2D4739]">Ostatnia anonimowa aktywność</p>{data.latestActivity ? <><p className="mt-3 text-sm leading-6 text-gray-600">{data.latestActivity.message}</p><p className="mt-2 text-xs text-[#6D7A62]">{relativeTime(data.latestActivity.occurredAt, now)}</p></> : <p className="mt-3 text-sm text-gray-500">Pierwsza aktywność pojawi się tutaj.</p>}</section></div></>}</DashboardCard>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Radio; label: string; value: number }) { return <div className="min-w-0 rounded-2xl bg-[#F8F5F0] p-3 sm:p-4"><Icon size={17} className="text-[#6D7A62]" aria-hidden="true" /><p className="mt-3 break-words text-xs text-gray-500 sm:text-sm">{label}</p><p className="mt-1 text-2xl font-bold text-[#2D4739]">{value}</p></div>; }
function FunnelStep({ label, value }: { label: string; value: number }) { return <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 sm:block sm:text-center"><p className="text-sm text-gray-500">{label}</p><p className="text-xl font-bold text-[#2D4739] sm:mt-1">{value}</p></div>; }
function Breakdown({ title, items }: { title: string; items: Array<{ label: string; count: number }> }) { return <section className="min-w-0 rounded-2xl border border-[#E5E1D8] p-4"><p className="text-sm font-semibold text-[#2D4739]">{title}</p>{items.length ? <ol className="mt-3 space-y-2">{items.map((item) => <li key={item.label} className="flex min-w-0 items-center justify-between gap-3 text-sm"><span className="min-w-0 break-words text-gray-600">{item.label}</span><strong className="shrink-0 text-[#55624D]">{item.count}</strong></li>)}</ol> : <p className="mt-3 text-sm text-gray-500">Brak danych.</p>}</section>; }
function relativeTime(value: string, now: number) { const seconds = Math.max(0, Math.floor((now - new Date(value).getTime()) / 1000)); if (seconds < 60) return "Przed chwilą"; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes} min temu`; const hours = Math.floor(minutes / 60); return hours === 1 ? "Godzinę temu" : `${hours} godz. temu`; }
