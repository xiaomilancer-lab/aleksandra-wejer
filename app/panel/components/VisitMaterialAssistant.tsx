"use client";

import { BookOpen, BrainCircuit, Library, Paperclip, Printer, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignKnowledgeMaterialToVisitAction, saveGeneratedMaterialForVisitAction } from "../actions/knowledgeLibraryActions";
import { STARTER_KNOWLEDGE_MATERIALS } from "../data/starterKnowledgeMaterials";
import {
  materialAgeGroups,
  materialFormats,
  materialObjectives,
  materialTopics,
  type GeneratedMaterialDraft,
  type GeneratedMaterialPackage,
  type KnowledgeMaterial,
  type MaterialAgeGroup,
  type MaterialFormat,
  type MaterialObjective,
  type MaterialTopic,
} from "../domain";
import { knowledgeSearchScore } from "../lib/knowledgeSearch";

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char); }
function printMaterial(material: Pick<KnowledgeMaterial, "title" | "category" | "content">) {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return;
  popup.opener = null;
  popup.document.write(`<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escapeHtml(material.title)}</title><style>body{font-family:Arial,sans-serif;color:#233b30;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.6}h1{font-size:28px}.meta{color:#68756b;margin-bottom:28px}.content{white-space:pre-wrap}footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#666}</style></head><body><h1>${escapeHtml(material.title)}</h1><div class="meta">${escapeHtml(material.category)} · materiał roboczy PsychOLKI</div><div class="content">${escapeHtml(material.content)}</div><footer>Materiał pomocniczy do indywidualnej oceny i dostosowania przez psychologa. Nie jest narzędziem diagnostycznym ani procedurą interwencyjną.</footer><script>window.onload=()=>window.print()</script></body></html>`);
  popup.document.close();
}

export default function VisitMaterialAssistant({ visitId, materials, assignedMaterials }: { visitId: number; materials: KnowledgeMaterial[]; assignedMaterials: KnowledgeMaterial[] }) {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState<MaterialAgeGroup>("Dziecko 9–12 lat");
  const [topic, setTopic] = useState<MaterialTopic>("Emocje i samoregulacja");
  const [objective, setObjective] = useState<MaterialObjective>("Rozpoznanie potrzeb");
  const [materialFormat, setMaterialFormat] = useState<MaterialFormat>("Kolorowe scenki obrazkowe");
  const [keywords, setKeywords] = useState("");
  const [goal, setGoal] = useState("");
  const [selected, setSelected] = useState<KnowledgeMaterial | null>(null);
  const [generated, setGenerated] = useState<GeneratedMaterialPackage | null>(null);
  const [assigned, setAssigned] = useState(assignedMaterials);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const suggestions = useMemo(() => {
    if (keywords.trim().length < 2) return [];
    const query = `${ageGroup} ${keywords} ${goal}`;
    return materials.map((material, index) => ({ material, index, score: knowledgeSearchScore(material, query) })).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 5).map((entry) => entry.material);
  }, [ageGroup, goal, keywords, materials]);

  const attach = (material: KnowledgeMaterial) => startTransition(async () => {
    setError(null); setMessage(null);
    try { const saved = await assignKnowledgeMaterialToVisitAction(visitId, material.id); setAssigned((current) => current.some((item) => item.id === saved.id) ? current : [saved, ...current]); setMessage("Materiał zapisany w bibliotece i przypięty do tej wizyty."); router.refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się przypiąć materiału."); }
  });
  const generate = async () => {
    setError(null); setMessage(null); setGenerated(null);
    setGenerating(true);
    try {
      const response = await fetch("/api/panel/material-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ageGroup, topic, objective, format: materialFormat }) });
      const payload = await response.json() as GeneratedMaterialPackage & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Nie udało się przygotować materiałów.");
      setGenerated(payload); setMessage("PsychOLKA przygotowała dwie robocze propozycje. Sprawdź je przed użyciem.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "PsychOLKA AI chwilowo odpoczywa."); }
    finally { setGenerating(false); }
  };
  const saveGenerated = (draft: GeneratedMaterialDraft) => startTransition(async () => {
    setError(null); setMessage(null);
    try {
      const saved = await saveGeneratedMaterialForVisitAction(visitId, { title: draft.title, category: draft.category, description: draft.description, tags: [...new Set([...draft.tags, draft.kind === "home" ? "do domu" : "do gabinetu", "PsychOLKA AI — po weryfikacji"])], content: draft.content, isPinned: false });
      setAssigned((current) => [saved, ...current]); setSavedTitles((current) => [...current, draft.title]); setMessage("Materiał zapisany i przypięty. Możesz go edytować lub usunąć w Bibliotece."); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się zapisać materiału."); }
  });

  return <section className="rounded-3xl border border-[#D5DCCF] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-gray-500">Biblioteka offline + opcjonalna pomoc AI</p><h2 className="mt-1 flex items-center gap-2 text-lg font-bold"><BrainCircuit size={21} /> Dobierz materiał do wizyty</h2></div><Link href="/panel/library" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2 text-sm font-semibold"><Library size={17} /> Otwórz Bibliotekę</Link></div>
    <div className="mt-5 rounded-2xl border border-[#CFE0D2] bg-[#F0F6F0] p-4 text-sm leading-6 text-[#355544]"><p className="flex items-center gap-2 font-bold"><ShieldCheck size={18} /> Tryb bez danych osobowych</p><p className="mt-1">Wpisuj wyłącznie anonimowe hasła. Nie podawaj imienia, nazwiska, telefonu, e-maila, szkoły, adresu, numerów dokumentów ani fragmentów notatki z wizyty.</p></div>
    {assigned.length > 0 && <div className="mt-5"><p className="text-sm font-bold">Przypięte do tej wizyty</p><div className="mt-2 flex flex-wrap gap-2">{assigned.map((material) => <button key={material.id} type="button" onClick={() => setSelected(material)} className="inline-flex items-center gap-2 rounded-xl bg-[#EEF1EB] px-3 py-2 text-left text-sm font-semibold"><Paperclip size={15} /> {material.title}</button>)}</div></div>}
    <div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Grupa<select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value as MaterialAgeGroup)} className="mt-2 min-h-12 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 outline-none focus:border-[#6D7A62]">{materialAgeGroups.map((group) => <option key={group}>{group}</option>)}</select></label><label className="text-sm font-semibold">Cel spotkania (opcjonalnie)<input value={goal} onChange={(event) => setGoal(event.target.value)} maxLength={300} placeholder="np. nazwanie potrzeb i plan szukania wsparcia" className="mt-2 min-h-12 w-full rounded-xl border border-[#D5DCCF] px-3 outline-none focus:border-[#6D7A62]" /></label></div>
    <label className="mt-4 block text-sm font-semibold">Anonimowe hasła<textarea value={keywords} onChange={(event) => setKeywords(event.target.value)} maxLength={500} rows={3} placeholder="np. dziecko 12 lat, smutek, brak wsparcia rówieśników, trudność z proszeniem o pomoc" className="mt-2 w-full resize-y rounded-xl border border-[#D5DCCF] p-3 outline-none focus:border-[#6D7A62]" /></label>
    <div className="mt-5"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">Najpierw biblioteka offline</h3><span className="text-xs text-gray-500">bez kosztu API</span></div>{keywords.trim().length < 2 ? <p className="mt-3 rounded-xl bg-[#F8F5F0] p-4 text-sm text-gray-600">Wpisz hasła, a PsychOLKA przeszuka {STARTER_KNOWLEDGE_MATERIALS.length} gotowych prac i prywatne materiały Aleksandry.</p> : suggestions.length ? <div className="mt-3 grid gap-3">{suggestions.map((material) => <article key={material.id} className="rounded-2xl border border-[#E5E1D8] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-wide text-[#6D7A62]">{material.category}</p><h4 className="mt-1 font-bold">{material.title}</h4><p className="mt-2 text-sm leading-6 text-gray-600">{material.description}</p></div><div className="flex gap-2"><button type="button" onClick={() => setSelected(material)} className="rounded-xl border border-[#D5DCCF] px-3 py-2 text-sm font-semibold">Otwórz</button><button type="button" onClick={() => attach(material)} disabled={isPending} className="rounded-xl bg-[#6D7A62] px-3 py-2 text-sm font-semibold text-white disabled:bg-gray-400">Przypnij</button></div></div></article>)}</div> : <p className="mt-3 rounded-xl bg-[#FFF9EE] p-4 text-sm text-[#765D32]">Nie znaleziono wystarczająco bliskiego materiału. Możesz poprosić PsychOLKĘ AI o dwie nowe wersje robocze.</p>}</div>
    <div className="mt-5 rounded-2xl border border-[#D5DCCF] bg-white p-4 text-sm leading-6"><p className="flex items-center gap-2 font-bold"><ShieldCheck size={18} /> Hasła i cel pozostają tylko w aplikacji</p><p className="mt-1 text-gray-600">Służą wyłącznie do lokalnego przeszukania biblioteki. PsychOLKA AI otrzyma tylko neutralne wybory z poniższych list — bez opisu wizyty i bez danych pacjenta.</p></div>
    <div className="mt-4 rounded-2xl border border-[#E8D9F3] bg-[#FBF7FE] p-4"><div className="grid gap-3 md:grid-cols-3"><SafeSelect label="Temat dla AI" value={topic} options={materialTopics} onChange={(value) => setTopic(value as MaterialTopic)} /><SafeSelect label="Cel materiału" value={objective} options={materialObjectives} onChange={(value) => setObjective(value as MaterialObjective)} /><SafeSelect label="Format" value={materialFormat} options={materialFormats} onChange={(value) => setMaterialFormat(value as MaterialFormat)} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 font-bold"><Sparkles size={18} /> PsychOLKA AI</p><p className="mt-1 text-sm text-gray-600">Używaj, gdy biblioteka offline nie wystarcza. Każdy wynik wymaga oceny Aleksandry.</p></div><button type="button" onClick={generate} disabled={generating || isPending} className="min-h-11 rounded-xl bg-[#6D7A62] px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-400">{generating ? "PsychOLKA przygotowuje…" : generated ? "Więcej materiałów" : "Spróbuj czegoś nowego"}</button></div></div>
    {message && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}{error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>}
    {generated && <div className="mt-5"><div className="rounded-xl bg-[#F8F5F0] p-4 text-sm leading-6"><strong>Dlaczego te propozycje:</strong> {generated.summary}<br /><strong>Ważne:</strong> {generated.safetyNote}</div><div className="mt-4 grid gap-4 lg:grid-cols-2"><GeneratedCard label="Dla Aleksandry — podczas wizyty" draft={generated.professionalMaterial} saved={savedTitles.includes(generated.professionalMaterial.title)} pending={isPending} onSave={() => saveGenerated(generated.professionalMaterial)} /><GeneratedCard label="Dla pacjenta — do domu" draft={generated.homeMaterial} saved={savedTitles.includes(generated.homeMaterial.title)} pending={isPending} onSave={() => saveGenerated(generated.homeMaterial)} /></div></div>}
    {selected && <div className="fixed inset-0 z-[100] flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={selected.title}><article className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#6D7A62]">{selected.category}</p><h2 className="mt-1 text-2xl font-bold">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{selected.description}</p></div><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-[#D5DCCF] px-3 py-2 font-bold">✕</button></div><div className="mt-6 whitespace-pre-wrap rounded-2xl bg-[#F8F5F0] p-5 text-sm leading-7 text-gray-800">{selected.content}</div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => printMaterial(selected)} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold"><Printer size={17} /> Drukuj / PDF</button><button type="button" onClick={() => attach(selected)} disabled={isPending} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">Przypnij do wizyty</button></div></article></div>}
  </section>;
}

function SafeSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-semibold">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 outline-none focus:border-[#6D7A62]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function GeneratedCard({ label, draft, saved, pending, onSave }: { label: string; draft: GeneratedMaterialDraft; saved: boolean; pending: boolean; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  return <article className="rounded-2xl border border-[#E5E1D8] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#6D7A62]">{label}</p><h3 className="mt-2 font-bold">{draft.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{draft.description}</p>{open && <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#F8F5F0] p-4 text-sm leading-7">{draft.content}</div>}<div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-3 py-2 text-sm font-semibold"><BookOpen size={16} /> {open ? "Zwiń" : "Otwórz"}</button><button type="button" onClick={() => printMaterial({ title: draft.title, category: draft.category, content: draft.content })} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] px-3 py-2 text-sm font-semibold"><Printer size={16} /> Drukuj</button><button type="button" onClick={onSave} disabled={pending || saved} className="rounded-xl bg-[#6D7A62] px-3 py-2 text-sm font-semibold text-white disabled:bg-gray-400">{saved ? "Zapisano" : "Zapisz i przypnij"}</button></div></article>;
}
