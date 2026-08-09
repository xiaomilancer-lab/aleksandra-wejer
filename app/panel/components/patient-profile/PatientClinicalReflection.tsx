"use client";

import { Pin, Save, Star } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { saveReflectionCardAction } from "../../actions/clinicalReflectionActions";
import type { ReflectionCard, ReflectionCardCategory } from "../../domain";

const sections: { category: ReflectionCardCategory; title: string }[] = [
  { category: "observations", title: "Najważniejsze obserwacje" },
  { category: "return_to", title: "Tematy wymagające powrotu" },
  { category: "strengths", title: "Mocne strony pacjenta" },
  { category: "work_areas", title: "Obszary do dalszej pracy" },
  { category: "next_questions", title: "Pytania na następną wizytę" },
];

export default function PatientClinicalReflection({ patientId, cards }: { patientId: string; cards: ReflectionCard[] }) {
  const [isPending, startTransition] = useTransition();
  const initialCards = useMemo(() => Object.fromEntries(sections.map((section) => [section.category, cards.find((card) => card.category === section.category)])) as Partial<Record<ReflectionCardCategory, ReflectionCard>>, [cards]);
  const [cardByCategory, setCardByCategory] = useState(initialCards);
  const [contentByCategory, setContentByCategory] = useState<Partial<Record<ReflectionCardCategory, string>>>(() => Object.fromEntries(sections.map((section) => [section.category, initialCards[section.category]?.content ?? ""])));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function saveSection(category: ReflectionCardCategory, changes?: Partial<Pick<ReflectionCard, "is_important" | "is_pinned_to_next_visit">>) {
    const existingCard = cardByCategory[category];
    const section = sections.find((item) => item.category === category)!;
    const isImportant = changes?.is_important ?? existingCard?.is_important ?? false;
    const isPinnedToNextVisit = changes?.is_pinned_to_next_visit ?? existingCard?.is_pinned_to_next_visit ?? false;
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const savedCard = await saveReflectionCardAction({ patientId, title: existingCard?.title || section.title, content: contentByCategory[category] ?? "", category, isImportant, isPinnedToNextVisit }, existingCard?.id);
        setCardByCategory((current) => ({ ...current, [category]: savedCard }));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zapisać refleksji.");
      }
    });
  }

  return <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]"><div><p className="text-sm text-gray-500">Prywatne uporządkowanie informacji po spotkaniach</p><h2 className="mt-1 font-bold text-[#2D4739]">🌿 Refleksja</h2><p className="mt-2 text-sm text-gray-600">To nie jest diagnoza ani propozycja rozpoznania. Treść pozostaje narzędziem roboczym psychologa.</p></div>{errorMessage && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}<div className="mt-6 space-y-4">{sections.map((section) => { const card = cardByCategory[section.category]; return <article key={section.category} className="rounded-2xl bg-[#F8F5F0] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-2"><h3 className="font-semibold text-[#2D4739]">{section.title}</h3>{card?.is_important && <Star size={16} fill="currentColor" className="text-[#B7791F]" aria-label="Ważne" />}{card?.is_pinned_to_next_visit && <Pin size={16} className="text-[#6D7A62]" aria-label="Przypięto do następnej wizyty" />}</div><div className="flex gap-1"><button type="button" disabled={isPending} onClick={() => saveSection(section.category, { is_important: !(card?.is_important ?? false) })} aria-label={card?.is_important ? "Usuń oznaczenie ważne" : "Oznacz jako ważne"} className={`rounded-lg p-2 hover:bg-white ${card?.is_important ? "text-[#B7791F]" : "text-gray-500"}`}><Star size={17} fill={card?.is_important ? "currentColor" : "none"} /></button><button type="button" disabled={isPending} onClick={() => saveSection(section.category, { is_pinned_to_next_visit: !(card?.is_pinned_to_next_visit ?? false) })} aria-label={card?.is_pinned_to_next_visit ? "Odepnij od następnej wizyty" : "Przypnij do następnej wizyty"} className={`rounded-lg p-2 hover:bg-white ${card?.is_pinned_to_next_visit ? "text-[#6D7A62]" : "text-gray-500"}`}><Pin size={17} /></button></div></div><textarea value={contentByCategory[section.category] ?? ""} onChange={(event) => setContentByCategory((current) => ({ ...current, [section.category]: event.target.value }))} rows={4} placeholder="Wpisz prywatną refleksję..." disabled={isPending} className="mt-4 w-full resize-y rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" /><button type="button" disabled={isPending} onClick={() => saveSection(section.category)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-3 py-2 text-sm font-semibold text-white hover:bg-[#58644F] disabled:bg-gray-400"><Save size={16} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz"}</button></article>; })}</div><section className="mt-6 rounded-2xl border border-dashed border-[#D5DCCF] bg-[#EEF1EB] p-5"><h3 className="font-bold text-[#2D4739]">🤖 AI Reflection</h3><p className="mt-2 text-sm text-[#55624D]">W przyszłości w tym miejscu pojawią się propozycje uporządkowania informacji przygotowane przez AI.</p><p className="mt-3 text-xs text-gray-500">TODO: zachować pomocniczy charakter podpowiedzi; nie mogą one sugerować rozpoznania ani podejmować decyzji.</p></section></section>;
}
