"use client";

import Link from "next/link";
import { CalendarClock, EyeOff, Link2, Plus, Printer, Search, SlidersHorizontal, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Visit, VisitRecordKind } from "../../domain/booking";
import { VISIT_STATUSES } from "../../domain/status";
import { classifyVisitAction, createManualVisitAction, rescheduleVisitAction, updateVisitFeeAction } from "../../actions/visitOrganizerActions";
import { updateBooking } from "../../services/bookingService";
import StatusBadge from "../StatusBadge";
import type { Patient } from "../../domain/patient";
import { createHistoricalVisitAction } from "../../actions/visitOrganizerActions";
import { assignVisitToPatientAction, createPatientCardFromVisitAction } from "../../actions/patientActions";

type Filter = "all" | VisitRecordKind | `status:${string}`;

export default function VisitOrganizer({ initialVisits, classificationAvailable, financeAvailable, patients }: { initialVisits: Visit[]; classificationAvailable: boolean; financeAvailable: boolean; patients: Patient[] }) {
  const router = useRouter();
  const [visits, setVisits] = useState(initialVisits);
  const [filter, setFilter] = useState<Filter>("all");
  const [hideTestVisits, setHideTestVisits] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [patientCards, setPatientCards] = useState(patients);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pl");
    return visits.filter((visit) => {
      if (hideTestVisits && visit.record_kind === "test") return false;
      const matchesFilter = filter === "all" || filter === visit.record_kind || (filter.startsWith("status:") && visit.status === filter.slice(7));
      const matchesSearch = !needle || [visit.name, visit.email, visit.phone].some((value) => value?.toLocaleLowerCase("pl").includes(needle));
      return matchesFilter && matchesSearch;
    });
  }, [filter, hideTestVisits, query, visits]);

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

  function linkPatientCard(visit: Visit, patientId: string) {
    setMessage("");
    startTransition(async () => {
      try {
        const patient = patientId
          ? await assignVisitToPatientAction(visit.id, patientId)
          : await createPatientCardFromVisitAction(visit.id);
        setVisits((current) => current.map((item) => item.id === visit.id ? { ...item, patient_id: patient.id } : item));
        setPatientCards((current) => current.some((item) => item.id === patient.id) ? current : [...current, patient].sort((a, b) => a.name.localeCompare(b.name, "pl")));
        setMessage(`Wizyta ${visit.name} jest połączona z kartą pacjenta.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nie udało się przypisać karty pacjenta.");
      }
    });
  }

  function reschedule(visit: Visit, visitDate: string, visitTime: string) {
    setMessage("");
    startTransition(async () => {
      try {
        const updated = await rescheduleVisitAction(visit.id, { visitDate, visitTime });
        setVisits((current) => current
          .map((item) => item.id === visit.id ? updated : item)
          .sort((left, right) => `${right.visit_date}T${right.visit_time}`.localeCompare(`${left.visit_date}T${left.visit_time}`)));
        setMessage(`Przeniesiono wizytę ${visit.name} na ${formatDate(updated.visit_date)}, ${updated.visit_time.slice(0, 5)}. Poprzedni termin jest już wolny.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nie udało się zmienić terminu wizyty.");
      }
    });
  }

  function saveVisitFee(visit: Visit, value: string) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await updateVisitFeeAction(visit.id, value);
        setVisits((current) => current.map((item) => item.id === visit.id ? { ...item, visit_fee: result.visitFee } : item));
        setMessage(result.visitFee === null ? `Usunięto kwotę z wizyty ${visit.name}.` : `Zapisano ${formatCurrency(result.visitFee)} przy wizycie ${visit.name}.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nie udało się zapisać kwoty wizyty.");
      }
    });
  }

  return <div className="space-y-6">
    <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-gray-500">Porządek bez usuwania historii</p><h1 className="mt-1 text-3xl font-bold text-[#2D4739]">Wizyty</h1><p className="mt-2 text-gray-600">Oznacz wizyty testowe, uporządkuj statusy i zachowaj prawdziwą historię gabinetu.</p></div><div className="flex flex-col gap-2 sm:items-end"><Link href="/panel/visits/after-visit-preview" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><Printer size={18} />Podgląd karty po spotkaniu</Link><button type="button" onClick={() => setManualOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2D4739] px-4 py-3 font-semibold text-white"><Plus size={18} />Dodaj wizytę poza grafikiem</button><button type="button" onClick={() => setHistoryOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white"><Plus size={18} />Dodaj wizytę historyczną</button></div></div>
    </header>
    {!classificationAvailable && <p className="rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] px-5 py-4 text-sm text-[#725C28]">Klasyfikacja „Prawdziwa / Testowa” czeka na uruchomienie przygotowanej migracji Supabase. Pozostałe dane są bezpieczne.</p>}
    {!financeAvailable && <p className="rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] px-5 py-4 text-sm text-[#725C28]">Kwoty i podsumowania finansowe czekają na uruchomienie migracji <strong>add_booking_visit_fee.sql</strong>. Wizyty i pozostałe funkcje działają normalnie.</p>}
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-6">
      <div className="flex items-center gap-2 text-[#2D4739]"><SlidersHorizontal size={19} /><h2 className="font-bold">Filtry</h2></div>
      <div className="mt-4 flex flex-wrap gap-2"><FilterButton active={filter === "all"} onClick={() => setFilter("all")}>Wszystkie ({counts.all})</FilterButton><FilterButton active={filter === "real"} onClick={() => setFilter("real")}>Prawdziwe ({counts.real})</FilterButton><FilterButton active={filter === "test"} onClick={() => { setHideTestVisits(false); setFilter("test"); }}>Testowe ({counts.test})</FilterButton>{VISIT_STATUSES.map((status) => <FilterButton key={status} active={filter === `status:${status}`} onClick={() => setFilter(`status:${status}`)}>{status}</FilterButton>)}</div>
      <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] px-4 py-3 text-sm font-semibold text-[#725C28]">
        <input type="checkbox" checked={hideTestVisits} onChange={(event) => { const checked = event.target.checked; setHideTestVisits(checked); if (checked && filter === "test") setFilter("all"); }} className="h-5 w-5 accent-[#6D7A62]" />
        <EyeOff size={19} aria-hidden="true" />
        Ukryj wizyty testowe ({counts.test})
      </label>
      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[#E5E1D8] bg-[#F8F5F0] px-4 py-3"><Search size={20} className="text-gray-400" /><span className="sr-only">Szukaj wizyty</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj po nazwie, telefonie lub e-mailu…" className="w-full bg-transparent outline-none" /></label>
    </section>
    {message && <p role="status" className="rounded-2xl bg-[#EEF1EB] px-5 py-3 text-sm font-semibold text-[#2D4739]">{message}</p>}
    <section className="grid gap-4 xl:grid-cols-2">{visible.map((visit) => <VisitOrganizerCard key={visit.id} visit={visit} patients={patientCards} pending={isPending} classificationAvailable={classificationAvailable} financeAvailable={financeAvailable} onSave={save} onLink={linkPatientCard} onReschedule={reschedule} onSaveFee={saveVisitFee} />)}</section>
    {visible.length === 0 && <p className="rounded-3xl bg-white p-8 text-center text-gray-500">Nie znaleziono wizyt pasujących do wybranych filtrów.</p>}
    {historyOpen && <HistoricalVisitDialog patients={patientCards} pending={isPending} onClose={() => setHistoryOpen(false)} onSaved={() => { setHistoryOpen(false); setMessage("Dodano prawdziwą wizytę historyczną — bez wysyłania wiadomości i prośby o opinię."); router.refresh(); }} />}
    {manualOpen && <ManualVisitDialog patients={patientCards} pending={isPending} onClose={() => setManualOpen(false)} onSaved={() => { setManualOpen(false); setMessage("Wizyta została wpisana ręcznie poza grafikiem."); router.refresh(); }} />}
  </div>;
}

function ManualVisitDialog({ patients, pending, onClose, onSaved }: { patients: Patient[]; pending: boolean; onClose: () => void; onSaved: () => void }) {
  const [patientId, setPatientId] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [visitDate, setVisitDate] = useState(""); const [visitTime, setVisitTime] = useState(""); const [locationId, setLocationId] = useState<"arthro-cure-clinic" | "nowa-wies-rzeczna">("nowa-wies-rzeczna"); const [status, setStatus] = useState<(typeof VISIT_STATUSES)[number]>("Nowe"); const [description, setDescription] = useState(""); const [error, setError] = useState(""); const [saving, startSaving] = useTransition();
  function submit(event: React.FormEvent) { event.preventDefault(); setError(""); startSaving(async () => { try { await createManualVisitAction({ patientId: patientId || null, name, phone, email, visitDate, visitTime, locationId, status, description }); onSaved(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się dodać wizyty."); } }); }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1F3028]/50 p-3 sm:items-center">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-sm text-gray-500">Ręczny wpis Aleksandry</p><h2 className="text-2xl font-bold text-[#2D4739]">Dodaj wizytę poza grafikiem</h2></div>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E5E1D8] p-2" aria-label="Zamknij"><X size={20} /></button>
        </div>
        <p className="mt-3 rounded-xl border border-[#D8E2D4] bg-[#F3F7F1] p-3 text-sm leading-6 text-[#55624D]">Ta funkcja omija tygodniowy grafik i wyjątki dostępności. Chroni jednak zajęty termin — nie pozwoli wpisać dwóch prawdziwych wizyt w tym samym gabinecie, dniu i godzinie.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Istniejąca karta pacjenta"><select value={patientId} onChange={(event) => setPatientId(event.target.value)} className={inputClass}><option value="">Bez przypisanej karty</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></Field>
          <Field label="Imię i nazwisko"><input value={name} onChange={(event) => setName(event.target.value)} disabled={Boolean(patientId)} className={inputClass} placeholder="Gdy nie wybierasz karty" /></Field>
          <Field label="Telefon"><input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field>
          <Field label="E-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field>
          <Field label="Data"><input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required className={inputClass} /></Field>
          <Field label="Godzina"><input type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} required className={inputClass} /></Field>
          <Field label="Miejsce"><select value={locationId} onChange={(event) => setLocationId(event.target.value as typeof locationId)} className={inputClass}><option value="nowa-wies-rzeczna">Centrum Zielińscy Premium</option><option value="arthro-cure-clinic">Arthro Cure Clinic</option></select></Field>
          <Field label="Status"><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className={inputClass}>{VISIT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <div className="sm:col-span-2"><Field label="Krótki opis"><input value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></Field></div>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold">Anuluj</button><button type="submit" disabled={saving || pending} className="rounded-xl bg-[#2D4739] px-4 py-2.5 font-semibold text-white disabled:bg-gray-400">{saving ? "Zapisywanie…" : "Wpisz wizytę"}</button></div>
      </form>
    </div>
  );
}

function HistoricalVisitDialog({ patients, pending, onClose, onSaved }: { patients: Patient[]; pending: boolean; onClose: () => void; onSaved: () => void }) {
  const [patientId, setPatientId] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [visitDate, setVisitDate] = useState(""); const [visitTime, setVisitTime] = useState(""); const [locationId, setLocationId] = useState<"arthro-cure-clinic" | "nowa-wies-rzeczna">("nowa-wies-rzeczna"); const [description, setDescription] = useState(""); const [error, setError] = useState(""); const [saving, startSaving] = useTransition();
  function submit(event: React.FormEvent) { event.preventDefault(); setError(""); startSaving(async () => { try { await createHistoricalVisitAction({ patientId: patientId || null, name, phone, email, visitDate, visitTime, locationId, description }); onSaved(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Nie udało się dodać wizyty."); } }); }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1F3028]/50 p-3 sm:items-center">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-sm text-gray-500">Spokojne odtworzenie historii</p><h2 className="text-2xl font-bold text-[#2D4739]">Dodaj odbytą wizytę</h2></div>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E5E1D8] p-2" aria-label="Zamknij"><X size={20} /></button>
        </div>
        <p className="mt-3 rounded-xl bg-[#EEF1EB] p-3 text-sm text-[#55624D]">Zapis nie wyśle pacjentowi wiadomości ani prośby o opinię.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Istniejąca karta pacjenta"><select value={patientId} onChange={(event) => setPatientId(event.target.value)} className={inputClass}><option value="">Bez przypisanej karty</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></Field>
          <Field label="Imię i nazwisko"><input value={name} onChange={(event) => setName(event.target.value)} disabled={Boolean(patientId)} className={inputClass} placeholder="Gdy nie wybierasz karty" /></Field>
          <Field label="Telefon"><input value={phone} onChange={(event) => setPhone(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field>
          <Field label="E-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={Boolean(patientId)} className={inputClass} /></Field>
          <Field label="Data"><input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required className={inputClass} /></Field>
          <Field label="Godzina"><input type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} required className={inputClass} /></Field>
          <Field label="Miejsce"><select value={locationId} onChange={(event) => setLocationId(event.target.value as typeof locationId)} className={inputClass}><option value="nowa-wies-rzeczna">Centrum Zielińscy Premium</option><option value="arthro-cure-clinic">Arthro Cure Clinic</option></select></Field>
          <Field label="Krótki opis"><input value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></Field>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold">Anuluj</button><button type="submit" disabled={saving || pending} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white disabled:bg-gray-400">{saving ? "Zapisywanie…" : "Dodaj jako zrealizowaną"}</button></div>
      </form>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 text-[#263E32] placeholder:text-[#7B847E] outline-none focus:border-[#6D7A62] disabled:bg-gray-100";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-sm font-semibold text-[#2D4739]">{label}{children}</label>; }

function VisitOrganizerCard({ visit, patients, pending, classificationAvailable, financeAvailable, onSave, onLink, onReschedule, onSaveFee }: { visit: Visit; patients: Patient[]; pending: boolean; classificationAvailable: boolean; financeAvailable: boolean; onSave: (visit: Visit, kind: VisitRecordKind, status: string) => void; onLink: (visit: Visit, patientId: string) => void; onReschedule: (visit: Visit, visitDate: string, visitTime: string) => void; onSaveFee: (visit: Visit, value: string) => void }) {
  const [kind, setKind] = useState<VisitRecordKind>(visit.record_kind ?? "real");
  const [status, setStatus] = useState(visit.status);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [visitDate, setVisitDate] = useState(visit.visit_date);
  const [visitTime, setVisitTime] = useState(visit.visit_time.slice(0, 5));
  const [visitFee, setVisitFee] = useState(visit.visit_fee === null || visit.visit_fee === undefined ? "" : String(visit.visit_fee).replace(".", ","));
  const changed = kind !== (visit.record_kind ?? "real") || status !== visit.status;
  const scheduleChanged = visitDate !== visit.visit_date || visitTime !== visit.visit_time.slice(0, 5);
  const currentFee = visit.visit_fee === null || visit.visit_fee === undefined ? null : Number(visit.visit_fee);
  const draftFee = parseFeeDraft(visitFee);
  const feeChanged = Number.isNaN(draftFee) || draftFee !== currentFee;
  return <article className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(45,71,57,0.05)] ${kind === "test" ? "border-[#E8D39D] bg-[#FFF9E9]" : "border-[#E5E1D8] bg-white"}`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">#{visit.id} · {kind === "test" ? "Wizyta testowa" : "Wizyta prawdziwa"}</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">{visit.name}</h2><p className="mt-1 text-sm text-gray-600">{formatDate(visit.visit_date)} · {visit.visit_time.slice(0, 5)}</p><p className="mt-1 text-sm text-gray-600">{visit.location}</p></div><StatusBadge status={visit.status} /></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4739]">Rodzaj<select value={kind} onChange={(event) => setKind(event.target.value as VisitRecordKind)} disabled={pending || !classificationAvailable} className="mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 disabled:bg-gray-100"><option value="real">Prawdziwa</option><option value="test">Testowa</option></select></label><label className="text-sm font-semibold text-[#2D4739]">Status<select value={status} onChange={(event) => setStatus(event.target.value)} disabled={pending} className="mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5">{VISIT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="mt-4 rounded-2xl border border-[#D8E2D4] bg-[#F3F7F1] p-4">
      <div className="flex items-center gap-2 text-[#2D4739]"><CalendarClock size={18} aria-hidden="true" /><p className="text-sm font-bold">Zmień datę lub godzinę</p></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Nowa data"><input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} disabled={pending} className={inputClass} /></Field><Field label="Nowa godzina"><input type="time" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} disabled={pending} className={inputClass} /></Field></div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><p className="text-xs leading-5 text-[#55624D]">Po zapisaniu poprzedni termin zwolni się automatycznie. Zmiana nie wysyła pacjentowi wiadomości.</p><button type="button" disabled={pending || !scheduleChanged || !visitDate || !visitTime} onClick={() => onReschedule(visit, visitDate, visitTime)} className="min-h-11 shrink-0 rounded-xl bg-[#2D4739] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">Zmień termin</button></div>
      {kind !== "test" && <div className="mt-4 border-t border-[#D8E2D4] pt-4"><div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Kwota za wizytę (PLN)"><input value={visitFee} onChange={(event) => setVisitFee(event.target.value)} inputMode="decimal" placeholder="150,00" disabled={pending || !financeAvailable} className={inputClass} /></Field><button type="button" disabled={pending || !financeAvailable || !feeChanged} onClick={() => onSaveFee(visit, visitFee)} className="min-h-11 rounded-xl border border-[#6D7A62] bg-white px-4 py-2.5 font-semibold text-[#2D4739] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400">Zapisz kwotę</button></div><p className="mt-2 text-xs leading-5 text-[#55624D]">Standardowa kwota to 150 zł. Możesz ją zmienić osobno dla każdej wizyty. To wykaz orientacyjny — nie faktura ani potwierdzenie płatności.</p></div>}
    </div>
    {kind !== "test" && <div className="mt-4 rounded-2xl border border-[#E5E1D8] bg-[#F8F5F0] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Karta pacjenta</p>
      {visit.patient_id ? <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#465449]">Wizyta jest przypisana. W karcie będą wspólnie widoczne wizyty, materiały, notatki i zadania.</p><Link href={`/panel/patients/${visit.patient_id}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-[#2D4739]"><Link2 size={16} /> Otwórz kartę</Link></div> : <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="text-sm font-semibold text-[#2D4739]"><span className="sr-only">Wybierz istniejącą kartę</span><select value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)} disabled={pending} className="w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 text-[#263E32]"><option value="">Utwórz lub dopasuj z danych wizyty</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}{patient.email ? ` · ${patient.email}` : ""}</option>)}</select></label><button type="button" disabled={pending} onClick={() => onLink(visit, selectedPatientId)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2D4739] px-4 py-2.5 font-semibold text-white disabled:bg-gray-400"><UserPlus size={17} /> {selectedPatientId ? "Przypisz kartę" : "Utwórz kartę"}</button></div>}
    </div>}
    {kind === "test" && <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-[#725C28]">Wizyta testowa nie tworzy i nie zmienia karty pacjenta.</p>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500"><span>{visit.phone || "Brak telefonu"}{visit.email ? ` · ${visit.email}` : ""}</span><div className="flex flex-wrap gap-2">{visit.record_kind !== "test" && visit.status === "Zrealizowane" && <Link href={`/panel/visits/${visit.id}/after-visit`} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-2.5 font-semibold text-[#2D4739]"><Printer size={16} />Karta po spotkaniu</Link>}<button type="button" disabled={pending || !changed} onClick={() => onSave(visit, kind, status)} className="rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">Zapisz zmiany</button></div></div>
  </article>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-[#2D4739] text-white" : "bg-[#F8F5F0] text-[#2D4739] hover:bg-[#EEF1EB]"}`}>{children}</button>; }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("pl-PL"); }
function formatCurrency(value: number) { return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value); }
function parseFeeDraft(value: string) { const normalized = value.trim().replace(",", "."); if (!normalized) return null; const parsed = Number(normalized); return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : Number.NaN; }
