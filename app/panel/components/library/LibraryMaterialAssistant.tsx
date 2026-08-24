"use client";

import { BookOpen, Printer, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeMaterialAction } from "../../actions/knowledgeLibraryActions";
import {
  materialAgeGroups,
  materialFormats,
  materialObjectives,
  materialTopics,
  type GeneratedMaterialDraft,
  type GeneratedMaterialPackage,
  type MaterialAgeGroup,
  type MaterialFormat,
  type MaterialObjective,
  type MaterialTopic,
} from "../../domain";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function printDraft(draft: GeneratedMaterialDraft) {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return;
  popup.opener = null;
  popup.document.write(`<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escapeHtml(draft.title)}</title><style>body{font-family:Arial,sans-serif;color:#233b30;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.6}h1{font-size:28px}.meta{color:#68756b;margin-bottom:28px}.content{white-space:pre-wrap}footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#666}</style></head><body><h1>${escapeHtml(draft.title)}</h1><div class="meta">${escapeHtml(draft.category)} · materiał roboczy PsychOLKI</div><div class="content">${escapeHtml(draft.content)}</div><footer>Materiał pomocniczy do indywidualnej oceny i dostosowania przez psychologa. Nie jest narzędziem diagnostycznym ani procedurą interwencyjną.</footer><script>window.onload=()=>window.print()</script></body></html>`);
  popup.document.close();
}

export default function LibraryMaterialAssistant({ privateLibraryAvailable }: { privateLibraryAvailable: boolean }) {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState<MaterialAgeGroup>("Dziecko 9–12 lat");
  const [topic, setTopic] = useState<MaterialTopic>("Emocje i samoregulacja");
  const [objective, setObjective] = useState<MaterialObjective>("Rozpoznanie potrzeb");
  const [format, setFormat] = useState<MaterialFormat>("Kolorowe scenki obrazkowe");
  const [generated, setGenerated] = useState<GeneratedMaterialPackage | null>(null);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const generate = async () => {
    setError(null);
    setMessage(null);
    setGenerating(true);
    try {
      const response = await fetch("/api/panel/material-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageGroup, topic, objective, format }),
      });
      const payload = await response.json() as GeneratedMaterialPackage & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Nie udało się przygotować materiałów.");
      setGenerated(payload);
      setMessage("PsychOLKA przygotowała dwie robocze propozycje. Najpierw je sprawdź, potem zdecyduj, co zapisać.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "PsychOLKA AI chwilowo odpoczywa.");
    } finally {
      setGenerating(false);
    }
  };

  const save = (draft: GeneratedMaterialDraft) => startTransition(async () => {
    setError(null);
    try {
      await createKnowledgeMaterialAction({
        title: draft.title,
        category: draft.category,
        description: draft.description,
        tags: [...new Set([...draft.tags, draft.kind === "home" ? "do domu" : "do gabinetu", "PsychOLKA AI — zatwierdzone"])],
        content: draft.content,
        isPinned: false,
      });
      setSavedTitles((current) => [...current, draft.title]);
      setMessage("Zapisano w prywatnej bibliotece. Materiał możesz teraz edytować, drukować lub usunąć.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Nie udało się zapisać materiału.");
    }
  });

  return <section className="rounded-3xl border border-[#D8E2D4] bg-[#F3F7F1] p-5 shadow-[0_12px_35px_rgba(45,71,57,0.05)] sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-sm font-bold text-[#2D4739]"><Sparkles size={18} /> Opcjonalna warstwa AI</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">Spróbuj czegoś nowego</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#59685D]">Wybierz wyłącznie neutralne ustawienia. Do AI nie trafiają hasła wyszukiwarki, opis wizyty ani dane pacjenta. Nic nie zapisze się automatycznie.</p></div><span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#476351]"><ShieldCheck size={16} /> tylko dla psychologa</span></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Select label="Dla kogo" value={ageGroup} options={materialAgeGroups} onChange={(value) => setAgeGroup(value as MaterialAgeGroup)} /><Select label="Temat" value={topic} options={materialTopics} onChange={(value) => setTopic(value as MaterialTopic)} /><Select label="Cel" value={objective} options={materialObjectives} onChange={(value) => setObjective(value as MaterialObjective)} /><Select label="Format" value={format} options={materialFormats} onChange={(value) => setFormat(value as MaterialFormat)} /></div>
    <button type="button" onClick={generate} disabled={generating || isPending} className="mt-4 min-h-11 rounded-xl bg-[#6D7A62] px-5 py-2.5 text-sm font-semibold text-white disabled:bg-gray-400">{generating ? "PsychOLKA przygotowuje…" : generated ? "Więcej materiałów" : "Spróbuj czegoś nowego"}</button>
    {message && <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#365342]">{message}</p>}{error && <p className="mt-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-sm text-red-700">{error}</p>}
    {generated && <div className="mt-5"><div className="rounded-xl bg-white p-4 text-sm leading-6"><strong>Dlaczego te propozycje:</strong> {generated.summary}<br /><strong>Ważne:</strong> {generated.safetyNote}</div><div className="mt-4 grid gap-4 lg:grid-cols-2"><DraftCard label="Dla Aleksandry — podczas wizyty" draft={generated.professionalMaterial} saved={savedTitles.includes(generated.professionalMaterial.title)} disabled={isPending || !privateLibraryAvailable} onSave={() => save(generated.professionalMaterial)} /><DraftCard label="Dla pacjenta — do domu" draft={generated.homeMaterial} saved={savedTitles.includes(generated.homeMaterial.title)} disabled={isPending || !privateLibraryAvailable} onSave={() => save(generated.homeMaterial)} /></div></div>}
  </section>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-semibold text-[#2D4739]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#CBD7C7] bg-white px-3 text-base text-[#2D4739] outline-none focus:border-[#6D7A62]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function DraftCard({ label, draft, saved, disabled, onSave }: { label: string; draft: GeneratedMaterialDraft; saved: boolean; disabled: boolean; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  return <article className="rounded-2xl border border-[#D5DCCF] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#6D7A62]">{label}</p><h3 className="mt-2 font-bold text-[#2D4739]">{draft.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{draft.description}</p>{open && <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#F8F5F0] p-4 text-sm leading-7">{draft.content}</div>}<div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-3 py-2 text-sm font-semibold"><BookOpen size={16} /> {open ? "Zwiń" : "Otwórz"}</button><button type="button" onClick={() => printDraft(draft)} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-3 py-2 text-sm font-semibold"><Printer size={16} /> Drukuj</button><button type="button" onClick={onSave} disabled={disabled || saved} className="rounded-xl bg-[#6D7A62] px-3 py-2 text-sm font-semibold text-white disabled:bg-gray-400">{saved ? "Zapisano" : "Zapisz w bibliotece"}</button></div></article>;
}
