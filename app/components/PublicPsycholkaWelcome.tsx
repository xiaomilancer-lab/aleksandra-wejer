"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PsycholkaWidget from "../panel/components/PsychOLKAWidget";
import PsycholkaGreetingSequence from "../panel/components/PsycholkaGreetingSequence";
import { PSYCHOLKA_DEBUG } from "../panel/psycholka/psycholkaConfig";
import { PUBLIC_GUIDE_START_EVENT } from "./PublicPsycholkaGuide";
import PublicQuickContact from "./PublicQuickContact";
import { CHARACTER_NAME } from "../lib/branding";
import { PsycholkaAssets } from "@/public/psycholka";

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

const paths = [
  { icon: "🧸", label: "Szukam pomocy dla dziecka", href: "#oferta" },
  { icon: "🎒", label: "Nastolatek", href: "#oferta" },
  { icon: "❤️", label: "Dorosły", href: "#oferta" },
  { icon: "🤝", label: "Para", href: "#oferta" },
  { icon: "👩‍⚕️", label: "Chcę poznać Aleksandrę", href: "#omnie" },
  { icon: "📅", label: "Chcę od razu umówić wizytę", href: "#kalendarz" },
];

function pickMessage<T extends readonly string[]>(messages: T): T[number] {
  return messages[Math.floor(Math.random() * messages.length)]!;
}

export default function PublicPsycholkaWelcome() {
  const [firstVisit, setFirstVisit] = useState(true);
  const [greeting, setGreeting] = useState<(typeof greetings)[number]>(greetings[0]);
  const [interactionMessage, setInteractionMessage] = useState<string | null>(null);
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
    <section aria-labelledby="public-psycholka-welcome-title" className="relative min-h-screen overflow-hidden bg-[#F9F6F1] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 md:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center md:gap-8">
        <div className="md:hidden"><Image src={PsycholkaAssets.greeting} alt="PsychOLKA wita Cię na stronie" width={220} height={220} priority className="h-40 w-40 object-contain" /></div>
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
            <Image src={PsycholkaAssets.booking.calendar} alt="" width={72} height={72} className="pointer-events-none absolute bottom-0 left-3 z-0 h-16 w-16 object-contain md:hidden" />
            <PsycholkaWidget context="welcome" action="point_booking" fallbackAction="greeting" className="public-psycholka-point-booking hidden md:block" />
            <a href="#kalendarz" onClick={() => showInteractionMessage("❤️ Trzymam kciuki.")} className="relative z-10 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E63946] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#cc2f3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2">📅 Umów wizytę</a>
          </div>
          <button type="button" onClick={startGuidedJourney} className="hidden min-h-12 items-center justify-center rounded-xl border border-[#2F6B5F] bg-white px-6 py-3 font-semibold text-[#2F6B5F] transition hover:bg-[#F3F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2 md:inline-flex">🌿 Rozejrzyj się ze mną</button>
          <a href="tel:+48510777469" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2F6B5F] bg-white px-4 py-3 font-semibold text-[#2F6B5F] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2 md:hidden"><Phone size={18} aria-hidden="true" />Zadzwoń</a>
          <div className="col-span-2"><PublicQuickContact /></div>
          <a href="https://wa.me/48510777469" target="_blank" rel="noreferrer" className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1FAE57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2">📱 WhatsApp</a>
        </div>
      </div>
      <div id="public-paths" className="mx-auto mt-16 hidden w-full max-w-6xl scroll-mt-24 md:block">
        <div className="mb-6 text-center"><h2 className="font-serif text-3xl font-semibold text-[#23332F]">W czym mogę Ci pomóc?</h2><p className="mt-2 text-stone-600">Wybierz ścieżkę, a pokażę Ci właściwe miejsce.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => <Link key={path.label} href={path.href} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#9CC6B9] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2"><span aria-hidden="true" className="text-2xl">{path.icon}</span><span className="font-semibold text-[#23332F] transition group-hover:text-[#2F6B5F]">{path.label}</span></Link>)}
        </div>
      </div>
    </section>
  );
}
