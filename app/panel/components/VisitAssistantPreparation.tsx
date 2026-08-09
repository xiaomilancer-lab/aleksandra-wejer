"use client";

import { Heart, Search } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleAssistantTemplateFavoriteAction } from "../actions/assistantTemplateActions";
import type { AssistantTemplate, Visit } from "../domain";

interface VisitAssistantPreparationProps {
  visit: Visit;
  templates: AssistantTemplate[];
}

interface PreparationDraft {
  description: string;
  observationPoints: string;
  interviewChecklist: string;
  recommendedMaterials: string;
  homeworkExamples: string;
  notes: string;
  sources: string;
}

const emptyDraft: PreparationDraft = { description: "", observationPoints: "", interviewChecklist: "", recommendedMaterials: "", homeworkExamples: "", notes: "", sources: "" };

export default function VisitAssistantPreparation({ visit, templates }: VisitAssistantPreparationProps) {
  const [query, setQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PreparationDraft>(emptyDraft);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pl-PL");
    if (!normalized) return templates;
    return templates.filter((template) => [template.title, template.category, template.age_group, ...template.problem_keywords].some((value) => value.toLocaleLowerCase("pl-PL").includes(normalized)));
  }, [query, templates]);

  function selectTemplate(template: AssistantTemplate) {
    setSelectedTemplateId(template.id);
    setDraft({ description: template.description, observationPoints: template.observation_points, interviewChecklist: template.interview_checklist, recommendedMaterials: template.recommended_materials, homeworkExamples: template.homework_examples, notes: template.notes, sources: "" });
  }

  function toggleFavorite(templateId: string) {
    startTransition(async () => {
      await toggleAssistantTemplateFavoriteAction(templateId);
      router.refresh();
    });
  }

  return <div className="space-y-5"><div className="rounded-2xl bg-[#F8F5F0] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold text-[#2D4739]">🌿 Przygotowanie do wizyty</h3><p className="mt-1 text-sm text-gray-600">Pomocniczy plan pracy dla: {visit.name}</p></div><span className="text-xs text-gray-500">Nie jest to narzędzie diagnostyczne.</span></div><div className="relative mt-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj: kategoria, wiek, słowa kluczowe..." className="w-full rounded-xl border border-[#E5E1D8] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" /></div>{filteredTemplates.length === 0 ? <p className="mt-4 text-sm text-gray-500">Brak dostępnych szablonów. Dodaj je po ręcznym uruchomieniu migracji.</p> : <div className="mt-4 flex max-h-44 flex-wrap gap-2 overflow-y-auto">{filteredTemplates.map((template) => <div key={template.id} className="flex items-center rounded-xl border border-[#E5E1D8] bg-white"><button type="button" onClick={() => selectTemplate(template)} className={`rounded-l-xl px-3 py-2 text-left text-sm font-semibold ${selectedTemplateId === template.id ? "bg-[#EEF1EB] text-[#2D4739]" : "text-[#2D4739] hover:bg-[#F8F5F0]"}`}>{template.title}</button><button type="button" onClick={() => toggleFavorite(template.id)} disabled={isPending} aria-label={template.is_favorite ? `Usuń ${template.title} z ulubionych` : `Dodaj ${template.title} do ulubionych`} className="border-l border-[#E5E1D8] px-2 py-2 text-[#B7791F] hover:bg-[#FFF7E6] disabled:cursor-not-allowed"><Heart size={15} fill={template.is_favorite ? "currentColor" : "none"} aria-hidden="true" /></button></div>)}</div>}</div><PreparationField title="📌 O czym warto pamiętać" value={draft.description} onChange={(description) => setDraft((current) => ({ ...current, description }))} /><PreparationField title="👀 Obserwacja podczas spotkania" value={draft.observationPoints} onChange={(observationPoints) => setDraft((current) => ({ ...current, observationPoints }))} /><PreparationField title="❓ Propozycje pytań" value={draft.interviewChecklist} onChange={(interviewChecklist) => setDraft((current) => ({ ...current, interviewChecklist }))} /><PreparationField title="📚 Materiały" value={draft.recommendedMaterials} onChange={(recommendedMaterials) => setDraft((current) => ({ ...current, recommendedMaterials }))} /><PreparationField title="🎯 Przykładowe zadania domowe" value={draft.homeworkExamples} onChange={(homeworkExamples) => setDraft((current) => ({ ...current, homeworkExamples }))} /><PreparationField title="📝 Własne notatki psychologa" value={draft.notes} onChange={(notes) => setDraft((current) => ({ ...current, notes }))} /><PreparationField title="🔗 Źródła" value={draft.sources} onChange={(sources) => setDraft((current) => ({ ...current, sources }))} hint="Miejsce na książki, artykuły, własne materiały i linki." /><p className="rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 text-xs text-gray-500">TODO: zapisywanie przygotowania, własnych notatek i źródeł dla konkretnej wizyty wymaga osobnego modelu danych. TODO: w przyszłości można tu podłączyć wyłącznie pomocnicze sugestie oparte na wieku pacjenta i temacie zgłoszenia — bez automatycznych decyzji.</p></div>;
}

function PreparationField({ title, value, onChange, hint }: { title: string; value: string; onChange: (value: string) => void; hint?: string }) { return <section className="rounded-2xl bg-[#F8F5F0] p-5"><h3 className="font-bold text-[#2D4739]">{title}</h3>{hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} placeholder="Wybierz szablon lub wpisz własną treść..." className="mt-4 w-full resize-y rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" /></section>; }
