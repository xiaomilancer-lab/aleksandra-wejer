import { NotebookText } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function DashboardRecentPatients() {
  return (
    <DashboardCard>
      <div className="flex items-center gap-3"><span className="rounded-2xl bg-[#EEEAF8] p-3 text-[#7057A4]"><NotebookText size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Dokumentacja</p><h2 className="font-bold text-[#2D4739]">Ostatnio dodane notatki</h2></div></div>
      <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Tu pojawią się ostatnio dodane notatki.</p>
    </DashboardCard>
  );
}
