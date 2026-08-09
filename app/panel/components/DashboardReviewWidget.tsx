import { Star } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function DashboardReviewWidget() {
  return (
    <DashboardCard>
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FFF4D9] p-3 text-[#B7791F]"><Star size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Komunikacja</p><h2 className="font-bold text-[#2D4739]">Opinie</h2></div></div>
      <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Brak oczekujących opinii.</p>
    </DashboardCard>
  );
}
