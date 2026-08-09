"use client";

import { Clock3, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { pickOptionalPsycholkaComment, pickPsycholkaMessage, psycholkaWelcomeHeaders, psycholkaWelcomeMessages } from "../psycholka/psycholkaEmotion";
import { recordPsycholkaPanelOpen, takePsycholkaMemoryMessage } from "../psycholka/psycholkaMemory";
import PsycholkaDesk from "./PsycholkaDesk";
import HeartMessageEngine from "./HeartMessageEngine";

type WelcomeHeaderProps = {
  initialNow: string;
  celebrate?: boolean;
  hasVisits?: boolean;
};

export default function WelcomeHeader({ initialNow, celebrate = false, hasVisits = true }: WelcomeHeaderProps) {
  const [now, setNow] = useState(() => new Date(initialNow));
  const [header, setHeader] = useState("Dzień dobry Aleksandro");
  const [greeting, setGreeting] = useState("Miło Cię znowu widzieć.");
  const [comment, setComment] = useState<string | null>(null);
  const [memoryMessage, setMemoryMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const chooseEmotion = window.setTimeout(() => {
      setHeader(pickPsycholkaMessage(psycholkaWelcomeHeaders));
      setGreeting(pickPsycholkaMessage(psycholkaWelcomeMessages));
      setComment(pickOptionalPsycholkaComment());
      const panelOpen = recordPsycholkaPanelOpen();
      setMemoryMessage(takePsycholkaMemoryMessage(panelOpen.memory, panelOpen.isNewDay, panelOpen.today));
    }, 0);

    return () => window.clearTimeout(chooseEmotion);
  }, []);

  const date = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E5E1D8] bg-[#2D4739] p-6 text-white shadow-[0_12px_35px_rgba(45,71,57,0.12)] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#DDE6D7]">
            <Sun size={20} aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-[0.12em]">
              {header}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting}
          </h1>
          <p className="mt-3 capitalize text-[#DDE6D7]">{date}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-[#F6F8F4]">
          <Clock3 size={18} aria-hidden="true" />
          <time dateTime={now.toISOString()} className="text-lg font-semibold">
            {time}
          </time>
        </div>
      </div>
      <div className="mt-5"><PsycholkaDesk hasVisits={hasVisits} celebrate={celebrate} />{comment && <p className="mt-2 text-sm text-[#DDE6D7]">{comment}</p>}{memoryMessage && <p className="mt-2 text-sm font-semibold text-[#F6F8F4]">{memoryMessage}</p>}<HeartMessageEngine eventKey="panel-open" className="mt-3" /></div>
    </section>
  );
}
