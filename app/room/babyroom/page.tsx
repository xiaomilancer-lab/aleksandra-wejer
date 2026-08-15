import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import BabyroomActivities from "./BabyroomActivities";

export default async function BabyroomPage() {
  await requireMember();

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
          <Link href="/room" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><ArrowLeft size={19} aria-hidden="true" />Wróć do pokoju</Link>
          <p className="mt-5 text-sm text-gray-500">Strefa dziecka</p>
          <h1 className="mt-1 text-3xl font-bold">Babyroom PsychOLKI 🌈</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">Kilka prostych aktywności na czas oczekiwania. Bez reklam, bez zakupów i bez zapisywania rysunków na serwerze.</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#EEF1EB] px-3 py-2 text-xs font-semibold text-[#55634F]"><ShieldCheck size={16} aria-hidden="true" />Dziecko korzysta razem z rodzicem lub opiekunem.</p>
        </header>
        <BabyroomActivities />
      </div>
    </main>
  );
}
