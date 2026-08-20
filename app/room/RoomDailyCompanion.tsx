"use client";

import Link from "next/link";
import { Check, ChevronRight, Flame, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const VISITS_KEY = "psycholka-room-visit-days";
const NEED_KEY = "psycholka-room-daily-need";

const needs = [
  { id: "calm", emoji: "🌿", label: "Spokoju", suggestion: "Zrób spokojną minutę z PsychOLKĄ.", href: "/chwila" },
  { id: "smile", emoji: "😊", label: "Uśmiechu", suggestion: "Zajrzyj do kolorowanek albo Memory.", href: "/room/babyroom" },
  { id: "order", emoji: "🗓️", label: "Porządku", suggestion: "Sprawdź najbliższe wizyty.", href: "/room/visits" },
  { id: "direction", emoji: "🚗", label: "Kierunku", suggestion: "Przygotuj spokojnie trasę do gabinetu.", href: "/room/travel" },
] as const;

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function RoomDailyCompanion() {
  const [visitCount, setVisitCount] = useState(1);
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const today = useMemo(() => dateKey(), []);
  const current = needs.find((item) => item.id === selectedNeed);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedDays = JSON.parse(window.localStorage.getItem(VISITS_KEY) || "[]") as string[];
      const days = Array.from(new Set([...savedDays, today])).slice(-30);
      window.localStorage.setItem(VISITS_KEY, JSON.stringify(days));
      setVisitCount(days.length);

      const savedNeed = JSON.parse(window.localStorage.getItem(NEED_KEY) || "null") as { day?: string; value?: string } | null;
      if (savedNeed?.day === today && savedNeed.value) setSelectedNeed(savedNeed.value);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [today]);

  function choose(value: string) {
    setSelectedNeed(value);
    window.localStorage.setItem(NEED_KEY, JSON.stringify({ day: today, value }));
  }

  async function shareApp() {
    const data = {
      title: "PsychOLKA — Aleksandra Wejer",
      text: "Zobacz spokojną przestrzeń PsychOLKI i bezpieczny Babyroom 🌸",
      url: window.location.origin,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // Użytkownik może po prostu zamknąć systemowe okno udostępniania.
    }
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-gray-500">Codzienna chwila tylko na tym urządzeniu</p>
          <h2 className="mt-1 text-2xl font-bold">Czego potrzebujesz na teraz?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">Nie zapisujemy tego na koncie ani nie wysyłamy do gabinetu. Wybór służy jedynie do pokazania właściwego skrótu.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#FFF6DE] px-4 py-3 text-sm font-bold text-[#745A20]" title="Liczba różnych dni, w których ten telefon odwiedził pokój">
          <Flame size={18} aria-hidden="true" />{visitCount === 1 ? "Pierwsza wizyta tutaj" : `${visitCount} dni razem z PsychOLKĄ`}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {needs.map((item) => (
          <button key={item.id} type="button" onClick={() => choose(item.id)} aria-pressed={selectedNeed === item.id} className={`min-h-24 rounded-2xl border p-3 text-left transition ${selectedNeed === item.id ? "border-[#6D7A62] bg-[#EEF1EB] shadow-sm" : "border-[#E5E1D8] hover:bg-[#FAF8F4]"}`}>
            <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
            <span className="mt-2 block font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-[#F8F5F0] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">{current.suggestion}</p>
          <Link href={current.href} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 font-bold text-white">Przejdź <ChevronRight size={18} /></Link>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAE2] pt-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><Sparkles size={17} />Małe powroty też się liczą.</p>
        <button type="button" onClick={shareApp} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-bold">{shared ? <Check size={17} /> : <Share2 size={17} />}{shared ? "Link gotowy" : "Poleć PsychOLKĘ"}</button>
      </div>
    </section>
  );
}
