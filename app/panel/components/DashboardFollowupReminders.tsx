import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import type { FollowupReminderAssignment } from "../domain";
import DashboardCard from "./DashboardCard";

export default function DashboardFollowupReminders({ assignments }: { assignments: FollowupReminderAssignment[] }) {
  const visibleAssignments = assignments.slice(0, 3);
  return <DashboardCard><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FBE8E8] p-3 text-[#B65A5A]"><Heart size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Na najbliższe wizyty</p><h2 className="font-bold text-[#2D4739]">Follow-up wymagające uwagi</h2></div></div>{visibleAssignments.length === 0 ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-6 text-center text-sm text-gray-500">Otwarte przypomnienia pojawią się tutaj przy najbliższych wizytach.</p> : <div className="mt-5 space-y-3">{visibleAssignments.map(({ reminder, patientName, nextVisitId, nextVisitDate, nextVisitTime }) => <Link key={reminder.id} href={`/panel/visits/${nextVisitId}/brief`} className="group block rounded-2xl bg-[#F8F5F0] p-4 transition hover:bg-[#EEF1EB]"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{reminder.title}</p><p className="mt-1 text-sm text-gray-600">{patientName} · {new Date(`${nextVisitDate}T00:00:00`).toLocaleDateString("pl-PL")} · {nextVisitTime}</p></div><ArrowRight size={17} className="mt-1 text-[#6D7A62] transition group-hover:translate-x-0.5" aria-hidden="true" /></div></Link>)}</div>}</DashboardCard>;
}
