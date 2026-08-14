"use client";

import Link from "next/link";
import { Plus, Printer, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Visit, VisitRecordKind } from "../../domain/booking";
import { VISIT_STATUSES } from "../../domain/status";
import { classifyVisitAction } from "../../actions/visitOrganizerActions";
import { updateBooking } from "../../services/bookingService";
import StatusBadge from "../StatusBadge";
import type { Patient } from "../../domain/patient";
import { createHistoricalVisitAction } from "../../actions/visitOrganizerActions";

type Filter = "all" | VisitRecordKind | `status:${string}`;

export default function VisitOrganizer({ initialVisits, classificationAvailable, patients }: { initialVisits: Visit[]; classificationAvailable: boolean; patients: Patient[] }) {
  const router = useRouter();
  const [visits, setVisits] = useState(initialVisits);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [historyOpen, setHistoryOpen] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pl");
    return visits.filter((visit) => {
      const matchesFilter = filter === "all" || filter === visit.record_kind || (filter.startsWith("status:") && visit.status === filter.slice(7));
      const matchesSearch = !needle || [visit.name, visit.email, visit.phone].some((value) => value?.toLocaleLowerCase("pl").includes(needle));
      return matchesFilter && matchesSearch;
    });
  }, [filter, query, visits]);

  const counts = { all: visits.length, real: visits.filter((visit) => visit.record_kind !== "test").length, test: visits.filter((visit) => visit.record_kind === "test").length };

  function save(visit: Visit, recordKind: VisitRecordKind, status: string) {
    setMessage("");
    startTransition(async () => {
      try {
        if (recordKind !== (visit.record_kind ?? "real")) await classifyVisitAction(visit.id, recordKind);
        if (status !== visit.status) await updateBooking(visit.id, status);
        setVisits((current) => current.map((item) => item.id === visit.id ? { ...item, record_kind: recordKind, status } : item));
        setMessage(`Zapisano wizytę: ${visit.name}.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nie udało się zapisać wizyty.");
      }
    });
  }

  return <div className="space-y-6">
    <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-gray-500">Porządek bez usuwania historii</p><h1 className="mt-1 text-3xl font-bold text-[#2D4739]">Wizyty</h1><p className="mt-2 text-gray-600">Oznacz wizyty testowe, uporządkuj statusy i zachowaj prawdziwą historię gabinetu.</p></div><div className="flex flex-col gap-2 sm:items-end"><Link href="/panel/visits/after-visit-preview" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><Printer size={18} />Podgląd karty po spotkaniu</Link><button type="button" onClick={() => setHistoryOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white"><Plus size={18} />Dodaj wizytę historyczną</button></div></div>
    </header>
    {!classificationAvailable && <p className="rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] px-5 py-4 text-sm text-[#725C28]">Klasyfikacja „Prawdziwa / Testowa” czeka na uruchomienie przygotowanej migracji Supabase. Pozostałe dane są bezpieczne.</p>}
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-6">
      <div className="flex items-center gap-2 text-[#2D4739]"><SlidersHorizontal size={19} /><h2 className="font-bold">Filtry</h2></div>
      <div className="mt-4 flex flex-wrap gap-2"><FilterButton active={filter === "all"} onClick={() => setFilter("all")}>Wszystkie ({counts.all})</FilterButton><FilterButton active={filter === "real"} onClick={() => setFilter("real")}>Prawdziwe ({counts.real})</FilterButton><FilterButton active={filter === "test"} onClick={() => setFilter("test")}>Testowe ({counts.test})</FilterButton>{VISIT_STATUSES.map((status) => <FilterButton key={status} active={filter === `status:${status}`} onClick={() => setFilter(`status:${status}`)}>{status}</FilterButton>)}</div>
      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E5E1D8] bg-[#F8F5F0] px-4 py-3"><Search size={20} className="text-gray-400" /><span className="sr-only">Szukaj wizyty</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj po nazwie, telefonie lub e-mailu…" className="w-full bg-transparent outline-none" /></label>
    </section>
    {message && <p role="status" className="rounded-2xl bg-[#EEF1EB] px-5 py-3 text-sm font-semibold text-[#2D4739]">{message}</p>}
    <section className="grid gap-4 xl:grid-cols-2">{visible.map((visit) => <VisitOrganizerCard key={visit.id} visit={visit} pending={isPending} classificationAvailable={classificationAvailable} onSave={save} />)}</section>
    {visible.length === 0 && <p className="rounded-3xl bg-white p-8 text-center text-gray-500">Nie znaleziono wizyt pasujących do wybranych filtrów.</p>}
    {historyOpen && <HistoricalVisitDialog patients={patients} pending={isPending} onClose={() => setHistoryOpen(false)} onSaved={() => { setHistoryOpen(false); setMessage("Dodano prawdziwą wizytę historyczną — bez wysyłania wiadomości i prośby o opinię."); router.refresh(); }} />}
  </div>;
}

function HistoricalVisitDialog({ patients, pending, onClose, onSaved }: { patients: Patient[]; pending: boolean; onClose: () => void; onSaved: () => void }) {
  const [patientId, setPatientId] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [visitDate, setVisitDate] = useState(""); const [visitTime, setVisitTime] = useState(""); const [locationId, setLocationId] = useState<"arthro-cure-clinic" | "nowa-wies-rzeczna">("arthro-cure-clinic"); const [description, setDescription] = useState(""); const [error, setError] = useState(""); const [saving, startSaving] = useTransition();
  function submit(event: React.FormEvent) { event.preventDefault(); setError(""); startSaving(async () => { try { await createHistoricalVisitAction({ patientId: patientId || null, name, phone, email, visitDate, visitTime, locationId, description }); onSaved(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się dodać wizyty."); } }); }
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1F3028]/50 p-3 sm:items-center"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-gray-500">Spokojne odtworzenie historii</p><h2 className="text-2xl font-bold text-[#2D4739]">Dodaj odbytą wizytę</h2></div><button type="button" onClick={onClose} className="rounded-xl border border-[#E5E1D8] p-2" aria-label="Zamknij"><X size={20} /></button></div><p className="mt-3 rounded-xl bg-[#EEF1EB] p-3 text-sm text-[#55624D]">Zapis nie wyśle pacjentowi wiadomości ani prośby o opinię.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Istniejąca karta pacjenta"><select value={patientId} onChange={(event) => setPatientId(event.target.value)} className={inputClass}><option value="">Bez przypisanej karty</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></Field><Field label="Imię i nazwisko"><input value={name} onChange={(event) => setName(event.target.value)} disabled={Boolean(patientId)} className={inputClass} placeholder="Gdy nie wybierasz karty" /></Field><Field label="Telefon"><input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field><Field label="E-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field><Field label="Data"><input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required className={inputClass} /></Field><Field label="Godzina"><input type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} required className={inputClass} /></Field><Field label="Miejsce"><select value={locationId} onChange={(event) => setLocationId(event.target.value as typeof locationId)} className={inputClass}><option value="arthro-cure-clinic">Arthro Cure Clinic</option><option value="nowa-wies-rzeczna">Centrum Zielińscy Premium</option></select></Field><Field label="Krótki opis"><input value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></Field></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold">Anuluj</button><button type="submit" disabled={saving || pending} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white disabled:bg-gray-400">{saving ? "Zapisywanie…" : "Dodaj jako zrealizowaną"}</button></div></form></div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 outline-none focus:border-[#6D7A62] disabled:bg-gray-100";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-sm font-semibold text-[#2D4739]">{label}{children}</label>; }

function VisitOrganizerCard({ visit, pending, classificationAvailable, onSave }: { visit: Visit; pending: boolean; classificationAvailable: boolean; onSave: (visit: Visit, kind: VisitRecordKind, status: string) => void }) {
  const [kind, setKind] = useState<VisitRecordKind>(visit.record_kind ?? "real");
  const [status, setStatus] = useState(visit.status);
  const changed = kind !== (visit.record_kind ?? "real") || status !== visit.status;
  return <article className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(45,71,57,0.05)] ${kind === "test" ? "border-[#E8D39D] bg-[#FFF9E9]" : "border-[#E5E1D8] bg-white"}`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">#{visit.id} · {kind === "test" ? "Wizyta testowa" : "Wizyta prawdziwa"}</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">{visit.name}</h2><p className="mt-1 text-sm text-gray-600">{formatDate(visit.visit_date)} · {visit.visit_time}</p><p className="mt-1 text-sm text-gray-600">{visit.location}</p></div><StatusBadge status={visit.status} /></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4739]">Rodzaj<select value={kind} onChange={(event) => setKind(event.target.value as VisitRecordKind)} disabled={pending || !classificationAvailable} className="mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 disabled:bg-gray-100"><option value="real">Prawdziwa</option><option value="test">Testowa</option></select></label><label className="text-sm font-semibold text-[#2D4739]">Status<select value={status} onChange={(event) => setStatus(event.target.value)} disabled={pending} className="mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5">{VISIT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500"><span>{visit.phone || "Brak telefonu"}{visit.email ? ` · ${visit.email}` : ""}</span><div className="flex flex-wrap gap-2">{visit.record_kind !== "test" && visit.status === "Zrealizowane" && <Link href={`/panel/visits/${visit.id}/after-visit`} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-2.5 font-semibold text-[#2D4739]"><Printer size={16} />Karta po spotkaniu</Link>}<button type="button" disabled={pending || !changed} onClick={() => onSave(visit, kind, status)} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">Zapisz zmiany</button></div></div>
  </article>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-[#2D4739] text-white" : "bg-[#F8F5F0] text-[#2D4739] hover:bg-[#EEF1EB]"}`}>{children}</button>; }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("pl-PL"); }
