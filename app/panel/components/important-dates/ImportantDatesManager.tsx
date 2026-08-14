"use client";

import { CalendarHeart, Check, Edit3, Gift, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { completeImportantDateAction, deleteImportantDateAction, saveImportantDateAction } from "../../actions/importantDateActions";
import type { ImportantDate, ImportantDateInput, ImportantDateOccasion, ImportantDateOccurrence } from "../../domain";

const occasionLabels: Record<ImportantDateOccasion, string> = { birthday: "Urodziny", anniversary: "Rocznica", holiday: "Święto", celebration: "Świętowanie", other: "Inna okazja" };
const reminderOptions = [30, 14, 7, 1, 0];
const emptyDraft: ImportantDateInput = { title: "", personName: "", occasion: "birthday", eventDate: "", recursYearly: true, reminderDays: [14, 7, 1], giftNotes: "", notes: "" };

export default function ImportantDatesManager({ initialOccurrences }: { initialOccurrences: ImportantDateOccurrence[] }) {
  const [occurrences, setOccurrences] = useState(initialOccurrences);
  const [draft, setDraft] = useState<ImportantDateInput>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const refresh = () => window.location.reload();
  const openNew = () => { setDraft(emptyDraft); setEditingId(null); setError(""); setFormOpen(true); };
  const edit = (item: ImportantDate) => { setDraft({ title: item.title, personName: item.person_name, occasion: item.occasion, eventDate: item.event_date, recursYearly: item.recurs_yearly, reminderDays: item.reminder_days, giftNotes: item.gift_notes, notes: item.notes }); setEditingId(item.id); setError(""); setFormOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const close = () => { setFormOpen(false); setEditingId(null); setError(""); };

  const save = () => startTransition(async () => {
    try { await saveImportantDateAction(editingId, draft); close(); refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Nie udało się zapisać daty."); }
  });

  const remove = (id: string) => {
    if (!window.confirm("Usunąć tę ważną datę?")) return;
    startTransition(async () => {
      try { await deleteImportantDateAction(id); setOccurrences((current) => current.filter(({ item }) => item.id !== id)); }
      catch { setError("Nie udało się usunąć daty."); }
    });
  };

  const toggleComplete = (occurrence: ImportantDateOccurrence) => startTransition(async () => {
    try { await completeImportantDateAction(occurrence.item.id, occurrence.occurrenceDate, !occurrence.isCompleted); setOccurrences((current) => current.map((entry) => entry.item.id === occurrence.item.id ? { ...entry, isCompleted: !entry.isCompleted } : entry)); }
    catch { setError("Nie udało się zmienić statusu."); }
  });

  return <div className="space-y-6">
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-gray-500">Prywatny kalendarz Aleksandry</p><h1 className="mt-1 text-2xl font-bold text-[#2D4739]">Ważne daty</h1><p className="mt-2 text-sm text-gray-600">Urodziny, rocznice i okazje, o których warto pamiętać spokojnie wcześniej.</p></div>{!formOpen && <button type="button" onClick={openNew} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />Dodaj datę</button>}</div>
      {formOpen && <DateForm draft={draft} setDraft={setDraft} editing={Boolean(editingId)} pending={isPending} error={error} onSave={save} onCancel={close} />}
    </section>
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7">
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FFF4D9] p-3 text-[#B7791F]"><CalendarHeart size={21} /></span><div><p className="text-sm text-gray-500">Od najbliższej</p><h2 className="font-bold text-[#2D4739]">Nadchodzące okazje</h2></div></div>
      {occurrences.length === 0 ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-7 text-center text-sm text-gray-600">Dodaj pierwszą ważną datę. PsychOLKA przypomni o niej we właściwym momencie.</p> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{occurrences.map((occurrence) => <article key={occurrence.item.id} className={`rounded-2xl border p-5 ${occurrence.isCompleted ? "border-[#D5DCCF] bg-[#EEF1EB]" : "border-[#E5E1D8] bg-[#F8F5F0]"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6D7A62]">{occasionLabels[occurrence.item.occasion]}</p><h3 className="mt-1 font-bold text-[#2D4739]">{occurrence.item.title}</h3>{occurrence.item.person_name && <p className="mt-1 text-sm text-gray-600">{occurrence.item.person_name}</p>}</div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#55624D]">{daysLabel(occurrence.daysUntil)}</span></div><p className="mt-4 text-sm font-medium text-[#2D4739]">{formatDate(occurrence.occurrenceDate)}{occurrence.item.recurs_yearly ? " · co roku" : ""}</p>{occurrence.item.gift_notes && <p className="mt-3 flex items-start gap-2 text-sm text-gray-600"><Gift size={16} className="mt-0.5 shrink-0 text-[#B7791F]" />{occurrence.item.gift_notes}</p>}<div className="mt-5 flex flex-wrap gap-2"><button type="button" disabled={isPending} onClick={() => toggleComplete(occurrence)} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#2D4739]"><Check size={16} />{occurrence.isCompleted ? "Cofnij załatwione" : "Załatwione"}</button><button type="button" onClick={() => edit(occurrence.item)} className="rounded-xl p-2 text-[#6D7A62]" aria-label="Edytuj"><Edit3 size={17} /></button><button type="button" onClick={() => remove(occurrence.item.id)} className="rounded-xl p-2 text-[#B65A5A]" aria-label="Usuń"><Trash2 size={17} /></button></div></article>)}</div>}
      {error && !formOpen && <p className="mt-5 rounded-xl bg-[#FFF9EE] px-4 py-3 text-sm text-[#7A6540]">{error}</p>}
    </section>
  </div>;
}

function DateForm({ draft, setDraft, editing, pending, error, onSave, onCancel }: { draft: ImportantDateInput; setDraft: (value: ImportantDateInput) => void; editing: boolean; pending: boolean; error: string; onSave: () => void; onCancel: () => void }) {
  const toggleReminder = (day: number) => setDraft({ ...draft, reminderDays: draft.reminderDays.includes(day) ? draft.reminderDays.filter((value) => value !== day) : [...draft.reminderDays, day] });
  return <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-4 sm:p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nazwa okazji"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Np. Urodziny mamy" className={inputClass} /></Field><Field label="Osoba (opcjonalnie)"><input value={draft.personName} onChange={(e) => setDraft({ ...draft, personName: e.target.value })} placeholder="Np. Mama" className={inputClass} /></Field><Field label="Rodzaj"><select value={draft.occasion} onChange={(e) => setDraft({ ...draft, occasion: e.target.value as ImportantDateOccasion })} className={inputClass}>{Object.entries(occasionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Data"><input type="date" value={draft.eventDate} onChange={(e) => setDraft({ ...draft, eventDate: e.target.value })} className={inputClass} /></Field></div><label className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2D4739]"><input type="checkbox" checked={draft.recursYearly} onChange={(e) => setDraft({ ...draft, recursYearly: e.target.checked })} className="accent-[#6D7A62]" />Powtarzaj co roku</label><div className="mt-4"><p className="text-sm font-semibold text-[#2D4739]">Przypomnij wcześniej</p><div className="mt-2 flex flex-wrap gap-2">{reminderOptions.map((day) => <button key={day} type="button" onClick={() => toggleReminder(day)} className={`rounded-full px-3 py-2 text-xs font-semibold ${draft.reminderDays.includes(day) ? "bg-[#6D7A62] text-white" : "bg-white text-[#55624D]"}`}>{day === 0 ? "w dniu okazji" : `${day} dni`}</button>)}</div></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Pomysł na prezent"><textarea rows={3} value={draft.giftNotes} onChange={(e) => setDraft({ ...draft, giftNotes: e.target.value })} className={inputClass} /></Field><Field label="Prywatna notatka"><textarea rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={inputClass} /></Field></div>{error && <p className="mt-4 rounded-xl bg-[#FFF9EE] px-4 py-3 text-sm text-[#7A6540]">{error}</p>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled={pending} onClick={onSave} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-gray-400">{pending ? "Zapisywanie..." : editing ? "Zapisz zmiany" : "Dodaj ważną datę"}</button><button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#55624D]"><X size={16} />Anuluj</button></div></div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-[#E5E1D8] bg-white px-3 py-2.5 text-sm text-[#2D4739] outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-sm font-semibold text-[#2D4739]">{label}{children}</label>; }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }); }
function daysLabel(days: number) { return days < 0 ? "minęła" : days === 0 ? "dzisiaj" : days === 1 ? "jutro" : `za ${days} dni`; }
