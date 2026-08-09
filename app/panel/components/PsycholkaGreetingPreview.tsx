"use client";

import { useEffect, useState } from "react";
import PsycholkaDesk from "./PsycholkaDesk";
import PsycholkaMemoryPreview from "./PsycholkaMemoryPreview";
import HeartMessageEngine from "./HeartMessageEngine";
import PsycholkaWidget from "./PsychOLKAWidget";
import type { PsycholkaAction } from "../psycholka/psycholkaTypes";

type PreviewStage = "greeting" | "open_arms" | "point_booking";

const assets: { action: PreviewStage; title: string; description: string }[] = [
  { action: "greeting", title: "GREETING", description: "Pierwsze, ciepłe powitanie." },
  { action: "open_arms", title: "OPEN ARMS", description: "Gest otwartych ramion." },
  { action: "point_booking", title: "POINT BOOKING", description: "Wskazanie przycisku rezerwacji." },
];

export default function PsycholkaGreetingPreview() {
  const [sequenceKey, setSequenceKey] = useState(0);
  const [stage, setStage] = useState<PreviewStage>("greeting");
  const [rareMomentKey, setRareMomentKey] = useState<number | undefined>(undefined);
  const [heartMessageKey, setHeartMessageKey] = useState<number | undefined>(undefined);
  const [breathEnabled, setBreathEnabled] = useState(true);

  useEffect(() => {
    const openArms = window.setTimeout(() => setStage("open_arms"), 1500);
    const pointBooking = window.setTimeout(() => setStage("point_booking"), 2500);

    return () => {
      window.clearTimeout(openArms);
      window.clearTimeout(pointBooking);
    };
  }, [sequenceKey]);

  const replay = () => {
    setStage("greeting");
    setSequenceKey((value) => value + 1);
  };

  return (
    <section className="mt-8 rounded-3xl border border-[#D5DCCF] bg-[#FCFDFB] p-6">
      <h2 className="text-xl font-bold text-[#2D4739]">Greeting Sequence</h2>
      <p className="mt-2 text-sm text-gray-600">Podgląd prawdziwych assetów bez czyszczenia localStorage.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.action} className="min-w-0 rounded-2xl border border-[#E5E1D8] bg-white p-4 text-center">
            <p className="text-xs font-bold tracking-[0.1em] text-[#6D7A62]">{asset.title}</p>
            <div className="mt-3 flex min-h-40 items-center justify-center">
              <PsycholkaWidget context="welcome" action={asset.action} />
            </div>
            <p className="text-xs leading-relaxed text-gray-600">{asset.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5">
        <p className="text-xs font-bold tracking-[0.1em] text-[#6D7A62]">REAL ASSET TEST</p>
        <div className="mt-4 flex min-h-52 flex-col items-center justify-center">
          <PsycholkaWidget key={`${sequenceKey}-${stage}`} context="welcome" action={stage as PsycholkaAction} className="psycholka-onboarding-widget" />
          <p className="mt-3 text-sm font-medium text-[#55624D]">
            {stage === "greeting" ? "Greeting" : stage === "open_arms" ? "Open arms" : "Point booking"}
          </p>
        </div>
        <button type="button" onClick={replay} className="mt-4 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">
          ▶ Odtwórz pełne powitanie
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5">
        <p className="text-xs font-bold tracking-[0.1em] text-[#6D7A62]">SECRET LIFE TEST</p>
        <div className="mt-3 flex min-h-44 items-end justify-center rounded-xl bg-[#2D4739] px-5">
          <PsycholkaDesk hasVisits forceRareMoment={rareMomentKey} />
        </div>
        <button type="button" onClick={() => setRareMomentKey(Date.now())} className="mt-4 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">
          ▶ Random Rare Moment
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5">
        <p className="text-xs font-bold tracking-[0.1em] text-[#6D7A62]">BREATH ENGINE TEST</p>
        <div className="mt-3 flex min-h-44 items-center justify-center rounded-xl bg-[#F8F5F0]">
          <PsycholkaWidget context="today" action="idle" breath={breathEnabled} />
        </div>
        <button type="button" onClick={() => setBreathEnabled((enabled) => !enabled)} className="mt-4 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">
          Breath {breathEnabled ? "ON" : "OFF"}
        </button>
      </div>
      <PsycholkaMemoryPreview />
      <section className="mt-8 rounded-3xl border border-[#D5DCCF] bg-white p-5">
        <p className="text-xs font-bold tracking-[0.1em] text-[#6D7A62]">HEART MESSAGE TEST</p>
        <div className="mt-4 min-h-11"><HeartMessageEngine eventKey="dev-heart-message" trigger={heartMessageKey} force /></div>
        <button type="button" onClick={() => setHeartMessageKey(Date.now())} className="mt-3 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">
          ▶ Losuj miłą wiadomość
        </button>
      </section>
    </section>
  );
}
