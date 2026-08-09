"use client";

import { Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getReflectionAction, saveReflectionAction } from "../actions/reflectionActions";
import type { Visit, VisitReflection } from "../domain";

interface VisitReflectionFormProps { visit: Visit; }

const defaultLevels = { moodLevel: 3, energyLevel: 3, engagementLevel: 3, reflection: "" };

export default function VisitReflectionForm({ visit }: VisitReflectionFormProps) {
  const [reflection, setReflection] = useState<VisitReflection | null>(null);
  const [draft, setDraft] = useState(defaultLevels);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getReflectionAction(visit.id).then((savedReflection) => {
      if (!active) return;
      setReflection(savedReflection);
      setDraft(savedReflection ? { moodLevel: savedReflection.mood_level, energyLevel: savedReflection.energy_level, engagementLevel: savedReflection.engagement_level, reflection: savedReflection.reflection } : defaultLevels);
    }).catch(() => { if (active) setErrorMessage("Nie udało się pobrać zapisanej refleksji."); });
    return () => { active = false; };
  }, [visit.id]);

  if (!visit.patient_id) return null;

  function submit() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const savedReflection = await saveReflectionAction({ visitId: visit.id, patientId: visit.patient_id!, ...draft }, reflection?.id);
        setReflection(savedReflection);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zapisać refleksji.");
      }
    });
  }

  return <section className="rounded-2xl bg-[#EEF1EB] p-5"><div><h3 className="font-bold text-[#2D4739]">🌿 Refleksja po spotkaniu</h3><p className="mt-1 text-sm text-gray-600">Prywatna obserwacja psychologa — nie jest diagnozą ani oceną.</p></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><LevelPicker label="Nastrój" value={draft.moodLevel} disabled={isPending} onChange={(moodLevel) => setDraft((current) => ({ ...current, moodLevel }))} /><LevelPicker label="Energia" value={draft.energyLevel} disabled={isPending} onChange={(energyLevel) => setDraft((current) => ({ ...current, energyLevel }))} /><LevelPicker label="Zaangażowanie" value={draft.engagementLevel} disabled={isPending} onChange={(engagementLevel) => setDraft((current) => ({ ...current, engagementLevel }))} /></div><label className="mt-5 block text-sm font-medium text-[#2D4739]">Krótka refleksja<textarea value={draft.reflection} onChange={(event) => setDraft((current) => ({ ...current, reflection: event.target.value }))} disabled={isPending} rows={4} className="mt-2 w-full resize-y rounded-xl border border-[#D5DCCF] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-white" placeholder="Własna obserwacja po spotkaniu..." /></label>{errorMessage && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}<button type="button" onClick={submit} disabled={isPending} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#58644F] disabled:cursor-not-allowed disabled:bg-gray-400"><Save size={17} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz"}</button></section>;
}

function LevelPicker({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (value: number) => void }) { return <div><p className="text-sm font-medium text-[#2D4739]">{label}</p><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((level) => <button key={level} type="button" disabled={disabled} onClick={() => onChange(level)} aria-label={`${label}: ${level} z 5`} aria-pressed={value === level} className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${value === level ? "bg-[#6D7A62] text-white" : "bg-white text-[#2D4739] hover:bg-[#DDE5D8]"}`}>{level}</button>)}</div></div>; }
