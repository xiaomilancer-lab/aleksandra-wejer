import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import TravelPlanner from "../room/travel/TravelPlanner";

export const metadata: Metadata = {
  title: "Dojazd do gabinetów | Aleksandra Wejer",
  description: "Zaplanuj dojazd do gabinetu Aleksandry Wejer w Starogardzie Gdańskim lub Nowej Wsi Rzecznej.",
  alternates: { canonical: "/dojazd" },
};

export default function PublicTravelPage() {
  return <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><ArrowLeft size={19} aria-hidden="true" />Strona główna</Link>
          <Link href="/#kalendarz" className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#6D7A62] px-4 py-3 font-semibold text-white"><CalendarDays size={19} aria-hidden="true" />Umów wizytę</Link>
        </div>
        <p className="mt-7 text-sm text-gray-500">Spokojna podróż do właściwego gabinetu</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Dojazd</h1>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">Wybierz gabinet i sposób podróży. PsychOLKA nie odczytuje ani nie zapisuje Twojej lokalizacji.</p>
      </header>
      <TravelPlanner />
    </div>
  </main>;
}
