"use client";

import { BookOpen, CalendarClock, ClipboardCheck, FolderKanban, Users, X, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DashboardCard from "./DashboardCard";

const actions = [
  { label: "Pacjenci", icon: Users, href: "/panel/patients" },
  { label: "Grafik i dostępność", icon: CalendarClock, href: "/panel/availability" },
  { label: "Biblioteka", icon: BookOpen, href: "/panel/library" },
  { label: "Szablony", icon: FolderKanban, href: "/panel/templates" },
  { label: "Domknięcie dnia", icon: ClipboardCheck, href: "/panel/day-closing" },
];

export default function DashboardQuickActions() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="hidden sm:block">
        <DashboardCard>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Szybkie akcje</p>
          <h2 className="mt-1 text-xl font-bold text-[#2D4739]">Co chcesz zrobić?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {actions.map(({ label, icon: Icon, href }) => <ActionLink key={label} label={label} icon={Icon} href={href} />)}
          </div>
        </DashboardCard>
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={mobileOpen}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2D4739] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(45,71,57,0.28)] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 sm:hidden"
      >
        <Zap size={18} aria-hidden="true" />
        Szybkie akcje
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Zamknij szybkie akcje" className="absolute inset-0 bg-[#1F3028]/45" />
          <section role="dialog" aria-modal="true" aria-labelledby="quick-actions-title" className="absolute inset-x-0 bottom-0 max-h-[min(82dvh,36rem)] overflow-y-auto rounded-t-3xl bg-white px-4 pt-4 shadow-2xl [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#D5DCCF]" aria-hidden="true" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Szybkie akcje</p>
                <h2 id="quick-actions-title" className="mt-1 text-xl font-bold text-[#2D4739]">Co chcesz zrobić?</h2>
              </div>
              <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} aria-label="Zamknij szybkie akcje" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E1D8] text-[#2D4739] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62]">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-5 grid gap-2" aria-label="Szybkie akcje">
              {actions.map(({ label, icon: Icon, href }) => <ActionLink key={label} label={label} icon={Icon} href={href} onClick={() => setMobileOpen(false)} />)}
            </nav>
          </section>
        </div>
      )}
    </>
  );
}

function ActionLink({ label, icon: Icon, href, onClick }: (typeof actions)[number] & { onClick?: () => void }) {
  return <Link href={href} onClick={onClick} className="flex min-h-12 min-w-0 items-center gap-3 rounded-2xl border border-[#E5E1D8] px-4 py-3.5 text-left font-semibold text-[#2D4739] transition-colors hover:border-[#6D7A62] hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62]"><span className="shrink-0 rounded-xl bg-[#EEF1EB] p-2 text-[#6D7A62]"><Icon size={18} aria-hidden="true" /></span><span className="min-w-0 break-words">{label}</span></Link>;
}
