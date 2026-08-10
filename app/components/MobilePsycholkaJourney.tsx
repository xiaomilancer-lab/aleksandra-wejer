import Image from "next/image";
import { HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { PsycholkaAssets } from "@/public/psycholka";
import HelpAccordion from "./HelpAccordion";

export default function MobilePsycholkaJourney() {
  return (
    <div className="space-y-4 bg-[#F9F6F1] px-4 pb-12 md:hidden">
      <section id="mobile-pomoc" data-scroll-anchor="oferta" className="scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src={PsycholkaAssets.booking.search} alt="PsychOLKA pomaga znaleźć właściwe wsparcie" width={96} height={96} className="h-20 w-20 object-contain" />
          <div>
            <p className="text-sm font-semibold text-[#6D7A62]">W czym mogę Ci pomóc?</p>
            <h2 className="mt-1 text-2xl font-bold text-[#2D4739]">Znajdźmy dobry pierwszy krok.</h2>
          </div>
        </div>
        <div className="mt-5"><HelpAccordion /></div>
        <a href="#mobile-aleksandra" className="mt-4 flex min-h-14 items-center gap-3 rounded-2xl border border-[#DCE8E2] bg-[#F7FBF9] p-4 text-left transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8]"><Sparkles size={22} className="text-[#6D7A62]" aria-hidden="true" /><span className="font-semibold text-[#2D4739]">Poznaj Aleksandrę</span></a>
      </section>

      <section id="mobile-aleksandra" data-scroll-anchor="omnie" className="scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Image src="/images/about-aleksandra-v2.png" alt="Aleksandra Wejer w gabinecie" width={160} height={200} className="h-36 w-28 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#6D7A62]">Poznaj Aleksandrę</p>
            <h2 className="mt-1 text-2xl font-bold text-[#2D4739]">Aleksandra Wejer</h2>
            <p className="mt-1 text-sm font-medium text-[#55624D]">Psycholog</p>
            <p className="mt-3 text-sm leading-6 text-gray-600">Jestem magistrem psychologii, absolwentką Uniwersytetu Gdańskiego. Wspieram dzieci, młodzież, dorosłych, pary i rodziny.</p>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
          <p>Ważne jest dla mnie stworzenie spokojnej, bezpiecznej przestrzeni do rozmowy bez oceniania — z uważnością i indywidualnym podejściem do każdej osoby.</p>
          <p>Prywatnie jestem mamą dwóch chłopców, dlatego bliskie są mi również codzienne wyzwania rodzicielstwa i życia rodzinnego.</p>
        </div>
      </section>

      <section className="rounded-3xl bg-[#EEF1EB] p-5">
        <div className="flex items-center gap-4">
          <Image src={PsycholkaAssets.work} alt="PsychOLKA w gabinecie" width={96} height={96} className="h-20 w-20 object-contain" />
          <div>
            <p className="text-sm font-semibold text-[#6D7A62]">Gdzie przyjmuje?</p>
            <h2 className="mt-1 text-xl font-bold text-[#2D4739]">Dwa spokojne miejsca.</h2>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm text-[#2D4739]">
          <p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" /><span>Arthro Cure Clinic<br />Starogard Gdański</span></p>
          <p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" /><span>Centrum Zielińscy Premium<br />Nowa Wieś Rzeczna</span></p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src={PsycholkaAssets.booking.calendar} alt="PsychOLKA pomaga umówić termin" width={96} height={96} className="h-20 w-20 shrink-0 object-contain" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#6D7A62]">Umów termin</p>
            <h2 className="mt-1 text-xl font-bold text-[#2D4739]">Zobaczmy wolne terminy.</h2>
          </div>
        </div>
        <a href="#kalendarz" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E63946] px-5 py-3 font-semibold text-white transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2"><HeartHandshake size={18} aria-hidden="true" />Przejdź do rezerwacji</a>
      </section>
    </div>
  );
}
