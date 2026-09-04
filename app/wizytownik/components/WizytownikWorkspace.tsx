"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileDown,
  FileText,
  LockKeyhole,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import {
  createJournalNoteAction,
  createJournalPatientAction,
  deleteJournalNoteAction,
  updateJournalNoteAction,
} from "../actions";
import type { JournalNote, JournalNotePayload, JournalPatient } from "../server/secureJournal";
import WizytownikLogoutButton from "./WizytownikLogoutButton";
import WizytownikInstallButton from "./WizytownikInstallButton";

type Props = {
  patients: JournalPatient[];
  selectedPatient: JournalPatient | null;
  notes: JournalNote[];
  today: string;
  setupError: string | null;
};

const emptyPayload: JournalNotePayload = {
  title: "",
  sessionSummary: "",
  keyTopics: "",
  observations: "",
  nextSteps: "",
};

export default function WizytownikWorkspace({ patients: initialPatients, selectedPatient, notes: initialNotes, today, setupError }: Props) {
  const router = useRouter();
  const [patients, setPatients] = useState(initialPatients);
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState("");
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<JournalNote | null>(null);
  const [occurredOn, setOccurredOn] = useState(today);
  const [payload, setPayload] = useState<JournalNotePayload>(emptyPayload);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("pl-PL");
    if (!value) return patients;
    return patients.filter((patient) => [patient.name, patient.journalAlias ?? "", patient.phone ?? "", patient.email ?? ""].some((field) => field.toLocaleLowerCase("pl-PL").includes(value)));
  }, [patients, query]);

  function openNewNote() {
    setEditing(null);
    setOccurredOn(today);
    setPayload({ ...emptyPayload, title: `Notatka z wizyty ${new Date(`${today}T12:00:00`).toLocaleDateString("pl-PL")}` });
    setError("");
    setMessage("");
    setEditorOpen(true);
  }

  function openEdit(note: JournalNote) {
    setEditing(note);
    setOccurredOn(note.occurredOn);
    setPayload({ title: note.title, sessionSummary: note.sessionSummary, keyTopics: note.keyTopics, observations: note.observations, nextSteps: note.nextSteps });
    setError("");
    setMessage("");
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditing(null);
    setPayload(emptyPayload);
  }

  function saveNote() {
    if (!selectedPatient) return;
    setError("");
    startTransition(async () => {
      try {
        const saved = editing
          ? await updateJournalNoteAction({ noteId: editing.id, patientId: selectedPatient.id, occurredOn, payload })
          : await createJournalNoteAction({ patientId: selectedPatient.id, occurredOn, payload });
        setNotes((current) => [saved, ...current.filter((note) => note.id !== saved.id)].sort((left, right) => right.occurredOn.localeCompare(left.occurredOn)));
        closeEditor();
        setMessage("Notatka została zaszyfrowana i zapisana w chmurze.");
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Nie udało się zapisać notatki.");
      }
    });
  }

  function removeNote(note: JournalNote) {
    if (!selectedPatient || !window.confirm("Usunąć tę notatkę bez możliwości cofnięcia?")) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteJournalNoteAction(note.id, selectedPatient.id);
        setNotes((current) => current.filter((item) => item.id !== note.id));
        setMessage("Notatka została trwale usunięta.");
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Nie udało się usunąć notatki.");
      }
    });
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#EEF3EA_0,transparent_34%),#F8F5F0] text-[#263E32]">
    <header className="sticky top-0 z-30 border-b border-[#DDE3D9] bg-[#F8F5F0]/95 px-3 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image src="/psycholka/work/16_work_pracuje.png" alt="PsychOLKA pracuje" width={58} height={58} className="h-14 w-14 object-contain drop-shadow-md" priority />
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D7A62]">Prywatne narzędzie Aleksandry</p><h1 className="text-xl font-black sm:text-2xl">Wizytownik psychOLKI</h1></div>
        </div>
        <div className="flex flex-wrap gap-2"><WizytownikInstallButton /><Link href="/panel" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#D6DDD3] bg-white px-4 py-2.5 text-sm font-bold"><ArrowLeft size={17} />Panel psychologa</Link><WizytownikLogoutButton /></div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1500px] gap-5 p-3 pb-24 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="min-w-0 rounded-[28px] border border-[#DDE3D9] bg-white p-4 shadow-[0_18px_50px_rgba(45,71,57,0.07)] sm:p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-gray-500">Wspólna baza</p><h2 className="text-xl font-black">Pacjenci</h2></div><button type="button" onClick={() => setPatientFormOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2D4739] text-white" aria-label="Dodaj pacjenta"><UserPlus size={20} /></button></div>
        <label className="relative mt-5 block"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71806D]" size={18} /><span className="sr-only">Szukaj pacjenta</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Imię, nazwisko, pseudonim…" className="min-h-12 w-full rounded-2xl border border-[#D6DDD3] bg-[#F8FAF7] py-3 pl-10 pr-3 text-[#263E32] placeholder:text-[#66716B] outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#E9EFE6]" /></label>
        <div className="mt-4 space-y-2">{filtered.map((patient) => <button key={patient.id} type="button" onClick={() => router.push(`/wizytownik?patient=${encodeURIComponent(patient.id)}`)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedPatient?.id === patient.id ? "border-[#6D7A62] bg-[#EEF3EA]" : "border-transparent bg-[#F8F5F0] hover:border-[#D6DDD3]"}`}><span className="block font-bold">{patient.name}</span>{patient.journalAlias && <span className="mt-0.5 block text-sm text-[#63705E]">„{patient.journalAlias}”</span>}<span className="mt-1 block text-xs text-gray-500">{patient.phone || patient.email || "Karta bez danych kontaktowych"}</span></button>)}</div>
        {filtered.length === 0 && <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-4 text-sm text-gray-500">Nie znaleziono takiej osoby.</p>}
      </aside>

      <section className="min-w-0">
        <div className="rounded-[28px] border border-[#D8E1D5] bg-[#EEF3EA] p-5 sm:p-6"><div className="flex gap-4"><span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#557050]"><ShieldCheck size={24} /></span><div><h2 className="font-black">Notatki chronione dodatkowym szyfrowaniem</h2><p className="mt-1 text-sm leading-6 text-[#4F6151]">Treść jest szyfrowana przed zapisem w bazie. Wizytownik nie umieszcza notatek w pamięci offline urządzenia. Zapisuj wyłącznie dane potrzebne do pracy.</p></div></div></div>

        {setupError && <div className="mt-5 rounded-[28px] border border-[#E8D19B] bg-[#FFF9E9] p-6"><div className="flex gap-3"><LockKeyhole className="shrink-0 text-[#8A6B24]" /><div><h2 className="font-black text-[#674F1C]">Potrzebna jednorazowa konfiguracja</h2><p className="mt-2 text-sm leading-6 text-[#735E32]">{setupError}</p><p className="mt-3 text-sm font-semibold">Karty pacjentów pozostają bez zmian. Zapisywanie notatek uruchomi się po dodaniu tabeli i klucza szyfrowania.</p></div></div></div>}

        {!selectedPatient ? <Welcome onAdd={() => setPatientFormOpen(true)} /> : <div className="mt-5 space-y-5">
          <section className="rounded-[28px] border border-[#DDE3D9] bg-white p-5 shadow-[0_18px_50px_rgba(45,71,57,0.06)] sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-[#6D7A62]">Historia spotkań</p><h2 className="mt-1 text-3xl font-black">{selectedPatient.name}</h2>{selectedPatient.journalAlias && <p className="mt-1 text-gray-600">Pseudonim: {selectedPatient.journalAlias}</p>}<p className="mt-2 text-sm text-gray-500">{notes.length} {notes.length === 1 ? "notatka" : "notatek"}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={openNewNote} disabled={Boolean(setupError)} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#2D4739] px-5 py-3 font-bold text-white disabled:bg-gray-400"><Plus size={19} />Nowa notatka</button><Link href={`/wizytownik/patients/${selectedPatient.id}/print`} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D6DDD3] px-4 py-3 font-bold"><FileDown size={18} />PDF</Link><a href={`/api/wizytownik/patients/${selectedPatient.id}/export?format=docx`} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D6DDD3] px-4 py-3 font-bold"><Download size={18} />DOCX</a></div></div></section>

          {message && <p role="status" className="rounded-2xl border border-[#CAD9C4] bg-[#F1F6EF] px-5 py-4 text-sm font-bold">{message}</p>}
          {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</p>}

          {notes.length === 0 ? <section className="rounded-[28px] border border-dashed border-[#C9D3C5] bg-white/70 p-10 text-center"><FileText className="mx-auto text-[#84917E]" size={38} /><h3 className="mt-4 text-xl font-black">Jeszcze nie ma notatek</h3><p className="mt-2 text-gray-600">Pierwszy wpis otrzyma automatycznie dzisiejszą datę.</p><button type="button" onClick={openNewNote} disabled={Boolean(setupError)} className="mt-5 rounded-2xl bg-[#6D7A62] px-5 py-3 font-bold text-white disabled:bg-gray-400">Dodaj pierwszy wpis</button></section> : <div className="space-y-4">{notes.map((note) => <article key={note.id} className="rounded-[26px] border border-[#DDE3D9] bg-white p-5 shadow-[0_10px_35px_rgba(45,71,57,0.05)] sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="inline-flex items-center gap-2 text-sm font-bold text-[#6D7A62]"><CalendarDays size={16} />{new Date(`${note.occurredOn}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</p><h3 className="mt-2 text-xl font-black">{note.title}</h3></div><div className="flex gap-2"><button type="button" onClick={() => openEdit(note)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EA]" aria-label="Edytuj notatkę"><Pencil size={18} /></button><button type="button" onClick={() => removeNote(note)} disabled={isPending} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700" aria-label="Usuń notatkę"><Trash2 size={18} /></button></div></div><NoteSection label="Przebieg wizyty" value={note.sessionSummary} /><NoteSection label="Najważniejsze tematy" value={note.keyTopics} /><NoteSection label="Obserwacje pomocne w dalszej pracy" value={note.observations} /><NoteSection label="Ustalenia i kolejny krok" value={note.nextSteps} /><p className="mt-5 border-t border-[#E7EBE4] pt-3 text-xs text-gray-500">Zaktualizowano {new Date(note.updatedAt).toLocaleString("pl-PL")}</p></article>)}</div>}
        </div>}
      </section>
    </div>

    {patientFormOpen && <PatientDialog pending={isPending} onClose={() => setPatientFormOpen(false)} onCreate={(data) => { setError(""); startTransition(async () => { try { const patient = await createJournalPatientAction(data); setPatients((current) => [...current, patient].sort((a, b) => a.name.localeCompare(b.name, "pl"))); setPatientFormOpen(false); router.push(`/wizytownik?patient=${patient.id}`); } catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się utworzyć karty."); } }); }} error={error} />}
    {editorOpen && selectedPatient && <NoteEditor patient={selectedPatient} payload={payload} setPayload={setPayload} occurredOn={occurredOn} setOccurredOn={setOccurredOn} pending={isPending} editing={Boolean(editing)} error={error} onClose={closeEditor} onSave={saveNote} />}
  </main>;
}

function Welcome({ onAdd }: { onAdd: () => void }) { return <section className="mt-5 rounded-[30px] border border-[#DDE3D9] bg-white p-8 text-center shadow-[0_18px_50px_rgba(45,71,57,0.06)] sm:p-12"><Image src="/psycholka/greeting/1_greeting_macha.png" alt="PsychOLKA wita" width={180} height={180} className="mx-auto h-40 w-40 object-contain drop-shadow-xl" /><h2 className="mt-4 text-3xl font-black">Wybierz kartę pacjenta</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">Wyszukaj osobę po imieniu, nazwisku, pseudonimie, telefonie lub adresie e-mail. Zobaczysz uporządkowaną historię notatek.</p><button type="button" onClick={onAdd} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#6D7A62] px-5 py-3 font-bold text-white"><UserPlus size={19} />Utwórz nową kartę</button></section>; }

function NoteSection({ label, value }: { label: string; value: string }) { if (!value) return null; return <section className="mt-5"><h4 className="text-sm font-black uppercase tracking-[0.08em] text-[#6D7A62]">{label}</h4><p className="mt-2 whitespace-pre-wrap leading-7 text-[#35463B]">{value}</p></section>; }

function PatientDialog({ pending, onClose, onCreate, error }: { pending: boolean; onClose: () => void; onCreate: (data: { name: string; alias: string; phone: string; email: string }) => void; error: string }) {
  const [name, setName] = useState(""); const [alias, setAlias] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState("");
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18271F]/60 p-3 backdrop-blur-sm sm:items-center"><form onSubmit={(event) => { event.preventDefault(); onCreate({ name, alias, phone, email }); }} className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl sm:p-8"><DialogHeader title="Nowa karta pacjenta" subtitle="Karta pojawi się także w panelu psychologa." onClose={onClose} /><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Imię i nazwisko / oznaczenie"><input required autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className={inputClass} /></Field><Field label="Pseudonim (opcjonalnie)"><input value={alias} onChange={(e) => setAlias(e.target.value)} maxLength={80} className={inputClass} /></Field><Field label="Telefon (opcjonalnie)"><input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} className={inputClass} /></Field><Field label="E-mail (opcjonalnie)"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} className={inputClass} /></Field></div><p className="mt-5 rounded-2xl bg-[#FFF9E9] p-4 text-sm leading-6 text-[#725C28]">Stosuj minimalizację danych: zapisuj tylko informacje rzeczywiście potrzebne do prowadzenia pracy.</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-[#D6DDD3] px-4 font-bold">Anuluj</button><button disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2D4739] px-5 font-bold text-white disabled:bg-gray-400"><Save size={17} />Utwórz kartę</button></div></form></div>;
}

function NoteEditor({ patient, payload, setPayload, occurredOn, setOccurredOn, pending, editing, error, onClose, onSave }: { patient: JournalPatient; payload: JournalNotePayload; setPayload: React.Dispatch<React.SetStateAction<JournalNotePayload>>; occurredOn: string; setOccurredOn: (value: string) => void; pending: boolean; editing: boolean; error: string; onClose: () => void; onSave: () => void }) {
  const update = (key: keyof JournalNotePayload, value: string) => setPayload((current) => ({ ...current, [key]: value }));
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18271F]/65 p-3 backdrop-blur-sm sm:p-6"><section className="mx-auto w-full max-w-4xl rounded-[30px] bg-white p-5 shadow-2xl sm:p-8"><DialogHeader title={editing ? "Edytuj notatkę" : "Nowa notatka z wizyty"} subtitle={patient.name} onClose={onClose} /><div className="mt-6 grid gap-4 sm:grid-cols-[220px_1fr]"><Field label="Data spotkania"><input type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} required className={inputClass} /></Field><Field label="Tytuł"><input value={payload.title} onChange={(e) => update("title", e.target.value)} maxLength={160} required className={inputClass} /></Field></div><div className="mt-4 space-y-4"><Field label="Przebieg wizyty"><textarea value={payload.sessionSummary} onChange={(e) => update("sessionSummary", e.target.value)} rows={9} maxLength={30000} required className={`${inputClass} resize-y`} placeholder="Krótko opisz przebieg spotkania…" /></Field><Field label="Najważniejsze tematy (opcjonalnie)"><textarea value={payload.keyTopics} onChange={(e) => update("keyTopics", e.target.value)} rows={4} maxLength={12000} className={`${inputClass} resize-y`} /></Field><Field label="Obserwacje pomocne w dalszej pracy (opcjonalnie)"><textarea value={payload.observations} onChange={(e) => update("observations", e.target.value)} rows={4} maxLength={12000} className={`${inputClass} resize-y`} /></Field><Field label="Ustalenia i kolejny krok (opcjonalnie)"><textarea value={payload.nextSteps} onChange={(e) => update("nextSteps", e.target.value)} rows={4} maxLength={12000} className={`${inputClass} resize-y`} /></Field></div><div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#EEF3EA] p-4 text-sm font-semibold text-[#4B6150]"><LockKeyhole size={18} className="shrink-0" />Zapis zostanie zaszyfrowany. Robocza treść nie trafia do localStorage.</div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="min-h-12 rounded-2xl border border-[#D6DDD3] px-5 font-bold">Anuluj</button><button type="button" onClick={onSave} disabled={pending || !payload.title.trim() || !payload.sessionSummary.trim()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-6 font-bold text-white disabled:bg-gray-400"><Save size={18} />{pending ? "Szyfrowanie i zapis…" : "Zaszyfruj i zapisz"}</button></div></section></div>;
}

function DialogHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) { return <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#6D7A62]">{subtitle}</p><h2 className="mt-1 text-2xl font-black">{title}</h2></div><button type="button" onClick={onClose} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D6DDD3]" aria-label="Zamknij"><X size={20} /></button></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-bold text-[#2D4739]">{label}{children}</label>; }
const inputClass = "mt-2 min-h-12 w-full rounded-2xl border border-[#CBD5C7] bg-white px-4 py-3 text-base text-[#22352B] placeholder:text-[#6F7772] outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#E9EFE6]";
