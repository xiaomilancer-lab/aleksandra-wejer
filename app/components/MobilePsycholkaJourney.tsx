import Image from "next/image";
import { HeartHandshake, MapPin } from "lucide-react";
import { PsycholkaAssets } from "@/public/psycholka";
import HelpAccordion from "./HelpAccordion";

export default function MobilePsycholkaJourney() {
  return (
    <div className="space-y-4 bg-[#F9F6F1] px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:hidden">
      <section id="mobile-aleksandra" data-scroll-anchor="omnie" className="scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Image src="/images/about-aleksandra-v2.png" alt="Aleksandra Wejer w gabinecie" width={160} height={200} className="h-36 w-28 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#6D7A62]">Poznaj Aleksandrę</p>
            <h2 className="mt-1 text-2xl font-bold text-[#2D4739]">Aleksandra Wejer</h2>
            <p className="mt-1 text-sm font-medium text-[#55624D]">Psycholog</p>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
          <p>Wierzę, że każda historia zasługuje na uwagę, zrozumienie i bezpieczną przestrzeń do rozmowy.</p>
          <p>Jestem magistrem psychologii, absolwentką Wydziału Nauk Społecznych Uniwersytetu Gdańskiego. Ukończyłam specjalność z zakresu psychologii rodziny i od ponad 6 lat pracuję z dziećmi i młodzieżą, m.in. w szkołach i przedszkolach.</p>
          <p>Wspieram również osoby dorosłe oraz rodziców mierzących się z wyzwaniami codziennego życia.</p>
          <details className="group rounded-2xl bg-[#F8F5F0] px-4 py-3">
            <summary className="cursor-pointer font-semibold text-[#55624D] marker:text-[#6D7A62]">Czytaj więcej o mnie</summary>
            <div className="mt-3 space-y-3">
              <p>Doświadczenie zawodowe rozwijałam także podczas praktyk w Centrum Leczenia Uzależnień oraz w prywatnym gabinecie psychologicznym.</p>
              <p>Prywatnie jestem mamą dwójki małych dzieci. Macierzyństwo każdego dnia przypomina mi, jak ważne w relacjach są bliskość, cierpliwość, zrozumienie i poczucie bezpieczeństwa.</p>
              <p>W pracy stawiam na empatię, autentyczność i indywidualne podejście. Chcę tworzyć przestrzeń, w której można spokojnie opowiedzieć o swoich trudnościach — bez oceniania i w swoim tempie.</p>
              <p>Psychologia jest dla mnie nie tylko zawodem, ale również pasją, dlatego stale poszerzam wiedzę i rozwijam swoje kompetencje.</p>
              <p>Jeśli czujesz, że potrzebujesz rozmowy, wsparcia lub chcesz lepiej zrozumieć siebie — zapraszam.</p>
              <p className="font-medium text-[#55624D]">Bo kiedy Ty czujesz się dobrze, łatwiej zadbać o wszystko, co dla Ciebie ważne.</p>
            </div>
          </details>
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
          <p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" /><span><strong>Centrum Zielińscy Premium</strong><br />Nowa Wieś Rzeczna<br /><span className="text-[#6D7A62]">Wszystkie dni poza wtorkiem</span></span></p>
          <p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" /><span><strong>Arthro Cure Clinic</strong><br />Starogard Gdański<br /><span className="text-[#6D7A62]">Tylko we wtorki</span></span></p>
        </div>
      </section>

      <section id="mobile-pomoc" data-scroll-anchor="oferta" className="scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src={PsycholkaAssets.booking.search} alt="PsychOLKA pomaga znaleźć właściwe wsparcie" width={96} height={96} className="h-20 w-20 object-contain" />
          <div>
            <p className="text-sm font-semibold text-[#6D7A62]">W czym mogę Ci pomóc?</p>
            <h2 className="mt-1 text-2xl font-bold text-[#2D4739]">Znajdźmy dobry pierwszy krok.</h2>
          </div>
        </div>
        <div className="mt-5"><HelpAccordion /></div>
      </section>

      <section className="relative z-10 overflow-visible rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src={PsycholkaAssets.booking.calendar} alt="PsychOLKA pomaga umówić termin" width={112} height={112} className="-mt-3 h-24 w-24 shrink-0 object-contain" />
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
