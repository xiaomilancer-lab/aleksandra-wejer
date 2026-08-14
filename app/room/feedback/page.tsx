import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import { getLatestCompletedBooking, getMemberPatientAccess } from "@/app/room/server/memberContext";
import RoomFeedbackForm from "./RoomFeedbackForm";

export default async function RoomFeedbackPage() {
  const member = await requireMember();
  const accessRows = await getMemberPatientAccess(member.userId);
  const patientIds = [...new Set(accessRows.map((row) => row.patient_id))];
  const latestBooking = await getLatestCompletedBooking(patientIds);

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
          <Link href="/room" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><ArrowLeft size={17} aria-hidden="true" />Wróć do pokoju</Link>
          <p className="mt-5 text-sm text-gray-500">Po spotkaniu</p>
          <h1 className="mt-1 text-3xl font-bold">Twoja opinia</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">Masz dwie równorzędne możliwości. Prywatna wiadomość trafia tylko do Aleksandry, a opinia Google jest publiczna.</p>
        </header>
        <RoomFeedbackForm suggestedLocationId={latestBooking?.location_id ?? null} canSendPrivate={patientIds.length > 0} />
      </div>
    </main>
  );
}
