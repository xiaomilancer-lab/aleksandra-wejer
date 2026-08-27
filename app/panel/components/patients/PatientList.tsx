"use client";

import Link from "next/link";
import { Plus, Search, UserRoundPlus, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import type { Patient } from "../../types/patient";
import { createPatientAction } from "../../actions/patientActions";
import EmptyPatients from "./EmptyPatients";
import PatientRow from "./PatientRow";

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
  const [patientCards, setPatientCards] = useState(patients);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pl-PL");

    if (!normalizedQuery) {
      return patientCards;
    }

    return patientCards.filter((patient) =>
      [patient.name, patient.phone ?? "", patient.email ?? ""].some((value) =>
        value.toLocaleLowerCase("pl-PL").includes(normalizedQuery)
      )
    );
  }, [patientCards, query]);

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold text-[#2D4739]">Karty pacjentów</h2><p className="mt-1 text-sm text-gray-500">Po utworzeniu kartę można przypisać do wcześniejszej albo nowej wizyty.</p></div><button type="button" onClick={() => setDialogOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2D4739] px-5 py-3 font-semibold text-white"><Plus size={19} aria-hidden="true" />Dodaj kartę pacjenta</button></div>
      {message && <div role="status" className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#D8E2D4] bg-[#F3F7F1] px-5 py-4 text-sm text-[#2D4739] sm:flex-row sm:items-center sm:justify-between"><span>{message}</span><div className="flex flex-wrap gap-2">{createdPatientId && <Link href={`/panel/patients/${createdPatientId}`} className="rounded-xl bg-white px-4 py-2 font-semibold">Otwórz kartę</Link>}<Link href="/panel/visits" className="rounded-xl bg-[#6D7A62] px-4 py-2 font-semibold text-white">Przypisz wizytę</Link></div></div>}
      <label className="relative block">
        <span className="sr-only">Szukaj pacjenta</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj pacjenta..." className="w-full rounded-2xl border border-[#E5E1D8] bg-white py-3.5 pl-11 pr-4 text-[#2D4739] outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
      </label>

      {filteredPatients.length === 0 ? <EmptyPatients hasPatients={patientCards.length > 0} /> : (
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
          {filteredPatients.map((patient) => <PatientRow key={patient.id} patient={patient} />)}
        </div>
      )}
      {dialogOpen && <CreatePatientDialog onClose={() => setDialogOpen(false)} onCreated={(patient, supportInfoSaved, supportInfoRequested) => { setPatientCards((current) => [...current, patient].sort((left, right) => left.name.localeCompare(right.name, "pl"))); setCreatedPatientId(patient.id); setMessage(supportInfoRequested && !supportInfoSaved ? `Utworzono kartę ${patient.name}. Informacje pomocne nie zapisały się — możesz dodać je po otwarciu karty w PsychOLKA Memory.` : `Utworzono kartę ${patient.name}. Możesz teraz przypisać ją do wizyty albo otworzyć i uzupełnić.`); setDialogOpen(false); }} />}
    </div>
  );
}

function CreatePatientDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (patient: Patient, supportInfoSaved: boolean, supportInfoRequested: boolean) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [supportInfo, setSupportInfo] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await createPatientAction({ name, phone, email, supportInfo });
        onCreated(result.patient, result.supportInfoSaved, result.supportInfoRequested);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Nie udało się utworzyć karty pacjenta.");
      }
    });
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1F3028]/50 p-3 sm:items-center"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><UserRoundPlus size={22} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Nowa osoba w gabinecie</p><h2 className="text-2xl font-bold text-[#2D4739]">Dodaj kartę pacjenta</h2></div></div><button type="button" onClick={onClose} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E1D8]" aria-label="Zamknij"><X size={20} /></button></div><p className="mt-4 rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] p-4 text-sm leading-6 text-[#725C28]">Zapisuj tylko informacje potrzebne Aleksandrze w pracy. Nie wpisuj tutaj pełnej dokumentacji medycznej ani zbędnych danych.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Imię i nazwisko"><input value={name} onChange={(event) => setName(event.target.value)} required autoFocus maxLength={120} className={inputClass} placeholder="Imię i nazwisko" /></Field><Field label="Telefon"><input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} className={inputClass} placeholder="Opcjonalnie" /></Field><div className="sm:col-span-2"><Field label="Adres e-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></Field></div><div className="sm:col-span-2"><Field label="Informacje pomocne przy materiałach i spotkaniach"><textarea value={supportInfo} onChange={(event) => setSupportInfo(event.target.value)} maxLength={2000} rows={5} className={`${inputClass} resize-y`} placeholder="Np. nastolatek; lubi ćwiczenia obrazkowe; preferuje spokojne tempo; cel spotkań…" /></Field><p className="mt-2 text-xs text-gray-500">Opcjonalnie. Zapisze się jako przypięta wskazówka w PsychOLKA Memory i będzie widoczna podczas przygotowania wizyty.</p></div></div>{error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold">Anuluj</button><button type="submit" disabled={isPending} className="min-h-11 rounded-xl bg-[#2D4739] px-5 py-2.5 font-semibold text-white disabled:bg-gray-400">{isPending ? "Tworzenie…" : "Utwórz kartę"}</button></div></form></div>;
}

const inputClass = "mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-3 text-[#263E32] placeholder:text-[#7B847E] outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-[#2D4739]">{label}{children}</label>; }
