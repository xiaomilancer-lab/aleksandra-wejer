import { AlertCircle } from "lucide-react";
import Link from "next/link";
import type { DashboardAttentionItem } from "../services/dashboardService";
import DashboardCard from "./DashboardCard";

export default function DashboardAttention({ items }: { items: DashboardAttentionItem[] }) {
  return (
    <DashboardCard>
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FBE8E8] p-3 text-[#BF4D4D]"><AlertCircle size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Sprawy do domknięcia</p><h2 className="font-bold text-[#2D4739]">Wymagają działania</h2></div></div>
      {items.length === 0 ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Brak wiarygodnych alertów wymagających działania.</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <Link key={item.id} href={item.href} className="rounded-2xl border border-[#E5E1D8] p-4 transition hover:border-[#BFCBB8] hover:bg-[#FCFDFB]"><p className="font-semibold text-[#2D4739]">{item.title}</p><p className="mt-2 text-sm text-gray-600">{item.description}</p></Link>)}</div>}
    </DashboardCard>
  );
}
