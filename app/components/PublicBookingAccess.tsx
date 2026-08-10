"use client";

import { CalendarDays, Phone } from "lucide-react";
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
    <div className="fixed right-6 top-6 z-40 hidden items-center gap-3 md:flex">
      <a href="tel:+48510777469" className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB]">
        <Phone size={17} aria-hidden="true" />Zadzwoń
      </a>
      <button type="button" onClick={scrollToCalendar} className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#4B4338] shadow-lg ring-1 ring-[#E5E2DB] backdrop-blur transition hover:bg-[#EEF1EB]">
        <CalendarDays size={17} aria-hidden="true" />Umów wizytę
      </button>
    </div>
    {!hideMobile && <button type="button" onClick={scrollToCalendar} className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 md:hidden"><CalendarDays size={18} aria-hidden="true" />Umów wizytę</button>}
  </>;
}
