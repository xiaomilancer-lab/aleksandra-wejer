"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function PublicBookingAccess() {
  const [hideMobile, setHideMobile] = useState(false);
  useEffect(() => { const calendar = document.getElementById("kalendarz"); if (!calendar) return; const observer = new IntersectionObserver(([entry]) => setHideMobile(entry.isIntersecting), { threshold: 0.1 }); observer.observe(calendar); return () => observer.disconnect(); }, []);
  const scrollToCalendar = () => document.getElementById("kalendarz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <><button type="button" onClick={scrollToCalendar} className="fixed right-6 top-6 z-40 hidden items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB] md:inline-flex"><CalendarDays size={17} aria-hidden="true" />Umów wizytę</button>{!hideMobile && <button type="button" onClick={scrollToCalendar} className="fixed inset-x-4 bottom-4 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 text-sm font-semibold text-white shadow-xl md:hidden"><CalendarDays size={18} aria-hidden="true" />Umów wizytę</button>}</>;
}
