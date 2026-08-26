"use client";

import { BookOpen, Clapperboard, Copy, Download, Edit3, Pin, Plus, Printer, Save, Search, ShieldCheck, Sparkles, Trash2, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeMaterialAction, deleteKnowledgeMaterialAction, updateKnowledgeMaterialAction } from "../../actions/knowledgeLibraryActions";
import { STARTER_KNOWLEDGE_MATERIALS } from "../../data/starterKnowledgeMaterials";
import { knowledgeCategories, type KnowledgeCategory, type KnowledgeMaterial, type KnowledgeMaterialInput } from "../../domain";
import { searchKnowledgeMaterials } from "../../lib/knowledgeSearch";
import LibraryMaterialAssistant from "./LibraryMaterialAssistant";

type Audience = "Wszyscy" | "Dzieci" | "Nastolatki" | "Dorośli" | "Pary i rodziny";
type Format = "Wszystkie" | "Scenki spotkań" | "Karty pracy" | "Plan sesji" | "Gra i zabawa" | "Obrazkowe" | "Tekstowe" | "Do domu";
const audiences: Audience[] = ["Wszyscy", "Dzieci", "Nastolatki", "Dorośli", "Pary i rodziny"];
const formats: Format[] = ["Wszystkie", "Scenki spotkań", "Karty pracy", "Plan sesji", "Gra i zabawa", "Obrazkowe", "Tekstowe", "Do domu"];
const emptyDraft: KnowledgeMaterialInput = { title: "", category: "Inne", description: "", tags: [], content: "", isPinned: false };

const isStarter = (material: KnowledgeMaterial) => material.id.startsWith("starter-");
const materialText = (material: KnowledgeMaterial) => [material.title, material.category, material.description, material.content, ...material.tags].join(" ").toLocaleLowerCase("pl-PL");
function matchesAudience(material: KnowledgeMaterial, audience: Audience) {
  if (audience === "Wszyscy") return true;
  const text = materialText(material);
  if (audience === "Dzieci") return /dziec|6–|7–|8–|9–|10–|11–|12 lat/.test(text);
  if (audience === "Nastolatki") return /nastolat|12–|13–|14–|15–|16–|17–/.test(text);
  if (audience === "Dorośli") return /doros|para|rodzic/.test(text);
  return /para|rodzin/.test(text);
}
function matchesFormat(material: KnowledgeMaterial, format: Format) {
  if (format === "Wszystkie") return true;
  const text = materialText(material);
  if (format === "Scenki spotkań") return text.includes("forma:scenki") || text.includes("scenariusz zobrazowany");
  if (format === "Karty pracy") return text.includes("forma:karta-pracy");
  if (format === "Plan sesji") return text.includes("plan sesji");
  if (format === "Gra i zabawa") return text.includes("forma:gra") || text.includes("zabaw");
  if (format === "Obrazkowe") return text.includes("forma:obrazkowe") || text.includes("wizual");
  if (format === "Tekstowe") return text.includes("forma:tekst") || text.includes("arkusz");
  return text.includes("do domu") || text.includes("między spotkaniami");
}

export default function KnowledgeLibraryManager({ materials, privateLibraryAvailable = true }: { materials: KnowledgeMaterial[]; privateLibraryAvailable?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Wszystkie" | KnowledgeCategory>("Wszystkie");
  const [audience, setAudience] = useState<Audience>("Wszyscy");
  const [format, setFormat] = useState<Format>("Wszystkie");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [selected, setSelected] = useState<KnowledgeMaterial | null>(null);
  const [draft, setDraft] = useState<KnowledgeMaterialInput>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const allMaterials = useMemo(() => [...STARTER_KNOWLEDGE_MATERIALS, ...materials], [materials]);
  const filtered = useMemo(() => {
    return searchKnowledgeMaterials(allMaterials, query).filter((material) => (category === "Wszystkie" || material.category === category) && matchesAudience(material, audience) && matchesFormat(material, format) && (!pinnedOnly || material.is_pinned));
  }, [allMaterials, audience, category, format, pinnedOnly, query]);

  const closeForm = () => { setDraft(emptyDraft); setEditingId(null); setFormOpen(false); setError(null); };
  const edit = (material: KnowledgeMaterial) => {
    setDraft({ title: material.title, category: material.category, description: material.description, tags: material.tags, content: material.content, isPinned: material.is_pinned });
    setEditingId(material.id); setSelected(null); setFormOpen(true); setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const save = () => startTransition(async () => {
    try {
      const wasEditing = Boolean(editingId);
      if (editingId) await updateKnowledgeMaterialAction(editingId, draft); else await createKnowledgeMaterialAction(draft);
      setMessage(wasEditing ? "Zmiany zostały zapisane." : "Materiał został dodany do prywatnej biblioteki."); closeForm(); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się zapisać materiału."); }
  });
  const duplicate = (material: KnowledgeMaterial) => startTransition(async () => {
    try {
      await createKnowledgeMaterialAction({ title: `${material.title} — moja wersja`, category: material.category, description: material.description, tags: [...new Set([...material.tags, "moja kopia"])], content: material.content, isPinned: false });
      setSelected(null); setMessage("Kopia jest w prywatnej bibliotece i można ją edytować."); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się utworzyć kopii."); }
  });
  const remove = (id: string) => {
    if (!window.confirm("Czy na pewno usunąć ten prywatny materiał?")) return;
    startTransition(async () => { try { await deleteKnowledgeMaterialAction(id); setSelected(null); setMessage("Materiał usunięty."); router.refresh(); } catch { setError("Nie udało się usunąć materiału."); } });
  };
  const resetFilters = () => { setQuery(""); setCategory("Wszystkie"); setAudience("Wszyscy"); setFormat("Wszystkie"); setPinnedOnly(false); };
  const downloadOfflinePack = () => {
    const text = STARTER_KNOWLEDGE_MATERIALS.map((material) => `${material.title}\n${material.category}\n${material.description}\n\n${material.content}`).join(`\n\n${"=".repeat(72)}\n\n`);
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "PsychOLKA-biblioteka-offline.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  return <div className="space-y-6">
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm text-gray-500">Prywatny warsztat Aleksandry</p><h1 className="mt-1 text-2xl font-bold text-[#2D4739] sm:text-3xl">Biblioteka materiałów</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">Gotowe plany spotkań, zabawy, arkusze obrazkowe i ćwiczenia do domu. Otwieraj na telefonie, drukuj albo utwórz własną edytowalną kopię.</p></div>{!formOpen && <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 text-sm font-semibold text-white"><Plus size={18} /> Własny materiał</button>}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><Stat value={STARTER_KNOWLEDGE_MATERIALS.length} label="gotowych materiałów" /><Stat value={materials.length} label="prywatnych kopii" /><Stat value={filtered.length} label="widocznych wyników" /></div>
      {!privateLibraryAvailable && <p className="mt-4 rounded-xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">Połączenie z prywatnymi kopiami jest chwilowo niedostępne. Gotowy katalog i wyszukiwanie nadal działają lokalnie; zapisywanie wróci po odzyskaniu połączenia.</p>}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#D8E2D4] bg-[#F3F7F1] p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#2D4739]"><ShieldCheck size={18} />Rdzeń działa bez AI</p><p className="mt-1 text-xs leading-5 text-[#59685D]">{STARTER_KNOWLEDGE_MATERIALS.length} gotowych materiałów i inteligentne wyszukiwanie są częścią aplikacji. Działają również bez klucza API.</p><button type="button" onClick={downloadOfflinePack} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#CBD7C7] bg-white px-4 py-2 text-sm font-semibold text-[#2D4739]"><Download size={17} />Pobierz pakiet offline</button></div>
        <div className="rounded-2xl border border-[#E8DDBE] bg-[#FFF9EE] p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#2D4739]"><Sparkles size={18} />Warstwa AI — tylko po kliknięciu</p><p className="mt-1 text-xs leading-5 text-[#6F5732]">Hasła z wyszukiwarki pozostają lokalnie. AI otrzyma tylko neutralny temat, grupę, cel i format z gotowych list. Wynik trafi do biblioteki dopiero po decyzji Aleksandry.</p></div>
      </div>
      <button type="button" onClick={() => { setFormat("Scenki spotkań"); setPinnedOnly(false); }} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9C9A5] bg-[#FFF8E8] px-5 py-3 font-bold text-[#6F5732] sm:w-auto"><Clapperboard size={19} /> Otwórz Scenki spotkań</button>
      <div className="relative mt-4"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj: ADHD, mutyzm, żałoba, lęk, para, ćwiczenie do domu..." className="w-full rounded-xl border border-[#D9D6CD] bg-[#F8F5F0] py-3.5 pl-12 pr-4 text-base text-[#2D4739] placeholder:text-[#667085] outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" /></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Filter label="Temat" value={category} onChange={(value) => setCategory(value as typeof category)} options={["Wszystkie", ...knowledgeCategories]} /><Filter label="Dla kogo" value={audience} onChange={(value) => setAudience(value as Audience)} options={audiences} /><Filter label="Rodzaj" value={format} onChange={(value) => setFormat(value as Format)} options={formats} /><label className="flex min-h-11 items-center gap-3 rounded-xl border border-[#E5E1D8] px-4 text-sm font-medium text-[#2D4739]"><input type="checkbox" checked={pinnedOnly} onChange={(event) => setPinnedOnly(event.target.checked)} className="h-4 w-4 accent-[#6D7A62]" />Tylko przypięte</label></div>
      {(query || category !== "Wszystkie" || audience !== "Wszyscy" || format !== "Wszystkie" || pinnedOnly) && <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><X size={16} /> Wyczyść filtry</button>}
      {formOpen && <MaterialForm draft={draft} isPending={isPending || !privateLibraryAvailable} isEditing={Boolean(editingId)} onChange={setDraft} onCancel={closeForm} onSave={save} />}
      {message && <p className="mt-4 rounded-xl bg-[#EEF4EA] px-4 py-3 text-sm text-[#365342]">{message}</p>}{error && <p className="mt-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-sm text-red-700">{error}</p>}
    </section>
    <LibraryMaterialAssistant privateLibraryAvailable={privateLibraryAvailable} />
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-[#EEF1EB] p-2 text-[#6D7A62]"><BookOpen size={20} /></span><div><p className="text-sm text-gray-500">Katalog PsychOLKI</p><h2 className="font-bold text-[#2D4739]">Materiały do pracy</h2></div></div>
      {filtered.length === 0 ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-8 text-center text-sm text-gray-600">Brak wyników. Spróbuj krótszego hasła albo wyczyść filtry.</p> : <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{filtered.map((material) => <MaterialCard key={material.id} material={material} isPending={isPending} onOpen={() => setSelected(material)} onEdit={() => edit(material)} onDuplicate={() => duplicate(material)} onDelete={() => remove(material.id)} />)}</div>}
    </section>
    {selected && <MaterialPreview material={selected} isPending={isPending} onClose={() => setSelected(null)} onDuplicate={() => duplicate(selected)} onEdit={() => edit(selected)} onDelete={() => remove(selected.id)} />}
  </div>;
}

function Stat({ value, label }: { value: number; label: string }) { return <div className="rounded-2xl bg-[#F8F5F0] px-4 py-3"><strong className="text-xl text-[#2D4739]">{value}</strong><p className="text-xs text-gray-600">{label}</p></div>; }
function Filter({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) { return <label><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 text-sm font-medium text-[#2D4739] outline-none">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

function MaterialCard({ material, isPending, onOpen, onEdit, onDuplicate, onDelete }: { material: KnowledgeMaterial; isPending: boolean; onOpen: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const starter = isStarter(material);
  return <article className="flex h-full flex-col rounded-2xl border border-[#E5E1D8] bg-[#F8F5F0] p-5"><button type="button" onClick={onOpen} className="text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8]" aria-label={`Otwórz materiał: ${material.title}`}><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${starter ? "bg-[#E9F1E7] text-[#496149]" : "bg-[#FFF1D6] text-[#8B641F]"}`}>{starter ? "Gotowy" : "Prywatny"}</span>{material.is_pinned && <Pin size={15} className="text-[#B7791F]" aria-label="Przypięty" />}</div><h3 className="mt-3 text-lg font-bold leading-snug text-[#2D4739]">{material.title}</h3><p className="mt-1 text-sm font-semibold text-[#6D7A62]">{material.category}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{material.description}</p></button><div className="mt-3 flex flex-wrap gap-1.5">{material.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#55624D]">{tag}</span>)}</div><div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2"><button type="button" onClick={onOpen} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-3.5 py-2 text-sm font-semibold text-white"><BookOpen size={16} />Otwórz pełny materiał</button><button type="button" onClick={onDuplicate} disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#D9D6CD] bg-white px-3.5 py-2 text-sm font-semibold text-[#2D4739]"><Copy size={15} /> Duplikuj</button>{!starter && <div className="flex gap-1 sm:col-span-2"><IconButton label="Edytuj" onClick={onEdit} disabled={isPending}><Edit3 size={17} /></IconButton><IconButton label="Usuń" onClick={onDelete} disabled={isPending} destructive><Trash2 size={17} /></IconButton></div>}</div></article>;
}

type WorksheetKind = "emocje-potrzeby" | "termometr" | "sygnalizator" | "siec-wsparcia";

function worksheetKind(material: KnowledgeMaterial): WorksheetKind | null {
  const tag = material.tags.find((item) => item.startsWith("arkusz:"));
  if (tag === "arkusz:emocje-potrzeby") return "emocje-potrzeby";
  if (tag === "arkusz:termometr") return "termometr";
  if (tag === "arkusz:sygnalizator") return "sygnalizator";
  if (tag === "arkusz:siec-wsparcia") return "siec-wsparcia";
  return null;
}

function WorksheetContent({ kind }: { kind: WorksheetKind }) {
  if (kind === "emocje-potrzeby") {
    const emotions = ["😊 Radość", "😟 Niepokój", "😠 Złość", "😢 Smutek", "😵 Przeciążenie"];
    const needs = ["A. Bliskość", "B. Ruch", "C. Cisza i przerwa", "D. Wysłuchanie", "E. Wspólna zabawa"];
    return <WorksheetFrame instruction="Pokoloruj buźki i połącz liniami emocje z potrzebami. Możesz wybrać więcej niż jedną odpowiedź."><div className="grid gap-4 sm:grid-cols-2"><WorksheetColumn title="Co mogę czuć?" items={emotions} /><WorksheetColumn title="Czego mogę potrzebować?" items={needs} /></div><BlankPrompt label="Moja własna emocja lub potrzeba" /></WorksheetFrame>;
  }
  if (kind === "termometr") {
    return <WorksheetFrame instruction="Pokoloruj poziom napięcia. Obok zaznacz, gdzie ciało wysyła pierwszy sygnał."><div className="grid gap-6 sm:grid-cols-[0.8fr_1.2fr]"><div><h4 className="mb-3 font-bold text-[#2D4739]">Mój poziom 0–10</h4><div className="grid grid-cols-2 gap-2">{Array.from({ length: 11 }, (_, index) => 10 - index).map((level) => <div key={level} className="flex h-9 items-center justify-center rounded-lg border-2 border-[#AAB8A4] bg-white text-sm font-bold">{level}</div>)}</div></div><div className="rounded-2xl border-2 border-dashed border-[#B8C4B3] bg-white p-4"><h4 className="text-center font-bold text-[#2D4739]">Gdzie czuję napięcie?</h4><div className="mx-auto mt-4 flex h-52 w-32 flex-col items-center"><div className="h-14 w-14 rounded-full border-2 border-[#6D7A62]" /><div className="h-24 w-20 rounded-[45%] border-2 border-[#6D7A62]" /><div className="flex w-20 justify-between"><div className="h-16 w-5 rounded-b-full border-2 border-t-0 border-[#6D7A62]" /><div className="h-16 w-5 rounded-b-full border-2 border-t-0 border-[#6D7A62]" /></div></div></div></div><BlankPrompt label="Przy poziomie 4–6 pomaga mi" /><BlankPrompt label="Mój znak: potrzebuję przerwy" /></WorksheetFrame>;
  }
  if (kind === "sygnalizator") {
    const lights = [{ color: "bg-[#F7C5C5] border-[#C96B6B]", title: "STOP", prompt: "Co zauważam w ciele?" }, { color: "bg-[#F8E8A8] border-[#C4A13B]", title: "SPRAWDŹ", prompt: "Czego teraz potrzebuję?" }, { color: "bg-[#CDE7C8] border-[#6F9B68]", title: "WYBIERZ", prompt: "Jaki będzie mój mały powrót?" }];
    return <WorksheetFrame instruction="W każdym świetle narysuj symbol albo wpisz jedno zdanie. Plan może być używany w domu i w gabinecie."><div className="grid gap-4 sm:grid-cols-3">{lights.map((light) => <section key={light.title} className={`min-h-56 rounded-3xl border-2 p-4 ${light.color}`}><div className="mx-auto h-16 w-16 rounded-full border-4 border-white/80 bg-white/40" /><h4 className="mt-3 text-center font-extrabold text-[#2D4739]">{light.title}</h4><p className="mt-3 text-sm font-semibold text-[#455249]">{light.prompt}</p><div className="mt-3 h-16 rounded-xl border-2 border-dashed border-white bg-white/60" /></section>)}</div><BlankPrompt label="Osoba, która może być moim nawigatorem" /></WorksheetFrame>;
  }
  return <WorksheetFrame instruction="Wpisz imiona, symbole lub miejsca. Każdy krąg może zostać pusty, jeśli tak jest bezpieczniej."><div className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-full border-2 border-[#AAB8A4] bg-[#F8F5F0] p-8"><span className="absolute top-5 text-xs font-bold uppercase tracking-wide text-[#6D7A62]">Miejsca i osoby czasami pomocne</span><div className="flex h-3/4 w-3/4 items-center justify-center rounded-full border-2 border-[#8FA087] bg-white p-8"><span className="absolute mt-[-55%] text-xs font-bold text-[#6D7A62]">Najbliższe wsparcie</span><div className="flex h-1/2 w-1/2 items-center justify-center rounded-full border-2 border-dashed border-[#6D7A62] bg-[#EEF4EB] text-center text-sm font-bold text-[#2D4739]">JA<br />lub mój symbol</div></div></div><BlankPrompt label="Tak mogę poprosić o wsparcie" /><BlankPrompt label="Bezpieczne miejsce, do którego mogę wrócić" /></WorksheetFrame>;
}

function WorksheetFrame({ instruction, children }: { instruction: string; children: React.ReactNode }) {
  return <div className="mt-6 rounded-3xl border-2 border-[#D9E4D4] bg-[#F7FAF5] p-4 sm:p-6"><p className="mb-5 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-[#455249]">✏️ {instruction}</p>{children}</div>;
}

function WorksheetColumn({ title, items }: { title: string; items: string[] }) {
  return <section><h4 className="mb-3 font-bold text-[#2D4739]">{title}</h4><div className="grid gap-2">{items.map((item) => <div key={item} className="min-h-12 rounded-xl border-2 border-[#C8D3C3] bg-white px-4 py-3 font-semibold text-[#344A3D]">{item}</div>)}</div></section>;
}

function BlankPrompt({ label }: { label: string }) {
  return <div className="mt-5"><p className="text-sm font-bold text-[#2D4739]">{label}:</p><div className="mt-2 h-16 rounded-xl border-2 border-dashed border-[#AAB8A4] bg-white" /></div>;
}

function worksheetPrintBody(kind: WorksheetKind) {
  if (kind === "emocje-potrzeby") return `<p class="instruction">Pokoloruj buźki i połącz liniami emocje z potrzebami. Możesz wybrać więcej niż jedną odpowiedź.</p><div class="columns"><div><h2>Co mogę czuć?</h2>${["😊 Radość", "😟 Niepokój", "😠 Złość", "😢 Smutek", "😵 Przeciążenie"].map((item) => `<div class="choice">${item}</div>`).join("")}</div><div><h2>Czego mogę potrzebować?</h2>${["A. Bliskość", "B. Ruch", "C. Cisza i przerwa", "D. Wysłuchanie", "E. Wspólna zabawa"].map((item) => `<div class="choice">${item}</div>`).join("")}</div></div><div class="blank"><b>Moja własna emocja lub potrzeba:</b></div>`;
  if (kind === "termometr") return `<p class="instruction">Pokoloruj poziom napięcia. Na sylwetce zaznacz, gdzie ciało wysyła pierwszy sygnał.</p><div class="columns"><div><h2>Mój poziom 0–10</h2><div class="levels">${Array.from({ length: 11 }, (_, index) => `<span>${10 - index}</span>`).join("")}</div></div><div><h2>Gdzie czuję napięcie?</h2><div class="body-map"><div class="head"></div><div class="torso"></div><div class="legs"></div></div></div></div><div class="blank"><b>Przy poziomie 4–6 pomaga mi:</b></div><div class="blank"><b>Mój znak: potrzebuję przerwy:</b></div>`;
  if (kind === "sygnalizator") return `<p class="instruction">W każdym świetle narysuj symbol albo wpisz jedno zdanie.</p><div class="traffic"><div><i></i><h2>STOP</h2><p>Co zauważam w ciele?</p></div><div><i></i><h2>SPRAWDŹ</h2><p>Czego teraz potrzebuję?</p></div><div><i></i><h2>WYBIERZ</h2><p>Jaki będzie mój mały powrót?</p></div></div><div class="blank"><b>Osoba, która może być moim nawigatorem:</b></div>`;
  return `<p class="instruction">Wpisz imiona, symbole lub miejsca. Każdy krąg może zostać pusty.</p><div class="circles"><div class="circle outer">Miejsca i osoby czasami pomocne<div class="circle middle">Najbliższe wsparcie<div class="circle inner">JA<br>lub mój symbol</div></div></div></div><div class="blank"><b>Tak mogę poprosić o wsparcie:</b></div><div class="blank"><b>Bezpieczne miejsce, do którego mogę wrócić:</b></div>`;
}

function MaterialPreview({ material, isPending, onClose, onDuplicate, onEdit, onDelete }: { material: KnowledgeMaterial; isPending: boolean; onClose: () => void; onDuplicate: () => void; onEdit: () => void; onDelete: () => void }) {
  const starter = isStarter(material);
  const copyText = async () => { try { await navigator.clipboard.writeText(`${material.title}\n\n${material.content}`); } catch { /* embedded browser may block clipboard */ } };
  const print = () => {
    const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
    const kind = worksheetKind(material);
    const main = kind ? `<div class="worksheet">${worksheetPrintBody(kind)}</div><div class="guidance"><h2>Wskazówki dla psychologa</h2><div class="content">${escape(material.content)}</div></div>` : `<div class="content">${escape(material.content)}</div>`;
    const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escape(material.title)}</title><style>body{font-family:Arial;color:#233b30;max-width:800px;margin:32px auto;padding:0 24px;line-height:1.45}h1{font-size:27px;margin-bottom:6px}h2{font-size:17px}.meta{color:#68756b;margin-bottom:22px}.content{white-space:pre-wrap}.instruction{border:2px solid #b9c7b3;border-radius:14px;padding:14px;font-weight:700}.columns{display:grid;grid-template-columns:1fr 1fr;gap:28px}.choice{border:2px solid #9faf98;border-radius:10px;padding:11px;margin:8px 0;font-weight:700}.blank{height:70px;border-bottom:2px solid #7d8d77;margin-top:24px}.levels{display:grid;grid-template-columns:repeat(2,48px);gap:5px}.levels span{border:2px solid #899a83;text-align:center;padding:5px;font-weight:700}.body-map{display:flex;flex-direction:column;align-items:center;height:255px}.head{width:60px;height:60px;border:2px solid #65765f;border-radius:50%}.torso{width:95px;height:110px;border:2px solid #65765f;border-radius:45%}.legs{width:75px;height:75px;border-left:18px double #65765f;border-right:18px double #65765f}.traffic{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.traffic>div{min-height:230px;border:2px solid #899a83;border-radius:22px;padding:14px;text-align:center}.traffic i{display:block;width:65px;height:65px;border:4px solid #65765f;border-radius:50%;margin:0 auto 12px}.circles{display:flex;justify-content:center}.circle{border:2px solid #65765f;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700}.outer{width:430px;height:430px;flex-direction:column}.middle{width:290px;height:290px;flex-direction:column;margin-top:16px}.inner{width:135px;height:135px;margin-top:16px}.guidance{page-break-before:always;padding-top:20px}footer{margin-top:32px;padding-top:14px;border-top:1px solid #ddd;font-size:11px;color:#666}@media print{body{margin:0 auto}.worksheet{break-inside:avoid}}</style></head><body><h1>${escape(material.title)}</h1><div class="meta">${escape(material.category)} · materiał roboczy</div>${main}<footer>Materiał pomocniczy PsychOLKI do indywidualnego dostosowania przez psychologa. Nie jest narzędziem diagnostycznym.</footer><script>window.onload=()=>window.print()</script></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" })); window.open(url, "_blank", "noopener,noreferrer"); window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };
  const worksheet = worksheetKind(material);
  const illustrated = material.tags.includes("forma:scenki") || material.tags.includes("scenariusz zobrazowany");
  return <div className="fixed inset-0 z-[100] flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={material.title}><article className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#6D7A62]">{material.category} · {starter ? "gotowy materiał" : "prywatny materiał"}</p><h2 className="mt-1 text-2xl font-bold text-[#2D4739]">{material.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{material.description}</p></div><IconButton label="Zamknij" onClick={onClose} disabled={false}><X size={22} /></IconButton></div><div className="mt-5 flex flex-wrap gap-2">{material.tags.map((tag) => <span key={tag} className="rounded-full bg-[#F8F5F0] px-3 py-1 text-xs text-[#55624D]">{tag}</span>)}</div>{worksheet ? <><WorksheetContent kind={worksheet} /><details className="mt-4 rounded-2xl bg-[#F8F5F0] p-5"><summary className="cursor-pointer font-bold text-[#2D4739]">Wskazówki dla psychologa</summary><div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-800">{material.content}</div></details></> : illustrated ? <ScenarioContent content={material.content} /> : <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-[#F8F5F0] p-5 text-sm leading-7 text-gray-800 sm:p-7">{material.content}</div>}<p className="mt-4 rounded-xl bg-[#FFF9EE] px-4 py-3 text-xs leading-5 text-[#765D32]">Materiał pomocniczy do indywidualnego dostosowania przez psychologa. Nie zastępuje diagnozy, oceny bezpieczeństwa ani planu terapii.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={onDuplicate} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><Copy size={16} /> Duplikuj</button><button type="button" onClick={copyText} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Copy size={16} /> Kopiuj</button><button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Printer size={16} /> Drukuj / PDF</button>{!starter && <><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Edit3 size={16} /> Edytuj</button><button type="button" onClick={onDelete} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600"><Trash2 size={16} /> Usuń</button></>}</div></article></div>;
}

function ScenarioContent({ content }: { content: string }) {
  const cards = content.split(/\n\n+/).filter(Boolean);
  const colors = ["bg-[#F2F6EF] border-[#D9E4D4]", "bg-[#FFF7E7] border-[#ECDCB8]", "bg-[#F8F2FA] border-[#E5D6E9]", "bg-[#EEF5F7] border-[#D2E2E6]"];
  return <div className="mt-6 grid gap-3 sm:grid-cols-2">{cards.map((card, index) => { const [heading, ...body] = card.split("\n"); return <section key={`${heading}-${index}`} className={`rounded-2xl border p-5 ${colors[index % colors.length]}`}><h3 className="font-bold text-[#2D4739]">{heading}</h3>{body.length > 0 && <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#455249]">{body.join("\n")}</p>}</section>; })}</div>;
}

function MaterialForm({ draft, isPending, isEditing, onChange, onCancel, onSave }: { draft: KnowledgeMaterialInput; isPending: boolean; isEditing: boolean; onChange: (value: KnowledgeMaterialInput) => void; onCancel: () => void; onSave: () => void }) {
  const update = <K extends keyof KnowledgeMaterialInput>(key: K, value: KnowledgeMaterialInput[K]) => onChange({ ...draft, [key]: value });
  return <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5"><h2 className="font-semibold text-[#2D4739]">{isEditing ? "Edytuj prywatny materiał" : "Nowy prywatny materiał"}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Tytuł" value={draft.title} onChange={(value) => update("title", value)} disabled={isPending} /><label className="block text-sm font-medium text-[#2D4739]">Kategoria<select value={draft.category} onChange={(event) => update("category", event.target.value as KnowledgeCategory)} disabled={isPending} className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3">{knowledgeCategories.map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Opis" value={draft.description} onChange={(value) => update("description", value)} disabled={isPending} textarea /><Field label="Tagi (oddziel przecinkami)" value={draft.tags.join(", ")} onChange={(value) => update("tags", value.split(",").map((tag) => tag.trim()).filter(Boolean))} disabled={isPending} /><div className="md:col-span-2"><Field label="Treść" value={draft.content} onChange={(value) => update("content", value)} disabled={isPending} textarea rows={10} /></div><label className="flex items-center gap-3 text-sm font-medium text-[#2D4739]"><input type="checkbox" checked={draft.isPinned} onChange={(event) => update("isPinned", event.target.checked)} className="h-4 w-4 accent-[#6D7A62]" />Przypnij materiał</label></div><div className="mt-5 flex gap-3"><button type="button" onClick={onSave} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><Save size={17} />{isPending ? "Zapisywanie..." : "Zapisz"}</button><button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><X size={17} /> Anuluj</button></div></div>;
}
function Field({ label, value, onChange, disabled, textarea, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; textarea?: boolean; rows?: number }) { const classes = "mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 text-base text-[#2D4739] placeholder:text-[#667085] outline-none"; return <label className="block text-sm font-medium text-[#2D4739]">{label}{textarea ? <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`${classes} resize-y`} /> : <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={classes} />}</label>; }
function IconButton({ label, onClick, disabled, destructive, children }: { label: string; onClick: () => void; disabled: boolean; destructive?: boolean; children: React.ReactNode }) { return <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={`rounded-lg p-2 hover:bg-white ${destructive ? "text-red-600" : "text-[#6D7A62]"}`}>{children}</button>; }
