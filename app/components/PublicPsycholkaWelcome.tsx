"use client";

import { Phone, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PsycholkaWidget from "../panel/components/PsychOLKAWidget";
import PsycholkaGreetingSequence from "../panel/components/PsycholkaGreetingSequence";
import { PSYCHOLKA_DEBUG } from "../panel/psycholka/psycholkaConfig";
import { PUBLIC_GUIDE_START_EVENT } from "./PublicPsycholkaGuide";
import PublicQuickContact from "./PublicQuickContact";
import { CHARACTER_NAME } from "../lib/branding";

const PUBLIC_WELCOME_KEY = "psycholka-public-welcome-seen";

const greetings = [
  "Dobrze, że jesteś. ❤️",
  "Miło Cię widzieć.",
  "Cześć! 😊",
  "Zapraszam.",
  "Usiądź wygodnie.",
  "Możemy zaczynać.",
  "To dobry moment.",
  "Cieszę się, że zajrzałeś.",
  "Spokojnie. Jestem tutaj.",
  "Chodź, pokażę Ci stronę.",
] as const;

const guidedMessages = [
  "Super! Chodź za mną.",
  "Pokażę Ci najważniejsze miejsca.",
  "Najpierw poznajmy gabinet.",
] as const;

function pickMessage<T extends readonly string[]>(messages: T): T[number] {
  return messages[Math.floor(Math.random() * messages.length)]!;
}

export default function PublicPsycholkaWelcome() {
  const [firstVisit, setFirstVisit] = useState(true);
  const [greeting, setGreeting] = useState<(typeof greetings)[number]>(greetings[0]);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const interactionTimer = useRef<number | null>(null);

  useEffect(() => {
    const initialiseWelcome = window.setTimeout(() => {
      const replayRequested = new URLSearchParams(window.location.search).get("psycholkaWelcome") === "1";
      const hasSeenWelcome = window.localStorage.getItem(PUBLIC_WELCOME_KEY) === "true";
      setFirstVisit(replayRequested || !hasSeenWelcome);
      if (replayRequested || !hasSeenWelcome) window.localStorage.setItem(PUBLIC_WELCOME_KEY, "true");
      setGreeting(pickMessage(greetings));
    }, 0);

    return () => {
      window.clearTimeout(initialiseWelcome);
      if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    };
  }, []);

  const showInteractionMessage = (message: string) => {
    setInteractionMessage(message);
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current);
    interactionTimer.current = window.setTimeout(() => setInteractionMessage(null), 1000);
  };

  const startGuidedJourney = () => {
    showInteractionMessage(pickMessage(guidedMessages));
    window.dispatchEvent(new Event(PUBLIC_GUIDE_START_EVENT));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = document.getElementById("omnie");
    if (!target) return;
    if (reducedMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    const start = window.scrollY;
    const destination = target.getBoundingClientRect().top + start - 16;
    const duration = 900;
    const startedAt = performance.now();
    const easeInOut = (progress: number) => progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
    const scroll = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      window.scrollTo({ top: start + (destination - start) * easeInOut(progress) });
      if (progress < 1) window.requestAnimationFrame(scroll);
    };
    window.requestAnimationFrame(scroll);
  };

  return (
    <section id="start" data-scroll-anchor="start" aria-labelledby="public-psycholka-welcome-title" className="relative min-h-screen scroll-mt-6 overflow-hidden bg-[#F9F6F1] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 md:scroll-mt-24 md:py-14">
      <button type="button" onClick={() => setIsAppInfoOpen(true)} className="absolute right-3 top-3 z-20 inline-flex max-w-28 items-center gap-1.5 rounded-xl border border-[#DCE8E2] bg-white/90 px-2 py-1.5 text-left text-[10px] font-semibold leading-3 text-[#31584F] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8] sm:right-6 sm:top-6 sm:max-w-48 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-xs sm:leading-4"><Smartphone size={13} className="shrink-0 sm:h-[17px] sm:w-[17px]" aria-hidden="true" />Aplikacja dla pacjentów<br />już powstaje ❤️</button>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center md:gap-8">
        <div className="md:hidden">{firstVisit ? <PsycholkaGreetingSequence className="public-psycholka-welcome-mobile" /> : <PsycholkaWidget context="welcome" action="wave" fallbackAction="greeting" className="public-psycholka-welcome-mobile" />}</div>
        <div className="hidden md:block">{firstVisit ? <PsycholkaGreetingSequence className="public-psycholka-welcome" /> : <PsycholkaWidget context="welcome" action="wave" fallbackAction="greeting" className="public-psycholka-welcome" />}</div>
        <div className="max-w-2xl space-y-4 md:space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2F6B5F]">Aleksandra Wejer · psycholog</p>
          <h1 id="public-psycholka-welcome-title" className="font-serif text-3xl font-semibold text-[#23332F] sm:text-5xl">{greeting}</h1>
          <p className="text-base leading-relaxed text-stone-700 md:hidden">Spokojnie. Pomogę Ci znaleźć właściwe miejsce i dogodny termin.</p>
          <p className="hidden text-lg leading-relaxed text-stone-700 md:block sm:text-xl">Jesteś na stronie Aleksandry Wejer — psychologa dla dzieci, młodzieży, dorosłych, par i rodzin.</p>
          <p className="hidden text-base leading-relaxed text-stone-600 md:block sm:text-lg">Cześć! Jestem {CHARACTER_NAME}. Jeśli chcesz, pomogę Ci odnaleźć się na stronie.</p>
          <p aria-live="polite" className={`hidden min-h-6 text-sm font-semibold text-[#31584F] transition-opacity md:block ${interactionMessage ? "opacity-100" : "opacity-0"}`}>{interactionMessage ?? " "}</p>
          {PSYCHOLKA_DEBUG && <p className="text-xs text-[#6D7A62]">Debug · wylosowany komunikat: {greeting}</p>}
        </div>
        <div className="grid w-full max-w-xl grid-cols-2 justify-center gap-3 md:grid-cols-2 md:items-start">
          <div className="relative inline-flex items-center justify-center">
            <PsycholkaWidget context="welcome" action="point_booking" fallbackAction="greeting" className="public-psycholka-point-booking" />
            <a href="#kalendarz" onClick={() => showInteractionMessage("❤️ Trzymam kciuki.")} className="relative z-10 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E63946] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#cc2f3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2">📅 Umów wizytę</a>
          </div>
          <button type="button" onClick={startGuidedJourney} className="hidden min-h-12 items-center justify-center rounded-xl border border-[#2F6B5F] bg-white px-6 py-3 font-semibold text-[#2F6B5F] transition hover:bg-[#F3F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2 md:inline-flex">🌿 Rozejrzyj się ze mną</button>
          <a href="tel:+48510777469" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2F6B5F] bg-white px-4 py-3 font-semibold text-[#2F6B5F] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2 md:hidden"><Phone size={18} aria-hidden="true" />Zadzwoń</a>
          <div className="col-span-2"><PublicQuickContact /></div>
          <a href="https://wa.me/48510777469" target="_blank" rel="noreferrer" className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1FAE57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2">📱 WhatsApp</a>
        </div>
      </div>
      {isAppInfoOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#23332F]/25 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="patient-app-title">
        <div className="relative w-full max-w-md rounded-3xl border border-[#DCE8E2] bg-white p-6 text-left shadow-2xl">
          <button type="button" onClick={() => setIsAppInfoOpen(false)} aria-label="Zamknij" className="absolute right-4 top-4 rounded-xl p-2 text-[#55624D] transition hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8]"><X size={18} aria-hidden="true" /></button>
          <div className="flex items-center gap-3 pr-10"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Smartphone size={22} aria-hidden="true" /></span><h2 id="patient-app-title" className="text-xl font-bold text-[#2D4739]">Aplikacja psychOLKA powstaje</h2></div>
          <p className="mt-5 text-sm leading-6 text-gray-600">Przygotowujemy spokojne miejsce, w którym pacjent będzie mieć pod ręką to, co potrzebne między wizytami.</p>
          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-[#55624D]">{["Dokumenty", "Historia wizyt", "Przypomnienia", "Ćwiczenia", "Materiały od psychologa", "Kontakt z gabinetem", "PsychOLKA"].map((item) => <li key={item} className="rounded-xl bg-[#F8F5F0] px-3 py-2">{item}</li>)}</ul>
        </div>
      </div>}
    </section>
  );
}
