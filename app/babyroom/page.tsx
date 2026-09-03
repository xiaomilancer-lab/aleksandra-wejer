import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ShieldCheck } from "lucide-react";
import BabyroomActivities from "../room/babyroom/BabyroomActivities";

export const metadata: Metadata = {
  title: "Babyroom PsychOLKI | Bezpłatny kącik dla dzieci",
  description: "Kolorowanki, memory, puzzle, rysowanie i spokojne szumy PsychOLKI. Bez konta i bez reklam.",
  alternates: { canonical: "/babyroom" },
};

export default function PublicBabyroomPage() {
  return <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><ArrowLeft size={19} aria-hidden="true" />Strona główna</Link>
          <Link href="/#kalendarz" className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#6D7A62] px-4 py-3 font-semibold text-white"><CalendarDays size={19} aria-hidden="true" />Umów wizytę</Link>
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-[#A14F60]">Bezpłatnie · bez konta · bez reklam</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Babyroom PsychOLKI 🌈</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-600">Spokojne aktywności dla dzieci i rodziców: szumy, kolorowanki, rysowanie, ćwiczenie oddechowe, memory i puzzle. Niczego nie zapisujemy ani nie wysyłamy.</p>
        <p className="mt-5 inline-flex items-start gap-2 rounded-2xl bg-[#F3F7F1] px-4 py-3 text-sm leading-6 text-[#55624D]"><ShieldCheck size={19} className="mt-0.5 shrink-0" aria-hidden="true" />Korzystajcie razem. To kącik zabawy i wyciszenia, a nie narzędzie diagnostyczne ani terapeutyczne.</p>
      </header>
      <BabyroomActivities />
    </div>
  </main>;
}
