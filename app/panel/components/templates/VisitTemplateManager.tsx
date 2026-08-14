"use client";

import {
  BookOpenCheck,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Heart,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { type ReactNode, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createTemplateAction,
  deleteTemplateAction,
  updateTemplateAction,
} from "../../actions/templateActions";
import type { VisitTemplate, VisitTemplateInput } from "../../domain";
import {
  STARTER_TEMPLATE_SOURCES,
  STARTER_VISIT_TEMPLATES,
  type StarterVisitTemplate,
} from "../../data/starterVisitTemplates";

interface VisitTemplateManagerProps {
  templates: VisitTemplate[];
  favoriteTemplates: VisitTemplate[];
}

const emptyDraft: VisitTemplateInput = {
  title: "",
  category: "",
  description: "",
  noteTemplate: "",
  homeworkTemplate: "",
  isFavorite: false,
};

export default function VisitTemplateManager({
  templates,
  favoriteTemplates,
}: VisitTemplateManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [starterQuery, setStarterQuery] = useState("");
  const [draft, setDraft] = useState<VisitTemplateInput>(emptyDraft);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pl-PL");
    if (!normalizedQuery) return templates;
    return templates.filter((template) =>
      [template.title, template.category].some((value) =>
        value.toLocaleLowerCase("pl-PL").includes(normalizedQuery)
      )
    );
  }, [query, templates]);

  const filteredStarterTemplates = useMemo(() => {
    const normalizedQuery = starterQuery.trim().toLocaleLowerCase("pl-PL");
    if (!normalizedQuery) return STARTER_VISIT_TEMPLATES;

    return STARTER_VISIT_TEMPLATES.filter((template) =>
      [template.title, template.category, template.ageGroup, ...template.keywords].some((value) =>
        value.toLocaleLowerCase("pl-PL").includes(normalizedQuery)
      )
    );
  }, [starterQuery]);

  function isStarterImported(starter: StarterVisitTemplate) {
    return templates.some(
      (template) =>
        template.title.trim().toLocaleLowerCase("pl-PL") ===
          starter.title.trim().toLocaleLowerCase("pl-PL") &&
        template.category.trim().toLocaleLowerCase("pl-PL") ===
          starter.category.trim().toLocaleLowerCase("pl-PL")
    );
  }

  function importStarterTemplate(starter: StarterVisitTemplate) {
    if (isStarterImported(starter)) return;

    setErrorMessage(null);
    startTransition(async () => {
      try {
        await createTemplateAction({
          title: starter.title,
          category: starter.category,
          description: starter.description,
          noteTemplate: starter.noteTemplate,
          homeworkTemplate: starter.homeworkTemplate,
          isFavorite: starter.isFavorite,
        });
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Nie udało się dodać szablonu startowego."
        );
      }
    });
  }

  function closeForm() {
    setDraft(emptyDraft);
    setEditingTemplateId(null);
    setIsFormOpen(false);
    setErrorMessage(null);
  }

  function openCreateForm() {
    setDraft(emptyDraft);
    setEditingTemplateId(null);
    setIsFormOpen(true);
    setErrorMessage(null);
  }

  function openEditForm(template: VisitTemplate) {
    setDraft(toDraft(template));
    setEditingTemplateId(template.id);
    setIsFormOpen(true);
    setErrorMessage(null);
  }

  function submitTemplate() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (editingTemplateId) {
          await updateTemplateAction(editingTemplateId, draft);
        } else {
          await createTemplateAction(draft);
        }
        closeForm();
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zapisać szablonu.");
      }
    });
  }

  function duplicateTemplate(template: VisitTemplate) {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await createTemplateAction({
          ...toDraft(template),
          title: `${template.title} (kopia)`,
          isFavorite: false,
        });
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się skopiować szablonu.");
      }
    });
  }

  function removeTemplate(template: VisitTemplate) {
    if (!window.confirm(`Czy na pewno chcesz usunąć szablon „${template.title}”?`)) return;

    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deleteTemplateAction(template.id);
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się usunąć szablonu.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Materiały do spokojnego przygotowania i prowadzenia spotkań</p>
            <h1 className="mt-1 text-2xl font-bold text-[#2D4739]">Szablony pracy</h1>
          </div>
          {!isFormOpen && (
            <button type="button" onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F]">
              <Plus size={18} aria-hidden="true" />
              Nowy szablon
            </button>
          )}
        </div>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj po nazwie lub kategorii..." className="w-full rounded-xl border border-[#E5E1D8] bg-[#F8F5F0] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        </div>

        {errorMessage && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

        {isFormOpen && (
          <TemplateForm draft={draft} isPending={isPending} isEditing={editingTemplateId !== null} onChange={setDraft} onCancel={closeForm} onSubmit={submitTemplate} />
        )}
      </section>

      <section className="rounded-3xl border border-[#D8DDD4] bg-[#F7FAF5] p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
        <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-[#42564A]">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#6D7A62]" size={21} aria-hidden="true" />
          <p>
            <strong>Bezpieczna biblioteka startowa.</strong> To autorskie materiały pomocnicze do
            rozmowy i planowania spotkania — nie są testami diagnostycznymi, nie zastępują oceny
            klinicznej ani lokalnych procedur bezpieczeństwa. Po dodaniu możesz zmienić każde słowo.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#E7EFE4] p-2.5 text-[#52705D]">
              <BookOpenCheck size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Autorskie scenariusze PsychOLKI</p>
              <h2 className="font-bold text-[#2D4739]">Biblioteka startowa</h2>
            </div>
          </div>
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            <input
              type="search"
              value={starterQuery}
              onChange={(event) => setStarterQuery(event.target.value)}
              placeholder="ADHD, żałoba, para, nastolatek…"
              className="w-full rounded-xl border border-[#D8DDD4] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#E7EFE4]"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {filteredStarterTemplates.map((starter) => {
            const imported = isStarterImported(starter);
            return (
              <article key={starter.id} className="flex flex-col rounded-2xl border border-[#DDE4D9] bg-white p-5">
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#617467]">
                  <span className="rounded-full bg-[#EEF3EB] px-3 py-1">{starter.category}</span>
                  <span className="rounded-full bg-[#FFF7E6] px-3 py-1 text-[#9A681C]">{starter.ageGroup}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#2D4739]">{starter.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{starter.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {starter.keywords.slice(0, 5).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-[#F8F5F0] px-2.5 py-1 text-xs text-gray-600">
                      {keyword}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => importStarterTemplate(starter)}
                  disabled={isPending || imported}
                  className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    imported
                      ? "border border-[#CFD8CB] bg-[#F3F7F1] text-[#56705E]"
                      : "bg-[#6D7A62] text-white hover:bg-[#58644F] disabled:bg-gray-400"
                  }`}
                >
                  {imported ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                  {imported ? "Dodano do moich" : "Dodaj do moich szablonów"}
                </button>
              </article>
            );
          })}
        </div>

        {filteredStarterTemplates.length === 0 && (
          <p className="mt-5 rounded-2xl bg-white px-4 py-6 text-center text-sm text-gray-500">
            Nie znaleziono pasującego materiału startowego.
          </p>
        )}

        <details className="mt-5 rounded-2xl border border-[#DDE4D9] bg-white p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-[#2D4739]">Podstawy merytoryczne i dalsza lektura</summary>
          <p className="mt-3 text-gray-600">
            Scenariusze są napisane od zera. Ich zasady bezpieczeństwa i organizacji pracy oparto na
            aktualnych zaleceniach instytucji publicznych i zawodowych:
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {STARTER_TEMPLATE_SOURCES.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-[#56705E] underline-offset-4 hover:underline">
                  {source.label}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#FFF7E6] p-2.5 text-[#B7791F]"><Heart size={19} fill="currentColor" aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Najczęściej używane</p><h2 className="font-bold text-[#2D4739]">Ulubione szablony</h2></div>
        </div>
        {favoriteTemplates.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-sm text-gray-500">Nie masz jeszcze ulubionych szablonów.</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteTemplates.map((template) => <FavoriteTemplate key={template.id} template={template} onUse={() => openEditForm(template)} />)}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
        <h2 className="font-bold text-[#2D4739]">Wszystkie szablony</h2>
        {filteredTemplates.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-6 text-center text-sm text-gray-500">{templates.length === 0 ? "Nie masz jeszcze żadnych szablonów." : "Nie znaleziono pasujących szablonów."}</p>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredTemplates.map((template) => <TemplateCard key={template.id} template={template} isPending={isPending} onEdit={() => openEditForm(template)} onDuplicate={() => duplicateTemplate(template)} onDelete={() => removeTemplate(template)} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function TemplateForm({ draft, isPending, isEditing, onChange, onCancel, onSubmit }: { draft: VisitTemplateInput; isPending: boolean; isEditing: boolean; onChange: (draft: VisitTemplateInput) => void; onCancel: () => void; onSubmit: () => void }) {
  const update = (field: keyof VisitTemplateInput, value: string | boolean) => onChange({ ...draft, [field]: value });
  return <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5"><p className="font-semibold text-[#2D4739]">{isEditing ? "Edytuj szablon" : "Nowy szablon"}</p><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Nazwa" value={draft.title} onChange={(value) => update("title", value)} required disabled={isPending} /><Field label="Kategoria" value={draft.category} onChange={(value) => update("category", value)} required disabled={isPending} /><Field label="Opis" value={draft.description} onChange={(value) => update("description", value)} disabled={isPending} textarea /><Field label="Szablon notatki" value={draft.noteTemplate} onChange={(value) => update("noteTemplate", value)} disabled={isPending} textarea /><div className="md:col-span-2"><Field label="Szablon zadania domowego" value={draft.homeworkTemplate} onChange={(value) => update("homeworkTemplate", value)} disabled={isPending} textarea /></div><label className="flex items-center gap-3 text-sm font-medium text-[#2D4739]"><input type="checkbox" checked={draft.isFavorite} onChange={(event) => update("isFavorite", event.target.checked)} disabled={isPending} className="h-4 w-4 accent-[#6D7A62]" />Ulubiony szablon</label></div><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={onSubmit} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#58644F] disabled:bg-gray-400"><Save size={17} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz"}</button><button type="button" onClick={onCancel} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D4739] hover:bg-white"><X size={17} aria-hidden="true" />Anuluj</button></div></div>;
}

function Field({ label, value, onChange, disabled, required, textarea }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; required?: boolean; textarea?: boolean }) { const className = "mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]"; return <label className="block text-sm font-medium text-[#2D4739]">{label}{textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} rows={4} className={`${className} resize-y`} /> : <input type="text" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} required={required} className={className} />}</label>; }

function FavoriteTemplate({ template, onUse }: { template: VisitTemplate; onUse: () => void }) { return <button type="button" onClick={onUse} className="rounded-2xl bg-[#F8F5F0] p-4 text-left transition hover:bg-[#EEF1EB]"><p className="font-semibold text-[#2D4739]">{template.title}</p><p className="mt-1 text-sm text-gray-500">{template.category}</p></button>; }

function TemplateCard({ template, isPending, onEdit, onDuplicate, onDelete }: { template: VisitTemplate; isPending: boolean; onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) { return <article className="rounded-2xl bg-[#F8F5F0] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[#2D4739]">{template.title}</h3>{template.is_favorite && <Heart size={16} className="text-[#B7791F]" fill="currentColor" aria-label="Ulubiony" />}</div><p className="mt-1 text-sm font-medium text-[#6D7A62]">{template.category}</p>{template.description && <p className="mt-3 text-sm text-gray-600">{template.description}</p>}</div><div className="flex gap-1"><IconButton label="Edytuj" onClick={onEdit} disabled={isPending}><Edit3 size={17} /></IconButton><IconButton label="Duplikuj" onClick={onDuplicate} disabled={isPending}><Copy size={17} /></IconButton><IconButton label="Usuń" onClick={onDelete} disabled={isPending} destructive><Trash2 size={17} /></IconButton></div></div></article>; }

function IconButton({ label, onClick, disabled, destructive, children }: { label: string; onClick: () => void; disabled: boolean; destructive?: boolean; children: ReactNode }) { return <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={`rounded-lg p-2 hover:bg-white disabled:cursor-not-allowed ${destructive ? "text-red-600" : "text-[#6D7A62]"}`}>{children}</button>; }

function toDraft(template: VisitTemplate): VisitTemplateInput { return { title: template.title, category: template.category, description: template.description, noteTemplate: template.note_template, homeworkTemplate: template.homework_template, isFavorite: template.is_favorite }; }
