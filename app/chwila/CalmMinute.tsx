"use client";

import { Check, Pause, Play, RefreshCw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AccountHomeLink from "@/app/components/AccountHomeLink";

const phases = [
  { label: "Spokojny wdech", seconds: 4, scale: 1.45 },
  { label: "Krótka pauza", seconds: 2, scale: 1.45 },
  { label: "Powolny wydech", seconds: 6, scale: 1 },
] as const;

const tinyIdeas = [
  "Rozluźnij ramiona i oprzyj stopy wygodnie o podłoże.",
  "Rozejrzyj się i znajdź trzy rzeczy w przyjemnym kolorze.",
  "Napij się wody i przez chwilę niczego nie przyspieszaj.",
  "Spójrz przez okno albo na coś zielonego.",
  "Zrób jedną małą rzecz, która ułatwi Ci dalszą część dnia.",
] as const;

export default function CalmMinute() {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(phases[0].seconds);
  const [round, setRound] = useState<number>(0);
  const [ideaIndex, setIdeaIndex] = useState<number>(0);
  const [shared, setShared] = useState(false);
  const phase = phases[phaseIndex];
  const complete = round >= 5;

  useEffect(() => {
    if (!running || complete) return;
    const timer = window.setTimeout(() => {
      if (secondsLeft > 1) {
        setSecondsLeft((value) => value - 1);
        return;
      }
      const nextPhase = (phaseIndex + 1) % phases.length;
      if (nextPhase === 0) {
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound >= 5) setRunning(false);
      }
      setPhaseIndex(nextPhase);
      setSecondsLeft(phases[nextPhase].seconds);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [complete, phaseIndex, round, running, secondsLeft]);

  const progress = useMemo(() => Math.min(100, (round / 5) * 100), [round]);

  function reset() {
    setRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(phases[0].seconds);
    setRound(0);
  }

  async function share() {
    const data = {
      title: "Chwila z PsychOLKĄ",
      text: "Znalazłam/em spokojną minutę z PsychOLKĄ 🌸",
      url: `${window.location.origin}/chwila`,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // Zamknięcie systemowego okna udostępniania nie wymaga komunikatu o błędzie.
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="flex flex-col gap-4 rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm text-gray-500">Działa również bez internetu</p>
            <h1 className="mt-1 text-3xl font-bold">Chwila z PsychOLKĄ 🌸</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">Prosta minuta oddechu i mała podpowiedź na teraz. Bez konta, oceniania i zapisywania odpowiedzi.</p>
          </div>
          <AccountHomeLink />
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-[#D9E1D5] bg-gradient-to-br from-[#294A3A] to-[#42614F] p-6 text-center text-white shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#DCE7DD]">Pięć spokojnych rund</p>
          <div className="mx-auto mt-8 flex h-64 items-center justify-center sm:h-72">
            <div
              className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#F7C1CB] via-[#F4D99E] to-[#B8D8C2] text-5xl shadow-[0_25px_70px_rgba(0,0,0,.24)] transition-transform duration-1000 ease-in-out sm:h-44 sm:w-44"
              style={{ transform: `scale(${running ? phase.scale : 1})` }}
              aria-hidden="true"
            >
              🌸
            </div>
          </div>
          <p className="text-2xl font-bold">{complete ? "Gotowe. Dziękuję za tę chwilę." : running ? phase.label : "Zaczynamy bez pośpiechu"}</p>
          <p className="mt-2 text-[#DFE9E1]">{complete ? "Możesz wrócić tu zawsze, kiedy masz ochotę." : running ? `${secondsLeft} · runda ${round + 1} z 5` : "To nie jest test — możesz przerwać w dowolnej chwili."}</p>
          <div className="mx-auto mt-6 h-2 max-w-lg overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#F1D598] transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {!complete && <button type="button" onClick={() => setRunning((value) => !value)} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-[#2D4739]">{running ? <Pause size={19} /> : <Play size={19} />}{running ? "Zatrzymaj" : round > 0 ? "Kontynuuj" : "Zacznij minutę"}</button>}
            <button type="button" onClick={reset} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 font-bold text-white"><RefreshCw size={18} />Od początku</button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-[1.3fr_.7fr]">
          <article className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Drobnostka na teraz</p>
            <h2 className="mt-1 text-2xl font-bold">{tinyIdeas[ideaIndex]}</h2>
            <button type="button" onClick={() => setIdeaIndex((value) => (value + 1) % tinyIdeas.length)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#EEF1EB] px-5 py-3 font-bold"><Sparkles size={18} />Pokaż inną</button>
          </article>
          <article className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Podaj dalej</p>
            <h2 className="mt-1 text-xl font-bold">Wyślij komuś spokojną minutę</h2>
            <button type="button" onClick={share} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#D5DCCF] px-5 py-3 font-bold">{shared ? <Check size={18} /> : <Share2 size={18} />}{shared ? "Gotowe" : "Udostępnij"}</button>
          </article>
        </section>
      </div>
    </main>
  );
}
