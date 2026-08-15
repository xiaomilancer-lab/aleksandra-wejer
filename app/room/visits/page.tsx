import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import { getMemberPatientAccess } from "@/app/room/server/memberContext";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ChangeRequestForm from "./ChangeRequestForm";

type RoomBooking = { id: number; name: string; visit_date: string; visit_time: string; location: string | null; status: string | null; record_kind: string | null };

export default async function RoomVisitsPage() {
  const member = await requireMember();
  const accessRows = await getMemberPatientAccess(member.userId);
  const patientIds = [...new Set(accessRows.map((row) => row.patient_id))];
  let bookings: RoomBooking[] = [];
  if (patientIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("id, name, visit_date, visit_time, location, status, record_kind")
      .in("patient_id", patientIds)
      .eq("record_kind", "real")
      .order("visit_date", { ascending: false })
      .order("visit_time", { ascending: false });
    if (error) throw error;
    bookings = (data ?? []) as RoomBooking[];
  }

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const upcoming = bookings
    .filter((booking) => booking.visit_date >= today && booking.status !== "Odwołane" && booking.status !== "Zrealizowane")
    .reverse();
  const history = bookings.filter((booking) => booking.visit_date < today || booking.status === "Zrealizowane" || booking.status === "Odwołane");

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm"><Link href="/room" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739]"><ArrowLeft size={19} aria-hidden="true" />Wróć do pokoju</Link><p className="mt-5 text-sm text-gray-500">Terminy przypisane do tego konta</p><h1 className="mt-1 text-3xl font-bold">Wizyty</h1><p className="mt-2 text-sm text-gray-600">Prośba o zmianę nie modyfikuje terminu automatycznie. Aleksandra najpierw ją potwierdzi.</p></header>
        {patientIds.length === 0 ? <section className="rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6"><h2 className="font-bold">Konto czeka na połączenie</h2><p className="mt-2 text-sm text-[#6F5732]">Po bezpiecznym przypisaniu karty pacjenta pojawią się tutaj właściwe terminy.</p></section> : <>
          <VisitSection title="Nadchodzące" icon={CalendarDays} empty="Brak zaplanowanych wizyt." bookings={upcoming} allowChanges />
          <VisitSection title="Historia" icon={CheckCircle2} empty="Historia wizyt jest jeszcze pusta." bookings={history} />
        </>}
      </div>
    </main>
  );
}

function VisitSection({ title, icon: Icon, empty, bookings, allowChanges = false }: { title: string; icon: typeof CalendarDays; empty: string; bookings: RoomBooking[]; allowChanges?: boolean }) {
  return <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={22} aria-hidden="true" /></span><h2 className="text-2xl font-bold">{title}</h2></div>{bookings.length === 0 ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-5 text-sm text-gray-600">{empty}</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-[#E5E1D8] p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{booking.name}</p><p className="mt-2 flex items-center gap-2 text-sm"><Clock3 size={16} aria-hidden="true" />{booking.visit_date} · {booking.visit_time.slice(0, 5)}</p></div><span className="rounded-full bg-[#EEF1EB] px-3 py-1 text-xs font-semibold">{booking.status ?? "Wizyta"}</span></div>{booking.location && <p className="mt-3 flex items-start gap-2 text-sm text-gray-600"><MapPin className="mt-0.5 shrink-0" size={16} aria-hidden="true" />{booking.location}</p>}{allowChanges && <ChangeRequestForm bookingId={booking.id} />}</article>)}</div>}</section>;
}
