import { CalendarDays } from "lucide-react";
import StatusBadge from "../StatusBadge";
import type { Visit } from "../../domain";
import { formatDate } from "../../utils/formatDate";

interface PatientVisitHistoryProps {
  visits: Visit[];
}

export default function PatientVisitHistory({ visits }: PatientVisitHistoryProps) {
  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><CalendarDays size={19} aria-hidden="true" /></span>
        <h2 className="font-bold text-[#2D4739]">Historia wizyt</h2>
      </div>
      {visits.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-center text-sm text-gray-500">Brak wizyt dla tego pacjenta.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {visits.map((visit) => (
            <article key={visit.id} className="rounded-2xl bg-[#F8F5F0] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-semibold capitalize text-[#2D4739]">{formatDate(visit.visit_date)}</p><p className="mt-1 text-sm text-gray-600">{visit.visit_time} · {visit.location}</p></div>
                <StatusBadge status={visit.status} />
              </div>
              <p className="mt-4 border-t border-[#E5E1D8] pt-4 text-sm text-gray-700">{visit.message || "Brak opisu zgłoszenia."}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
