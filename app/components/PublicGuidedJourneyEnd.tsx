"use client";

import { CalendarDays, Heart, Leaf, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import PsycholkaWidget from "../panel/components/PsychOLKAWidget";
import { PUBLIC_GUIDE_START_EVENT } from "./PublicPsycholkaGuide";

export default function PublicGuidedJourneyEnd() {
  const [isGuiding, setIsGuiding] = useState(false);

  useEffect(() => {
    const enableGuide = () => setIsGuiding(true);
    window.addEventListener(PUBLIC_GUIDE_START_EVENT, enableGuide);
    return () => window.removeEventListener(PUBLIC_GUIDE_START_EVENT, enableGuide);
  }, []);

  if (!isGuiding) return null;

  return (
    <section aria-labelledby="guided-journey-end-title" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#DCE8E2] bg-[#F7FBF9] px-6 py-10 text-center shadow-sm sm:px-10">
        <PsycholkaWidget context="welcome" action="booking_choice" fallbackAction="greeting" breath className="public-psycholka-guide-end" />
        <p className="mt-3 text-lg font-medium text-[#31584F]">Dziękuję, że przeszliśmy stronę razem.</p>
        <h2 id="guided-journey-end-title" className="mt-2 font-serif text-3xl font-semibold text-[#23332F] sm:text-4xl">Czy chcesz umówić wizytę?</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <a href="#kalendarz" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E63946] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#cc2f3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2"><CalendarDays size={17} aria-hidden="true" />Umów wizytę</a>
          <a href="https://www.znanylekarz.pl/aleksandra-wejer/psycholog/starogard-gdanski" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#D4DDD7] bg-white px-4 py-3 text-sm font-semibold text-[#31584F] transition hover:bg-[#EEF6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2"><Heart size={17} aria-hidden="true" />ZnanyLekarz</a>
          <a href="#kontakt" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#D4DDD7] bg-white px-4 py-3 text-sm font-semibold text-[#31584F] transition hover:bg-[#EEF6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2"><Mail size={17} aria-hidden="true" />Wyślij wiadomość</a>
        </div>
        <div className="mt-8 border-t border-[#DCE8E2] pt-7">
          <p className="mx-auto max-w-xl whitespace-pre-line text-sm leading-6 text-stone-600">{"Pssst... ❤️\nJeżeli kiedyś założysz konto, łatwiej będzie wrócić do wizyty, sprawdzić terminy, odebrać materiały i mieć wszystko w jednym miejscu."}</p>
          <button type="button" disabled aria-disabled="true" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#C9D9D2] bg-white px-4 py-2 text-sm font-semibold text-[#52766B] disabled:cursor-not-allowed"><Leaf size={16} aria-hidden="true" />Załóż konto (wkrótce)</button>
          <p className="mt-2 text-xs text-stone-500">Konto pacjenta nie jest jeszcze dostępne — przycisk nie zbiera danych.</p>
        </div>
        <div className="mt-8 border-t border-[#DCE8E2] pt-6">
          <PsycholkaWidget context="welcome" action="goodbye" fallbackAction="greeting" className="mx-auto public-psycholka-guide-end" />
          <p className="mt-2 text-sm font-medium text-[#31584F]">Do zobaczenia. ❤️</p>
        </div>
        {/* TODO: Enable the account CTA only after Patient Auth, role checks and patient-specific RLS policies are ready. */}
      </div>
    </section>
  );
}
