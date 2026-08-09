"use client";

import { Angry, Frown, Meh, Smile, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { saveMoodEntryAction } from "../actions/moodEntryActions";
import type { Mood } from "../domain";

const choices: Array<{ mood: Mood; label: string; Icon: typeof Smile }> = [{ mood: "happy", label: "Radośnie", Icon: Sparkles }, { mood: "good", label: "Dobrze", Icon: Smile }, { mood: "neutral", label: "Neutralnie", Icon: Meh }, { mood: "sad", label: "Smutno", Icon: Frown }, { mood: "angry", label: "Złość", Icon: Angry }, { mood: "anxious", label: "Niepokój", Icon: Frown }];

export default function PatientMoodCheckIn({ patientId }: { patientId: string }) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null); const [note, setNote] = useState(""); const [saved, setSaved] = useState(false); const [isPending, startTransition] = useTransition();
  const chooseMood = (mood: Mood) => { setSelectedMood(mood); setSaved(false); };
  const save = () => { if (!selectedMood) return; startTransition(async () => { await saveMoodEntryAction({ patientId, date: new Date().toISOString().slice(0, 10), mood: selectedMood, note }); setSaved(true); }); };
  return <section className="rounded-3xl border border-[#D5DCCF] bg-white p-6"><p className="text-sm text-[#55624D]">Mood Journey</p><h1 className="mt-1 text-2xl font-bold text-[#2D4739]">Jak się dziś czujesz?</h1><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{choices.map(({ mood, label, Icon }) => <button key={mood} type="button" onClick={() => chooseMood(mood)} className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition ${selectedMood === mood ? "border-[#6D7A62] bg-[#EEF1EB] text-[#2D4739]" : "border-[#E5E1D8] bg-[#FCFDFB] text-gray-600 hover:bg-[#F8F5F0]"}`}><Icon size={30} aria-hidden="true" />{label}</button>)}</div>{selectedMood && <><label className="mt-6 block text-sm font-semibold text-[#2D4739]">Co się wydarzyło? <span className="font-normal text-gray-500">(opcjonalnie)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-2xl border border-[#D5DCCF] bg-[#F8F5F0] p-3 text-sm outline-none focus:border-[#6D7A62]" /></label><button type="button" onClick={save} disabled={isPending} className="mt-4 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-gray-400">{isPending ? "Zapisywanie..." : "Zapisz samopoczucie"}</button>{saved && <p className="mt-3 text-sm text-[#3E7C49]">Dzisiejszy wpis został zapisany.</p>}</>}<p className="mt-5 text-xs text-gray-500">TODO: PsychOLKA może w przyszłości zachęcać do uzupełnienia wpisu. Nie będzie analizować odpowiedzi.</p></section>;
}
