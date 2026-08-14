import { ArrowLeft, CalendarClock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import type { Visit } from "../../domain/booking";
import StatusBadge from "../StatusBadge";

export default function UnlinkedVisitDetails({ visit, clinicalDataUnavailable = false }: { visit: Visit; clinicalDataUnavailable?: boolean }) {
  return <div className="space-y-6">
    <Link href="/panel/visits" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><ArrowLeft size={17} />Wróć do wizyt</Link>
    {clinicalDataUnavailable && <p className="rounded-2xl border border-[#E8D39D] bg-[#FFF9E9] px-5 py-4 text-sm text-[#725C28]">Rozbudowany brief jest chwilowo niedostępny. Podstawowe dane wizyty pozostają bezpieczne i widoczne poniżej.</p>}
    <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-gray-500">Szczegóły zgłoszenia</p><h1 className="mt-1 text-3xl font-bold text-[#2D4739]">{visit.name}</h1><p className="mt-2 text-sm font-semibold text-[#7A6540]">{visit.patient_id ? "Podstawowy podgląd wizyty" : "Brak przypisanej karty pacjenta"}</p></div><StatusBadge status={visit.status} /></div></header>
    <section className="grid gap-4 md:grid-cols-2"><Detail icon={CalendarClock} label="Termin" value={`${formatDate(visit.visit_date)} · ${visit.visit_time}`} /><Detail icon={MapPin} label="Miejsce" value={visit.location || "Nie podano"} /><Detail icon={Phone} label="Telefon" value={visit.phone || "Nie podano"} /><Detail icon={Mail} label="E-mail" value={visit.email || "Nie podano"} /></section>
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6"><div className="flex items-center gap-3"><UserRound size={20} className="text-[#6D7A62]" /><h2 className="font-bold text-[#2D4739]">Opis zgłoszenia</h2></div><p className="mt-4 whitespace-pre-wrap text-gray-700">{visit.message?.trim() || "Brak opisu."}</p></section>
    <p className="rounded-2xl bg-[#EEF1EB] px-5 py-4 text-sm text-[#55624D]">Status i klasyfikację tej wizyty możesz bezpiecznie zmienić na stronie „Wizyty”.</p>
  </div>;
}

function Detail({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) { return <div className="rounded-2xl border border-[#E5E1D8] bg-white p-5"><div className="flex items-center gap-2 text-sm text-gray-500"><Icon size={18} className="text-[#6D7A62]" />{label}</div><p className="mt-2 font-semibold text-[#2D4739]">{value}</p></div>; }
function formatDate(value: string) { return new Date(`${value}T00:00:00`).toLocaleDateString("pl-PL"); }
