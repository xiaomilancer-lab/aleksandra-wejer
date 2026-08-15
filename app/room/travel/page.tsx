import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import TravelPlanner from "./TravelPlanner";

export default async function TravelPage() {
  await requireMember();

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
          <Link href="/room" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]">
            <ArrowLeft size={19} aria-hidden="true" /> Wróć do pokoju
          </Link>
          <p className="mt-6 text-sm text-gray-500">Spokojna podróż do gabinetu</p>
          <h1 className="mt-1 text-3xl font-bold">Dojazd</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">Wybierz gabinet i sposób podróży. PsychOLKA nie odczytuje ani nie zapisuje Twojej lokalizacji.</p>
        </header>
        <TravelPlanner />
      </div>
    </main>
  );
}
