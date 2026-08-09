import { CalendarClock, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { DashboardVisit } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";

interface DashboardTodayProps {
  nextVisit: DashboardVisit | null;
}

export default function DashboardToday({ nextVisit }: DashboardTodayProps) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Kalendarz</p><h2 className="mt-1 text-xl font-bold text-[#2D4739]">Następna wizyta</h2></div>
        <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><CalendarClock size={21} aria-hidden="true" /></span>
      </div>
      {nextVisit ? (
        <div className="mt-6 rounded-2xl bg-[#F8F5F0] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-2xl font-bold text-[#2D4739]">{nextVisit.visit_time}</p><p className="mt-1 font-semibold text-[#2D4739]">{nextVisit.name}</p></div><StatusBadge status={nextVisit.status} /></div>
          <p className="mt-4 flex items-center gap-2 text-sm text-gray-600"><MapPin size={16} className="text-[#6D7A62]" aria-hidden="true" />{nextVisit.location}</p>
          {nextVisit.source && <p className="mt-3 inline-flex rounded-full bg-[#EEF1EB] px-2.5 py-1 text-xs font-semibold text-[#55624D]">{bookingSourceLabel(nextVisit.source)}</p>}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[#D9DDD3] bg-[#FAFBF8] px-5 py-8 text-center"><p className="font-medium text-[#2D4739]">Dzisiaj nie masz już zaplanowanych wizyt.</p></div>
      )}
    </DashboardCard>
  );
}

function bookingSourceLabel(source: string) { return source === "partner-zielinscy" || source === "partner-zielinscy-embed" ? "🌸 Zielińscy" : source === "instagram-zielinscy" ? "📷 Instagram" : source === "qr-zielinscy" ? "🔳 QR" : source === "main-site" ? "🌐 Strona" : source; }
