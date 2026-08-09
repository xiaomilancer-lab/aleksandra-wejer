"use client";

import { useState } from "react";
import { getPsycholkaMemory, recordPsycholkaCompletedDay, recordPsycholkaPanelOpen, recordPsycholkaWelcomeClick, resetPsycholkaMemoryForPreview, type PsycholkaMemorySnapshot } from "../psycholka/psycholkaMemory";

export default function PsycholkaMemoryPreview() {
  const [memory, setMemory] = useState<PsycholkaMemorySnapshot | null>(null);
  const refresh = () => setMemory(getPsycholkaMemory());

  return <section className="mt-8 rounded-3xl border border-[#D5DCCF] bg-[#FCFDFB] p-6"><h2 className="text-xl font-bold text-[#2D4739]">Memory Preview</h2><p className="mt-2 text-sm text-gray-600">Wyłącznie neutralne dane lokalne PsychOLKI.</p><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => { recordPsycholkaPanelOpen(); refresh(); }} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">Symuluj otwarcie panelu</button><button type="button" onClick={() => { recordPsycholkaCompletedDay(); refresh(); }} className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]">Symuluj zamknięcie dnia</button><button type="button" onClick={() => { recordPsycholkaWelcomeClick(); refresh(); }} className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]">Kliknięto „Dobrze, że jesteś”</button><button type="button" onClick={() => { setMemory(resetPsycholkaMemoryForPreview()); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#6D7A62] hover:bg-white">Wyczyść podgląd</button></div>{memory && <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2"><MemoryLine label="Otwarcia panelu" value={memory.panelOpenCount} /><MemoryLine label="Dni z rzędu" value={memory.consecutiveDays} /><MemoryLine label="Domknięte dni" value={memory.completedDays} /><MemoryLine label="Kliknięcia powitania" value={memory.welcomeClickCount} /></dl>}</section>;
}

function MemoryLine({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-white px-4 py-3"><dt className="text-gray-500">{label}</dt><dd className="mt-1 font-bold text-[#2D4739]">{value}</dd></div>; }
