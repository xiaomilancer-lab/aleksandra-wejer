"use client";

import { CalendarDays, LogIn, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PublicBookingAccess() {
  const [hideMobile, setHideMobile] = useState(false);

  useEffect(() => {
    const calendar = document.getElementById("kalendarz");
    if (!calendar) return;
    const observer = new IntersectionObserver(([entry]) => setHideMobile(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(calendar);
    return () => observer.disconnect();
  }, []);

  const scrollToCalendar = () => document.getElementById("kalendarz")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return <>
    <div className="fixed right-6 top-24 z-40 hidden items-center gap-3 md:flex">
      <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2">
        <LogIn size={17} aria-hidden="true" />Zaloguj się
      </Link>
      <a href="tel:+48510777469" className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB]">
        <Phone size={17} aria-hidden="true" />Zadzwoń
      </a>
      <button type="button" onClick={scrollToCalendar} className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB]">
        <CalendarDays size={17} aria-hidden="true" />Umów wizytę
      </button>
    </div>
    {!hideMobile && <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex gap-2 md:hidden">
      <Link href="/login" aria-label="Zaloguj się do panelu" title="Zaloguj się" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6D7A62] bg-white/95 text-[#2D4739] shadow-xl backdrop-blur transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"><LogIn size={19} aria-hidden="true" /></Link>
      <a href="tel:+48510777469" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#6D7A62] bg-white/95 px-3 py-3 text-sm font-semibold text-[#2D4739] shadow-xl backdrop-blur transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"><Phone size={18} aria-hidden="true" />Zadzwoń</a>
      <button type="button" onClick={scrollToCalendar} className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-3 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"><CalendarDays size={18} aria-hidden="true" />Umów wizytę</button>
    </div>}
  </>;
}
