import { getBookingLocationDisplayName } from "@/app/booking/locations";
import { Inbox } from "lucide-react";
import Link from "next/link";
import type { DashboardRequest } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";

export default function DashboardNewRequests({ requests }: { requests: DashboardRequest[] }) {
  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FFF3DD] p-3 text-[#9A6A19]"><Inbox size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Nowe zgłoszenia</p><h2 className="font-bold text-[#2D4739]">Do potwierdzenia</h2></div></div><span className="rounded-full bg-[#FFF3DD] px-3 py-1 text-sm font-bold text-[#7A6540]">{requests.length}</span></div>
      {requests.length === 0 ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Brak nowych zgłoszeń.</p> : <div className="mt-5 space-y-3">{requests.map((request) => <Link key={request.id} href={`/panel/visits/${request.id}/brief`} className="block rounded-2xl border border-[#E5E1D8] p-4 transition hover:border-[#BFCBB8] hover:bg-[#FCFDFB]"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{request.name}</p><p className="mt-1 text-sm text-gray-600">{request.visit_date} · {request.visit_time}</p></div><span className="rounded-full bg-[#EEF1EB] px-2.5 py-1 text-xs font-semibold text-[#55624D]">{request.source || "strona"}</span></div><p className="mt-2 text-sm text-[#6D7A62]">{getBookingLocationDisplayName(request.location_id, request.location)}</p><p className="mt-2 text-xs font-semibold text-[#7A6540]">{request.patient_id ? "Połączone z kartą pacjenta" : "Brak przypisanej karty pacjenta"}</p></Link>)}</div>}
    </DashboardCard>
  );
}
