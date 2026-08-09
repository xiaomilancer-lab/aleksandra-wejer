import { Activity } from "lucide-react";

export default function PatientTimeline() {
  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><Activity size={18} aria-hidden="true" /></span>
        <div><p className="text-sm text-gray-500">Przebieg współpracy</p><h2 className="font-bold text-[#2D4739]">Timeline</h2></div>
      </div>
      <p className="mt-5 rounded-2xl bg-[#F8F5F0] px-4 py-5 text-center text-sm text-gray-500">Wkrótce</p>
    </section>
  );
}
