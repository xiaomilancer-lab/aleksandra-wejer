import Link from "next/link";
import { ArrowRight, CloudOff, Heart, TimerReset } from "lucide-react";

export default function PublicCalmMinuteTeaser() {
  return (
    <section className="bg-[#F8F5F0] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-[#DDE4D9] bg-white shadow-[0_20px_55px_rgba(45,71,57,.08)] md:grid-cols-[1.15fr_.85fr]">
        <div className="p-6 sm:p-9 lg:p-12">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#6D7A62]"><Heart size={17} fill="currentColor" className="text-[#C76E76]" />Mały prezent od PsychOLKI</p>
          <h2 className="mt-4 text-3xl font-bold text-[#2D4739] sm:text-4xl">Masz spokojną minutę?</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">Bez logowania, oceniania i zapisywania odpowiedzi. Otwórz prostą chwilę oddechu, która działa również wtedy, gdy internet na moment zniknie.</p>
          <Link href="/chwila" className="mt-7 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-[#2D4739] px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#3A5948]">Otwórz spokojną minutę <ArrowRight size={19} /></Link>
        </div>
        <div className="grid content-center gap-4 bg-gradient-to-br from-[#EAF1E8] to-[#F7EEDC] p-6 sm:p-9">
          <div className="rounded-3xl bg-white/80 p-5 backdrop-blur-sm"><TimerReset className="text-[#6D7A62]" size={28} /><p className="mt-3 font-bold text-[#2D4739]">Jedna minuta, pięć spokojnych rund</p></div>
          <div className="rounded-3xl bg-white/80 p-5 backdrop-blur-sm"><CloudOff className="text-[#6D7A62]" size={28} /><p className="mt-3 font-bold text-[#2D4739]">Dostępna także offline po pierwszym otwarciu</p></div>
        </div>
      </div>
    </section>
  );
}
