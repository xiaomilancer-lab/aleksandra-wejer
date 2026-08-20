"use client";

import { BookOpen, Copy, Edit3, Pin, Plus, Printer, Save, Search, Trash2, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeMaterialAction, deleteKnowledgeMaterialAction, updateKnowledgeMaterialAction } from "../../actions/knowledgeLibraryActions";
import { STARTER_KNOWLEDGE_MATERIALS } from "../../data/starterKnowledgeMaterials";
import { knowledgeCategories, type KnowledgeCategory, type KnowledgeMaterial, type KnowledgeMaterialInput } from "../../domain";

type Audience = "Wszyscy" | "Dzieci" | "Nastolatki" | "Dorośli" | "Pary i rodziny";
type Format = "Wszystkie" | "Plan sesji" | "Gra i zabawa" | "Obrazkowe" | "Tekstowe" | "Do domu";
const audiences: Audience[] = ["Wszyscy", "Dzieci", "Nastolatki", "Dorośli", "Pary i rodziny"];
const formats: Format[] = ["Wszystkie", "Plan sesji", "Gra i zabawa", "Obrazkowe", "Tekstowe", "Do domu"];
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
  if (format === "Plan sesji") return text.includes("plan sesji");
  if (format === "Gra i zabawa") return text.includes("forma:gra") || text.includes("zabaw");
  if (format === "Obrazkowe") return text.includes("forma:obrazkowe") || text.includes("wizual");
  if (format === "Tekstowe") return text.includes("forma:tekst") || text.includes("arkusz");
  return text.includes("do domu") || text.includes("między spotkaniami");
}

export default function KnowledgeLibraryManager({ materials }: { materials: KnowledgeMaterial[] }) {
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
    const term = query.trim().toLocaleLowerCase("pl-PL");
    return allMaterials.filter((material) => (!term || materialText(material).includes(term)) && (category === "Wszystkie" || material.category === category) && matchesAudience(material, audience) && matchesFormat(material, format) && (!pinnedOnly || material.is_pinned));
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

  return <div className="space-y-6">
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm text-gray-500">Prywatny warsztat Aleksandry</p><h1 className="mt-1 text-2xl font-bold text-[#2D4739] sm:text-3xl">Biblioteka materiałów</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">Gotowe plany spotkań, zabawy, arkusze obrazkowe i ćwiczenia do domu. Otwieraj na telefonie, drukuj albo utwórz własną edytowalną kopię.</p></div>{!formOpen && <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 text-sm font-semibold text-white"><Plus size={18} /> Własny materiał</button>}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><Stat value={STARTER_KNOWLEDGE_MATERIALS.length} label="gotowych materiałów" /><Stat value={materials.length} label="prywatnych kopii" /><Stat value={filtered.length} label="widocznych wyników" /></div>
      <div className="relative mt-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj: ADHD, mutyzm, żałoba, lęk, para, ćwiczenie do domu..." className="w-full rounded-xl border border-[#D9D6CD] bg-[#F8F5F0] py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" /></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Filter label="Temat" value={category} onChange={(value) => setCategory(value as typeof category)} options={["Wszystkie", ...knowledgeCategories]} /><Filter label="Dla kogo" value={audience} onChange={(value) => setAudience(value as Audience)} options={audiences} /><Filter label="Rodzaj" value={format} onChange={(value) => setFormat(value as Format)} options={formats} /><label className="flex min-h-11 items-center gap-3 rounded-xl border border-[#E5E1D8] px-4 text-sm font-medium text-[#2D4739]"><input type="checkbox" checked={pinnedOnly} onChange={(event) => setPinnedOnly(event.target.checked)} className="h-4 w-4 accent-[#6D7A62]" />Tylko przypięte</label></div>
      {(query || category !== "Wszystkie" || audience !== "Wszyscy" || format !== "Wszystkie" || pinnedOnly) && <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><X size={16} /> Wyczyść filtry</button>}
      {formOpen && <MaterialForm draft={draft} isPending={isPending} isEditing={Boolean(editingId)} onChange={setDraft} onCancel={closeForm} onSave={save} />}
      {message && <p className="mt-4 rounded-xl bg-[#EEF4EA] px-4 py-3 text-sm text-[#365342]">{message}</p>}{error && <p className="mt-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-sm text-red-700">{error}</p>}
    </section>
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
  return <article className="flex h-full flex-col rounded-2xl border border-[#E5E1D8] bg-[#F8F5F0] p-5"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${starter ? "bg-[#E9F1E7] text-[#496149]" : "bg-[#FFF1D6] text-[#8B641F]"}`}>{starter ? "Gotowy" : "Prywatny"}</span>{material.is_pinned && <Pin size={15} className="text-[#B7791F]" aria-label="Przypięty" />}</div><h3 className="mt-3 text-lg font-bold leading-snug text-[#2D4739]">{material.title}</h3><p className="mt-1 text-sm font-semibold text-[#6D7A62]">{material.category}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{material.description}</p><div className="mt-3 flex flex-wrap gap-1.5">{material.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#55624D]">{tag}</span>)}</div><div className="mt-auto flex flex-wrap gap-2 pt-5"><button type="button" onClick={onOpen} className="rounded-xl bg-[#6D7A62] px-3.5 py-2 text-sm font-semibold text-white">Otwórz</button><button type="button" onClick={onDuplicate} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D6CD] bg-white px-3.5 py-2 text-sm font-semibold text-[#2D4739]"><Copy size={15} /> Duplikuj</button>{!starter && <><IconButton label="Edytuj" onClick={onEdit} disabled={isPending}><Edit3 size={17} /></IconButton><IconButton label="Usuń" onClick={onDelete} disabled={isPending} destructive><Trash2 size={17} /></IconButton></>}</div></article>;
}

function MaterialPreview({ material, isPending, onClose, onDuplicate, onEdit, onDelete }: { material: KnowledgeMaterial; isPending: boolean; onClose: () => void; onDuplicate: () => void; onEdit: () => void; onDelete: () => void }) {
  const starter = isStarter(material);
  const copyText = async () => { try { await navigator.clipboard.writeText(`${material.title}\n\n${material.content}`); } catch { /* embedded browser may block clipboard */ } };
  const print = () => {
    const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
    const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escape(material.title)}</title><style>body{font-family:Arial;color:#233b30;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.55}h1{font-size:28px}.meta{color:#68756b;margin-bottom:28px}.content{white-space:pre-wrap}footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#666}</style></head><body><h1>${escape(material.title)}</h1><div class="meta">${escape(material.category)} · materiał roboczy</div><div class="content">${escape(material.content)}</div><footer>Materiał pomocniczy PsychOLKI do indywidualnego dostosowania przez psychologa. Nie jest narzędziem diagnostycznym.</footer><script>window.onload=()=>window.print()</script></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" })); window.open(url, "_blank", "noopener,noreferrer"); window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };
  return <div className="fixed inset-0 z-[100] flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={material.title}><article className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#6D7A62]">{material.category} · {starter ? "gotowy materiał" : "prywatny materiał"}</p><h2 className="mt-1 text-2xl font-bold text-[#2D4739]">{material.title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{material.description}</p></div><IconButton label="Zamknij" onClick={onClose} disabled={false}><X size={22} /></IconButton></div><div className="mt-5 flex flex-wrap gap-2">{material.tags.map((tag) => <span key={tag} className="rounded-full bg-[#F8F5F0] px-3 py-1 text-xs text-[#55624D]">{tag}</span>)}</div><div className="mt-6 whitespace-pre-wrap rounded-2xl bg-[#F8F5F0] p-5 text-sm leading-7 text-gray-800 sm:p-7">{material.content}</div><p className="mt-4 rounded-xl bg-[#FFF9EE] px-4 py-3 text-xs leading-5 text-[#765D32]">Materiał pomocniczy do indywidualnego dostosowania przez psychologa. Nie zastępuje diagnozy, oceny bezpieczeństwa ani planu terapii.</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={onDuplicate} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><Copy size={16} /> Duplikuj</button><button type="button" onClick={copyText} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Copy size={16} /> Kopiuj</button><button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Printer size={16} /> Drukuj / PDF</button>{!starter && <><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D6CD] px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><Edit3 size={16} /> Edytuj</button><button type="button" onClick={onDelete} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600"><Trash2 size={16} /> Usuń</button></>}</div></article></div>;
}

function MaterialForm({ draft, isPending, isEditing, onChange, onCancel, onSave }: { draft: KnowledgeMaterialInput; isPending: boolean; isEditing: boolean; onChange: (value: KnowledgeMaterialInput) => void; onCancel: () => void; onSave: () => void }) {
  const update = <K extends keyof KnowledgeMaterialInput>(key: K, value: KnowledgeMaterialInput[K]) => onChange({ ...draft, [key]: value });
  return <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5"><h2 className="font-semibold text-[#2D4739]">{isEditing ? "Edytuj prywatny materiał" : "Nowy prywatny materiał"}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Tytuł" value={draft.title} onChange={(value) => update("title", value)} disabled={isPending} /><label className="block text-sm font-medium text-[#2D4739]">Kategoria<select value={draft.category} onChange={(event) => update("category", event.target.value as KnowledgeCategory)} disabled={isPending} className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3">{knowledgeCategories.map((item) => <option key={item}>{item}</option>)}</select></label><Field label="Opis" value={draft.description} onChange={(value) => update("description", value)} disabled={isPending} textarea /><Field label="Tagi (oddziel przecinkami)" value={draft.tags.join(", ")} onChange={(value) => update("tags", value.split(",").map((tag) => tag.trim()).filter(Boolean))} disabled={isPending} /><div className="md:col-span-2"><Field label="Treść" value={draft.content} onChange={(value) => update("content", value)} disabled={isPending} textarea rows={10} /></div><label className="flex items-center gap-3 text-sm font-medium text-[#2D4739]"><input type="checkbox" checked={draft.isPinned} onChange={(event) => update("isPinned", event.target.checked)} className="h-4 w-4 accent-[#6D7A62]" />Przypnij materiał</label></div><div className="mt-5 flex gap-3"><button type="button" onClick={onSave} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><Save size={17} />{isPending ? "Zapisywanie..." : "Zapisz"}</button><button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D4739]"><X size={17} /> Anuluj</button></div></div>;
}
function Field({ label, value, onChange, disabled, textarea, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; textarea?: boolean; rows?: number }) { const classes = "mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none"; return <label className="block text-sm font-medium text-[#2D4739]">{label}{textarea ? <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={`${classes} resize-y`} /> : <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className={classes} />}</label>; }
function IconButton({ label, onClick, disabled, destructive, children }: { label: string; onClick: () => void; disabled: boolean; destructive?: boolean; children: React.ReactNode }) { return <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={`rounded-lg p-2 hover:bg-white ${destructive ? "text-red-600" : "text-[#6D7A62]"}`}>{children}</button>; }
