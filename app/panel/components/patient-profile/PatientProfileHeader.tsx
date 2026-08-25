"use client";

import { CalendarDays, Edit3, Mail, Phone, Save, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePatientAction } from "../../actions/patientActions";
import type { Patient } from "../../domain";

interface PatientProfileHeaderProps { patient: Patient; createdAt: string; }

export default function PatientProfileHeader({ patient, createdAt }: PatientProfileHeaderProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(patient);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone ?? "");
  const [email, setEmail] = useState(patient.email ?? "");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function cancel() {
    setName(current.name); setPhone(current.phone ?? ""); setEmail(current.email ?? "");
    setMessage(""); setEditing(false);
  }
  function save(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    startTransition(async () => {
      try {
        const updated = await updatePatientAction(current.id, { name, phone, email });
        setCurrent(updated); setEditing(false); setMessage("Dane pacjenta zostały zapisane."); router.refresh();
      } catch (error) { setMessage(error instanceof Error ? error.message : "Nie udało się zapisać danych."); }
    });
  }

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5"><span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]"><UserRound size={29} aria-hidden="true" /></span><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Karta pacjenta</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-[#2D4739]">{current.name}</h1></div></div>
        <div className="flex flex-wrap gap-2"><span className="w-fit rounded-full bg-[#E7F3E8] px-3 py-2 text-sm font-semibold text-[#3E7C49]">Aktywna</span>{!editing && <button type="button" onClick={() => setEditing(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2 font-semibold text-[#2D4739]"><Edit3 size={17} /> Edytuj dane</button>}</div>
      </div>
      {editing ? (
        <form onSubmit={save} className="mt-8 border-t border-[#EDEAE4] pt-6">
          <div className="grid gap-4 sm:grid-cols-3"><EditField label="Imię i nazwisko"><input required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></EditField><EditField label="Telefon"><input inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></EditField><EditField label="E-mail"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="Opcjonalnie" /></EditField></div>
          <p className="mt-4 rounded-xl bg-[#F8F5F0] px-4 py-3 text-sm text-[#5C675E]">Cechy spotkań, preferencje i ważne informacje dopisz niżej w sekcji „Pamięć pacjenta”. Dane wcześniejszych wizyt pozostają niezmienionym zapisem historycznym.</p>
          <div className="mt-4 flex flex-wrap justify-end gap-2"><button type="button" onClick={cancel} disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 font-semibold text-[#2D4739]"><X size={17} /> Anuluj</button><button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white disabled:bg-gray-400"><Save size={17} /> {pending ? "Zapisywanie…" : "Zapisz dane"}</button></div>
        </form>
      ) : <div className="mt-8 grid gap-5 border-t border-[#EDEAE4] pt-6 sm:grid-cols-3"><ProfileDetail icon={Phone} label="Telefon" value={current.phone ?? "Brak telefonu"} /><ProfileDetail icon={Mail} label="E-mail" value={current.email ?? "Brak e-maila"} truncate /><ProfileDetail icon={CalendarDays} label="Data dodania" value={createdAt} /></div>}
      {message && <p role="status" className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${message.includes("zostały") ? "bg-[#EEF1EB] text-[#2D4739]" : "bg-red-50 text-red-700"}`}>{message}</p>}
    </section>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-3 text-[#263E32] placeholder:text-[#7B847E] outline-none focus:border-[#6D7A62]";
function EditField({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-sm font-semibold text-[#2D4739]">{label}{children}</label>; }
function ProfileDetail({ icon: Icon, label, value, truncate = false }: { icon: typeof Phone; label: string; value: string; truncate?: boolean }) { return <div className="flex min-w-0 items-start gap-3"><Icon size={18} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" /><div className="min-w-0"><p className="text-sm text-gray-500">{label}</p><p className={`mt-1 font-medium text-[#2D4739] ${truncate ? "truncate" : ""}`}>{value}</p></div></div>; }
