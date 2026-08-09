"use client";

import { Check, Edit3, ListChecks, Plus, Save, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createPatientTaskAction,
  deletePatientTaskAction,
  updatePatientTaskAction,
} from "../../actions/patientTaskActions";
import StatusBadge from "../StatusBadge";
import type { PatientTask, PatientTaskStatus } from "../../domain";
import { formatDate } from "../../utils/formatDate";
import HeartMessageEngine from "../HeartMessageEngine";

interface PatientTasksProps {
  patientId: string;
  tasks: PatientTask[];
  onTaskSaved?: () => void;
}

interface TaskDraft {
  title: string;
  description: string;
  dueDate: string;
  status: PatientTaskStatus;
}

const emptyDraft: TaskDraft = {
  title: "",
  description: "",
  dueDate: "",
  status: "todo",
};

const taskStatusLabels: Record<PatientTaskStatus, string> = {
  todo: "Do zrobienia",
  in_progress: "W trakcie",
  completed: "Wykonane",
};

export default function PatientTasks({ patientId, tasks, onTaskSaved }: PatientTasksProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [heartMessageTrigger, setHeartMessageTrigger] = useState<number | null>(null);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  const isFormOpen = isCreating || editingTaskId !== null;

  function closeForm() {
    setDraft(emptyDraft);
    setEditingTaskId(null);
    setIsCreating(false);
    setErrorMessage(null);
  }

  function openCreateForm() {
    setDraft(emptyDraft);
    setEditingTaskId(null);
    setIsCreating(true);
    setErrorMessage(null);
  }

  function openEditForm(task: PatientTask) {
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.due_date ?? "",
      status: task.status,
    });
    setEditingTaskId(task.id);
    setIsCreating(false);
    setErrorMessage(null);
  }

  function submitTask() {
    setErrorMessage(null);

    startTransition(async () => {
      try {
        if (editingTaskId) {
          await updatePatientTaskAction(editingTaskId, patientId, draft);
        } else {
          await createPatientTaskAction({ patientId, ...draft });
        }
        closeForm();
        onTaskSaved?.();
        setHeartMessageTrigger(Date.now());
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zapisać zadania.");
      }
    });
  }

  function markCompleted(task: PatientTask) {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await updatePatientTaskAction(task.id, patientId, {
          title: task.title,
          description: task.description,
          dueDate: task.due_date,
          visitId: task.visit_id,
          status: "completed",
        });
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się zaktualizować zadania.");
      }
    });
  }

  function removeTask(taskId: string) {
    if (!window.confirm("Czy na pewno chcesz usunąć to zadanie?")) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deletePatientTaskAction(taskId, patientId);
        router.refresh();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Nie udało się usunąć zadania.");
      }
    });
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><ListChecks size={19} aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Praca między spotkaniami</p><h2 className="font-bold text-[#2D4739]">Zadania domowe</h2></div>
        </div>
        {!isFormOpen && (
          <button type="button" onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F]">
            <Plus size={18} aria-hidden="true" />
            Nowe zadanie
          </button>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-semibold text-[#2D4739]">{tasks.length} zadań</span><span className="text-gray-600">{completedCount} wykonanych · {progress}%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5E1D8]"><div className="h-full rounded-full bg-[#6D7A62] transition-all" style={{ width: `${progress}%` }} /></div>
      </div>

      {errorMessage && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
      {heartMessageTrigger && <HeartMessageEngine eventKey="task-saved" trigger={heartMessageTrigger} className="mt-5" />}

      {isFormOpen && (
        <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5">
          <p className="font-semibold text-[#2D4739]">{editingTaskId ? "Edytuj zadanie" : "Nowe zadanie"}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#2D4739] sm:col-span-2">Tytuł<input type="text" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" disabled={isPending} required /></label>
            <label className="block text-sm font-medium text-[#2D4739] sm:col-span-2">Opis<textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={5} className="mt-2 w-full resize-y rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" disabled={isPending} /></label>
            <label className="block text-sm font-medium text-[#2D4739]">Termin<input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" disabled={isPending} /></label>
            <label className="block text-sm font-medium text-[#2D4739]">Status<select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as PatientTaskStatus }))} className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" disabled={isPending}>{Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={submitTask} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F] disabled:cursor-not-allowed disabled:bg-gray-400"><Save size={17} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz"}</button>
            <button type="button" onClick={closeForm} disabled={isPending} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D4739] hover:bg-white disabled:cursor-not-allowed"><X size={17} aria-hidden="true" />Anuluj</button>
          </div>
        </div>
      )}

      {tasks.length === 0 && !isFormOpen ? (
        <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-center text-sm text-gray-500">Brak zadań domowych dla tego pacjenta.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-2xl bg-[#F8F5F0] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 className="font-semibold text-[#2D4739]">{task.title}</h3>{task.due_date && <p className="mt-1 text-xs text-gray-500">Termin: {formatDate(task.due_date)}</p>}</div>
                <div className="flex items-center gap-2"><StatusBadge status={task.status} label={taskStatusLabels[task.status]} /><button type="button" onClick={() => openEditForm(task)} disabled={isPending} aria-label={`Edytuj zadanie: ${task.title}`} className="rounded-lg p-2 text-[#6D7A62] hover:bg-white disabled:cursor-not-allowed"><Edit3 size={17} aria-hidden="true" /></button><button type="button" onClick={() => removeTask(task.id)} disabled={isPending} aria-label={`Usuń zadanie: ${task.title}`} className="rounded-lg p-2 text-red-600 hover:bg-white disabled:cursor-not-allowed"><Trash2 size={17} aria-hidden="true" /></button></div>
              </div>
              {task.description && <p className="mt-4 whitespace-pre-wrap border-t border-[#E5E1D8] pt-4 text-sm text-gray-700">{task.description}</p>}
              {task.status !== "completed" && <button type="button" onClick={() => markCompleted(task)} disabled={isPending} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-[#2D4739] transition hover:bg-[#EEF1EB] disabled:cursor-not-allowed"><Check size={17} className="text-[#3E7C49]" aria-hidden="true" />Wykonane</button>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
