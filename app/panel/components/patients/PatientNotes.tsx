"use client";

import { BookOpen, Edit3, NotebookText, Plus, Save, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createPatientNoteAction,
  deletePatientNoteAction,
  updatePatientNoteAction,
} from "../../actions/patientNoteActions";
import { createPatientTaskAction } from "../../actions/patientTaskActions";
import type { PatientNote, VisitTemplate } from "../../domain";

interface PatientNotesProps {
  patientId: string;
  notes: PatientNote[];
  templates: VisitTemplate[];
  onNoteSaved?: () => void;
}

interface NoteDraft {
  title: string;
  content: string;
  homework: string;
}

const emptyDraft: NoteDraft = { title: "", content: "", homework: "" };

export default function PatientNotes({ patientId, notes, templates, onNoteSaved }: PatientNotesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormOpen = isCreating || editingNoteId !== null;

  function closeForm() {
    setIsCreating(false);
    setEditingNoteId(null);
    setIsTemplatePickerOpen(false);
    setDraft(emptyDraft);
    setErrorMessage(null);
  }

  function openCreateForm() {
    setIsCreating(true);
    setEditingNoteId(null);
    setIsTemplatePickerOpen(false);
    setDraft(emptyDraft);
    setErrorMessage(null);
  }

  function openEditForm(note: PatientNote) {
    setEditingNoteId(note.id);
    setIsCreating(false);
    setIsTemplatePickerOpen(false);
    setDraft({ title: note.title, content: note.content, homework: "" });
    setErrorMessage(null);
  }

  function applyTemplate(template: VisitTemplate) {
    setDraft({
      title: template.title,
      content: template.note_template,
      homework: template.homework_template,
    });
    setIsTemplatePickerOpen(false);
  }

  function submitNote() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        if (editingNoteId) {
          await updatePatientNoteAction(editingNoteId, patientId, draft);
        } else {
          await createPatientNoteAction({ patientId, title: draft.title, content: draft.content });
          if (draft.homework.trim()) {
            await createPatientTaskAction({
              patientId,
              title: `Zadanie domowe: ${draft.title}`,
              description: draft.homework,
              status: "todo",
            });
          }
        }
        closeForm();
        onNoteSaved?.();
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zapisać notatki.");
      }
    });
  }

  function removeNote(noteId: string) {
    if (!window.confirm("Czy na pewno chcesz usunąć tę notatkę?")) return;
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deletePatientNoteAction(noteId, patientId);
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się usunąć notatki.");
      }
    });
  }

  return (
    <section className="mt-6 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><NotebookText size={19} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Przebieg terapii</p><h2 className="font-bold text-[#2D4739]">Notatki</h2></div></div>
        {!isFormOpen && <button type="button" onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F]"><Plus size={18} aria-hidden="true" />Dodaj notatkę</button>}
      </div>

      {errorMessage && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

      {isFormOpen && <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold text-[#2D4739]">{editingNoteId ? "Edytuj notatkę" : "Nowa notatka"}</p><button type="button" onClick={() => setIsTemplatePickerOpen((open) => !open)} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-3 py-2 text-sm font-semibold text-[#2D4739] hover:bg-[#EEF1EB]"><BookOpen size={17} aria-hidden="true" />Użyj szablonu</button></div>
        {isTemplatePickerOpen && <div className="mt-4 rounded-xl border border-[#D5DCCF] bg-white p-3"><p className="px-2 pb-2 text-sm font-medium text-[#2D4739]">Wybierz szablon</p>{templates.length === 0 ? <p className="px-2 py-3 text-sm text-gray-500">Brak dostępnych szablonów.</p> : <div className="max-h-52 space-y-1 overflow-y-auto">{templates.map((template) => <button key={template.id} type="button" onClick={() => applyTemplate(template)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-[#F8F5F0]"><span><span className="block text-sm font-semibold text-[#2D4739]">{template.title}</span><span className="block text-xs text-gray-500">{template.category}</span></span>{template.is_favorite && <span aria-label="Ulubiony">⭐</span>}</button>)}</div>}</div>}
        <div className="mt-4 space-y-4"><NoteField label="Tytuł" value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} disabled={isPending} /><NoteField label="Treść" value={draft.content} onChange={(content) => setDraft((current) => ({ ...current, content }))} disabled={isPending} textarea rows={6} /><NoteField label="Zadanie domowe" value={draft.homework} onChange={(homework) => setDraft((current) => ({ ...current, homework }))} disabled={isPending} textarea rows={4} optional /></div>
        <p className="mt-2 text-xs text-gray-500">Wypełnione zadanie domowe zostanie zapisane jako nowe zadanie pacjenta wraz z notatką.</p>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={submitNote} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F] disabled:cursor-not-allowed disabled:bg-gray-400"><Save size={17} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz"}</button><button type="button" onClick={closeForm} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D4739] hover:bg-white"><X size={17} aria-hidden="true" />Anuluj</button></div>
      </div>}

      {notes.length === 0 && !isFormOpen ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-center text-sm text-gray-500">Pierwsza notatka z przebiegu terapii pojawi się tutaj.</p> : <div className="mt-6 space-y-4">{notes.map((note) => <article key={note.id} className="rounded-2xl bg-[#F8F5F0] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-semibold text-[#2D4739]">{note.title}</h3><p className="mt-1 text-xs text-gray-500">Zaktualizowano {new Date(note.updated_at).toLocaleDateString("pl-PL")}</p></div><div className="flex gap-2"><button type="button" onClick={() => openEditForm(note)} disabled={isPending} aria-label={`Edytuj notatkę: ${note.title}`} className="rounded-lg p-2 text-[#6D7A62] hover:bg-white"><Edit3 size={17} aria-hidden="true" /></button><button type="button" onClick={() => removeNote(note.id)} disabled={isPending} aria-label={`Usuń notatkę: ${note.title}`} className="rounded-lg p-2 text-red-600 hover:bg-white"><Trash2 size={17} aria-hidden="true" /></button></div></div><p className="mt-4 whitespace-pre-wrap border-t border-[#E5E1D8] pt-4 text-sm text-gray-700">{note.content}</p></article>)}</div>}
    </section>
  );
}

function NoteField({ label, value, onChange, disabled, textarea, rows, optional }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; textarea?: boolean; rows?: number; optional?: boolean }) { const className = "mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]"; return <label className="block text-sm font-medium text-[#2D4739]">{label}{optional && <span className="ml-1 font-normal text-gray-500">(opcjonalnie)</span>}{textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className={`${className} resize-y`} disabled={disabled} required={!optional} /> : <input type="text" value={value} onChange={(event) => onChange(event.target.value)} className={className} disabled={disabled} required />}</label>; }
